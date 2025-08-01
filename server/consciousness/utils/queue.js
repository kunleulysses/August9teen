import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from './redisClient.js';
import { initializeRandomness, traceId } from './random.js';
import { saveReality, incrementMetric } from './persistence.js';
import generator from '../instance.js';
import { logger, child as childLogger } from './logger.js';
import { counters } from './metrics.js';

export const realityQueue = new Queue('realityGen', { connection: redis });
export const queueEvents = new QueueEvents('realityGen', { connection: redis });

export const realityWorker = new Worker(
  'realityGen',
  async job => {
    let { realityRequest, consciousnessState } = job.data;
    // Attach traceId if missing
    if (!job.data.traceId) {
      job.data.traceId = traceId();
    }
    const log = childLogger({ traceId: job.data.traceId });
    const MAX_RSS = parseInt(process.env.MAX_RSS_BYTES || 512 * 1024 * 1024);
    const rss = process.memoryUsage().rss;
    if (rss > MAX_RSS * 0.85) {
      await incrementMetric('queueRejects');
      counters.queueRejects.inc();
      log.warn({ rss, MAX_RSS }, '🚨 Memory pressure: job rejected');
      throw new Error('MEMORY_PRESSURE');
    }

    initializeRandomness(realityRequest.seed || Date.now());
    log.info('🧠🌀🌍 [job] Generating holographic consciousness reality...');
    const result = await generator.generateHolographicConsciousnessReality(
      realityRequest,
      consciousnessState
    );
    await incrementMetric('jobsProcessed');
    counters.jobsProcessed.inc();
    log.info('✅ [job] Completed holographic consciousness reality');
    return result;
  },
  { connection: redis, concurrency: 1 }
);