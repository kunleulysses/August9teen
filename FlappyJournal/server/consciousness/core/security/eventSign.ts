import { createHmac } from 'crypto';

function secretFromEnv(): string {
  return process.env.SPIRAL_EVENT_SECRET || 'spiral-secret';
}

export function sign(payload: any): string {
  const secret = secretFromEnv();
  const h = createHmac('sha256', secret);
  h.update(JSON.stringify(payload));
  return h.digest('hex');
}

export function verify(payload: any, signature: string): boolean {
  return sign(payload) === signature;
}