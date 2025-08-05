import { SpiralMemoryArchitecture } from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import { InMemorySpiralAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';

describe('Adaptive GC', () => {
  let arch: SpiralMemoryArchitecture;

  beforeEach(() => {
    arch = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
  });

  it('should clear the queue within the dynamic budget', async () => {
    // Create 1000 memory nodes
    for (let i = 0; i < 1000; i++) {
      await arch.storeMemory(`test content ${i}`);
    }

    // Set all nodes to be old and low access
    for (const node of arch.spiralMemory.values()) {
      node.createdAt = new Date(0).toISOString();
      node.accessCount = 0;
    }

    // Run GC
    await arch.performGarbageCollection();

    // Check that the queue is empty
    expect(arch.gcQueue.size()).toBe(0);
  });

  it('should force collection after 3 skips', async () => {
    // Create a memory node that will always be skipped
    await arch.storeMemory('test content');
    const nodeId = arch.spiralMemory.keys().next().value;
    arch.shouldCollectMemory = () => false;

    // Run GC 3 times
    await arch.performGarbageCollection();
    await arch.performGarbageCollection();
    await arch.performGarbageCollection();

    // Check that the node was collected
    expect(arch.spiralMemory.has(nodeId)).toBe(false);
  });
});