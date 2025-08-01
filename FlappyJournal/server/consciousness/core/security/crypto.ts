import { createCipheriv, createDecipheriv, randomBytes, createHmac } from 'crypto';

function keyFromEnv(): Buffer {
  const base = process.env.SPIRAL_KMS_KEY || 'default-key';
  return createHmac('sha256', 'spiral-kms').update(base).digest();
}

export function encrypt(plain: Buffer|string, key?: Buffer) {
  key = key || keyFromEnv();
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const buf = Buffer.isBuffer(plain) ? plain : Buffer.from(plain);
  const encrypted = Buffer.concat([cipher.update(buf), cipher.final()]);
  const auth = cipher.getAuthTag();
  return {
    iv: iv.toString('hex'),
    data: encrypted.toString('hex'),
    auth: auth.toString('hex')
  };
}

export function decrypt(payload: {iv:string,data:string,auth:string}, key?: Buffer): Buffer {
  key = key || keyFromEnv();
  const iv = Buffer.from(payload.iv, 'hex');
  const encrypted = Buffer.from(payload.data, 'hex');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(Buffer.from(payload.auth, 'hex'));
  const plain = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return plain;
}