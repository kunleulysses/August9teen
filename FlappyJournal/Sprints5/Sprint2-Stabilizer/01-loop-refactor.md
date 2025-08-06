# 01 – Refactor Blocking Loops

**Objective:**  
Convert synchronous/blocking loops (e.g. `while(true)`) to async iterators or event loops.

**Why it matters:**  
Prevents event-loop starvation, improves scalability, and keeps Node.js responsive.

---

## Preconditions

- Feature branch (e.g. `feat/quantum-audit`)
- Node.js ≥ 16
- Jest available for regression testing

---

## Procedure

### 1. Identify blocking loops

```sh
grep -r --exclude-dir="FlappyJournal hey" 'while (true' .
```

### 2. Refactor example

**Before:**
```js
while (true) {
  processEvent();
}
```

**After:**
```js
async function eventLoop() {
  while (running) {
    await processEvent();
    await new Promise(res => setImmediate(res));
  }
}
eventLoop();
```

Or for streams:
```js
for await (const event of eventSource) {
  handleEvent(event);
}
```

---

## Verification

- No tight `while(true)` in code.
- All endpoints responsive under load (`ab`, `wrk`, or `k6`).
- All regression/unit tests pass.

---

## Rollback / Troubleshooting

- If event processing stalls, check for missing awaits or unhandled promises.
- Use `git stash` to revert partial loop rewrites.

---

## Time Estimate

01:00

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-2.1