const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://localhost:8082';
const REALM = process.env.KEYCLOAK_REALM || 'featherweight';

const client = jwksClient({
  jwksUri: `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/certs`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 300000 // 5 minutes
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyScope(requiredScope) {
  return function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, getKey, {
      audience: 'featherweight-frontend',
      issuer: `${KEYCLOAK_URL}/realms/${REALM}`,
      algorithms: ['RS256']
    }, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid token' });
      }

      const scopes = decoded.scope ? decoded.scope.split(' ') : [];
      if (!scopes.includes(requiredScope)) {
        return res.status(403).json({ error: 'Insufficient scope' });
      }

      req.user = decoded;
      next();
    });
  };
}

module.exports = { verifyScope };
