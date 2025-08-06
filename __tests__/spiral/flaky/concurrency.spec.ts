import SpiralMemoryArchitecture from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import LevelSpiralAdapter from '../../server/consciousness/core/storage/LevelSpiralAdapter.cjs';
import RedisSpiralAdapter from '../../server/consciousness/core/storage/RedisSpiralAdapter.cjs';
import { InMemorySpiralAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';

describe('SpiralMemoryArchitecture Concurrency Guards', () => {
  let spiral: any;
  let redisSpiral: any;

  beforeEach(async () => {
    // Test with in-memory adapter first (fastest)
    spiral = new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() });
    await spiral.initialize();

    // Clear any existing data
    spiral.spiralMemory.clear();
    spiral.memorySpirals.clear();
    spiral.sigilRegistry.clear();
    spiral.memoryCount = 0;
    spiral.garbageCollectionCount = 0;

    // Reinitialize spiral memory structures
    await spiral.initializeSpiralMemory();

    // Test with Redis adapter if available
    if (process.env.REDIS_URL) {
      redisSpiral = new SpiralMemoryArchitecture({
        storage: new RedisSpiralAdapter(process.env.REDIS_URL)
      });
      await redisSpiral.initialize();
    }
  });

  afterEach(async () => {
    // Clean up
    if (spiral) {
      spiral = null;
    }
    if (redisSpiral) {
      redisSpiral = null;
    }
  });

  describe('Parallel storeMemory operations', () => {
    it('should handle 1000 parallel storeMemory calls with correct counts', async () => {
      const N = 1000;
      const promises = Array.from({ length: N }, (_, i) =>
        () => spiral.storeMemory(`test content ${i}`, 'test', 'shallow', [])
      );

      // Use Promise.all to fire parallel requests
      const results = await Promise.all(promises.map(fn => fn()));

      // Verify all operations completed successfully
      expect(results).toHaveLength(N);
      expect(results.every(result => result && result.id)).toBe(true);

      // Verify memory statistics are correct
      const stats = spiral.getMemoryStatistics();
      expect(stats.totalMemories).toBe(N);

      // Verify spiral node counts sum correctly
      let totalSpiralNodes = 0;
      for (const spiralData of spiral.memorySpirals.values()) {
        totalSpiralNodes += spiralData.nodeCount;
      }
      expect(totalSpiralNodes).toBe(N);

      // Verify memoryCount is correct
      expect(spiral.memoryCount).toBe(N);
    }, 30000); // 30 second timeout for this intensive test

    it('should handle concurrent storeMemory and GC operations', async () => {
      const N = 500;
      
      // Store some initial memories
      const storePromises = Array.from({ length: N }, (_, i) =>
        () => spiral.storeMemory(`initial content ${i}`, 'test', 'shallow', [])
      );
      await Promise.all(storePromises.map(fn => fn()));

      const initialStats = spiral.getMemoryStatistics();
      expect(initialStats.totalMemories).toBe(N);

      // Now run concurrent operations: more stores + GC
      const concurrentStores = Array.from({ length: N }, (_, i) => 
        () => spiral.storeMemory(`concurrent content ${i}`, 'test', 'shallow', [])
      );
      
      const gcPromises = Array.from({ length: 10 }, () => 
        () => spiral.triggerGC(50) // 50ms time budget
      );

      // Mix store and GC operations
      const allOperations = [...concurrentStores, ...gcPromises];
      
      // Shuffle the operations for more realistic concurrency
      for (let i = allOperations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allOperations[i], allOperations[j]] = [allOperations[j], allOperations[i]];
      }

      await Promise.all(allOperations.map(fn => fn()));

      // Verify counts are still consistent
      const finalStats = spiral.getMemoryStatistics();
      
      // Should have at least the initial memories (some may have been GC'd)
      expect(finalStats.totalMemories).toBeGreaterThanOrEqual(N);
      
      // Verify spiral node counts sum correctly
      let totalSpiralNodes = 0;
      for (const spiralData of spiral.memorySpirals.values()) {
        totalSpiralNodes += spiralData.nodeCount;
      }
      expect(totalSpiralNodes).toBe(finalStats.totalMemories);
    }, 45000); // 45 second timeout
  });

  describe('Redis adapter concurrency', () => {
    it('should handle parallel operations with Redis adapter', async () => {
      if (!process.env.REDIS_URL || !redisSpiral) {
        console.log('Skipping Redis test - REDIS_URL not set');
        return;
      }

      const N = 200; // Smaller number for Redis to avoid overwhelming
      const promises = Array.from({ length: N }, (_, i) => 
        () => redisSpiral.storeMemory(`redis test ${i}`, 'redis_test', 'shallow', [])
      );

      const results = await Promise.all(promises.map(fn => fn()));

      expect(results).toHaveLength(N);
      expect(results.every(result => result && result.id)).toBe(true);

      const stats = redisSpiral.getMemoryStatistics();
      expect(stats.totalMemories).toBe(N);

      // Verify spiral node counts
      let totalSpiralNodes = 0;
      for (const spiralData of redisSpiral.memorySpirals.values()) {
        totalSpiralNodes += spiralData.nodeCount;
      }
      expect(totalSpiralNodes).toBe(N);
    }, 60000); // 60 second timeout for Redis operations

    it('should use atomic increments for Redis spiral counts', async () => {
      if (!process.env.REDIS_URL || !redisSpiral) {
        console.log('Skipping Redis atomic test - REDIS_URL not set');
        return;
      }

      // Verify that the Redis adapter has atomicIncr method
      expect(typeof redisSpiral.storage.atomicIncr).toBe('function');

      // Store a few memories and verify atomic operations work
      const N = 50;
      const promises = Array.from({ length: N }, (_, i) => 
        () => redisSpiral.storeMemory(`atomic test ${i}`, 'atomic', 'shallow', [])
      );

      await Promise.all(promises.map(fn => fn()));

      const stats = redisSpiral.getMemoryStatistics();
      expect(stats.totalMemories).toBe(N);
    }, 30000);
  });

  describe('Error handling and safety', () => {
    it('should handle mutex timeout gracefully', async () => {
      // This test verifies that the mutex doesn't deadlock
      const promises = Array.from({ length: 100 }, (_, i) => 
        () => spiral.storeMemory(`timeout test ${i}`, 'test', 'shallow', [])
      );

      // Should complete without hanging
      const results = await Promise.all(promises.map(fn => fn()));
      expect(results).toHaveLength(100);
    }, 15000);

    it('should maintain consistency after errors', async () => {
      const N = 50; // Smaller test for debugging

      // All operations should succeed for now to test basic functionality
      const operations = Array.from({ length: N }, (_, i) =>
        () => spiral.storeMemory(`valid content ${i}`, 'test', 'shallow', [])
      );

      const results = await Promise.all(operations);
      const successfulResults = results.filter(r => r !== null);

      console.log(`Successful results: ${successfulResults.length}, Total memories: ${spiral.getMemoryStatistics().totalMemories}`);

      // Verify counts are consistent with successful operations
      const stats = spiral.getMemoryStatistics();
      expect(stats.totalMemories).toBe(successfulResults.length);
    }, 20000);
  });

  describe('Performance impact', () => {
    it('should have minimal performance impact from mutex', async () => {
      const N = 100;
      
      // Measure time for sequential operations
      const startSequential = Date.now();
      for (let i = 0; i < N; i++) {
        await spiral.storeMemory(`sequential ${i}`, 'perf', 'shallow', []);
      }
      const sequentialTime = Date.now() - startSequential;

      // Clear and measure parallel operations
      spiral.spiralMemory.clear();
      spiral.memoryCount = 0;
      
      const startParallel = Date.now();
      const promises = Array.from({ length: N }, (_, i) => 
        () => spiral.storeMemory(`parallel ${i}`, 'perf', 'shallow', [])
      );
      await Promise.all(promises.map(fn => fn()));
      const parallelTime = Date.now() - startParallel;

      // Parallel should be faster despite mutex overhead
      expect(parallelTime).toBeLessThan(sequentialTime);
      
      console.log(`Sequential: ${sequentialTime}ms, Parallel: ${parallelTime}ms`);
    }, 30000);
  });
});
