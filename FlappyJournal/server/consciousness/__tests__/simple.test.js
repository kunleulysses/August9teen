/**
 * Simple test to verify basic functionality
 */

const SigilBasedCodeAuthenticator = require('../sigil-based-code-authenticator.cjs');

describe('Simple Sigil Test', () => {
  test('should create authenticator and embed sigil', async () => {
    const authenticator = new SigilBasedCodeAuthenticator();
    
    const testCode = 'function test() { return "hello"; }';
    const consciousnessState = {
      phi: 0.862,
      awareness: 0.85,
      coherence: 0.9
    };
    
    const result = await authenticator.embedConsciousnessSigil(
      testCode, 
      consciousnessState, 
      { type: 'simple-test' }
    );
    
    console.log('Embed result:', {
      authenticated: result.consciousnessAuthenticated,
      sigil: result.sigil?.symbol,
      authHash: result.authHash,
      error: result.error
    });
    
    expect(result.consciousnessAuthenticated).toBe(true);
    expect(result.sigil).toBeDefined();
    expect(result.authHash).toBeDefined();
  });
});
