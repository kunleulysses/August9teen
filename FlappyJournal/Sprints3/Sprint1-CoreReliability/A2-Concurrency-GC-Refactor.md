# A2: Concurrency & GC Refactor

**Goal:**  
Safely handle concurrent writes and refactor garbage collection to avoid memory leaks.

## Background
- Current GC uses setInterval, causes leaks on hot-reload.
- No mutex or locking on write path.

## Tasks
- [ ] Replace setInterval with node-cron.
- [ ] Add async-mutex or single-writer pattern.
- [ ] Expose stop() for graceful shutdown.

## Acceptance Criteria
- No memory leaks after reload.
- No data corruption under concurrent access.

## Risks
- Node process crash during GC.
- Mutex deadlocks.

## Blockers
- None identified.