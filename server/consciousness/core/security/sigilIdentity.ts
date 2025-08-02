/**
 * sigilIdentity.ts
 * Helper for deterministic per-component secret using HMAC-SHA256.
 */
import crypto from 'crypto';

const MASTER_KEY = process.env.SIGIL_MASTER_KEY || 'sigil-master';

export function getComponentSecret(componentId: string): string {
  // HMAC-SHA256 of componentId using the master key, hex output
  return crypto.createHmac('sha256', MASTER_KEY)
    .update(componentId)
    .digest('hex');
}