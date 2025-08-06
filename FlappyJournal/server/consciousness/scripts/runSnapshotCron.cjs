#!/usr/bin/env node

/**
 * Snapshot Writer Cron Job
 * Runs the snapshot writer on a schedule
 */

const cron = require('node-cron');
const { logger } = require('../utils/logger.cjs');
const snapshotWriter = require('../utils/snapshotWriter.cjs');

// Schedule: Every 5 minutes
const CRON_SCHEDULE = process.env.SNAPSHOT_CRON_SCHEDULE || '*/5 * * * *';

class SnapshotCron {
  constructor() {
    this.job = null;
    this.isRunning = false;
  }

  /**
   * Run the snapshot creation
   */
  async runSnapshot() {
    if (this.isRunning) {
      logger.warn('Snapshot already in progress, skipping this run');
      return;
    }

    this.isRunning = true;
    
    try {
      logger.info('Starting scheduled snapshot creation');
      const result = await snapshotWriter.createSnapshot();
      logger.info({ result }, 'Completed scheduled snapshot');
    } catch (error) {
      logger.error({ error }, 'Failed to create scheduled snapshot');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Start the cron job
   */
  start() {
    if (this.job) {
      logger.warn('Snapshot cron job already running');
      return;
    }

    logger.info(`Starting snapshot cron job with schedule: ${CRON_SCHEDULE}`);
    
    this.job = cron.schedule(CRON_SCHEDULE, () => {
      this.runSnapshot().catch(error => {
        logger.error({ error }, 'Unhandled error in snapshot cron job');
      });
    }, {
      scheduled: true,
      timezone: 'UTC'
    });

    // Run immediately on start
    this.runSnapshot().catch(error => {
      logger.error({ error }, 'Failed to run initial snapshot');
    });
  }

  /**
   * Stop the cron job
   */
  stop() {
    if (this.job) {
      this.job.stop();
      this.job = null;
      logger.info('Stopped snapshot cron job');
    }
  }
}

// Run as a standalone script
if (require.main === module) {
  const cronJob = new SnapshotCron();
  cronJob.start();

  // Handle shutdown signals
  const shutdown = async () => {
    logger.info('Shutting down snapshot cron job');
    cronJob.stop();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = SnapshotCron;
