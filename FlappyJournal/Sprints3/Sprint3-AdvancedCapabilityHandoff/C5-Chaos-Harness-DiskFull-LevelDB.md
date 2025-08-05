# C5: Chaos Harness – Disk-Full/LevelDB Lock Tests

**Goal:**  
Ensure robustness against disk full and LevelDB lock errors.

## Background
- No chaos testing for storage edge cases.

## Tasks
- [ ] Simulate disk-full.
- [ ] Simulate LevelDB lock.

## Acceptance Criteria
- System survives disk/lock failures.

## Risks
- Data loss under chaos.

## Blockers
- None identified.