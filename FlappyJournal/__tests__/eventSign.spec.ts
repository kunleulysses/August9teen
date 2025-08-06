import { sign, verify } from '../server/consciousness/core/security/eventSign';

describe('eventSign ESM', () => {
  it('should sign and verify a payload', () => {
    const payload = { data: 'hello flux' };
    const signature = sign(payload);
    expect(verify(payload, signature)).toBe(true);
  });

  it('should fail to verify a tampered payload', () => {
    const payload = { data: 'hello flux' };
    const signature = sign(payload);
    const tamperedPayload = { data: 'hello darkness' };
    expect(verify(tamperedPayload, signature)).toBe(false);
  });
});