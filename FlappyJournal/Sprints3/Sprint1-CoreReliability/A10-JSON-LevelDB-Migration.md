# Ticket A10 – JSONtoLevelDB-Migration

## Goal
Migrate all legacy JSON file-based sigil data to LevelDB buckets with full checksum verification, report, and a robust rollback safety net.

## Context

The original Sigil-DNA implementation persisted each minted sigil as a separate JSON file in the `consciousness-sigils/` directory (see [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)). This approach is crash-prone, unscalable, and does not provide atomicity or durability guarantees. Moving to LevelDB (see [`FlappyJournal/server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs)) is necessary for production-grade durability and performance.

A migration script is required to:
- Read all JSON files from the legacy storage directory.
- Write each record to the new LevelDB adapter, using a deterministic key schema.
- Compute and validate checksums to ensure no data loss or corruption.
- Optionally, support dry-run and rollback modes for safe migration.
- Provide a detailed migration report (counts, failures, timing).
- Be idempotent and safe to re-run if interrupted.

Key files:
- [`server/sigil-api.cjs`](../../server/sigil-api.cjs)
- [`server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs)
- JSON files in `consciousness-sigils/`

## Prerequisites

- Node.js v18.x or higher
- `level` npm package
- Access to both legacy JSON directory and LevelDB
- Backup of `consciousness-sigils/` directory
- Sufficient disk space for LevelDB
- ENV: `SIGIL_DB_PATH`, `SIGIL_JSON_PATH`
- Ability to stop the service during migration to prevent race conditions

## Step-by-Step Implementation

### 1. Backup the Legacy JSON Store

1. Stop all services that write to `consciousness-sigils/`.
2. Create a tarball backup:
   ```
   tar czvf sigil-json-backup-$(date +%Y%m%d).tgz consciousness-sigils/
   ```

### 2. Author Migration Script

1. Create `scripts/migrate-json-to-leveldb.cjs`:
   ```js
   const fs = require('fs');
   const path = require('path');
   const crypto = require('crypto');
   const { LevelDBSigilAdapter } = require('../server/consciousness/persistence/LevelDBSigilAdapter.cjs');

   const srcDir = process.env.SIGIL_JSON_PATH || './consciousness-sigils';
   const adapter = new LevelDBSigilAdapter(process.env.SIGIL_DB_PATH || './sigil-leveldb');
   const report = { migrated: 0, skipped: 0, failed: 0, checksums: [], failures: [] };

   async function migrate() {
     const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.json'));
     for (const file of files) {
       const filePath = path.join(srcDir, file);
       try {
         const raw = fs.readFileSync(filePath, 'utf-8');
         const record = JSON.parse(raw);
         const checksum = crypto.createHash('sha256').update(raw).digest('hex');
         await adapter.setSigilRecord(record.id, record.timestamp, record);
         report.migrated++;
         report.checksums.push({ file, checksum });
       } catch (e) {
         report.failed++;
         report.failures.push({ file, error: e.message });
       }
     }
     fs.writeFileSync('migrate-report.json', JSON.stringify(report, null, 2));
     console.log(`Migrated ${report.migrated} records, ${report.failed} failed.`);
   }
   migrate();
   ```

### 3. Add Dry-Run and Rollback Support

1. Add a `--dry-run` flag that only reads and validates files, does not write to LevelDB.
2. On failure, use the backup to restore:
   ```
   rm -rf consciousness-sigils/
   tar xzvf sigil-json-backup-YYYYMMDD.tgz
   ```

### 4. Verify Integrity after Migration

1. Count records in LevelDB:
   ```js
   const all = await adapter.allSigilRecords();
   console.log('LevelDB record count:', all.length);
   ```
2. Compare checksums of migrated records to legacy files.

### 5. Update Documentation

- Document migration process, caveats, and recovery in the README and runbooks.

---

## Verification

### Automated

- Run migration script in dry-run mode, confirm all files parse with no errors.
- Run actual migration, confirm reported migrated = number of .json files.
- Verify a sample of checksums match between legacy and LevelDB.

### Manual/Integration

- Start service with LevelDB backend, query for sigils, ensure all expected records exist.
- Compare output of:
  ```
  ls consciousness-sigils/*.json | wc -l
  ```
  with
  ```
  node -e "require('./server/consciousness/persistence/LevelDBSigilAdapter.cjs').allSigilRecords().then(r=>console.log(r.length))"
  ```

- Restore from backup and rerun if any errors occur.

---

## Rollback

- Stop service, clear LevelDB directory:
  ```
  rm -rf ./sigil-leveldb/*
  ```
- Restore JSON files from backup tarball:
  ```
  tar xzvf sigil-json-backup-YYYYMMDD.tgz
  ```
- Point service back to legacy mode or rerun migration after fix.

---

## Acceptance Criteria

- All legacy JSON records migrated to LevelDB with no data loss.
- Checksums match for all migrated records.
- Migration script produces a detailed report.
- Dry-run, real-run, and rollback all work as documented.
- Service can be started with only LevelDB as backend.

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: _______________________

---

## References / Further Reading

- [node-level package](https://www.npmjs.com/package/level)
- [Migration patterns](https://martinfowler.com/bliki/DatabaseMigration.html)
- [Node.js fs docs](https://nodejs.org/api/fs.html)
- [Runbook: Data migration](https://runbooks.example.com/sigil-dna-migration)
- [JSON checksum validation](https://www.npmjs.com/package/checksum)