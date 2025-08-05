# 01 – Enable Jest Suites

**Objective:**  
Unskip and fix all quantum-related Jest test suites.

**Why it matters:**  
Ensures test coverage, prevents regressions.

---

## Preconditions

- Jest installed and working
- All tests currently skipped (`describe.skip`)

---

## Procedure

### 1. Enable tests

```sh
find .