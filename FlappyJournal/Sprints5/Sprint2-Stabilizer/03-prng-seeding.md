> Status: Complete

# 03 – Injectable PRNG Seeding

**Objective:**  
Replace all uses of global `Math.random()` with a deterministic, injectable PRNG (using `seedrandom`), and refactor APIs 
to accept the PRNG as a dependency for full test determinism.

**Why it matters:**  
Deterministic seeding is required for reproducible tests and benchmarking, and guards against accidental randomness in 
production logic or tests.

---

## Preconditions

- On feature branch.
- All modules using randomness identified (e.g., quantum field gen, spiral gen).
- `seedrandom` is installed:
  ```sh
  npm install seedrandom --save
  ```
- Test harnesses and CI ready for changes.

---

## Procedure

### 1. Refactor All Random Usages to Use Injected PRNG

- **Before**: (in `FlappyJournal/server/consciousness/core/HyperdimensionalSpiralTopology.ts`)
  ```ts
  const x = Math.random();
  ```

- **After**:  
  Change function signatures to accept a PRNG.
  ```ts
  import seedrandom, { PRNG } from 'seedrandom';
  // Update signature:
  export function generateSpiral(
    dim: number,
    template: { a?: number; b?: number; turns?: number; nodes?: number },
    rng: PRNG = Math.random // default for prod
  ) {
    // ...
    const theta = (2 * Math.PI * turns * i) / nodes;
    // use rng() instead of Math.random()
    const perturb = rng();
  }
  ```

- Pass a seeded PRNG in tests:
  ```ts
  import seedrandom from 'seedrandom';
  const rng = seedrandom('jest-seed-123');
  generateSpiral(3, {}, rng);
  ```

### 2. Replace All `Math.random()` Calls

- In all quantum modules, search and replace:
  ```sh
  grep -rl 'Math.random()' . | grep -v node_modules | xargs sed -i 's/Math\.random()/rng()/g'
  ```

### 3. Update Tests to Use Fixed Seeds

- In test files:
  ```js
  import seedrandom from 'seedrandom';
  const rng = seedrandom('test-seed-42');
  // pass rng to all tested modules/functions
  ```

---

## Verification

- Run all tests multiple times: results must be identical.
- Confirm `grep Math.random` returns no matches in codebase (except in default params).
- Coverage remains ≥ 80%.

---

## Rollback / Troubleshooting

- If regressions, revert signature change and restore original function.
- If output is still non-deterministic, check for hidden uses of `Date.now()` or other env sources.

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: Quantum Core Maintainer
- JIRA: Q5-2.3