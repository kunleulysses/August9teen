const { sign, verify } = require('../server/consciousness/core/security/eventSign.cjs');

describe('eventSign CJS', () => {
  it('should sign and verify a payload', () => {
    const payload = { foo: 'bar' };
    const signature = sign(payload);
    expect(verify(payload, signature)).toBe(true);
  });

  it('should fail to verify a modified payload', () => {
    const payload = { foo: 'bar' };
    const signature = sign(payload);
    const modifiedPayload = { foo: 'baz' };
    expect(verify(modifiedPayload, signature)).toBe(false);
  });
});