const { SpiralMemoryArchitecture } = require('../server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { InMemorySpiralAdapter } = require('../server/consciousness/core/storage/SpiralStorageAdapter.cjs');

async function run() {
  const arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });

  // Create 50k memory nodes
  for (let i = 0; i < 50000; i++) {
    await arch.storeMemory(`test content ${i}`);
  }

  // Set all nodes to be old and low access
  for (const node of arch.spiralMemory.values()) {
    node.createdAt = new Date(0).toISOString();
    node.accessCount = 0;
  }

  // Run GC and print stats
  const interval = setInterval(async () => {
    await arch.performGarbageCollection();
    const stats = arch.getMemoryStatistics();
    console.log(`Backlog: ${stats.totalMemories}, Budget: ${arch.gcQueue.size() / 10}, Collected/sec: ${stats.garbageCollectionCount}`);
    if (stats.totalMemories === 0) {
      clearInterval(interval);
    }
  }, 1000);
}

run();