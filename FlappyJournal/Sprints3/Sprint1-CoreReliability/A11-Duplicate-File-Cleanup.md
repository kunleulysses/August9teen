# A11: Duplicate File Cleanup & Path Fix

**Goal:**  
Remove stale/duplicate sigil files and fix import/build paths.

## Background
- Multiple sigil implementations in tree.
- Build scripts copy wrong files.

## Tasks
- [ ] Identify and remove backup/test sigil files.
- [ ] Update Dockerfile and scripts for correct paths.
- [ ] Add lint rule for path correctness.

## Acceptance Criteria
- Only one authoritative sigil implementation.
- Build passes with correct files.

## Risks
- Accidental deletion of needed files.
- Missed import updates.

## Blockers
- None identified.