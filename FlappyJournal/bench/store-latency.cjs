const { SpiralMemoryArchitecture } = require('../server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { InMemorySpiralAdapter } = require('../server/consciousness/core/storage/SpiralStorageAdapter.cjs');
const { performance } = require('perf_hooks');

async function run() {
  const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
  const latencies = [];

  for (let i = 0; i < 10000; i++) {
    const start = performance.now();
    await arch.storeMemory(`test content ${i}`);
    latencies.push(performance.now() - start);
  }

  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  console.log(`p95 latency: ${p95.toFixed(3)}ms`);

  const distances = [];
  for (let i = 0; i < 1000; i++) {
    const spiral = await arch.selectOptimalSpiral('general', 'shallow', 100, arch.memorySpirals.keys().next().value);
    distances.push(arch.routing[spiral.id].x);
  }
  const avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
  console.log(`Average selection distance: ${avgDistance.toFixed(3)}`);
}

run();