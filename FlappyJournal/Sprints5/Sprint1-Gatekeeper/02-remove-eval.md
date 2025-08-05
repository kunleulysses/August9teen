# 02 – Remove Dangerous `eval` Patterns

**Objective:**  
Eliminate all uses of `eval`, `new Function`, and similar unsafe patterns from codebase.

**Why it matters:**  
Prevents remote code execution (RCE) and major security vulnerabilities.

---

## Preconditions

- Feature branch (e.g. `feat/quantum-audit`)
- ESLint + Prettier installed locally
- Shell access with `grep`/`find`

---

## Procedure

### 1. Find all eval-like patterns

```sh
grep -r --exclude-dir="FlappyJournal hey" --exclude-dir="node_modules" --color 'eval(' .
grep -r 'new Function' .
```

### 2. Refactor patterns

- Replace with a safe registry or use `JSON.parse`/callback map.
- Example:

```js
// ❌ Bad
const result = eval(codeString);

// ✅ Good
const allowedOps = { sum: (a, b) => a + b };
const result = allowedOps[op]?.(...args);
```

### 3. Add ESLint rule

Add to `.eslintrc.cjs`:

```json
"no-eval": "error"
```

---

## Verification

- Run `eslint .` — no `eval` should be found.
- Grep for `eval`/`new Function` — should return nothing.
- All tests pass.

---

## Rollback / Troubleshooting

- If breaking change: revert commit, then fix tests and refactor incrementally.
- Use `git stash` to save partial edits.

---

## Time Estimate

01:00

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-1.2