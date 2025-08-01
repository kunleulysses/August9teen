import { randomUUID as nodeRandomUUID, createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Always prefer native randomUUID if available, otherwise fallback to uuid.
export function generateId() {
  if (typeof nodeRandomUUID === 'function') {
    return nodeRandomUUID();
  }
  return uuidv4();
}

export function generateHash(input) {
  return createHash('sha256').update(input).digest('hex');
}