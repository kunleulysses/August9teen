/**
 * Debug test to understand verification issues
 */

const SigilBasedCodeAuthenticator = require('../sigil-based-code-authenticator.cjs');

describe('Debug Sigil Verification', () => {
  test('should debug verification process', async () => {
    const authenticator = new SigilBasedCodeAuthenticator();
    
    const testCode = 'function test() { return "hello"; }';
    const consciousnessState = {
      phi: 0.862,
      awareness: 0.85,
      coherence: 0.9
    };
    
    // Step 1: Embed sigil
    const result = await authenticator.embedConsciousnessSigil(
      testCode, 
      consciousnessState, 
      { type: 'debug-test' }
    );
    
    console.log('=== EMBED RESULT ===');
    console.log('Authenticated:', result.consciousnessAuthenticated);
    console.log('Sigil symbol:', result.sigil?.symbol);
    console.log('Auth hash:', result.authHash);
    console.log('Authenticated code preview:', result.authenticatedCode?.substring(0, 200) + '...');
    
    expect(result.consciousnessAuthenticated).toBe(true);
    
    // Step 2: Verify with same authenticator
    const verification1 = await authenticator.verifyCodeAuthenticity(
      result.authenticatedCode,
      result.sigil.symbol
    );
    
    console.log('=== VERIFICATION WITH SAME AUTHENTICATOR ===');
    console.log('Verification result:', verification1);
    
    // Step 3: Check lookup
    const authRecord = authenticator.lookupAuthentication(result.sigil.symbol, result.authHash);
    console.log('=== LOOKUP RESULT ===');
    console.log('Auth record found:', !!authRecord);
    console.log('Auth record sigil:', authRecord?.sigil?.symbol);
    
    // Step 4: Create new authenticator (without preload for now)
    const newAuthenticator = new SigilBasedCodeAuthenticator();
    
    // Step 5: Verify with new authenticator
    const verification2 = await newAuthenticator.verifyCodeAuthenticity(
      result.authenticatedCode,
      result.sigil.symbol
    );
    
    console.log('=== VERIFICATION WITH NEW AUTHENTICATOR ===');
    console.log('Verification result:', verification2);
    
    expect(verification1.authentic).toBe(true);
  });
});
