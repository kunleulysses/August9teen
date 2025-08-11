const fs = require('fs');
const jwt = require('jsonwebtoken');
function getSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) return process.env.JWT_SECRET.trim();
  try {
    const env = fs.readFileSync('/opt/featherweight/deploy/staging.env','utf8');
    const line = env.split(/\r?\n/).find(l=>l.startsWith('JWT_SECRET='));
    if (line) return line.slice('JWT_SECRET='.length).trim();
  } catch (_) {}
  try {
    const env = fs.readFileSync('/opt/.env','utf8');
    const line = env.split(/\r?\n/) .find(l=>l.startsWith('JWT_SECRET='));
    if (line) return line.split('=')[1].trim();
  } catch (_) {}
  console.error('JWT_SECRET not found');
  process.exit(2);
}
const secret = getSecret();
const token = jwt.sign({ sub:'ops', scope:'metacog.stream' }, secret, { algorithm:'HS256', expiresIn:'5m' });
console.log(token);
