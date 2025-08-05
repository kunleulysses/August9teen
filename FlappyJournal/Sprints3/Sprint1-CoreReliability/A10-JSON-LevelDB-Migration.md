# A10: JSON-to-LevelDB Migration Script

**Goal:**  
Migrate legacy JSON file sigils to LevelDB buckets with checksum verify.

## Background
- Current JSON files are crash-prone, not scalable.
- LevelDB adapter planned.

## Tasks
- [ ] Write migration script for JSON to LevelDB.
- [ ] Add checksum/rollback logic.
- [ ] Verify pre/post counts match.

## Acceptance Criteria
- All sigils preserved in LevelDB.
- Rollback possible on error.

## Risks
- Data loss on migration.
- Corrupt records.

## Blockers
- None identified.