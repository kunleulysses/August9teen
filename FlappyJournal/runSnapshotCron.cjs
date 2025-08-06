#!/usr/bin/env node

/**
 * Snapshot Cron Job for Consciousness Reality Generator
 * Runs automated database snapshots on a schedule
 */

const snapshotWriter = require('./server/consciousness/utils/snapshotWriter.cjs');
const { logger } = require('./server/consciousness/utils/logger.cjs');

async function runSnapshotCron() {
  const startTime = Date.now();
  
  try {
    logger.info('Starting scheduled snapshot creation...');
    
    // Generate snapshot name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const snapshotName = `scheduled_${timestamp}`;
    
    // Create the snapshot
    const result = await snapshotWriter.createSnapshot(snapshotName);
    
    if (result.success) {
      const duration = Date.now() - startTime;
      logger.info({
        snapshotId: result.snapshot.id,
        snapshotName: result.snapshot.name,
        size: result.snapshot.size,
        checksum: result.snapshot.checksum,
        durationMs: duration
      }, 'Scheduled snapshot created successfully');
      
      // Clean up old snapshots (keep last 10)
      await cleanupOldSnapshots();
      
      process.exit(0);
    } else {
      logger.error('Scheduled snapshot creation failed');
      process.exit(1);
    }
    
  } catch (error) {
    logger.error({ 
      error: error.message, 
      stack: error.stack 
    }, 'Scheduled snapshot creation failed with error');
    process.exit(1);
  }
}

async function cleanupOldSnapshots() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Get all completed snapshots, ordered by creation date (newest first)
    const snapshots = await prisma.snapshot.findMany({
      where: { status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' }
    });
    
    // Keep the 10 most recent snapshots, mark others for cleanup
    const snapshotsToDelete = snapshots.slice(10);
    
    if (snapshotsToDelete.length > 0) {
      logger.info(`Cleaning up ${snapshotsToDelete.length} old snapshots`);
      
      for (const snapshot of snapshotsToDelete) {
        try {
          // Delete from S3 if it exists
          if (snapshot.s3Key && snapshotWriter.s3Client) {
            const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
            await snapshotWriter.s3Client.send(new DeleteObjectCommand({
              Bucket: snapshotWriter.s3Bucket,
              Key: snapshot.s3Key
            }));
            logger.info(`Deleted S3 object: ${snapshot.s3Key}`);
          }
          
          // Delete from database
          await prisma.snapshot.delete({
            where: { id: snapshot.id }
          });
          
          logger.info(`Cleaned up snapshot: ${snapshot.name}`);
          
        } catch (error) {
          logger.error({ 
            snapshotId: snapshot.id, 
            error: error.message 
          }, 'Failed to cleanup snapshot');
        }
      }
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    logger.error({ error: error.message }, 'Failed to cleanup old snapshots');
  }
}

// Handle process signals
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run the cron job
runSnapshotCron();