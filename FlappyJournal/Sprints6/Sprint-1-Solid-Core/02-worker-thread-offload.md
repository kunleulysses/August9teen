# Worker-Thread Offload

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
Offload all CPU-intensive math (e.g. golden-ratio, vortex, matrix, harmonics) from the Node.js event loop to a worker pool (Piscina), ensuring OS responsiveness and low-latency.

**Rationale:**  
Current heavy computations block the event loop, causing tick lag, missed heartbeats, and degraded API latency.

---

## 2. Prerequisites & Related Files

- Node.js v18+ (worker_threads stable)
- `piscina` npm package
- Math-heavy functions in:
  - `UniversalConsciousnessProtocol.cjs`
  - `ConsciousnessSingularityEngine.cjs`
  - `TranscendentConsciousnessComputing.cjs`
  - Any `core/math/` helpers

---

## 3. Files to Modify/Create

- **Create:**  
  - `FlappyJournal/server/consciousness/core/workers/consciousnessMath.js`
- **Modify:**  
  - Import Piscina in UCP, CSE, and refactor calls to use workers

---

## 4. Step-by-Step Implementation

1. **Install Piscina:**
   ```sh
   npm install piscina
   ```

2. **Create Worker File:**
   ```js
   // FlappyJournal/server/consciousness/core/workers/consciousnessMath.js
   module.exports = {
     computeGoldenRatioAlignment: ({ baseFreq, phi }) => {
       const goldenFreq = baseFreq * phi;
       const alignment = Math.sin(goldenFreq / 1000 * Math.PI) * 0.5 + 0.5;
       return { goldenFrequency: goldenFreq, alignment };
     },
     // ...add more offloadable math here
   }
   ```

3. **Initialize Piscina Pool:**
   ```js
   // In UCP/CSE
   const Piscina = require('piscina');
   const path = require('path');
   const mathPool = new Piscina({ filename: path.resolve(__dirname, './workers/consciousnessMath.js') });
   ```

4. **Offload Calls:**
   ```js
   // Replace direct calls to computeGoldenRatioAlignment with:
   const result = await mathPool.run({ baseFreq, phi }, { name: 'computeGoldenRatioAlignment' });
   ```

5. **Test with Benchmark:**
   ```sh
   node --trace-worker <your app.js>
   ```

---

## 5. Validation & Unit Testing

1. **Test:**
   ```sh
   npx jest FlappyJournal/server/consciousness/core/workers/consciousnessMath.test.js
   ```
2. **Sample Test:**
   ```js
   const Piscina = require('piscina');
   const path = require('path');
   const pool = new Piscina({ filename: path.resolve(__dirname, './consciousnessMath.js') });
   test('Golden ratio math offload', async () => {
     const out = await pool.run({ baseFreq: 432, phi: 1.618 }, { name: 'computeGoldenRatioAlignment' });
     expect(out.goldenFrequency).toBeCloseTo(699.0, 1);
   });
   ```

3. **Expected Output:**
   ```
   PASS  .../consciousnessMath.test.js
   ✓ Golden ratio math offload (20 ms)
   ```

---

## 6. Metrics/SLI Checkpoints

- p95 main event loop delay < 10 ms under load
- Worker utilization visible in `/metrics`

---

## 7. Effort Estimate & Role

- **Estimated Time:** 5–6 hours  
- **Responsible:** Senior Backend Engineer

---

## 8. Risks & Rollback

- **Risk:**  
  - Worker pool starvation if pool size too small; event-loop starvation if fallback fails.
- **Rollback:**  
  - Revert modules to local, synchronous math. Remove Piscina import.

---

## 9. Done-Definition Checklist

- [ ] Worker file created and tested
- [ ] All heavy math refactored to offload
- [ ] Benchmarks show <10 ms event loop delay
- [ ] Code reviewed and merged