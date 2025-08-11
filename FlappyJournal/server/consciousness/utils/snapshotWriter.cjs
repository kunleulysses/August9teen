/**
 * Snapshot Writer for Consciousness Reality Generator
 * Handles database snapshots with S3 integration and checksum verification
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger.cjs');

const execPromise = promisify(exec);

class SnapshotWriter {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.prisma = new PrismaClient();
    this.snapshotDir = process.env.SNAPSHOT_DIR || '/tmp/snapshots';
    this.s3Bucket = process.env.S3_BUCKET || 'featherweight-snapshots';

    // Allow local-only operation without S3 by env flag or missing creds
    const s3Disabled = String(process.env.SNAPSHOT_S3_DISABLE || process.env.S3_DISABLE || 'false').toLowerCase() === 'true' ||
      !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY;
    if (s3Disabled) {
      this.s3Bucket = null;
    }
    
    // Ensure snapshot directory exists
    if (!fs.existsSync(this.snapshotDir)) {
      fs.mkdirSync(this.snapshotDir, { recursive: true });
    }
  }

  /**
   * Generate a timestamp for the snapshot
   */
  _generateTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-');
  }

  /**
   * Generate a checksum for a file
   */
  async _generateChecksum(filePath) {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * Create a database snapshot by copying the SQLite file
   * @param {string} name - Name for the snapshot
   * @returns {Promise<Object>} Snapshot metadata
   */
  async createSnapshot(name = `snapshot_${new Date().toISOString()}`) {
    const logger = this.log || console;
    const startTime = Date.now();
    
    try {
      logger.info(`Creating SQLite snapshot: ${name}`);
      
      // Create snapshot directory if it doesn't exist
      await fs.promises.mkdir(this.snapshotDir, { recursive: true });
      
      // Get database file path
      const dbPath = process.env.DATABASE_URL.replace('file:', '').replace('sqlite:', '');
      
      // Generate snapshot file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `snapshot_${timestamp}.db`;
      const filePath = path.join(this.snapshotDir, fileName);
      
      // Create database backup by copying the file (simpler approach for SQLite)
      logger.info('Creating database backup...');
      await fs.promises.copyFile(dbPath, filePath);
      
      // Get file stats
      const stats = await fs.promises.stat(filePath);
      const fileSize = stats.size;
      
      // Calculate checksum
      logger.info('Calculating checksum...');
      const fileBuffer = await fs.promises.readFile(filePath);
      const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      
      // Upload to S3 if configured
      let s3Key = null;
      if (this.s3Client && this.s3Bucket) {
        s3Key = `snapshots/${fileName}`;
        logger.info(`Uploading to S3: ${s3Key}`);
        
        const uploadParams = {
          Bucket: this.s3Bucket,
          Key: s3Key,
          Body: fileBuffer,
          ContentType: 'application/x-sqlite3',
          Metadata: {
            'sha256': checksum,
            'database': 'sqlite',
            'created-at': new Date().toISOString()
          }
        };
        
        await this.s3Client.send(new PutObjectCommand(uploadParams));
      }
      
      // Save snapshot metadata to database
      const snapshot = await this.prisma.snapshot.create({
        data: {
          name,
          s3Key: s3Key || filePath,
          checksum,
          size: fileSize,
          status: 'COMPLETED',
          schemaVersion: 1
        }
      });
      
      // Clean up local file if uploaded to S3
      if (s3Key) {
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          logger.warn(`Failed to clean up local snapshot file: ${error.message}`);
        }
      }
      
      const duration = Date.now() - startTime;
      logger.info(`Snapshot ${name} created successfully in ${duration}ms`);
      
      return {
        success: true,
        snapshot,
        durationMs: duration
      };
      
    } catch (error) {
      const errorMsg = `Failed to create snapshot: ${error.message}`;
      logger.error({ error, stack: error.stack }, errorMsg);
      
      // Record failure in database if possible
      try {
        await this.prisma.snapshot.create({
          data: {
            name,
            status: 'FAILED',
            restoreMessage: errorMsg,
            schemaVersion: 1
          }
        });
      } catch (dbError) {
        logger.error({ error: dbError }, 'Failed to record snapshot failure in database');
      }
      
      throw new Error(errorMsg);
    }
  }

  /**
   * Reset the database by creating a backup and then restoring from it
   * For SQLite, we'll create a backup file and then restore it
   */
  async _resetDatabase() {
    const logger = this.log || console;
    
    try {
      logger.info('Preparing to reset SQLite database...');
      
      // Get the database file path from DATABASE_URL
      const dbPath = process.env.DATABASE_URL.replace('file:', '').replace('sqlite:', '');
      const backupPath = `/opt/featherweight/FlappyJournal/prisma/backups/pre_restore_${Date.now()}.db`;
      
      // Create a backup of the current database
      logger.info(`Creating backup of current database at: ${backupPath}`);
      await fs.promises.copyFile(dbPath, backupPath);
      
      // Disconnect Prisma client
      logger.info('Disconnecting Prisma client...');
      await this.prisma.$disconnect();
      
      // Remove the existing database file
      logger.info('Removing existing database file...');
      try {
        await fs.promises.unlink(dbPath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          throw error; // Only throw if the error isn't "file not found"
        }
      }
      
      // Reconnect to the database (this will create a new empty database)
      logger.info('Reconnecting to database...');
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      
      // Run migrations
      logger.info('Running database migrations...');
      await execPromise('npx prisma migrate deploy');
      
      logger.info('Database reset completed successfully');
      return { 
        success: true, 
        backupPath,
        message: 'Database reset successfully. A backup was created before reset.'
      };
      
    } catch (error) {
      const errorMsg = `Failed to reset database: ${error.message}`;
      logger.error({ error, stack: error.stack }, errorMsg);
      
      // Attempt to reconnect to the database even if reset failed
      try {
        await this.prisma.$disconnect();
        this.prisma = new PrismaClient();
        await this.prisma.$connect();
        logger.info('Reconnected to database after reset failure');
      } catch (reconnectError) {
        logger.error({ error: reconnectError }, 'Failed to reconnect to database after reset failure');
      }
      
      throw new Error(errorMsg);
    }
  }

  /**
   * Restore database from a snapshot with comprehensive error handling and verification
   */
  async restoreFromSnapshot(snapshotName) {
    const logger = this.log || console;
    const startTime = Date.now();
    
    try {
      logger.info(`Initiating restore from snapshot: ${snapshotName}`);
      
      // Find the snapshot in the database
      const snapshot = await this.prisma.snapshot.findFirst({
        where: { name: snapshotName },
        orderBy: { createdAt: 'desc' }
      });
      
      if (!snapshot) {
        throw new Error(`Snapshot not found: ${snapshotName}`);
      }
      
      logger.info(`Found snapshot: ${snapshot.id} (${snapshot.name})`);
      
      // Update snapshot status
      await this.prisma.snapshot.update({
        where: { id: snapshot.id },
        data: { 
          restoreStatus: 'IN_PROGRESS',
          restoreMessage: 'Restore in progress',
          lastRestoredAt: new Date()
        }
      });
      
      let localSnapshotPath;
      
      try {
        // Download from S3 if needed
        if (snapshot.s3Key && this.s3Client) {
          logger.info(`Downloading snapshot from S3: ${snapshot.s3Key}`);
          
          localSnapshotPath = path.join(this.snapshotDir, path.basename(snapshot.s3Key));
          await fs.promises.mkdir(path.dirname(localSnapshotPath), { recursive: true });
          
          const params = {
            Bucket: this.s3Bucket,
            Key: snapshot.s3Key
          };
          
          const { Body } = await this.s3Client.send(new GetObjectCommand(params));
          const writeStream = fs.createWriteStream(localSnapshotPath);
          
          await new Promise((resolve, reject) => {
            Body.pipe(writeStream)
              .on('error', reject)
              .on('finish', resolve);
          });
          
          logger.info(`Downloaded snapshot to: ${localSnapshotPath}`);
        } else if (fs.existsSync(snapshot.s3Key)) {
          // Use local file if it exists
          localSnapshotPath = snapshot.s3Key;
          logger.info(`Using local snapshot file: ${localSnapshotPath}`);
        } else {
          throw new Error('No valid snapshot file found');
        }
        
        // Verify checksum
        logger.info('Verifying snapshot checksum...');
        const fileBuffer = await fs.promises.readFile(localSnapshotPath);
        const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        
        if (checksum !== snapshot.checksum) {
          throw new Error(`Checksum verification failed. Expected ${snapshot.checksum}, got ${checksum}`);
        }
        
        // Reset the database
        logger.info('Resetting database...');
        await this._resetDatabase();
        
        // Get the database file path
        const dbPath = process.env.DATABASE_URL.replace('file:', '').replace('sqlite:', '');
        
        // Close any existing connections
        logger.info('Closing database connections...');
        await this.prisma.$disconnect();
        
        // Remove the existing database file
        logger.info('Removing existing database file...');
        try {
          await fs.promises.unlink(dbPath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
        
        // Copy the snapshot to the database location
        logger.info(`Restoring database from snapshot: ${localSnapshotPath}`);
        await fs.promises.copyFile(localSnapshotPath, dbPath);
        
        // Reconnect to the database
        logger.info('Reconnecting to database...');
        this.prisma = new PrismaClient();
        await this.prisma.$connect();
        
        // Run migrations to ensure schema is up to date
        logger.info('Running database migrations...');
        await execPromise('npx prisma migrate deploy');
        
        // Verify the restore was successful
        logger.info('Verifying restore...');
        const realityCount = await this.prisma.reality.count();
        logger.info(`Restore verification: Found ${realityCount} reality records`);
        
        // Update snapshot status
        await this.prisma.snapshot.update({
          where: { id: snapshot.id },
          data: { 
            restoreStatus: 'SUCCESS',
            restoreMessage: 'Restore completed successfully',
            lastRestoredAt: new Date()
          }
        });
        
        const duration = Date.now() - startTime;
        logger.info(`Successfully restored from snapshot ${snapshotName} in ${duration}ms`);
        
        return {
          success: true,
          snapshot: {
            ...snapshot,
            restoreStatus: 'SUCCESS',
            lastRestoredAt: new Date()
          },
          durationMs: duration
        };
        
      } finally {
        // Clean up local snapshot file if it was downloaded
        if (localSnapshotPath && localSnapshotPath !== snapshot.s3Key) {
          try {
            await fs.promises.unlink(localSnapshotPath);
          } catch (error) {
            logger.warn(`Failed to clean up local snapshot file: ${error.message}`);
          }
        }
      }
      
    } catch (error) {
      const errorMsg = `Failed to restore from snapshot: ${error.message}`;
      logger.error({ error, stack: error.stack }, errorMsg);
      
      // Update snapshot status with error
      try {
        await this.prisma.snapshot.update({
          where: { id: snapshot?.id },
          data: { 
            restoreStatus: 'FAILED',
            restoreMessage: errorMsg,
            lastRestoredAt: new Date()
          }
        });
      } catch (updateError) {
        logger.error({ error: updateError }, 'Failed to update snapshot status with error');
      }
      
      // Attempt to reconnect to the database
      try {
        await this.prisma.$disconnect();
        this.prisma = new PrismaClient();
        await this.prisma.$connect();
      } catch (reconnectError) {
        logger.error({ error: reconnectError }, 'Failed to reconnect to database after restore failure');
      }
      
      throw new Error(errorMsg);
    }
    const snapshotPath = path.join(this.snapshotDir, snapshotName);
    let restoreSuccessful = false;
    
    try {
      // Get snapshot metadata from database first
      const snapshot = await this.prisma.snapshot.findUnique({
        where: { name: snapshotName }
      });
      
      if (!snapshot) {
        throw new Error(`Snapshot ${snapshotName} not found in database`);
      }
      
      logger.info({ snapshotId: snapshot.id }, `Initiating database restore from snapshot: ${snapshotName}`);
      
      // Step 1: Download snapshot from S3 if not exists locally
      if (!fs.existsSync(snapshotPath)) {
        logger.info(`Downloading snapshot ${snapshotName} from S3`);
        const { GetObjectCommand } = require('@aws-sdk/client-s3');
        
        try {
          const params = {
            Bucket: this.s3Bucket,
            Key: snapshot.s3Key || `snapshots/${snapshotName}`,
          };
          
          const { Body, ContentLength } = await this.s3Client.send(new GetObjectCommand(params));
          
          // Ensure directory exists
          if (!fs.existsSync(path.dirname(snapshotPath))) {
            fs.mkdirSync(path.dirname(snapshotPath), { recursive: true });
          }
          
          // Write file with progress tracking
          const writeStream = fs.createWriteStream(snapshotPath);
          let bytesDownloaded = 0;
          const progressInterval = setInterval(() => {
            const percent = Math.round((bytesDownloaded / ContentLength) * 100);
            logger.info(`Download progress: ${percent}% (${bytesDownloaded}/${ContentLength} bytes)`);
          }, 2000);
          
          await new Promise((resolve, reject) => {
            Body.on('data', (chunk) => bytesDownloaded += chunk.length);
            Body.pipe(writeStream)
              .on('error', (error) => {
                clearInterval(progressInterval);
                reject(error);
              })
              .on('finish', () => {
                clearInterval(progressInterval);
                logger.info(`Download completed: ${bytesDownloaded} bytes`);
                resolve();
              });
          });
          
        } catch (error) {
          throw new Error(`Failed to download snapshot from S3: ${error.message}`);
        }
      }
      
      // Step 2: Verify local file integrity
      if (!fs.existsSync(snapshotPath)) {
        throw new Error(`Snapshot file not found at ${snapshotPath} after download`);
      }
      
      const fileSize = fs.statSync(snapshotPath).size;
      if (fileSize === 0) {
        throw new Error(`Snapshot file is empty: ${snapshotPath}`);
      }
      
      logger.info(`Verifying checksum for ${snapshotName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`);
      
      // Step 3: Verify checksum
      const checksum = await this._generateChecksum(snapshotPath);
      if (checksum !== snapshot.checksum) {
        throw new Error(`Checksum verification failed for ${snapshotName}. Expected ${snapshot.checksum}, got ${checksum}`);
      }
      
      logger.info('Checksum verified, preparing database for restore...');
      
      // Step 4: Create a pre-restore backup if this is a production environment
      let preRestoreBackup = null;
      if (process.env.NODE_ENV === 'production') {
        try {
          preRestoreBackup = await this.createSnapshot();
          logger.info(`Created pre-restore backup: ${preRestoreBackup.snapshotName}`);
        } catch (error) {
          logger.warn(`Failed to create pre-restore backup: ${error.message}`);
        }
      }
      
      // Step 5: Reset the database
      await this._resetDatabase();
      
      // Step 6: Restore from dump with progress tracking
      logger.info(`Restoring database from ${snapshotName}...`);
      
      const restoreCmd = `pg_restore --verbose --clean --if-exists --no-owner --no-privileges \
        --dbname=${process.env.DATABASE_URL} ${snapshotPath}`;
      
      logger.debug(`Executing: ${restoreCmd}`);
      
      const { stdout, stderr } = await execPromise(restoreCmd, { maxBuffer: 50 * 1024 * 1024 });
      
      if (stderr && stderr.includes('ERROR')) {
        logger.error({ stderr }, 'Errors during pg_restore');
        throw new Error(`Restore failed: ${stderr}`);
      }
      
      // Step 7: Verify restoration
      logger.info('Verifying database restoration...');
      const [realityCount, pathCount, fieldCount] = await Promise.all([
        this.prisma.reality.count(),
        this.prisma.recursionPath.count(),
        this.prisma.consciousnessField.count()
      ]);
      
      if (realityCount === 0 && pathCount === 0 && fieldCount === 0) {
        throw new Error('Restore completed but database appears to be empty');
      }
      
      // Step 8: Update snapshot metadata
      await this.prisma.snapshot.update({
        where: { id: snapshot.id },
        data: { 
          lastRestoredAt: new Date(),
          restoreStatus: 'SUCCESS',
          restoreMessage: `Successfully restored ${realityCount} realities, ${pathCount} paths, and ${fieldCount} fields`
        },
      });
      
      restoreSuccessful = true;
      logger.info({
        realities: realityCount,
        paths: pathCount,
        fields: fieldCount
      }, 'Database restoration completed successfully');
      
      return { 
        success: true, 
        snapshot: {
          name: snapshotName,
          id: snapshot.id,
          restoredAt: new Date().toISOString(),
          counts: { realityCount, pathCount, fieldCount }
        },
        preRestoreBackup: preRestoreBackup ? { 
          name: preRestoreBackup.snapshotName,
          id: preRestoreBackup.id 
        } : null
      };
      
    } catch (error) {
      const errorMessage = `Failed to restore from snapshot ${snapshotName}: ${error.message}`;
      logger.error({ error, stack: error.stack }, errorMessage);
      
      // Update snapshot with failure status
      try {
        await this.prisma.snapshot.update({
          where: { name: snapshotName },
          data: { 
            lastRestoredAt: new Date(),
            restoreStatus: 'FAILED',
            restoreMessage: errorMessage
          },
        });
      } catch (dbError) {
        logger.error({ error: dbError }, 'Failed to update snapshot restore status');
      }
      
      throw new Error(errorMessage);
      
    } finally {
      // Clean up local file
      try {
        if (fs.existsSync(snapshotPath)) {
          fs.unlinkSync(snapshotPath);
          logger.debug(`Cleaned up temporary snapshot file: ${snapshotPath}`);
        }
      } catch (cleanupError) {
        logger.error({ error: cleanupError }, 'Error cleaning up temporary snapshot file');
      }
      
      // Log final status
      if (restoreSuccessful) {
        logger.info(`✅ Successfully completed restoration from ${snapshotName}`);
      } else {
        logger.error(`❌ Restoration from ${snapshotName} failed`);
      }
    }
  }

  /**
   * Check if database is empty
   */
  async isDatabaseEmpty() {
    try {
      const count = await this.prisma.reality.count();
      return count === 0;
    } catch (error) {
      // If the table doesn't exist, consider it empty
      if (error.code === 'P2021') {
        return true;
      }
      throw error;
    }
  }

  /**
   * Bootstrap database from latest snapshot if empty
   */
  async bootstrapDatabase() {
    try {
      // Check if database is empty by querying a few key tables
      const [realityCount, pathCount, fieldCount] = await Promise.all([
        this.prisma.reality.count(),
        this.prisma.recursionPath.count(),
        this.prisma.consciousnessField.count()
      ]);
      
      const isEmpty = realityCount === 0 && pathCount === 0 && fieldCount === 0;
      
      if (!isEmpty) {
        logger.info({ realityCount, pathCount, fieldCount }, 'Database is not empty, skipping bootstrap');
        return { bootstrapped: false };
      }
      
      logger.info('Database appears empty, attempting to bootstrap from latest snapshot');
      
      // Get latest successful snapshot
      const latestSnapshot = await this.prisma.snapshot.findFirst({
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
      });
      
      if (!latestSnapshot) {
        logger.info('No snapshots available for bootstrap');
        return { bootstrapped: false };
      }
      
      // Verify the snapshot exists in S3
      try {
        const headParams = {
          Bucket: this.s3Bucket,
          Key: latestSnapshot.s3Key,
        };
        
        await this.s3Client.send(new HeadObjectCommand(headParams));
      } catch (error) {
        if (error.name === 'NotFound') {
          logger.warn({ snapshot: latestSnapshot.name }, 'Snapshot not found in S3, skipping bootstrap');
          return { bootstrapped: false, error: 'Snapshot not found in S3' };
        }
        throw error;
      }
      
      // Restore from snapshot
      logger.info({ snapshot: latestSnapshot.name }, 'Restoring database from snapshot');
      await this.restoreFromSnapshot(latestSnapshot.name);
      
      // Verify restoration
      const [newRealityCount, newPathCount, newFieldCount] = await Promise.all([
        this.prisma.reality.count(),
        this.prisma.recursionPath.count(),
        this.prisma.consciousnessField.count()
      ]);
      
      if (newRealityCount > 0 || newPathCount > 0 || newFieldCount > 0) {
        logger.info(
          { realityCount: newRealityCount, pathCount: newPathCount, fieldCount: newFieldCount },
          'Successfully bootstrapped database from snapshot'
        );
        
        return { 
          bootstrapped: true, 
          snapshot: {
            name: latestSnapshot.name,
            timestamp: latestSnapshot.createdAt,
            checksum: latestSnapshot.checksum,
          },
          counts: {
            realities: newRealityCount,
            paths: newPathCount,
            fields: newFieldCount
          }
        };
      } else {
        logger.error('Database restoration completed but no data was loaded');
        return { 
          bootstrapped: false, 
          error: 'No data loaded during restoration',
          snapshot: latestSnapshot.name
        };
      }
      
    } catch (error) {
      logger.error({ error }, 'Failed to bootstrap database from snapshot');
      return { 
        bootstrapped: false, 
        error: error.message,
        stack: error.stack
      };
    }
  }
}

// Export singleton instance
const snapshotWriter = new SnapshotWriter();
module.exports = snapshotWriter;
