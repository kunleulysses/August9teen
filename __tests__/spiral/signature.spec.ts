import { sign, verify } from '../../server/consciousness/core/security/eventSign';

describe('Event signature', () => {
  it('signs and verifies payloads', () => {
    const payload = { foo: 1, bar: 'baz' };
    const sig = sign(payload);
    expect(verify(payload, sig)).toBe(true);
    expect(verify({ ...payload, tampered: true }, sig)).toBe(false);
  });
});