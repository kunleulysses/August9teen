# A8: CI Enable Tests & Heavy Flag

**Goal:**  
Run all sigil tests in CI, gating coverage, with option to exclude heavy tests.

## Background
- Many tests currently skipped.
- Heavy collision test slows CI.

## Tasks
- [ ] Enable all test suites.
- [ ] Add --runHeavy flag for long tests.
- [ ] Gate coverage at 80%.

## Acceptance Criteria
- CI completes in <90s for PRs.
- Full suite runs nightly.

## Risks
- Flaky long-running tests.
- Missed regressions.

## Blockers
- None identified.