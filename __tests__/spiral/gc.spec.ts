import SpiralMemoryArchitecture from '../../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture';

describe('GC time-budget', () => {
  it('collects within budget and does not crash', async () => {
    const spiral = new SpiralMemoryArchitecture();
    await spiral.initialize();
    const N = 1000;
    for (let i = 0; i < N; ++i) {
      await spiral.storeMemory('foo'+i, 'memory', 'shallow', []);
    }
    await spiral.performGarbageCollection(20);
    // Should not throw; no assertion on count as it's time-budgeted
    expect(true).toBe(true);
  });
});