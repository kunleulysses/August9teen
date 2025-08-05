/**
 * Test: Quota Store
 * Verifies that quota tracking works correctly with persistence
 */

const { incrWithinHour, resetQuota, getQuota } = require('../utils/quotaStore.cjs');
const { PostgresStore } = require('../persistence/PostgresStore.cjs');

describe('Quota Store', () => {
  let store;
  const testId = 'test-quota-id';

  beforeAll(async () => {
    store = new PostgresStore();
    await store.ready;
  });

  afterAll(async () => {
    // Clean up test data
    await store.pool.query('DELETE FROM selfcoding_quota WHERE id = $1', [testId]);
    await store.pool.query('TRUNCATE TABLE pg_type RESTART IDENTITY CASCADE');
    await store.close();
  });

  beforeEach(async () => {
    // Reset quota before each test
    await resetQuota(testId);
  });

  test('should allow requests within quota limit', async () => {
    // Test first 100 requests should succeed
    for (let i = 1; i <= 100; i++) {
      const allowed = await incrWithinHour(testId, 1, 100);
      expect(allowed).toBe(true);
    }
    
    // Verify quota state
    const quota = await getQuota(testId);
    expect(quota.used).toBe(100);
  });

  test('should reject requests exceeding quota limit', async () => {
    // Use up the quota
    for (let i = 1; i <= 100; i++) {
      await incrWithinHour(testId, 1, 100);
    }
    
    // 101st request should fail
    const allowed = await incrWithinHour(testId, 1, 100);
    expect(allowed).toBe(false);
    
    // Verify quota state
    const quota = await getQuota(testId);
    expect(quota.used).toBe(101);
  });

  test('should reset quota correctly', async () => {
    // Use some quota
    await incrWithinHour(testId, 50, 100);
    
    let quota = await getQuota(testId);
    expect(quota.used).toBe(50);
    
    // Reset quota
    await resetQuota(testId);
    
    quota = await getQuota(testId);
    expect(quota.used).toBe(0);
    
    // Should be able to use quota again
    const allowed = await incrWithinHour(testId, 1, 100);
    expect(allowed).toBe(true);
  });

  test('should handle time-based quota reset', async () => {
    // Mock time to test hour-based reset
    const originalNow = Date.now;
    let mockTime = Date.now();
    Date.now = () => mockTime;
    
    try {
      // Use up quota
      for (let i = 1; i <= 100; i++) {
        await incrWithinHour(testId, 1, 100);
      }
      
      // Should be at limit
      let allowed = await incrWithinHour(testId, 1, 100);
      expect(allowed).toBe(false);
      
      // Advance time by more than an hour
      mockTime += 61 * 60 * 1000; // 61 minutes
      
      // Should reset and allow requests again
      allowed = await incrWithinHour(testId, 1, 100);
      expect(allowed).toBe(true);
      
      const quota = await getQuota(testId);
      expect(quota.used).toBe(1); // Should have reset and incremented once
      
    } finally {
      Date.now = originalNow;
    }
  });

  test('should persist quota across store instances', async () => {
    // Use some quota
    await incrWithinHour(testId, 25, 100);
    
    // Create new store instance
    const newStore = new PostgresStore();
    await newStore.ready;
    
    try {
      // Quota should persist
      const quota = await newStore.getQuota(testId);
      expect(quota.used).toBe(25);
      
    } finally {
      await newStore.close();
    }
  });

  test('should handle different quota IDs independently', async () => {
    const id1 = 'test-id-1';
    const id2 = 'test-id-2';
    
    try {
      // Use quota for first ID
      await incrWithinHour(id1, 50, 100);
      
      // Use quota for second ID
      await incrWithinHour(id2, 75, 100);
      
      // Check quotas are independent
      const quota1 = await getQuota(id1);
      const quota2 = await getQuota(id2);
      
      expect(quota1.used).toBe(50);
      expect(quota2.used).toBe(75);
      
    } finally {
      // Clean up
      await store.pool.query('DELETE FROM selfcoding_quota WHERE id IN ($1, $2)', [id1, id2]);
    }
  });
});
