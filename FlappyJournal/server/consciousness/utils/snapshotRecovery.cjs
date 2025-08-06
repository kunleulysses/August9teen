/**
 * Snapshot Recovery and Rollback Utilities
 * Handles error recovery and rollback strategies for failed snapshot operations
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger.cjs');

class SnapshotRecovery {
  constructor() {
    this.prisma = new PrismaClient();
    this.recoveryDir = process.env.RECOVERY_DIR || '/opt/featherweight/FlappyJournal/prisma/recovery';
    
    // Ensure recovery directory exists
    if (!fs.existsSync(this.recoveryDir)) {
      fs.mkdirSync(this.recoveryDir, { recursive: true });
    }
  }

  /**
   * Create a pre-operation backup before risky operations
   */
  async createPreOperationBackup(operationType, metadata = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `pre_${operationType}_${timestamp}`;
    
    try {
      logger.info(`Creating pre-operation backup: ${backupName}`);
      
      // Get database file path
      const dbPath = process.env.DATABASE_URL.replace('file:', '').replace('sqlite:', '');
      const backupPath = path.join(this.recoveryDir, `${backupName}.db`);
      
      // Create backup by copying database file
      await fs.promises.copyFile(dbPath, backupPath);
      
      // Record backup metadata
      const backupMetadata = {
        name: backupName,
        operationType,
        originalDbPath: dbPath,
        backupPath,
        metadata,
        createdAt: new Date().toISOString(),
        size: (await fs.promises.stat(backupPath)).size
      };
      
      const metadataPath = path.join(this.recoveryDir, `${backupName}.json`);
      await fs.promises.writeFile(metadataPath, JSON.stringify(backupMetadata, null, 2));
      
      logger.info(`Pre-operation backup created: ${backupName}`);
      return {
        success: true,
        backupName,
        backupPath,
        metadata: backupMetadata
      };
      
    } catch (error) {
      logger.error(`Failed to create pre-operation backup: ${error.message}`);
      throw new Error(`Pre-operation backup failed: ${error.message}`);
    }
  }

  /**
   * Rollback to a pre-operation backup
   */
  async rollbackToPreOperationBackup(backupName) {
    try {
      logger.info(`Rolling back to pre-operation backup: ${backupName}`);
      
      const metadataPath = path.join(this.recoveryDir, `${backupName}.json`);
      const backupPath = path.join(this.recoveryDir, `${backupName}.db`);
      
      // Verify backup exists
      if (!fs.existsSync(metadataPath) || !fs.existsSync(backupPath)) {
        throw new Error(`Backup not found: ${backupName}`);
      }
      
      // Load backup metadata
      const metadata = JSON.parse(await fs.promises.readFile(metadataPath, 'utf8'));
      
      // Disconnect Prisma client
      await this.prisma.$disconnect();
      
      // Restore database file
      await fs.promises.copyFile(backupPath, metadata.originalDbPath);
      
      // Reconnect Prisma client
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      
      // Verify rollback
      const realityCount = await this.prisma.reality.count();
      
      logger.info(`Rollback completed: ${backupName} (${realityCount} realities restored)`);
      
      return {
        success: true,
        backupName,
        realityCount,
        rolledBackAt: new Date().toISOString()
      };
      
    } catch (error) {
      logger.error(`Rollback failed: ${error.message}`);
      throw new Error(`Rollback failed: ${error.message}`);
    }
  }

  /**
   * Recover from a failed snapshot restore
   */
  async recoverFromFailedRestore(snapshotName, error) {
    try {
      logger.info(`Attempting recovery from failed restore: ${snapshotName}`);
      
      // Find the most recent pre-restore backup
      const backupFiles = fs.readdirSync(this.recoveryDir)
        .filter(file => file.startsWith('pre_restore_') && file.endsWith('.json'))
        .map(file => {
          const metadata = JSON.parse(fs.readFileSync(path.join(this.recoveryDir, file), 'utf8'));
          return metadata;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      if (backupFiles.length === 0) {
        throw new Error('No pre-restore backup found for recovery');
      }
      
      const latestBackup = backupFiles[0];
      logger.info(`Found pre-restore backup: ${latestBackup.name}`);
      
      // Rollback to the pre-restore backup
      const rollbackResult = await this.rollbackToPreOperationBackup(latestBackup.name);
      
      // Update snapshot status to reflect failed restore
      try {
        await this.prisma.snapshot.update({
          where: { name: snapshotName },
          data: {
            restoreStatus: 'FAILED',
            restoreMessage: `Restore failed and rolled back: ${error.message}`,
            lastRestoredAt: new Date()
          }
        });
      } catch (dbError) {
        logger.warn(`Failed to update snapshot status: ${dbError.message}`);
      }
      
      return {
        success: true,
        recoveryMethod: 'rollback_to_backup',
        backupUsed: latestBackup.name,
        rollbackResult
      };
      
    } catch (recoveryError) {
      logger.error(`Recovery failed: ${recoveryError.message}`);
      
      // Last resort: try to reinitialize database with migrations
      return await this.emergencyDatabaseReset();
    }
  }

  /**
   * Emergency database reset as last resort
   */
  async emergencyDatabaseReset() {
    try {
      logger.warn('Attempting emergency database reset...');
      
      // Disconnect Prisma
      await this.prisma.$disconnect();
      
      // Get database path
      const dbPath = process.env.DATABASE_URL.replace('file:', '').replace('sqlite:', '');
      
      // Create emergency backup of current state
      const emergencyBackupPath = path.join(this.recoveryDir, `emergency_backup_${Date.now()}.db`);
      try {
        await fs.promises.copyFile(dbPath, emergencyBackupPath);
        logger.info(`Emergency backup created: ${emergencyBackupPath}`);
      } catch (backupError) {
        logger.warn(`Failed to create emergency backup: ${backupError.message}`);
      }
      
      // Remove corrupted database
      try {
        await fs.promises.unlink(dbPath);
      } catch (unlinkError) {
        logger.warn(`Failed to remove corrupted database: ${unlinkError.message}`);
      }
      
      // Reconnect Prisma (will create new database)
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      
      // Run migrations
      const { execSync } = require('child_process');
      execSync('npx prisma migrate deploy', { 
        cwd: '/opt/featherweight/FlappyJournal',
        stdio: 'pipe'
      });
      
      logger.warn('Emergency database reset completed');
      
      return {
        success: true,
        recoveryMethod: 'emergency_reset',
        emergencyBackup: emergencyBackupPath,
        message: 'Database was reset to empty state with fresh schema'
      };
      
    } catch (error) {
      logger.error(`Emergency database reset failed: ${error.message}`);
      throw new Error(`All recovery methods failed: ${error.message}`);
    }
  }

  /**
   * Validate database integrity after operations
   */
  async validateDatabaseIntegrity() {
    try {
      logger.info('Validating database integrity...');
      
      // Basic integrity checks
      const checks = {
        realityCount: await this.prisma.reality.count(),
        pathCount: await this.prisma.recursionPath.count(),
        fieldCount: await this.prisma.consciousnessField.count(),
        snapshotCount: await this.prisma.snapshot.count()
      };
      
      // Check for orphaned records
      const orphanedPaths = await this.prisma.recursionPath.count({
        where: {
          AND: [
            { parentId: { not: { in: await this.prisma.reality.findMany({ select: { id: true } }).then(r => r.map(x => x.id)) } } },
            { childId: { not: { in: await this.prisma.reality.findMany({ select: { id: true } }).then(r => r.map(x => x.id)) } } }
          ]
        }
      });
      
      const integrity = {
        ...checks,
        orphanedPaths,
        isHealthy: orphanedPaths === 0,
        validatedAt: new Date().toISOString()
      };
      
      if (integrity.isHealthy) {
        logger.info('Database integrity validation passed');
      } else {
        logger.warn(`Database integrity issues found: ${orphanedPaths} orphaned paths`);
      }
      
      return integrity;
      
    } catch (error) {
      logger.error(`Database integrity validation failed: ${error.message}`);
      return {
        isHealthy: false,
        error: error.message,
        validatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Clean up old recovery backups
   */
  async cleanupOldRecoveryBackups(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    try {
      logger.info('Cleaning up old recovery backups...');
      
      const files = fs.readdirSync(this.recoveryDir);
      const now = Date.now();
      let cleanedCount = 0;
      
      for (const file of files) {
        const filePath = path.join(this.recoveryDir, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          cleanedCount++;
          logger.debug(`Cleaned up old recovery backup: ${file}`);
        }
      }
      
      logger.info(`Cleaned up ${cleanedCount} old recovery backups`);
      return { cleanedCount };
      
    } catch (error) {
      logger.error(`Failed to clean up recovery backups: ${error.message}`);
      return { cleanedCount: 0, error: error.message };
    }
  }

  /**
   * Get recovery status and available backups
   */
  async getRecoveryStatus() {
    try {
      const backupFiles = fs.readdirSync(this.recoveryDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          try {
            const metadata = JSON.parse(fs.readFileSync(path.join(this.recoveryDir, file), 'utf8'));
            return metadata;
          } catch (error) {
            return null;
          }
        })
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const integrity = await this.validateDatabaseIntegrity();
      
      return {
        availableBackups: backupFiles.length,
        latestBackup: backupFiles[0] || null,
        databaseIntegrity: integrity,
        recoveryDir: this.recoveryDir
      };
      
    } catch (error) {
      return {
        error: error.message,
        recoveryDir: this.recoveryDir
      };
    }
  }
}

// Export singleton instance
const snapshotRecovery = new SnapshotRecovery();
module.exports = snapshotRecovery;