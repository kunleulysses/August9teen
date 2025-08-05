# Ticket A1 – LevelDBSigilAdapter

## Goal
Implement a production-grade LevelDB adapter for the Sigil-DNA system, replacing all file-based and in-memory persistence for sigil state.

## Context
Flat JSON files are not crash-safe and do not scale for concurrent writes. LevelDB is a proven, high-performance, embeddable key-value store with transactional guarantees and WAL. This adapter will centralize all persistence for sigil creation, verification, and retrieval.
- Previous persistence: `./consciousness-sigils` (JSON files), in-memory `Map` in `sigil-identity.cjs`
- Target interface: interchangeable with in-memory store and Postgres (see `persistence/PostgresStore.cjs`)
- Reference paths: `FlappyJournal/server/sigil-api.cjs`, `FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs`

## Prerequisites
• Node.js ≥ 18  
• `level` npm package (`npm i level`)  
• Test Postgres DB for migration validation  
• Sufficient disk space for WAL  
• ENV: `SIGIL_DB_PATH=/var/lib/sigil-leveldb`  
• Docker volume provisioned if in container  
• No other process using DB path

## Step-by-Step
1. **Install LevelDB dependency**
   ```sh
   npm install level
   ```

2. **Create Adapter File**  
   Create `FlappyJournal/server/consciousness/persistence/LevelDBSigilAdapter.cjs`:
   ```patch
   const level = require('level');
   class LevelDBSigilAdapter {
     constructor(dbPath = process.env.SIGIL_DB_PATH || './sigil-leveldb') {
       this.db = level(dbPath, { valueEncoding: 'json' });
     }
     async setSigilRecord(symbol, authHash, record) {
       const key = `sigil:${symbol}:${authHash}`;
       await this.db.put(key, record);
     }
     async getSigilRecord(symbol, authHash) {
       try {
         const key = `sigil:${symbol}:${authHash}`;
         return await this.db.get(key);
       } catch (e) { if (e.notFound) return undefined; throw e; }
     }
     async allSigilRecords() {
       const records = [];
       for await (const [key, value] of this.db.iterator({ gte: 'sigil:', lte: 'sigil;'})) {
         records.push(value);
       }
       return records;
     }
     async close() { await this.db.close(); }
   }
   module.exports = { LevelDBSigilAdapter };
   ```

3. **Integrate with Sigil Engine**  
   - In `sigil-based-code-authenticator.cjs` and `sigil-identity.cjs`, replace all Map-based and file-based persistence with the new adapter.
   - Dependency-inject the storage backend via constructor.

4. **Add Migration Script**  
   - Script: `FlappyJournal/scripts/migrate-json-to-leveldb.cjs`
   - Load all JSON files, write to LevelDB with same keys.
   - Validate record count matches.

5. **Update Dockerfile**  
   - Add volume for LevelDB path.
   - Ensure proper permissions.

6. **Metrics and WAL**  
   - Ensure LevelDB is opened with WAL enabled (`options`).
   - Expose Prometheus gauge for open file handles.

7. **Unit Tests**  
   - `__tests__/sigil/leveldb-adapter.spec.ts` with CRUD, error, and concurrency tests.

## Verification
- Run migration script, check no errors, counts match.
- Unit test: create, update, get, delete sigil, all pass.
- Integration: mint via REST, verify via code-authenticator, round-trip works.
- Soak test: 10k sigil writes in 60s, no data loss/crash.
- Inspect LevelDB file size grows as expected.
- `curl` GET /sigils returns expected records after restart.

## Rollback
- Restore JSON files from pre-migration backup.
- Switch SIGIL_DB_PATH to backup path.
- Git: `git revert` LevelDB integration commits.

## Acceptance Criteria
- LevelDB adapter passes all CRUD, error, and concurrency tests.
- All sigil persistence flows use LevelDB, not JSON or Map.
- Migration script migrates all records losslessly.
- WAL and compaction work; no file corruption after crash.
- Prometheus gauge for open handles is present.

## References
- [LevelDB Node.js docs](https://github.com/Level/level)
- [PostgresStore.cjs](../persistence/PostgresStore.cjs)
- [RFC: Durable Sigil Persistence](https://example.com/rfc-sigil-durability)
- [SIGIL_DB_PATH docs](https://example.com/sigil-env-docs)