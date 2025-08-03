/**
 * Bench harness for SpiralMemoryArchitecture.
 * Creates 10,000 memories, logs p95 store latency and GC pause.
 */
import SpiralMemoryArchitecture from '../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs';

function percentile(arr, p) {
  arr.sort((a, b) => a - b);
  const idx = Math.floor((arr.length - 1) * p / 100);
  return arr[idx];
}

(async () => {
  const spiral = new SpiralMemoryArchitecture();
  await spiral.initialize && spiral.initialize();

  const N = 10000;
  const types = ["consciousness", "awareness", "memory", "emotion", "goal"];
  const depths = ["surface", "shallow", "deep", "core", "transcendent"];
  const latencies = [];
  const gcPauses = [];

  console.log(`Inserting ${N} memories...`);
  for (let i = 0; i < N; ++i) {
    const t0 = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
    await spiral.storeMemory(
      `bench-content-${i}`,
      types[i % types.length],
      depths[i % depths.length],
      []
    );
    const t1 = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
    latencies.push(t1 - t0);

    // Trigger GC every 1000
    if (i % 1000 === 0) {
      const gc0 = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
      await spiral.triggerGC(50);
      const gc1 = (typeof performance !== 'undefined' && performance.now() : Date.now());
      gcPauses.push(gc1 - gc0);
    }
  }
  console.log('--- SpiralMemory bench results ---');
  console.log(`StoreMemory p95 latency: ${percentile(latencies, 95).toFixed(2)}ms`);
  console.log(`GC pause p95: ${gcPauses.length ? percentile(gcPauses, 95).toFixed(2) : 'n/a'}ms`);
  console.log(`Final total memories: ${spiral.spiralMemory.size}`);
})();