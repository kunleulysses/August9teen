# A15: StorageDriver Abstraction

**Goal:**  
Abstract storage layer for pluggable LevelDB/Postgres drivers.

## Background
- Multiple persistence layers, code drift.
- No interface unification.

## Tasks
- [ ] Define StorageDriver interface.
- [ ] Implement LevelDB and Postgres adapters.
- [ ] Add tests for each.

## Acceptance Criteria
- Engine runs with either backend.
- Passes all integration tests.

## Risks
- Interface drift.
- Missed adapter bugs.

## Blockers
- None identified.