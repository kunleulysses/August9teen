const fs = require('fs').promises;
const path = require('path');
const { LevelDBSigilAdapter } = require('../server/consciousness/persistence/LevelDBSigilAdapter.cjs');

const JSON_SIGIL_DIR = path.join(__dirname, '..', 'consciousness-sigils');
const levelDBAdapter = new LevelDBSigilAdapter();

async function migrate() {
  console.log('Starting migration from JSON files to LevelDB...');
  let jsonFiles = [];
  try {
    jsonFiles = await fs.readdir(JSON_SIGIL_DIR);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('No JSON sigil directory found. Nothing to migrate.');
      return;
    }
    throw error;
  }

  let migratedCount = 0;
  for (const file of jsonFiles) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(JSON_SIGIL_DIR, file);
      try {
        const content = await fs.readFile(filePath, 'utf8');
        const record = JSON.parse(content);
        if (record.sigil && record.authHash) {
          await levelDBAdapter.setSigilRecord(record.sigil.symbol, record.authHash, record);
          migratedCount++;
        }
      } catch (error) {
        console.error(`Failed to migrate ${file}:`, error);
      }
    }
  }

  console.log(`Migration complete. Migrated ${migratedCount} records.`);

  const allRecords = await levelDBAdapter.allSigilRecords();
  console.log(`Verification: Found ${allRecords.length} records in LevelDB.`);

  if (migratedCount !== allRecords.length) {
    console.error('Error: Mismatch between migrated records and records in LevelDB.');
  } else {
    console.log('Verification successful.');
  }

  await levelDBAdapter.close();
}

migrate().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
});