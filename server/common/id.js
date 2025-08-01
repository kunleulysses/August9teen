import { randomUUID as nodeRandomUUID } from 'crypto';

let randomUUID;
try {
  randomUUID = nodeRandomUUID;
} catch (e) {
  // Node <= 16 fallback
  import('uuid').then(({ v4 }) => {
    randomUUID = v4;
  });
}

export function generateId() {
  if (randomUUID) return randomUUID();
  // fallback (should not happen except in rare edge cases)
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

import { createHash } from 'crypto';
export function generateHash(input) {
  return createHash('sha256').update(input).digest('hex');
}