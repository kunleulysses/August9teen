const fs = require('fs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'dev-secret-change-me';
const payload = { sub: 'tester', scope: ['metacog.stream'] };
const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '10m' });
fs.writeFileSync('/tmp/jwt_hs256.txt', token);
process.stdout.write(token + '\n');