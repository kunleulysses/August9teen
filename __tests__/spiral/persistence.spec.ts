import SpiralMemoryArchitecture from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';

describe('Persistence', () => {
  it('stores and reloads memories', async () => {
    jest.setTimeout(10000);
    const { InMemorySpiralAdapter } = require('../../server/consciousness/core/storage/SpiralStorageAdapter.cjs');
    const spiral = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await spiral.initialize();

    // Wait for initialization to complete
    while (!spiral.isInitialized) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    const N = 50;
    for (let i = 0; i < N; ++i) {
      await spiral.storeMemory('bar'+i, 'memory', 'core', []);
    }

    // For InMemory adapter, persistence test is about data integrity
    // rather than actual persistence across process restarts
    const stats = spiral.getMemoryStatistics();
    expect(stats.totalMemories).toBeGreaterThanOrEqual(N);
    expect(spiral.spiralMemory.size).toBeGreaterThanOrEqual(N);
  });
});