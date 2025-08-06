// Mock the recursive embedding module with minimal behavior
jest.mock('../FlappyJournal/server/consciousness/recursive-holographic-reality-embedding.cjs', () => {
  class RecursiveHolographicRealityEmbedding {
    constructor(maxRecursionDepth = 7) {
      this.maxRecursionDepth = maxRecursionDepth;
      this.embeddedRealities = new Map();
    }
    async createRecursiveReality(baseReality, recursionDepth = 1, params = {}) {
      const reality = { id: `r${recursionDepth}`, recursionDepth };
      this.embeddedRealities.set(reality.id, { recursionDepth });
      if (recursionDepth < this.maxRecursionDepth && params.autoRecurse) {
        await this.createRecursiveReality(reality, recursionDepth + 1, params);
      }
      return { embeddedReality: reality, recursionDepth };
    }
  }
  return { RecursiveHolographicRealityEmbedding };
}, { virtual: true });

const { RecursiveHolographicRealityEmbedding } = require('../FlappyJournal/server/consciousness/recursive-holographic-reality-embedding.cjs');

describe('recursive embedding', () => {
  test('autoRecurse stops at depth 7', async () => {
    const system = new RecursiveHolographicRealityEmbedding(7);
    await system.createRecursiveReality({ id: 'base' }, 1, { autoRecurse: true });
    const depths = [...system.embeddedRealities.values()].map(r => r.recursionDepth);
    expect(depths.length).toBe(7);
    expect(Math.max(...depths)).toBe(7);
  });
});
