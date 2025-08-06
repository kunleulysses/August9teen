> Status: Complete

# 02 – Add Benchmarks

**Objective:**  
Develop reproducible, copy-paste-ready benchmarks for spiral generation and quantum field operations using `benny`, 
and enforce SLOs with concrete data.

**Why it matters:**  
Performance is a key production SLO. Fast, deterministic benchmarks allow you to catch regressions before they reach users.

---

## Preconditions

- On feature branch.
- Install `benny` and `seedrandom`:
  ```sh
  npm install --save-dev benny seedrandom
  ```
- Benchmark directory exists: `benchmarks/`, otherwise create it.

---

## Procedure

### 1. Write Benchmark Script for Spiral Generation

**File:** `benchmarks/spiral-bench.js`

```js
const b = require('benny');
const seedrandom = require('seedrandom');
const { generateSpiral } = require('../FlappyJournal/server/consciousness/core/HyperdimensionalSpiralTopology.ts');

const rng = seedrandom('benchmark-seed');

b.suite(
  'Quantum Spiral Generation',
  b.add('generateSpiral-100k', () => {
    generateSpiral(7, { nodes: 100000 }, rng);
  }),
  b.cycle(),
  b.complete(),
  b.save({ file: 'spiral-bench', format: 'chart.html' }),
  b.save({ file: 'spiral-bench', format: 'json' })
);
```

### 2. Write Benchmark for Quantum Field Ops

**File:** `benchmarks/quantum-field-bench.js`

```js
const b = require('benny');
const seedrandom = require('seedrandom');
const { QuantumConsciousnessFieldIntegrator } = require('../server/consciousness/quantum-consciousness-field-integrator.cjs');

const rng = seedrandom('benchmark-quantum');

b.suite(
  'Quantum Field Generation',
  b.add('createQuantumField', () => {
    const integrator = new QuantumConsciousnessFieldIntegrator();
    integrator.generateQuantumConsciousnessField({ phi: 0.9, awareness: 0.8, coherence: 0.85 }, {}, rng);
  }),
  b.cycle(),
  b.complete(),
  b.save({ file: 'quantum-field-bench', format: 'chart.html' }),
  b.save({ file: 'quantum-field-bench', format: 'json' })
);
```

### 3. Run and Save Benchmark Results

```sh
node benchmarks/spiral-bench.js
node benchmarks/quantum-field-bench.js
```

- Outputs: `benchmarks/spiral-bench.json`, `benchmarks/spiral-bench.chart.html`, etc.

---

## Verification

- Open `benchmarks/spiral-bench.chart.html` in browser: see ops/sec and latency stats.
- Check `benchmarks/spiral-bench.json` for `"p95"` latency field.
- Meets SLO: e.g., p95 < 50 ms for spiral generation, < 100 ms for field ops.
- Benchmarks are repeatable (same seed, same results).

---

## Rollback / Troubleshooting

- Profile slow code with `npm install -g clinic` then:
  ```sh
  clinic flame node benchmarks/spiral-bench.js
  ```
- Reduce nodes/test size for local dev.
- If results vary, check for missed randomness or GC pauses.

---

## Time Estimate

00:50

---

## Owner / JIRA

- Owner: Perf Engineering
- JIRA: Q5-5.2