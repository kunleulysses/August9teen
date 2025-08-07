const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { LevelDBSigilAdapter } = require('../server/consciousness/persistence/LevelDBSigilAdapter.cjs');

const srcDir = process.env.SIGIL_JSON_PATH || './consciousness-sigils';
const dbPath = process.env.SIGIL_DB_PATH || './sigil-leveldb';
const dryRun = process.argv.includes('--dry-run');

async function migrate() {
  console.log(`Starting migration from ${srcDir} to ${dbPath}`);
  console.log(`Dry run: ${dryRun}`);
  
  const report = {
    migrated: 0,
    skipped: 0,
    failed: 0,
    checksums: [],
    failures: [],
    startTime: new Date().toISOString(),
    endTime: null
  };

  let adapter;
  if (!dryRun) {
    adapter = new LevelDBSigilAdapter(dbPath);
  }

  try {
    if (!fs.existsSync(srcDir)) {
      throw new Error(`Source directory ${srcDir} does not exist`);
    }

    const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
    console.log(`Found ${files.length} JSON files to migrate`);

    for (const file of files) {
      const filePath = path.join(srcDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const record = JSON.parse(raw);
        
        // Validate required fields
        if (!record.id || !record.timestamp) {
          report.failed++;
          report.failures.push({ 
            file, 
            error: 'Missing required fields (id, timestamp)' 
          });
          continue;
        }

        // Calculate checksum
        const checksum = crypto.createHash('sha256').update(raw).digest('hex');
        
        if (!dryRun) {
          // Migrate to LevelDB
          await adapter.setSigilRecord(record.id, record.timestamp, {
            ...record,
            migrationChecksum: checksum,
            migratedAt: new Date().toISOString(),
            sourceFile: file
          });
        }
        
        report.migrated++;
        report.checksums.push({ file, checksum, id: record.id });
        
        if (report.migrated % 100 === 0) {
          console.log(`Migrated ${report.migrated} records...`);
        }
        
      } catch (e) {
        report.failed++;
        report.failures.push({ 
          file, 
          error: e.message,
          stack: e.stack 
        });
        console.error(`Failed to migrate ${file}: ${e.message}`);
      }
    }

    report.endTime = new Date().toISOString();
    
    // Write detailed report
    const reportFile = `migrate-report-${Date.now()}.json`;
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    console.log(`\n=== Migration Complete ===`);
    console.log(`Total files processed: ${files.length}`);
    console.log(`Successfully migrated: ${report.migrated}`);
    console.log(`Failed: ${report.failed}`);
    console.log(`Skipped: ${report.skipped}`);
    console.log(`Report saved to: ${reportFile}`);
    
    if (report.failed > 0) {
      console.error(`\nFAILURES:`);
      report.failures.forEach(f => {
        console.error(`  ${f.file}: ${f.error}`);
      });
      process.exit(1);
    }
    
    // Verify migration if not dry run
    if (!dryRun && adapter) {
      console.log('\nVerifying migration...');
      const allRecords = await adapter.allSigilRecords();
      console.log(`LevelDB contains ${allRecords.length} records`);
      
      if (allRecords.length !== report.migrated) {
        console.error(`Verification failed: Expected ${report.migrated} records, found ${allRecords.length}`);
        process.exit(1);
      }
      
      console.log('Migration verification successful!');
    }
    
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    if (adapter) {
      await adapter.close();
    }
  }
}

// Backup function
async function createBackup() {
  if (!fs.existsSync(srcDir)) {
    console.log('No source directory to backup');
    return;
  }
  
  const backupName = `sigil-json-backup-${new Date().toISOString().split('T')[0]}.tgz`;
  const { execSync } = require('child_process');
  
  try {
    execSync(`tar czvf ${backupName} ${srcDir}`, { stdio: 'inherit' });
    console.log(`Backup created: ${backupName}`);
  } catch (error) {
    console.error('Backup failed:', error.message);
    throw error;
  }
}

// Main execution
async function main() {
  if (process.argv.includes('--backup')) {
    await createBackup();
    return;
  }
  
  if (process.argv.includes('--help')) {
    console.log(`
Usage: node migrate-json-to-leveldb.cjs [options]

Options:
  --dry-run     Validate files without writing to LevelDB
  --backup      Create backup of JSON files
  --help        Show this help

Environment Variables:
  SIGIL_JSON_PATH   Source directory (default: ./consciousness-sigils)
  SIGIL_DB_PATH     Target LevelDB path (default: ./sigil-leveldb)
    `);
    return;
  }
  
  await migrate();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrate, createBackup };