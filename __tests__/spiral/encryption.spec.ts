import { encrypt, decrypt } from '../../FlappyJournal/server/consciousness/core/security/crypto';

describe('Encryption', () => {
  it('encrypt/decrypt round-trip', () => {
    const key = Buffer.alloc(32, 1);
    const msg = 'hello spiral';
    const enc = encrypt(msg, key);
    const dec = decrypt(enc, key).toString();
    expect(dec).toBe(msg);
  });
});