# Ticket A8 – CI-EnableTests-CoverageGate

## Goal
Ensure all sigil-related tests are enabled in continuous integration (CI), introduce a `--runHeavy` flag to allow long-running/collision tests to be skipped in quick PR builds, and enforce a minimum coverage threshold of 80%.

## Context

The Sigil-DNA codebase includes critical test suites (see [`FlappyJournal/__tests__/sigil/`](../../../__tests__/sigil/), [`FlappyJournal/__tests__/spiral/sigil.spec.ts`](../../../__tests__/spiral/sigil.spec.ts)), but many are currently skipped or excluded from CI via `testPathIgnorePatterns` (see [`jest.config.cjs`](../../../jest.config.cjs)). Heavy tests—especially collision and soak tests—take minutes to run, which slows down PR review cycles and makes contributors less inclined to run the full suite. Meanwhile, disabling these tests entirely risks missing latent bugs and regressions in core cryptographic logic.

To balance speed and rigor, we must:
- Enable all tests by default in the main CI workflow.
- Allow long-running tests (those that run 100k+ iterations) to be run only in nightly or dedicated jobs, using a `--runHeavy` or similar flag.
- Gate all merges on minimum 80% code coverage (statements, branches, functions).
- Ensure coverage is measured on all sigil-related and persistence code, not just SpiralMemory.

Key files:
- [`jest.config.cjs`](../../../jest.config.cjs)
- [`FlappyJournal/__tests__/sigil/collision.spec.ts`](../../../__tests__/sigil/collision.spec.ts)
- `.github/workflows/ci.yml` (or equivalent GitHub Actions/CI provider config)
- All testable sigil files under `FlappyJournal/server/`

## Prerequisites

- Node.js v18.x or higher
- Jest and associated runners (`npm install jest`)
- Working CI environment (GitHub Actions, GitLab CI, etc.)
- Access to update `.github/workflows/ci.yml` or pipeline config
- ENV: `RUN_HEAVY_TESTS` or CLI flag
- Coverage reporting tool (nyc, Jest built-in)
- Sufficient compute resources for nightly jobs

## Step-by-Step Implementation

### 1. Enable All Test Suites

1. In `jest.config.cjs`, remove or review all `testPathIgnorePatterns` and ensure all sigil suites are included:
   ```js
   testPathIgnorePatterns: [
     // Remove entries that exclude __tests__/sigil/
   ]
   ```
2. Ensure all files under `__tests__/sigil/` and `spiral/` are matched by `testMatch`.

### 2. Implement the --runHeavy Flag

1. In heavy test files (e.g., `collision.spec.ts`), wrap heavy blocks in:
   ```js
   if (process.env.RUN_HEAVY_TESTS === '1') {
     it('should not have collisions in 200k sigils', async () => {
       // ...
     });
   }
   ```
2. In package.json, add scripts:
   ```json
   "test": "jest",
   "test:heavy": "RUN_HEAVY_TESTS=1 jest"
   ```
3. Document this flag in the README.

### 3. Update CI Workflow

1. In `.github/workflows/ci.yml`:
   - For PRs/branches:
     ```yaml
     - name: Run core tests
       run: npm run test
     ```
   - For nightly/main:
     ```yaml
     - name: Run heavy tests
       if: github.ref == 'refs/heads/main'
       run: npm run test:heavy
     ```

2. Add a coverage step:
   ```yaml
   - name: Generate coverage report
     run: npm run test -- --coverage
   - name: Enforce coverage threshold
     run: |
       if [ $(node -p "require('./coverage/coverage-summary.json').total.statements.pct") -lt 80 ]; then
         echo "Coverage below threshold"; exit 1; fi
   ```

### 4. Expand Coverage Collection

1. In `jest.config.cjs`, ensure all sigil files are included in `collectCoverageFrom`:
   ```js
   collectCoverageFrom: [
     'FlappyJournal/server/**/*.js',
     '!**/*.test.*',
     '!**/__tests__/**'
   ],
   ```

### 5. Add/Refactor Tests for Edge Cases

1. Write additional unit tests for:
   - Concurrent encodes
   - GC under load
   - Error handling
   - Persistence errors

---

## Verification

### Unit/Integration

- `npm run test` passes in <90s, all core tests green.
- `npm run test:heavy` runs all heavy tests, includes collision tests, no failures.
- Coverage summary:
  ```
  Statements   : 85% (XX/XX)
  Branches     : 81% (XX/XX)
  Functions    : 82% (XX/XX)
  Lines        : 84% (XX/XX)
  ```
- PRs blocked if coverage <80%.

### CI

- GitHub Actions or CI console shows all expected test and coverage jobs.
- Nightly/main builds take longer but always succeed.
- Test logs show skipped heavy tests on PRs, included on nightly.

---

## Rollback

- Restore previous jest config and CI settings:
  ```
  git checkout HEAD~1 -- jest.config.cjs .github/workflows/ci.yml
  ```
- Remove scripts from package.json.
- Remove `RUN_HEAVY_TESTS` guards from tests.

---

## Acceptance Criteria

- All sigil and persistence code covered by tests.
- PR builds always <90s, nightly runs may be longer.
- 80%+ coverage required for merge.
- Heavy tests run at least nightly.
- No regressions or test skips.

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: _______________________

---

## References / Further Reading

- [Jest CLI and docs](https://jestjs.io/docs/cli)
- [Testing best practices](https://github.com/goldbergyoni/nodebestpractices#testing-and-quality)
- [GitHub Actions matrix builds](https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs)
- [nyc coverage tool](https://github.com/istanbuljs/nyc)
- [Jest coverage report](https://jestjs.io/docs/configuration#collectcoveragefrom-array)