import crypto from 'node:crypto';

export function calcSigilHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
}

