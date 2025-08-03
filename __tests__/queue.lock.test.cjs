const { realityQueue, realityWorker } = require('../server/consciousness/utils/queue.cjs');
const { queueEvents } = require('../server/consciousness/utils/queue.cjs');
const { incrementMetric } = require('../server/consciousness/utils/persistence.cjs');
const generator = require('../server/consciousness/instance.cjs').default;

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

describe('Distributed lock enforcement', () => {
  let origGen;
  beforeAll(async () => {
    try {
      const Redis = require('ioredis');
      const redis = new Redis(REDIS_URL);
      await redis.ping();
      await redis.quit();
    } catch (e) {
      console.warn('Redis not running or not available: skipping test');
      return pending('Redis not available');
    }
    // Monkey patch generator to record times
    origGen = generator.generateHolographicConsciousnessReality;
    generator._jobTimes = [];
    generator.generateHolographicConsciousnessReality = async (...args) => {
      const start = Date.now();
      await new Promise(r => setTimeout(r, 350)); // Simulate slow job
      const end = Date.now();
      generator._jobTimes.push({ start, end });
      return { success: true };
    };
  });

  afterAll(() => {
    if (origGen) generator.generateHolographicConsciousnessReality = origGen;
    if (realityWorker && realityWorker.close) realityWorker.close();
  });

  it('enforces lock even with concurrency > 1', async () => {
    const payloads = [
      {
        realityRequest: { description: "Lock Job 1", version: 1 },
        consciousnessState: { phi: 0.5, awareness: 0.5, coherence: 0.5, version: 1 }
      },
      {
        realityRequest: { description: "Lock Job 2", version: 1 },
        consciousnessState: { phi: 0.6, awareness: 0.6, coherence: 0.6, version: 1 }
      }
    ];

    const job1 = await realityQueue.add('gen', payloads[0]);
    const job2 = await realityQueue.add('gen', payloads[1]);

    await job1.waitUntilFinished(queueEvents);
    await job2.waitUntilFinished(queueEvents);

    const times = generator._jobTimes;
    expect(times.length).toBe(2);
    expect(times[1].start).toBeGreaterThanOrEqual(times[0].end);
  });
});