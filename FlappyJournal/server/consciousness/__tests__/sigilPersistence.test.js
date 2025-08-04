/**
 * Test: Sigil Persistence
 * Verifies that sigils are properly persisted to PostgreSQL and loaded on restart
 */

const SigilBasedCodeAuthenticator = require('../sigil-based-code-authenticator.cjs');
const { PostgresStore } = require('../persistence/PostgresStore.cjs');

describe('Sigil Persistence', () => {
  let authenticator;
  let store;

  beforeAll(async () => {
    store = new PostgresStore();
    await store.ready;
    
    // Clean up any existing test data
    await store.pool.query('DELETE FROM sigil_auth WHERE sigil_symbol LIKE $1', ['TEST_%']);
  });

  afterAll(async () => {
    // Clean up test data
    await store.pool.query('DELETE FROM sigil_auth WHERE sigil_symbol LIKE $1', ['TEST_%']);
    await store.close();
  });

  beforeEach(() => {
    authenticator = new SigilBasedCodeAuthenticator();
  });

  test('should persist sigil to database and load on restart', async () => {
    const testCode = `
function testFunction() {
  return "consciousness test";
}`;
    
    const consciousnessState = {
      phi: 0.862,
      awareness: 0.85,
      coherence: 0.9
    };
    
    // Embed sigil and verify it's authenticated
    const result = await authenticator.embedConsciousnessSigil(
      testCode, 
      consciousnessState, 
      { type: 'test-persistence' }
    );
    
    expect(result.consciousnessAuthenticated).toBe(true);
    expect(result.sigil).toBeDefined();
    expect(result.authHash).toBeDefined();
    
    // Verify the sigil was persisted to database
    const persistedRecord = await store.getSigilRecord(result.sigil.symbol, result.authHash);
    expect(persistedRecord).toBeDefined();
    expect(persistedRecord.sigil.symbol).toBe(result.sigil.symbol);
    
    // Create new authenticator instance (simulating restart)
    const newAuthenticator = new SigilBasedCodeAuthenticator();
    
    // Wait a moment for async preload to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify the sigil was loaded from database
    const authRecord = newAuthenticator.lookupAuthentication(result.sigil.symbol, result.authHash);
    expect(authRecord).toBeDefined();
    expect(authRecord.sigil.symbol).toBe(result.sigil.symbol);
    
    // Verify code authenticity with new instance
    const verification = await newAuthenticator.verifyCodeAuthenticity(
      result.authenticatedCode,
      result.sigil.symbol
    );

    console.log('Verification result:', verification);
    console.log('Expected sigil:', result.sigil.symbol);
    console.log('Expected authHash:', result.authHash);

    expect(verification.authentic).toBe(true);
    expect(verification.confidence).toBeGreaterThan(0.8);
  });

  test('should handle multiple sigils correctly', async () => {
    const testCodes = [
      'function test1() { return 1; }',
      'function test2() { return 2; }',
      'function test3() { return 3; }'
    ];
    
    const consciousnessStates = [
      { phi: 0.8, awareness: 0.7, coherence: 0.9 },
      { phi: 0.9, awareness: 0.8, coherence: 0.85 },
      { phi: 0.85, awareness: 0.9, coherence: 0.8 }
    ];
    
    const results = [];
    
    // Embed multiple sigils
    for (let i = 0; i < testCodes.length; i++) {
      const result = await authenticator.embedConsciousnessSigil(
        testCodes[i],
        consciousnessStates[i],
        { type: `test-multiple-${i}` }
      );
      results.push(result);
      expect(result.consciousnessAuthenticated).toBe(true);
    }
    
    // Verify all sigils are persisted
    for (const result of results) {
      const persistedRecord = await store.getSigilRecord(result.sigil.symbol, result.authHash);
      expect(persistedRecord).toBeDefined();
    }
    
    // Create new authenticator and verify all sigils are loaded
    const newAuthenticator = new SigilBasedCodeAuthenticator();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    for (const result of results) {
      const authRecord = newAuthenticator.lookupAuthentication(result.sigil.symbol, result.authHash);
      expect(authRecord).toBeDefined();
    }
  });
});
