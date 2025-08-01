import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from './redisClient.js';
import { initializeRandomness } from './random.js';
import { saveReality, incrementMetric } from './persistence.js';
import generator from '../instance.js';

export const realityQueue = new Queue('realityGen', { connection: redis });
export const queueEvents = new QueueEvents('realityGen', { connection: redis });

export const realityWorker = new Worker(
  'realityGen',
  async job => {
    const { realityRequest, consciousnessState } = job.data;
    const MAX_RSS = parseInt(process.env.MAX_RSS_BYTES || 512 * 1024 * 1024);
    const rss = process.memoryUsage().rss;
    if (rss > MAX_RSS * 0.85) {
      await incrementMetric('queueRejects');
      throw new Error('MEMORY_PRESSURE');
    }

    initializeRandomness(realityRequest.seed || Date.now());
    const result = await generator.generateHolographicConsciousnessReality(
      realityRequest,
      consciousnessState
    );
    await incrementMetric('jobsProcessed');
    return result;
  },
  { connection: redis, concurrency: 1 }
);