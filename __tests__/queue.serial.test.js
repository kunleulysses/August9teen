const { realityQueue } = require('../server/consciousness/utils/queue.js');
const { queueEvents } = require('../server/consciousness/utils/queue.js');
const { incrementMetric } = require('../server/consciousness/utils/persistence.js');

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

describe('BullMQ queue serial processing', () => {
  let job1, job2;
  beforeAll(async () => {
    try {
      // Try a simple redis ping (skip if not running)
      const Redis = require('ioredis');
      const redis = new Redis(REDIS_URL);
      await redis.ping();
      await redis.quit();
    } catch (e) {
      console.warn('Redis not running or not available: skipping test');
      return pending('Redis not available');
    }
  });

  it('processes jobs serially', async () => {
    // Clear metrics for test
    await incrementMetric('jobsProcessed', -1000);

    const payload1 = {
      realityRequest: { description: "Job 1", version: 1 },
      consciousnessState: { phi: 0.5, awareness: 0.5, coherence: 0.5, version: 1 }
    };
    const payload2 = {
      realityRequest: { description: "Job 2", version: 1 },
      consciousnessState: { phi: 0.6, awareness: 0.6, coherence: 0.6, version: 1 }
    };

    const start = Date.now();
    job1 = await realityQueue.add('gen', payload1);
    job2 = await realityQueue.add('gen', payload2);

    const finished1 = await job1.waitUntilFinished(queueEvents);
    const mid = Date.now();
    const finished2 = await job2.waitUntilFinished(queueEvents);
    const end = Date.now();

    expect(finished1.success).toBe(true);
    expect(finished2.success).toBe(true);
    expect(mid - start).toBeLessThan(end - mid); // job2 finishes after job1
  });
});