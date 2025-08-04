/**
 * Adapter Factory for Contract Testing
 * Provides standardized creation and cleanup utilities for all storage adapters
 */

const LevelSpiralAdapter = require('../../FlappyJournal/server/consciousness/core/storage/LevelSpiralAdapter.cjs');
const RedisSpiralAdapter = require('../../FlappyJournal/server/consciousness/core/storage/RedisSpiralAdapter.cjs');
const { InMemorySpiralAdapter } = require('../../FlappyJournal/server/consciousness/core/storage/SpiralStorageAdapter.cjs');
const fs = require('fs');
const path = require('path');

export interface AdapterTestConfig {
  name: string;
  createAdapter: () => any;
  cleanup: (adapter: any) => Promise<void>;
  supportsAtomicIncr: boolean;
  requiresExternalService: boolean;
}

/**
 * Clean up LevelDB test database
 */
async function cleanupLevelDB(adapter: any): Promise<void> {
  try {
    // Close the database connection
    if (adapter && adapter.db && typeof adapter.db.close === 'function') {
      await new Promise<void>((resolve, reject) => {
        adapter.db.close((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    // Remove the database directory
    if (adapter && adapter.dbPath) {
      const rimraf = require('rimraf');
      await new Promise<void>((resolve, reject) => {
        rimraf(adapter.dbPath, (err: any) => {
          if (err && err.code !== 'ENOENT') reject(err);
          else resolve();
        });
      });
    }
  } catch (error) {
    console.warn('LevelDB cleanup warning:', error);
  }
}

/**
 * Clean up Redis test database
 */
async function cleanupRedis(adapter: any): Promise<void> {
  try {
    if (adapter && adapter.redis && typeof adapter.redis.flushdb === 'function') {
      await adapter.redis.flushdb();
    }
    
    // Close Redis connection
    if (adapter && adapter.redis && typeof adapter.redis.quit === 'function') {
      await adapter.redis.quit();
    }
  } catch (error) {
    console.warn('Redis cleanup warning:', error);
  }
}

/**
 * Clean up InMemory adapter
 */
async function cleanupInMemory(adapter: any): Promise<void> {
  try {
    if (adapter && adapter.data) {
      adapter.data.clear();
    }
  } catch (error) {
    console.warn('InMemory cleanup warning:', error);
  }
}

/**
 * Generate unique test database path for LevelDB
 */
function generateTestDBPath(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return path.join(__dirname, '../../tmp-testdb-' + timestamp + '-' + random);
}

/**
 * Check if Redis is available for testing
 */
async function isRedisAvailable(): Promise<boolean> {
  try {
    const testRedisUrl = process.env.TEST_REDIS_URL || 'redis://127.0.0.1:6379/15';
    const testAdapter = new RedisSpiralAdapter(testRedisUrl);
    await testAdapter.init();
    await testAdapter.redis.ping();
    await testAdapter.redis.quit();
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Adapter configurations for contract testing
 */
export const adapterConfigs: AdapterTestConfig[] = [
  {
    name: 'InMemory',
    createAdapter: () => new InMemorySpiralAdapter(),
    cleanup: cleanupInMemory,
    supportsAtomicIncr: false,
    requiresExternalService: false
  },
  // Temporarily disabled Level adapter due to missing level dependency
  // {
  //   name: 'Level',
  //   createAdapter: () => {
  //     const dbPath = generateTestDBPath();
  //     const adapter = new LevelSpiralAdapter(dbPath);
  //     adapter.dbPath = dbPath; // Store path for cleanup
  //     return adapter;
  //   },
  //   cleanup: cleanupLevelDB,
  //   supportsAtomicIncr: false,
  //   requiresExternalService: false
  // },
  {
    name: 'Redis',
    createAdapter: () => {
      const testRedisUrl = process.env.TEST_REDIS_URL || 'redis://127.0.0.1:6379/15';
      return new RedisSpiralAdapter(testRedisUrl);
    },
    cleanup: cleanupRedis,
    supportsAtomicIncr: true,
    requiresExternalService: true
  }
];

/**
 * Filter adapters based on availability
 */
export async function getAvailableAdapters(): Promise<AdapterTestConfig[]> {
  const available: AdapterTestConfig[] = [];
  
  for (const config of adapterConfigs) {
    if (config.requiresExternalService) {
      if (config.name === 'Redis') {
        const redisAvailable = await isRedisAvailable();
        if (redisAvailable) {
          available.push(config);
        } else {
          console.log(`⚠️  Skipping ${config.name} adapter tests - service not available`);
        }
      }
    } else {
      available.push(config);
    }
  }
  
  return available;
}

/**
 * Create and initialize an adapter for testing
 */
export async function createTestAdapter(config: AdapterTestConfig): Promise<any> {
  const adapter = config.createAdapter();
  
  try {
    await adapter.init();
    return adapter;
  } catch (error) {
    // Cleanup on initialization failure
    await config.cleanup(adapter);
    throw error;
  }
}

/**
 * Generate test data with various types for JSON fidelity testing
 */
export function generateTestData(seed: string = 'test') {
  return {
    id: `${seed}-${Date.now()}`,
    string: `test string ${seed}`,
    number: Math.random() * 1000,
    boolean: Math.random() > 0.5,
    null: null,
    array: [1, 'two', { three: 3 }, null, true],
    object: {
      nested: {
        deep: {
          value: `nested-${seed}`,
          timestamp: new Date().toISOString()
        }
      },
      unicode: '🌀✨🔧',
      special: 'quotes"and\'backslashes\\and\nnewlines'
    },
    date: new Date().toISOString(),
    largeString: 'x'.repeat(1000) // Test larger payloads
  };
}

/**
 * Generate multiple test keys with a common prefix
 */
export function generateTestKeys(prefix: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix}:key-${i}`);
}

/**
 * Wait for a specified amount of time (for timing-sensitive tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>, 
  maxAttempts: number = 3, 
  baseDelay: number = 100
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await wait(delay);
    }
  }
  
  throw lastError!;
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; timeMs: number }> {
  const start = Date.now();
  const result = await fn();
  const timeMs = Date.now() - start;
  return { result, timeMs };
}

export default {
  adapterConfigs,
  getAvailableAdapters,
  createTestAdapter,
  generateTestData,
  generateTestKeys,
  wait,
  retry,
  measureTime
};
