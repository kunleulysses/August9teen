> Status: Complete

# 01 – Enable Jest Suites

**Objective:**  
Unskip, update, and ensure all quantum-related Jest test suites are running with deterministic outcomes.

**Why it matters:**  
High test coverage prevents future regressions, ensures reliability, and provides safety as system complexity grows.

---

## Preconditions

- On latest `develop` or `feat/quantum-audit` branch.
- Jest installed (`npm list jest` or `yarn list jest`).
- All quantum-related test files are present (e.g. `test-quantum-*.cjs`).
- PRNG seeding from Sprint2-03 implemented.
- CI is able to run tests headlessly.

---

## Procedure

### 1. Find and Unskip All Quantum Jest Suites

```sh
# Unskip all quantum test suites by replacing 'describe.skip' with 'describe'
find . -name "test-quantum-*.cjs" -exec sed -i 's/describe\.skip/describe/g' {} \;
```

### 2. Ensure Deterministic Tests

- Open each `test-quantum-*` file.
- Replace any `Math.random()` calls with an injected seeded PRNG as implemented in Sprint2-03.
- Refactor tests to use fixed seeds, e.g.:
  ```js
  const rng = seedrandom('test-seed');
  ```

### 3. Update Test Expectations

- Where expectations depended on random or non-deterministic output, update them to match seeded values.
- For floating point or time-based values, use approximate matchers:
  ```js
  expect(value).toBeCloseTo(0.1234, 4);
  ```

### 4. Add/Update Coverage Thresholds

- Edit `jest.config.cjs` (or equivalent):
  ```js
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
  ```

### 5. Run All Tests

```sh
npm run test -- --coverage
# or
yarn test --coverage
```

### 6. Check for Failures

- Investigate any failures.
- If a test is flaky, debug and apply deterministic seed logic.
- Fix or temporarily skip only with a ticket and TODO.

---

## Verification

- All quantum test suites run and pass locally and on CI.
- Coverage report (e.g. `coverage/lcov-report/index.html`) shows ≥ 80% for quantum code.
- PR passes with all test and coverage checks green.

---

## Rollback / Troubleshooting

- If mass changes break tests, use `git checkout` or `git stash` to revert.
- Run a single suite for isolation:
  ```sh
  npm run test -- tests/test-quantum-consciousness-network-platform.cjs
  ```
- If Jest reports missing files, check for typos in test file globs.

---

## Time Estimate

01:20

---

## Owner / JIRA

- Owner: Quantum QA Lead (update upon assignment)
- JIRA: Q5-5.1