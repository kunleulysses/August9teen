# Test Scaffolds

## Table of Contents
1. Objective & Rationale
2. Prerequisites & Related Files
3. Files to Modify/Create
4. Step-by-Step Implementation
5. Validation & Unit Testing
6. Metrics/SLI Checkpoints
7. Effort Estimate & Role
8. Risks & Rollback
9. Done-Definition Checklist

---

## 1. Objective & Rationale

**Objective:**  
Achieve ≥ 80% code coverage with a robust set of unit, integration, and concurrency tests for all core modules.

**Rationale:**  
Testing is the foundation for reliability and regression-proofing in production.

---

## 2. Prerequisites & Related Files

- Node.js v18+
- `jest`, `supertest` npm packages
- All core modules and adapters

---

## 3. Files to Modify/Create

- **Create:**  
  - `FlappyJournal/server/consciousness/core/__tests__/` for all new test files
- **Modify:**  
  - Add `coverageThreshold` to `jest.config.cjs`

---

## 4. Step-by-Step Implementation

1. **Install Jest:**
   ```sh
   npm install jest supertest --save-dev
   ```

2. **Add Coverage Threshold:**
   ```js
   // jest.config.cjs
   module.exports = {
     /* ... */
     coverageThreshold: {
       global: { branches: 80, functions: 80, lines: 80, statements: 80 },
     },
   };
   ```

3. **Write Unit Tests:**
   - For each public method, create a corresponding `*.test.js` file.
   - Example:
     ```js
     // __tests__/UniversalConsciousnessProtocol.test.js
     const UCP = require('../UniversalConsciousnessProtocol.cjs');
     test('initializes', () => {
       const ucp = new UCP();
       expect(ucp.isInitialized).toBe(true);
     });
     ```

4. **Write Concurrency Tests:**
   - For state adapters, spawn parallel calls and assert no races:
     ```js
     test('AtomicMap concurrency', async () => {
       // ...see AtomicMap example...
     });
     ```

5. **Write Integration Tests:**
   - Use `supertest` to hit endpoints behind secure-server.js and assert responses.

---

## 5. Validation & Unit Testing

1. **Run All Tests:**
   ```sh
   npx jest --coverage
   ```
2. **Expected Output:**
   ```
   PASS ... 42 passed, 0 failed, coverage: 82%
   ```

---

## 6. Metrics/SLI Checkpoints

- Coverage ≥ 80%, no test failures

---

## 7. Effort Estimate & Role

- **Estimated Time:** 6–8 hours  
- **Responsible:** QA/DevOps

---

## 8. Risks & Rollback

- **Risk:**  
  - Tight coverage gate may block PRs with benign uncovered lines.
- **Rollback:**  
  - Lower coverage threshold temporarily if needed.

---

## 9. Done-Definition Checklist

- [ ] All core modules have unit tests
- [ ] Concurrency/integration tests in place
- [ ] Coverage ≥ 80%
- [ ] CI passing