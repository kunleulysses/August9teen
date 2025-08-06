# Circuit-Breaker & Retry

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
Wrap every external I/O (DB, adapters, LLM, Redis, FS) with a circuit-breaker and retry layer to ensure graceful recovery from transient failures and avoid cascading outages.

**Rationale:**  
The platform currently fails hard on any adapter error, risking system-wide downtime.

---

## 2. Prerequisites & Related Files

- Node.js v18+
- `FlappyJournal/server/utils/circuitBreaker.cjs`
- `p-retry` npm package
- All modules with calls to external services

---

## 3. Files to Modify/Create

- **Modify:**  
  - All external I/O calls in UCP, CSE, ECSM, adapters
  - Add `withBreaker(fn, name)` wrapper function where needed

---

## 4. Step-by-Step Implementation

1. **Install p-retry:**
   ```sh
   npm install p-retry
   ```

2. **Create Wrapper:**
   ```js
   // FlappyJournal/server/consciousness/core/utils/withBreaker.js
   const breaker = require('../../../../utils/circuitBreaker.cjs');
   const pRetry = require('p-retry');
   module.exports = async function withBreaker(fn, name) {
     return breaker(name, () => pRetry(fn, { retries: 5 }));
   };
   ```

3. **Wrap All External Calls:**
   - Example:
     ```js
     const withBreaker = require('./utils/withBreaker');
     const result = await withBreaker(() => redis.get(key), 'redis_get');
     ```
   - Repeat for all DB, LLM, FS interactions.

4. **Expose CB Metrics:**
   - Export circuit-breaker state to Prometheus via `/metrics`.

---

## 5. Validation & Unit Testing

1. **Test:**
   ```sh
   npx jest FlappyJournal/server/consciousness/core/utils/withBreaker.test.js
   ```
2. **Sample Test:**
   ```js
   const withBreaker = require('./withBreaker');
   test('Retries and breaks on failure', async () => {
     let count = 0;
     await expect(withBreaker(() => { count++; throw new Error('fail'); }, 'fail_test')).rejects.toThrow();
     expect(count).toBe(6); // 1 + 5 retries
   });
   ```

3. **Expected Output:**
   ```
   PASS  .../withBreaker.test.js
   ✓ Retries and breaks on failure (20 ms)
   ```

---

## 6. Metrics/SLI Checkpoints

- Circuit-breaker states visible in `/metrics`
- All retries capped at 5

---

## 7. Effort Estimate & Role

- **Estimated Time:** 3 hours  
- **Responsible:** Backend Engineer

---

## 8. Risks & Rollback

- **Risk:**  
  - Over-aggressive breaker configs can cause accidental outages.
- **Rollback:**  
  - Remove withBreaker wrappers; restore direct calls.

---

## 9. Done-Definition Checklist

- [ ] All external calls breaker-wrapped
- [ ] Test failures trigger retry and open breaker
- [ ] Breaker state exported to metrics
- [ ] Peer review complete