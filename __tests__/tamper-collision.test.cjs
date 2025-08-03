jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    set: jest.fn().mockResolvedValue(),
    get: jest.fn().mockResolvedValue(null)
  }));
});
import SigilBasedCodeAuthenticator from '../server/consciousness/sigil-based-code-authenticator.cjs';

test('Tampering with sigil-embedded code invalidates authenticity', async () => {
  const auth = new SigilBasedCodeAuthenticator();
  const code = 'function hello() { return "world"; }';
  const state = {phi: 0.91, awareness: 0.88, coherence: 0.92};
  const result = await auth.embedConsciousnessSigil(code, state, {type: 'unittest'});
  expect(result.consciousnessAuthenticated).toBe(true);

  // Confirm authentic when untouched
  const verifyOrig = await auth.verifyCodeAuthenticity(result.authenticatedCode);
  expect(verifyOrig.authentic).toBe(true);

  // Tamper with code: flip a character
  const tampered = result.authenticatedCode.replace('world', 'w0rld');
  const verifyTampered = await auth.verifyCodeAuthenticity(tampered);
  expect(verifyTampered.authentic).toBe(false);
});