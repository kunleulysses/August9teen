# 03 – Injectable PRNG Seeding

**Objective:**  
Replace global `Math.random()` with injectable, deterministic PRNG (e.g. `seedrandom`).

**Why it matters:**  
Enables repeatable tests, eliminates flaky outputs, and improves security.

---

## Preconditions

- Install `seedrandom`: `npm install seedrandom`
- All modules using random numbers identified

---

## Procedure

### 1. Refactor random usage

**Before:**
```js
const x = Math.random();
```

**After:**
```js
const seedrandom = require('seedrandom');
const rng = seedrandom('my-seed');
const x = rng();
```

### 2. Inject PRNG into modules

Pass PRNG to functions/classes as dependency.

---

## Verification

- Tests produce same output every run (given same seed).
- `grep Math.random` returns no matches.
- All regression/unit tests pass.

---

## Rollback / Troubleshooting

- If output differs, check for hidden non-determinism.
- Fallback to default Math.random if needed.

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-2.3