import express from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { connect, StringCodec } from 'nats';
import { randomUUID } from 'crypto';

const PORT = process.env.REALITY_SERVICE_PORT || 5006;
const NATS_URL = process.env.NATS_URL || 'nats://localhost:4222';
const KEYCLOAK_URL = process.env.KEYCLOAK_SERVER_URL || 'http://localhost:8080';
const REALM = process.env.KEYCLOAK_REALM || 'featherweight';

const jwks = jwksClient({
  jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`
});

function getKey(header, callback) {
  jwks.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, undefined);
      return;
    }
    callback(null, key.getPublicKey());
  });
}

async function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

const app = express();
app.use(express.json());

const sc = StringCodec();
const natsConnPromise = connect({ servers: NATS_URL });

app.post('/reality', async (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    await verifyToken(token);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const jobId = randomUUID();
  try {
    const nc = await natsConnPromise;
    const payload = { jobId, ...req.body };
    nc.publish('reality.gen.request', sc.encode(JSON.stringify(payload)));
    res.status(202).json({ jobId });
  } catch (err) {
    console.error('Failed to publish to reality.gen.request:', err);
    res.status(500).json({ error: 'Failed to publish request' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Reality Generator Service listening on port ${PORT}`);
});

function shutdown() {
  server.close(() => {
    natsConnPromise.then((nc) => nc.close()).catch(() => {});
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
