import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from './redisClient.js';
import { initializeRandomness, traceId as genTraceId } from './random.js';
import { saveReality, incrementMetric } from './persistence.js';
import generator from '../instance.js';
import { logger, child as childLogger } from './logger.js';
import { counters, jobDuration, lockUnavailable } from './metrics.js';
import { runWithTraceId } from './trace.js';
import { withGeneratorLock } from './redisLock.js';

export const realityQueue = new Queue('realityGen', { connection: redis });
export const queueEvents = new QueueEvents('realityGen', { connection: redis });

export const realityWorker = new Worker(
  'realityGen',
  async job => {
    let { realityRequest, consciousnessState } = job.data;
    if (!job.data.traceId) {
      job.data.traceId = genTraceId();
    }
    // Wrap job in trace context
    return await runWithTraceId(job.data.traceId, async () => {
      const log = childLogger();
      const MAX_RSS = parseInt(process.env.MAX_RSS_BYTES || 512 * 1024 * 1024);
      const rss = process.memoryUsage().rss;
      if (rss > MAX_RSS * 0.85) {
        await incrementMetric('queueRejects');
        counters.queueRejects.inc();
        log.warn({ rss, MAX_RSS }, '🚨 Memory pressure: job rejected');
        throw new Error('MEMORY_PRESSURE');
      }

      try {
        return await withGeneratorLock(async () => {
          initializeRandomness(realityRequest.seed || Date.now());
          log.info('🧠🌀🌍 [job] Generating holographic consciousness reality...');
          const startTime = Date.now();
          const result = await generator.generateHolographicConsciousnessReality(
            realityRequest,
            consciousnessState
          );
          const durationSec = (Date.now() - startTime) / 1000;
          jobDuration.observe(durationSec);
          await incrementMetric('jobsProcessed');
          counters.jobsProcessed.inc();
          log.info({ durationSec }, '✅ [job] Completed holographic consciousness reality');
          return result;
        });
      } catch (err) {
        if (err.message === 'LOCK_UNAVAILABLE') {
          counters.lockUnavailable.inc();
          lockUnavailable.inc();
          log.warn('🔒 Could not acquire generator lock, delaying job');
          await job.moveToDelayed(Date.now() + 30000);
          await incrementMetric('queueRejects');
          throw err; // BullMQ will retry
        } else {
          throw err;
        }
      }
    });
  },
  { connection: redis, concurrency: parseInt(process.env.WORKER_CONCURRENCY || 4) }
);