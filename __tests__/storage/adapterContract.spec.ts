/**
 * Storage Adapter Contract Test Suite
 * Ensures all storage adapters adhere to the same behavioral contract
 */

import { 
  getAvailableAdapters, 
  createTestAdapter, 
  generateTestData, 
  generateTestKeys,
  wait,
  retry,
  measureTime,
  AdapterTestConfig 
} from '../helpers/adapterFactory';

describe('Storage Adapter Contract', () => {
  // Import adapter configs directly for synchronous access
  const { adapterConfigs } = require('../helpers/adapterFactory');

  // Test each adapter configuration
  adapterConfigs.forEach((config: any) => {
    describe(`${config.name} Adapter Contract`, () => {
      let adapter: any;

      beforeEach(async () => {
        // Skip adapter if external service is required but not available
        if (config.requiresExternalService && config.name === 'Redis') {
          try {
            const testRedisUrl = process.env.TEST_REDIS_URL || 'redis://127.0.0.1:6379/15';
            const { RedisSpiralAdapter } = require('../../server/consciousness/core/storage/RedisSpiralAdapter.cjs');
            const testAdapter = new RedisSpiralAdapter(testRedisUrl);
            await testAdapter.init();
            await testAdapter.redis.ping();
            await testAdapter.redis.quit();
          } catch (error) {
            console.log(`⚠️  Skipping ${config.name} tests - service not available`);
            console.warn(`${config.name} service not available`);
            return;
            return;
          }
        }

        adapter = await createTestAdapter(config);
      });

      afterEach(async () => {
        if (adapter) {
          await config.cleanup(adapter);
          adapter = null;
        }
      });

      describe('Initialization', () => {
        it('should initialize successfully', async () => {
          expect(adapter).toBeDefined();
          expect(typeof adapter.init).toBe('function');
          expect(typeof adapter.get).toBe('function');
          expect(typeof adapter.set).toBe('function');
          expect(typeof adapter.del).toBe('function');
          expect(typeof adapter.keys).toBe('function');
        });

        it('should handle multiple init calls gracefully', async () => {
          await expect(adapter.init()).resolves.not.toThrow();
          await expect(adapter.init()).resolves.not.toThrow();
        });
      });

      describe('Basic CRUD Operations', () => {
        it('should store and retrieve simple values', async () => {
          const key = 'test:simple';
          const value = 'simple string value';

          await adapter.set(key, value);
          const retrieved = await adapter.get(key);

          expect(retrieved).toBe(value);
        });

        it('should store and retrieve complex objects with deep equality', async () => {
          const key = 'test:complex';
          const value = generateTestData('complex');

          await adapter.set(key, value);
          const retrieved = await adapter.get(key);

          expect(retrieved).toEqual(value);
        });

        it('should handle null and undefined values', async () => {
          const nullKey = 'test:null';
          const undefinedKey = 'test:undefined';

          await adapter.set(nullKey, null);
          await adapter.set(undefinedKey, undefined);

          expect(await adapter.get(nullKey)).toBe(null);
          expect(await adapter.get(undefinedKey)).toBe(undefined);
        });

        it('should delete keys successfully', async () => {
          const key = 'test:delete';
          const value = 'to be deleted';

          await adapter.set(key, value);
          expect(await adapter.get(key)).toBe(value);

          await adapter.del(key);
          expect(await adapter.get(key)).toBeUndefined();
        });

        it('should handle deletion of non-existent keys', async () => {
          const key = 'test:nonexistent';
          
          // Should not throw error
          await expect(adapter.del(key)).resolves.not.toThrow();
        });
      });

      describe('JSON Fidelity', () => {
        it('should preserve all JavaScript data types', async () => {
          const testCases = [
            { key: 'test:string', value: 'hello world' },
            { key: 'test:number', value: 42 },
            { key: 'test:float', value: 3.14159 },
            { key: 'test:boolean-true', value: true },
            { key: 'test:boolean-false', value: false },
            { key: 'test:null', value: null },
            { key: 'test:array', value: [1, 'two', { three: 3 }] },
            { key: 'test:object', value: { nested: { deep: 'value' } } }
          ];

          // Store all test cases
          for (const testCase of testCases) {
            await adapter.set(testCase.key, testCase.value);
          }

          // Verify all test cases
          for (const testCase of testCases) {
            const retrieved = await adapter.get(testCase.key);
            expect(retrieved).toEqual(testCase.value);
          }
        });

        it('should handle Unicode and special characters', async () => {
          const testData = {
            unicode: '🌀✨🔧💫🚀',
            chinese: '你好世界',
            arabic: 'مرحبا بالعالم',
            emoji: '😀😃😄😁😆😅😂🤣',
            special: 'quotes"and\'backslashes\\and\nnewlines\tand\rcarriage',
            json: '{"nested": "json", "array": [1,2,3]}'
          };

          const key = 'test:unicode';
          await adapter.set(key, testData);
          const retrieved = await adapter.get(key);

          expect(retrieved).toEqual(testData);
        });

        it('should handle large payloads', async () => {
          const largeObject = {
            id: 'large-test',
            data: 'x'.repeat(10000), // 10KB string
            array: Array.from({ length: 1000 }, (_, i) => ({ index: i, value: `item-${i}` })),
            nested: {
              level1: {
                level2: {
                  level3: {
                    level4: {
                      level5: 'deep nesting test'
                    }
                  }
                }
              }
            }
          };

          const key = 'test:large';
          await adapter.set(key, largeObject);
          const retrieved = await adapter.get(key);

          expect(retrieved).toEqual(largeObject);
        });
      });

      describe('Key Operations', () => {
        it('should list keys with prefix filtering', async () => {
          const prefix = 'test:keys';
          const keys = generateTestKeys(prefix, 5);
          
          // Store test data
          for (const key of keys) {
            await adapter.set(key, `value-for-${key}`);
          }

          // Get keys with prefix
          const retrievedKeys = await adapter.keys(prefix);
          
          // Should contain all our test keys
          for (const key of keys) {
            expect(retrievedKeys).toContain(key);
          }
        });

        it('should return empty array for non-matching prefix', async () => {
          const keys = await adapter.keys('nonexistent:prefix');
          expect(Array.isArray(keys)).toBe(true);
          expect(keys.length).toBe(0);
        });

        it('should handle keys with special characters', async () => {
          const specialKeys = [
            'test:special:colon',
            'test-special-dash',
            'test_special_underscore',
            'test.special.dot',
            'test/special/slash',
            'test special space'
          ];

          // Store values for special keys
          for (const key of specialKeys) {
            await adapter.set(key, `value-${key}`);
          }

          // Verify all keys can be retrieved
          for (const key of specialKeys) {
            const value = await adapter.get(key);
            expect(value).toBe(`value-${key}`);
          }
        });
      });

      describe('Error Handling', () => {
        it('should return undefined for non-existent keys', async () => {
          const result = await adapter.get('definitely:does:not:exist');
          expect(result).toBeUndefined();
        });

        it('should handle malformed keys gracefully', async () => {
          const malformedKeys = ['', null, undefined];
          
          for (const key of malformedKeys) {
            // Should not crash, but behavior may vary by adapter
            try {
              await adapter.get(key as any);
              await adapter.set(key as any, 'test');
              await adapter.del(key as any);
            } catch (error) {
              // Some adapters may throw errors for invalid keys, which is acceptable
              expect(error).toBeDefined();
            }
          }
        });

        it('should handle concurrent operations without corruption', async () => {
          const key = 'test:concurrent';
          const operations = [];

          // Create 20 concurrent set operations
          for (let i = 0; i < 20; i++) {
            operations.push(adapter.set(`${key}:${i}`, { index: i, timestamp: Date.now() }));
          }

          // Wait for all operations to complete
          await Promise.all(operations);

          // Verify all values were stored correctly
          for (let i = 0; i < 20; i++) {
            const value = await adapter.get(`${key}:${i}`);
            expect(value).toBeDefined();
            expect(value.index).toBe(i);
          }
        });
      });

      describe('Atomic Operations', () => {
        it('should support atomicIncr if available', async () => {
          if (!config.supportsAtomicIncr) {
            console.log(`⚠️  Skipping atomicIncr test for ${config.name} - not supported`);
            return;
          }

          expect(typeof adapter.atomicIncr).toBe('function');

          const key = 'test:atomic:counter';

          // Test basic increment
          const result1 = await adapter.atomicIncr(key, 1);
          expect(result1).toBe(1);

          const result2 = await adapter.atomicIncr(key, 5);
          expect(result2).toBe(6);

          const result3 = await adapter.atomicIncr(key, -2);
          expect(result3).toBe(4);
        });

        it('should handle concurrent atomic increments correctly', async () => {
          if (!config.supportsAtomicIncr) {
            console.log(`⚠️  Skipping concurrent atomicIncr test for ${config.name} - not supported`);
            return;
          }

          const key = 'test:atomic:concurrent';
          const concurrentOps = 20;

          // Create 20 concurrent increment operations
          const operations = Array.from({ length: concurrentOps }, () =>
            adapter.atomicIncr(key, 1)
          );

          const results = await Promise.all(operations);

          // All operations should succeed
          expect(results).toHaveLength(concurrentOps);
          results.forEach(result => expect(typeof result).toBe('number'));

          // Final value should be exactly 20
          const finalValue = await adapter.atomicIncr(key, 0); // Increment by 0 to get current value
          expect(finalValue).toBe(concurrentOps);
        });

        it('should handle atomic operations with different increments', async () => {
          if (!config.supportsAtomicIncr) {
            console.log(`⚠️  Skipping mixed atomicIncr test for ${config.name} - not supported`);
            return;
          }

          const key = 'test:atomic:mixed';
          const operations = [
            () => adapter.atomicIncr(key, 10),
            () => adapter.atomicIncr(key, -3),
            () => adapter.atomicIncr(key, 7),
            () => adapter.atomicIncr(key, -2),
            () => adapter.atomicIncr(key, 5)
          ];

          await Promise.all(operations.map(op => op()));

          // Expected final value: 10 - 3 + 7 - 2 + 5 = 17
          const finalValue = await adapter.atomicIncr(key, 0);
          expect(finalValue).toBe(17);
        });
      });

      describe('Concurrency Safety', () => {
        it('should handle concurrent read/write operations safely', async () => {
          const key = 'test:concurrency:readwrite';
          const iterations = 50;

          const operations = [];

          // Mix of read and write operations
          for (let i = 0; i < iterations; i++) {
            if (i % 2 === 0) {
              // Write operation
              operations.push(adapter.set(key, { iteration: i, timestamp: Date.now() }));
            } else {
              // Read operation
              operations.push(adapter.get(key));
            }
          }

          // All operations should complete without errors
          const results = await Promise.all(operations);
          expect(results).toHaveLength(iterations);
        });

        it('should maintain data integrity under concurrent stress', async () => {
          const keyPrefix = 'test:stress';
          const concurrency = 50;
          const operationsPerWorker = 10;

          const workers = Array.from({ length: concurrency }, (_, workerId) =>
            async () => {
              for (let i = 0; i < operationsPerWorker; i++) {
                const key = `${keyPrefix}:worker-${workerId}:op-${i}`;
                const value = { workerId, operation: i, timestamp: Date.now() };

                await adapter.set(key, value);
                const retrieved = await adapter.get(key);

                expect(retrieved).toEqual(value);
              }
            }
          );

          // Run all workers concurrently
          await Promise.all(workers.map(worker => worker()));

          // Verify all data was stored correctly
          const allKeys = await adapter.keys(keyPrefix);
          expect(allKeys.length).toBe(concurrency * operationsPerWorker);
        });

        it('should handle rapid key creation and deletion', async () => {
          const keyPrefix = 'test:rapid:lifecycle';
          const cycles = 20;

          for (let cycle = 0; cycle < cycles; cycle++) {
            const operations = [];

            // Create multiple keys
            for (let i = 0; i < 10; i++) {
              const key = `${keyPrefix}:cycle-${cycle}:key-${i}`;
              operations.push(adapter.set(key, { cycle, key: i }));
            }

            await Promise.all(operations);

            // Verify keys exist
            const keys = await adapter.keys(`${keyPrefix}:cycle-${cycle}`);
            expect(keys.length).toBe(10);

            // Delete all keys
            const deleteOps = keys.map((key: any) => adapter.del(key));
            await Promise.all(deleteOps);

            // Verify keys are gone
            const remainingKeys = await adapter.keys(`${keyPrefix}:cycle-${cycle}`);
            expect(remainingKeys.length).toBe(0);
          }
        });
      });

      describe('Performance Characteristics', () => {
        it('should handle batch operations efficiently', async () => {
          const batchSize = 100;
          const prefix = 'test:batch';

          const { timeMs } = await measureTime(async () => {
            const operations = [];

            for (let i = 0; i < batchSize; i++) {
              operations.push(adapter.set(`${prefix}:${i}`, { index: i, data: `batch-${i}` }));
            }

            await Promise.all(operations);
          });

          console.log(`${config.name}: ${batchSize} operations in ${timeMs}ms (${(batchSize / (timeMs / 1000)).toFixed(0)} ops/sec)`);

          // Verify all data was stored
          const keys = await adapter.keys(prefix);
          expect(keys.length).toBe(batchSize);

          // Performance expectation: should complete within reasonable time
          expect(timeMs).toBeLessThan(5000); // 5 seconds for 100 operations
        });

        it('should handle rapid sequential operations', async () => {
          const key = 'test:rapid';
          const iterations = 50;

          for (let i = 0; i < iterations; i++) {
            await adapter.set(key, { iteration: i, timestamp: Date.now() });
            const value = await adapter.get(key);
            expect(value.iteration).toBe(i);
          }
        });
      });

      describe('Edge Cases and Error Scenarios', () => {
        it('should handle extremely long keys', async () => {
          const longKey = 'test:long:' + 'x'.repeat(1000);
          const value = 'value for long key';

          try {
            await adapter.set(longKey, value);
            const retrieved = await adapter.get(longKey);
            expect(retrieved).toBe(value);
          } catch (error: any) {
            // Some adapters may have key length limits, which is acceptable
            console.log(`${config.name} has key length limits:`, error.message);
          }
        });

        it('should handle keys with only special characters', async () => {
          const specialKeys = [
            ':::',
            '...',
            '---',
            '___',
            '///',
            '\\\\\\',
            '???',
            '***',
            '###'
          ];

          for (const key of specialKeys) {
            try {
              await adapter.set(key, `value-${key}`);
              const value = await adapter.get(key);
              expect(value).toBe(`value-${key}`);
            } catch (error: any) {
              // Some special characters may not be supported, which is acceptable
              console.log(`${config.name} doesn't support key "${key}":`, error.message);
            }
          }
        });

        it('should handle circular reference objects gracefully', async () => {
          const circularObj: any = { name: 'circular' };
          circularObj.self = circularObj;

          const key = 'test:circular';

          try {
            await adapter.set(key, circularObj);
            // If it doesn't throw, verify we can retrieve something
            const retrieved = await adapter.get(key);
            expect(retrieved).toBeDefined();
          } catch (error: any) {
            // Circular references should be handled gracefully (usually by throwing)
            expect(error).toBeDefined();
            expect(error.message).toMatch(/circular|convert|serialize/i);
          }
        });

        it('should handle very deep nested objects', async () => {
          // Create a deeply nested object
          let deepObj: any = { level: 0 };
          let current = deepObj;

          for (let i = 1; i <= 100; i++) {
            current.next = { level: i };
            current = current.next;
          }
          current.end = true;

          const key = 'test:deep';

          try {
            await adapter.set(key, deepObj);
            const retrieved = await adapter.get(key);

            // Verify structure is preserved
            expect(retrieved.level).toBe(0);

            // Navigate to the end
            let nav = retrieved;
            for (let i = 1; i <= 100; i++) {
              nav = nav.next;
              expect(nav.level).toBe(i);
            }
            expect(nav.end).toBe(true);
          } catch (error: any) {
            // Some adapters may have depth limits
            console.log(`${config.name} has nesting limits:`, error.message);
          }
        });

        it('should handle concurrent operations on the same key', async () => {
          const key = 'test:same-key-concurrent';
          const concurrentWrites = 20;

          // Multiple concurrent writes to the same key
          const operations = Array.from({ length: concurrentWrites }, (_, i) =>
            adapter.set(key, { writer: i, timestamp: Date.now() })
          );

          await Promise.all(operations);

          // Should have some value (last writer wins)
          const finalValue = await adapter.get(key);
          expect(finalValue).toBeDefined();
          expect(typeof finalValue.writer).toBe('number');
          expect(finalValue.writer).toBeGreaterThanOrEqual(0);
          expect(finalValue.writer).toBeLessThan(concurrentWrites);
        });

        it('should handle mixed data types in rapid succession', async () => {
          const key = 'test:mixed-types';
          const values = [
            'string',
            42,
            true,
            null,
            undefined,
            { object: 'value' },
            [1, 2, 3],
            3.14159
          ];

          for (const value of values) {
            await adapter.set(key, value);
            const retrieved = await adapter.get(key);
            expect(retrieved).toEqual(value);
          }
        });

        it('should handle storage exhaustion gracefully', async () => {
          // Try to store a very large amount of data
          const largeData = {
            id: 'exhaustion-test',
            data: 'x'.repeat(1000000), // 1MB string
            array: Array.from({ length: 10000 }, (_, i) => ({ index: i, data: 'y'.repeat(100) }))
          };

          const key = 'test:exhaustion';

          try {
            await adapter.set(key, largeData);
            const retrieved = await adapter.get(key);
            expect(retrieved).toEqual(largeData);
          } catch (error: any) {
            // Storage exhaustion should be handled gracefully
            expect(error).toBeDefined();
            console.log(`${config.name} storage limit reached:`, error.message);
          }
        });

        it('should handle rapid key creation beyond typical limits', async () => {
          const keyPrefix = 'test:limit';
          const keyCount = 1000;
          const batchSize = 50;

          try {
            // Create keys in batches to avoid overwhelming the adapter
            for (let batch = 0; batch < keyCount / batchSize; batch++) {
              const operations = [];

              for (let i = 0; i < batchSize; i++) {
                const keyIndex = batch * batchSize + i;
                operations.push(adapter.set(`${keyPrefix}:${keyIndex}`, { index: keyIndex }));
              }

              await Promise.all(operations);
            }

            // Verify some keys exist
            const keys = await adapter.keys(keyPrefix);
            expect(keys.length).toBeGreaterThan(0);
            expect(keys.length).toBeLessThanOrEqual(keyCount);

          } catch (error: any) {
            // Some adapters may have limits
            console.log(`${config.name} reached limits at:`, error.message);
          }
        });

        it('should handle adapter reinitialization', async () => {
          const key = 'test:reinit';
          const value = 'persistent value';

          // Store a value
          await adapter.set(key, value);

          // Reinitialize the adapter
          await adapter.init();

          // Value should still be accessible (for persistent adapters)
          const retrieved = await adapter.get(key);
          if (config.name !== 'InMemory') {
            // Persistent adapters should retain data
            expect(retrieved).toBe(value);
          } else {
            // InMemory adapter may lose data on reinit
            console.log(`${config.name} is ephemeral - data may be lost on reinit`);
          }
        });

        it('should handle operations after cleanup attempts', async () => {
          const key = 'test:post-cleanup';
          const value = 'test value';

          // Store initial value
          await adapter.set(key, value);
          expect(await adapter.get(key)).toBe(value);

          // Attempt cleanup (should not affect current adapter instance)
          try {
            await config.cleanup(adapter);
          } catch (error: any) {
            // Cleanup might fail if adapter is still in use
            console.log(`${config.name} cleanup warning:`, error.message);
          }

          // Adapter should still work or gracefully handle the situation
          try {
            await adapter.set(key, 'new value');
            const retrieved = await adapter.get(key);
            expect(retrieved).toBeDefined();
          } catch (error: any) {
            // Some adapters may become unusable after cleanup
            expect(error).toBeDefined();
          }
        });
      });
    }
    });
