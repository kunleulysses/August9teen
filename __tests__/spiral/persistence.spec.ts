import SpiralMemoryArchitecture from '../../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs';

describe('Persistence', () => {
  it('stores and reloads memories', async () => {
    const spiral = new SpiralMemoryArchitecture();
    await spiral.initialize();
    const N = 50;
    for (let i = 0; i < N; ++i) {
      await spiral.storeMemory('bar'+i, 'memory', 'core', []);
    }
    // Simulate reload
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    delete require.cache[require.resolve('../../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture')];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SpiralMemoryArchitecture2 = require('../../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture').default;
    const spiral2 = new SpiralMemoryArchitecture2();
    await spiral2.initialize();
    expect(spiral2.spiralMemory.size).toBeGreaterThanOrEqual(N);
  });
});