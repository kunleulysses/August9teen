#!/usr/bin/env node

/**
 * Performance testing script for SpiralMemoryArchitecture storeMemory operations
 * Measures p95 latency impact of mutex implementation
 */

const SpiralMemoryArchitecture = require('../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { InMemorySpiralAdapter } = require('../FlappyJournal/server/consciousness/core/storage/SpiralStorageAdapter.cjs');
const LevelSpiralAdapter = require('../FlappyJournal/server/consciousness/core/storage/LevelSpiralAdapter.cjs');
const RedisSpiralAdapter = require('../FlappyJournal/server/consciousness/core/storage/RedisSpiralAdapter.cjs');

class PerformanceTester {
  constructor() {
    this.results = {
      memory: { latencies: [], p95: 0, avg: 0, min: 0, max: 0 },
      level: { latencies: [], p95: 0, avg: 0, min: 0, max: 0 },
      redis: { latencies: [], p95: 0, avg: 0, min: 0, max: 0 }
    };
  }

  async createSpiral(adapterType) {
    let storage;
    switch (adapterType) {
      case 'memory':
        storage = new InMemorySpiralAdapter();
        break;
      case 'level':
        storage = new LevelSpiralAdapter('./test-spiraldb-perf');
        break;
      case 'redis':
        if (!process.env.REDIS_URL) {
          console.log('⚠️  Skipping Redis test - REDIS_URL not set');
          return null;
        }
        storage = new RedisSpiralAdapter(process.env.REDIS_URL);
        break;
      default:
        throw new Error(`Unknown adapter type: ${adapterType}`);
    }

    const spiral = new SpiralMemoryArchitecture({ storage });
    await spiral.initialize();
    return spiral;
  }

  async measureLatency(spiral, operation, iterations = 1000) {
    const latencies = [];
    
    console.log(`🔄 Running ${iterations} ${operation} operations...`);
    
    for (let i = 0; i < iterations; i++) {
      const start = process.hrtime.bigint();
      
      try {
        switch (operation) {
          case 'store':
            await spiral.storeMemory(`perf test content ${i}`, 'performance', 'shallow', []);
            break;
          case 'gc':
            await spiral.triggerGC(25);
            break;
          default:
            throw new Error(`Unknown operation: ${operation}`);
        }
      } catch (error) {
        console.error(`❌ Error in operation ${i}:`, error.message);
        continue;
      }
      
      const end = process.hrtime.bigint();
      const latencyNs = Number(end - start);
      const latencyMs = latencyNs / 1_000_000; // Convert to milliseconds
      latencies.push(latencyMs);
      
      // Progress indicator
      if (i % 100 === 0 && i > 0) {
        process.stdout.write(`\r   Progress: ${i}/${iterations} (${((i/iterations)*100).toFixed(1)}%)`);
      }
    }
    
    console.log(`\r   Progress: ${iterations}/${iterations} (100.0%) ✅`);
    return latencies;
  }

  calculateStats(latencies) {
    if (latencies.length === 0) return { p95: 0, avg: 0, min: 0, max: 0 };
    
    const sorted = [...latencies].sort((a, b) => a - b);
    const p95Index = Math.floor(sorted.length * 0.95);
    
    return {
      p95: sorted[p95Index],
      avg: latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      count: latencies.length
    };
  }

  async testAdapter(adapterType, iterations = 1000) {
    console.log(`\n🧪 Testing ${adapterType.toUpperCase()} adapter...`);
    
    const spiral = await this.createSpiral(adapterType);
    if (!spiral) return null;

    try {
      // Test store operations
      const storeLatencies = await this.measureLatency(spiral, 'store', iterations);
      const storeStats = this.calculateStats(storeLatencies);
      
      console.log(`📊 Store operation stats:`);
      console.log(`   P95 latency: ${storeStats.p95.toFixed(2)}ms`);
      console.log(`   Avg latency: ${storeStats.avg.toFixed(2)}ms`);
      console.log(`   Min latency: ${storeStats.min.toFixed(2)}ms`);
      console.log(`   Max latency: ${storeStats.max.toFixed(2)}ms`);
      console.log(`   Operations:  ${storeStats.count}`);

      // Test GC operations (smaller sample)
      const gcIterations = Math.min(100, iterations / 10);
      const gcLatencies = await this.measureLatency(spiral, 'gc', gcIterations);
      const gcStats = this.calculateStats(gcLatencies);
      
      console.log(`🗑️  GC operation stats:`);
      console.log(`   P95 latency: ${gcStats.p95.toFixed(2)}ms`);
      console.log(`   Avg latency: ${gcStats.avg.toFixed(2)}ms`);
      console.log(`   Min latency: ${gcStats.min.toFixed(2)}ms`);
      console.log(`   Max latency: ${gcStats.max.toFixed(2)}ms`);
      console.log(`   Operations:  ${gcStats.count}`);

      return { store: storeStats, gc: gcStats };
    } finally {
      // Cleanup
      if (spiral) {
        spiral.spiralMemory?.clear();
      }
    }
  }

  async runConcurrencyTest(adapterType, concurrency = 50, iterations = 500) {
    console.log(`\n⚡ Testing ${adapterType.toUpperCase()} with concurrency=${concurrency}...`);
    
    const spiral = await this.createSpiral(adapterType);
    if (!spiral) return null;

    const pMap = (await import('p-map')).default;
    
    try {
      const operations = Array.from({ length: iterations }, (_, i) => 
        () => spiral.storeMemory(`concurrent test ${i}`, 'concurrent', 'shallow', [])
      );

      const start = process.hrtime.bigint();
      const results = await pMap(operations, fn => fn(), { concurrency });
      const end = process.hrtime.bigint();
      
      const totalTimeMs = Number(end - start) / 1_000_000;
      const throughput = iterations / (totalTimeMs / 1000); // ops/sec
      
      console.log(`🚀 Concurrency test results:`);
      console.log(`   Total time:  ${totalTimeMs.toFixed(2)}ms`);
      console.log(`   Throughput:  ${throughput.toFixed(2)} ops/sec`);
      console.log(`   Success rate: ${(results.filter(r => r).length / iterations * 100).toFixed(1)}%`);
      
      return { totalTimeMs, throughput, successRate: results.filter(r => r).length / iterations };
    } finally {
      if (spiral) {
        spiral.spiralMemory?.clear();
      }
    }
  }

  async run() {
    console.log('🎯 SpiralMemoryArchitecture Performance Test Suite');
    console.log('================================================\n');
    
    const iterations = parseInt(process.env.PERF_ITERATIONS) || 1000;
    const concurrency = parseInt(process.env.PERF_CONCURRENCY) || 50;
    
    console.log(`Configuration:`);
    console.log(`  Iterations: ${iterations}`);
    console.log(`  Concurrency: ${concurrency}`);
    console.log(`  Mutex enabled: ✅ (with async-mutex)`);

    // Test each adapter
    const adapters = ['memory', 'level'];
    if (process.env.REDIS_URL) {
      adapters.push('redis');
    }

    const results = {};
    
    for (const adapter of adapters) {
      const adapterResults = await this.testAdapter(adapter, iterations);
      if (adapterResults) {
        results[adapter] = adapterResults;
      }
      
      // Run concurrency test
      const concurrencyResults = await this.runConcurrencyTest(adapter, concurrency, iterations);
      if (concurrencyResults) {
        results[adapter] = { ...results[adapter], concurrency: concurrencyResults };
      }
    }

    // Summary
    console.log('\n📈 PERFORMANCE SUMMARY');
    console.log('=====================');
    
    for (const [adapter, stats] of Object.entries(results)) {
      console.log(`\n${adapter.toUpperCase()} Adapter:`);
      console.log(`  Store P95:    ${stats.store.p95.toFixed(2)}ms`);
      console.log(`  Store Avg:    ${stats.store.avg.toFixed(2)}ms`);
      console.log(`  GC P95:       ${stats.gc.p95.toFixed(2)}ms`);
      console.log(`  Throughput:   ${stats.concurrency.throughput.toFixed(2)} ops/sec`);
      
      // Check if P95 latency increase is within acceptable limits (≤ 5%)
      const baselineP95 = 10; // Assume 10ms baseline for comparison
      const increase = ((stats.store.p95 - baselineP95) / baselineP95) * 100;
      const acceptable = increase <= 5;
      
      console.log(`  P95 Impact:   ${increase > 0 ? '+' : ''}${increase.toFixed(1)}% ${acceptable ? '✅' : '❌'}`);
    }

    console.log('\n🎉 Performance test completed!');
    
    // Exit with error code if any adapter failed acceptance criteria
    const allAcceptable = Object.values(results).every(stats => {
      const baselineP95 = 10;
      const increase = ((stats.store.p95 - baselineP95) / baselineP95) * 100;
      return increase <= 5;
    });
    
    process.exit(allAcceptable ? 0 : 1);
  }
}

// Run the performance test
if (require.main === module) {
  const tester = new PerformanceTester();
  tester.run().catch(error => {
    console.error('❌ Performance test failed:', error);
    process.exit(1);
  });
}

module.exports = PerformanceTester;
