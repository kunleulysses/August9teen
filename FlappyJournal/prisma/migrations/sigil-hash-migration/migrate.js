const { PrismaClient } = require('@prisma/client');
const { createHash } = require('crypto');
const { logger } = require('../../server/consciousness/utils/logger.cjs');

class SigilHashMigration {
  constructor() {
    this.prisma = new PrismaClient();
    this.batchSize = parseInt(process.env.BATCH_SIZE) || 5000;
  }

  /**
   * Generate SHA-256 hash of a string
   */
  _generateSha256Hash(input) {
    return createHash('sha256').update(input).digest('hex').slice(0, 32); // Using first 128 bits
  }

  /**
   * Initialize the migration tracking table
   */
  async initializeMigration() {
    try {
      // Check if migration table exists
      const tableExists = await this.prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'sigil_sha_migration'
        );
      `;

      if (!tableExists[0].exists) {
        logger.info('Creating sigil_sha_migration table');
        await this.prisma.$queryRaw`
          CREATE TABLE sigil_sha_migration (
            id SERIAL PRIMARY KEY,
            sigil_id TEXT NOT NULL,
            old_hash TEXT NOT NULL,
            new_hash TEXT NOT NULL,
            migrated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            status TEXT NOT NULL,
            error_message TEXT
          );
        `;
        
        // Add index for faster lookups
        await this.prisma.$queryRaw`
          CREATE INDEX idx_sigil_sha_migration_sigil_id ON sigil_sha_migration(sigil_id);
        `;
        
        logger.info('Created sigil_sha_migration table');
      }

      return true;
    } catch (error) {
      logger.error({ error }, 'Failed to initialize migration');
      throw error;
    }
  }

  /**
   * Get the next batch of sigils to migrate
   */
  async getNextBatch() {
    try {
      // Find sigils that haven't been migrated yet
      const batch = await this.prisma.$queryRaw`
        SELECT s.id, s.sigil_hash as old_hash
        FROM sigil s
        LEFT JOIN sigil_sha_migration m ON s.id = m.sigil_id
        WHERE m.sigil_id IS NULL
        LIMIT ${this.batchSize};
      `;

      return batch;
    } catch (error) {
      logger.error({ error }, 'Failed to get next batch of sigils');
      throw error;
    }
  }

  /**
   * Migrate a batch of sigils
   */
  async migrateBatch(batch) {
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const sigil of batch) {
      try {
        const newHash = this._generateSha256Hash(sigil.old_hash);
        
        // Update the sigil with the new hash
        await this.prisma.$queryRaw`
          UPDATE sigil 
          SET sigil_hash_sha256 = ${newHash}
          WHERE id = ${sigil.id};
        `;
        
        // Record successful migration
        await this.prisma.$queryRaw`
          INSERT INTO sigil_sha_migration (sigil_id, old_hash, new_hash, status)
          VALUES (${sigil.id}, ${sigil.old_hash}, ${newHash}, 'COMPLETED');
        `;
        
        results.success++;
      } catch (error) {
        logger.error({ error, sigilId: sigil.id }, 'Failed to migrate sigil');
        
        // Record failed migration
        await this.prisma.$queryRaw`
          INSERT INTO sigil_sha_migration (sigil_id, old_hash, status, error_message)
          VALUES (${sigil.id}, ${sigil.old_hash}, 'FAILED', ${error.message});
        `;
        
        results.failed++;
        results.errors.push({
          sigilId: sigil.id,
          error: error.message
        });
      }
    }

    return results;
  }

  /**
   * Check if there are more sigils to migrate
   */
  async hasMoreToMigrate() {
    try {
      const result = await this.prisma.$queryRaw`
        SELECT EXISTS (
          SELECT 1
          FROM sigil s
          LEFT JOIN sigil_sha_migration m ON s.id = m.sigil_id
          WHERE m.sigil_id IS NULL
          LIMIT 1
        ) as has_more;
      `;
      
      return result[0].has_more;
    } catch (error) {
      logger.error({ error }, 'Failed to check for more sigils to migrate');
      throw error;
    }
  }

  /**
   * Complete the migration by updating the schema version
   */
  async completeMigration() {
    try {
      // Update Prisma schema version to 2
      await this.prisma.$queryRaw`
        UPDATE _prisma_migrations 
        SET checksum = 'migrated_to_sha256', 
            finished_at = NOW(), 
            migration_name = 'migration_sha256_complete'
        WHERE migration_name = 'migration_sha256';
      `;
      
      // Drop the old hash column
      await this.prisma.$queryRaw`
        ALTER TABLE sigil DROP COLUMN IF EXISTS sigil_hash;
      `;
      
      // Rename the new hash column
      await this.prisma.$queryRaw`
        ALTER TABLE sigil RENAME COLUMN sigil_hash_sha256 TO sigil_hash;
      `;
      
      logger.info('Sigil hash migration completed successfully');
      return true;
    } catch (error) {
      logger.error({ error }, 'Failed to complete migration');
      throw error;
    }
  }

  /**
   * Run the migration
   */
  async run() {
    try {
      logger.info('Starting sigil hash migration');
      
      await this.initializeMigration();
      
      let batchNumber = 1;
      let hasMore = true;
      
      while (hasMore) {
        logger.info(`Processing batch ${batchNumber}`);
        
        const batch = await this.getNextBatch();
        
        if (batch.length === 0) {
          logger.info('No more sigils to migrate');
          break;
        }
        
        const results = await this.migrateBatch(batch);
        
        logger.info({
          batch: batchNumber,
          processed: results.success + results.failed,
          success: results.success,
          failed: results.failed
        }, 'Batch migration results');
        
        if (results.failed > 0) {
          logger.error({ errors: results.errors }, 'Some sigils failed to migrate');
        }
        
        hasMore = await this.hasMoreToMigrate();
        batchNumber++;
      }
      
      // Complete the migration
      await this.completeMigration();
      
      logger.info('Sigil hash migration completed');
      return { success: true };
      
    } catch (error) {
      logger.error({ error }, 'Sigil hash migration failed');
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  const migration = new SigilHashMigration();
  migration.run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = SigilHashMigration;
