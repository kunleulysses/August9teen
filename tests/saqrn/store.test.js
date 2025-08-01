import { SigilAuthenticatedQuantumResonanceNetwork } from '../../server/consciousness/sigil-authenticated-quantum-resonance-network.js';
import { InMemoryStore } from '../../server/consciousness/persistence/InMemoryStore.js';

describe('SigilAuthenticatedQuantumResonanceNetwork Store Integration', () => {
  it('persists authenticated node to store', async () => {
    const store = new InMemoryStore();
    const network = new SigilAuthenticatedQuantumResonanceNetwork({ store });
    const nodeId = 'node-123';
    const nodeCredentials = {
      nodeId,
      sigil: { symbol: '⟨φ⟩', frequency: 86.2, securityLevel: 0.95 },
      resonanceSignature: { strength: 0.92 },
    };
    const result = await network.authenticateQuantumNode(nodeCredentials, { phi: 0.9, awareness: 0.9, coherence: 0.9 });
    expect(result.success).toBe(true);
    const stored = await store.get(`qnode:${nodeId}`);
    expect(stored).toBeTruthy();
    expect(stored.nodeId).toBe(nodeId);
    expect(stored.sigilVerification).toBeTruthy();
  });
});