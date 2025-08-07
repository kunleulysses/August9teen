# Chaos Harness

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
Introduce a chaos harness to inject controlled failures (kill threads, inject latency, simulate adapter errors) into core OS modules to validate system resilience and alerting.

**Rationale:**  
Chaos testing is essential to prove the OS is robust against real-world failures and operator mistakes.

---

## 2. Prerequisites & Related Files

- Node.js v18+
- Existing tools/chaos/redisChaos.cjs as reference
- All stateful and workerized core modules

---

## 3. Files to Modify/Create

- **Create:**  
  - `FlappyJournal/tools/chaos/osComponentChaos.cjs`
- **Modify:**  
  - Optionally expose chaos endpoints in dev mode in `secure-server.js`

---

## 4. Step-by-Step Implementation

1. **Scaffold Chaos Script:**
   ```js
   // FlappyJournal/tools/chaos/osComponentChaos.cjs
   const { kill, delay, injectError } = require('./chaosUtils');
   module.exports = async function chaosHarness(target) {
     if (target === 'worker') await kill('worker');
     if (target === 'eventbus') await delay('eventbus', 1000);
     if (target === 'adapter') await injectError('adapter', 'fail-fast');
   };
   ```

2. **Add CLI Entrypoint:**
   ```sh
   node FlappyJournal/tools/chaos/osComponentChaos.cjs worker
   ```

3. **Optionally add dev-only HTTP/WS endpoints to trigger chaos.**

---

## 5. Validation & Unit Testing

1. **Manual:**
   - Run chaos script and observe system logs, alert firings in Grafana.

2. **Automated:**
   ```js
   // tools/chaos/osComponentChaos.test.js
   test('injects error and triggers alert', async () => {
     // simulate error, assert alert log
   });
   ```

---

## 6. Metrics/SLI Checkpoints

- All SLI breaches cause alert firing
- System recovers automatically after chaos event

---

## 7. Effort Estimate & Role

- **Estimated Time:** 3 hours  
- **Responsible:** DevOps Engineer

---

## 8. Risks & Rollback

- **Risk:**  
  - Chaos in prod could cause outage.
- **Rollback:**  
  - Remove chaos script and endpoints.

---

## 9. Done-Definition Checklist

- [ ] Chaos harness script created
- [ ] Manual/auto tests pass
- [ ] Alert rules fire and self-heal