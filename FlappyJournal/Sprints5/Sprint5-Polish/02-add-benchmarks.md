# 02 – Add Benchmarks

**Objective:**  
Measure and optimize key quantum code paths (spiral gen, field ops).

**Why it matters:**  
Quantifies performance, prevents regressions, ensures SLOs.

---

## Preconditions

- Install `benchmark` or `benny`
- Large test data (e.g. 100k node spirals)

---

## Procedure

### 1. Create benchmark scripts

```js
const bench = require('benny');
bench.suite(
  'Spiral Generation',
  bench.add('generateSpiral', () => { generateSpiral(7, { nodes: 100000 }); }),
  bench.cycle(),
  bench.complete()
);
```

### 2. Run and record results

```sh
node benchmarks/spiral-bench.js
```

---

## Verification

- Output: ops/sec, latency stats
- Meets SLO: e.g. p95 < 50 ms for spiral, < 100 ms for field ops

---

## Rollback / Troubleshooting

- If too slow, profile with `clinic.js` or `0x`
- Try smaller batch size for dev

---

## Time Estimate

00:50

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-5.2