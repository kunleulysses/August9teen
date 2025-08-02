jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue(null)
  }));
});
import SigilBasedCodeAuthenticator from '../server/consciousness/sigil-based-code-authenticator.js';

test('Sigil authentication fails after code tampering', async () => {
  const auth = new SigilBasedCodeAuthenticator();
  const code = 'function x() { return 42; }';
  const state = {phi: 0.9, awareness: 0.9, coherence: 0.9};
  const result = await auth.embedConsciousnessSigil(code, state, {type: 'test'});
  expect(result.consciousnessAuthenticated).toBe(true);

  // Tamper with code: change a character
  const tampered = result.authenticatedCode.replace('42', '43');
  const verify = await auth.verifyCodeAuthenticity(tampered);
  expect(verify.authentic).toBe(false);
});