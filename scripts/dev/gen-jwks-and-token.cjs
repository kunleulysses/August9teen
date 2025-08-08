const { generateKeyPairSync } = require('crypto');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function main() {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const pubJwk = publicKey.export({ format: 'jwk' });

  const kid = process.env.JWT_KID || 'devkey1';
  const issuer = process.env.JWT_ISSUER || 'http://localhost/';
  const audience = process.env.JWT_AUDIENCE || 'sigil-api';

  const jwkOut = { kty: 'RSA', use: 'sig', alg: 'RS256', kid, n: pubJwk.n, e: pubJwk.e };
  const jwksDir = '/tmp/jwks/.well-known';
  fs.mkdirSync(jwksDir, { recursive: true });
  fs.writeFileSync(path.join(jwksDir, 'jwks.json'), JSON.stringify({ keys: [jwkOut] }));

  const payload = { sub: 'tester', tenantId: 'dev', roles: ['admin'] };
  const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid: kid, issuer, audience, expiresIn: '10m' });
  fs.writeFileSync('/tmp/jwt_rs256.txt', token);
  process.stdout.write(token + '\n');
}

if (require.main === module) main();