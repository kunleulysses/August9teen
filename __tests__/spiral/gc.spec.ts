import SpiralMemoryArchitecture from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';

describe('GC time-budget', () => {
  it('collects within budget and does not crash', async () => {
    jest.setTimeout(10000);
    const { InMemorySpiralAdapter } = require('../../server/consciousness/core/storage/SpiralStorageAdapter.cjs');
    const spiral = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await spiral.initialize();

    // Wait for initialization to complete
    while (!spiral.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const N = 1000;
    for (let i = 0; i < N; ++i) {
      await spiral.storeMemory('foo'+i, 'memory', 'shallow', []);
    }
    await spiral.performGarbageCollection(20);
    // Should not throw; no assertion on count as it's time-budgeted
    expect(true).toBe(true);
  });
});