import { sign, verify } from '../server/consciousness/core/security/eventSign.cjs';

describe('EventSign CJS Compatibility', () => {
  test('CJS sign/verify works correctly', () => {
    if (typeof sign !== 'function') {
      throw new Error('sign not exported from CJS module!');
    }
    if (typeof verify !== 'function') {
      throw new Error('verify not exported from CJS module!');
    }
    
    const payload = { foo: 1, timestamp: Date.now() };
    const signature = sign(payload);
    
    expect(typeof signature).toBe('string');
    expect(signature.length).toBeGreaterThan(0);
    expect(verify(payload, signature)).toBe(true);
    expect(verify({ ...payload, modified: true }, signature)).toBe(false);
  });

  test('CJS and ESM produce identical signatures', async () => {
    const { sign: esmSign, verify: esmVerify } = await import('../server/consciousness/core/security/eventSign.cjs');
    
    const payload = { test: 'data', number: 42 };
    const cjsSignature = sign(payload);
    const esmSignature = esmSign(payload);
    
    expect(cjsSignature).toBe(esmSignature);
    expect(verify(payload, esmSignature)).toBe(true);
    expect(esmVerify(payload, cjsSignature)).toBe(true);
  });

  test('Handles complex payloads correctly', () => {
    const complexPayload = {
      nested: { data: [1, 2, 3] },
      array: ['a', 'b', 'c'],
      number: 123.456,
      boolean: true,
      null: null
    };
    
    const signature = sign(complexPayload);
    expect(verify(complexPayload, signature)).toBe(true);
  });
});