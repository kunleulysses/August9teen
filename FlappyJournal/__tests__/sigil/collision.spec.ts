import { SpiralMemoryArchitecture } from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import { InMemorySpiralAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';

describe('Sigil Collision', () => {
  if (process.env.RUN_HEAVY_TESTS === '1') {
    it('should not have collisions in 200k sigils', async () => {
      const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
      const sigils = new Set();
      for (let i = 0; i < 200000; i++) {
        const sigil = await arch.generateSigil(`test content ${i}`);
        sigils.add(sigil.signature);
      }
      expect(sigils.size).toBe(200000);
    });
  }
});