# 02 – Memory Eviction (TTL + WeakRef)

**Objective:**  
Add time-to-live (TTL) and WeakRef eviction for long-lived objects (e.g. `activeQuantumFields`).

**Why it matters:**  
Prevents memory leaks, enables GC, and keeps long-running services stable.

---

## Preconditions

- Feature branch
- Node.js ≥ 18 (WeakRef support)
- Test harness for field creation

---

## Procedure

### 1. Wrap objects in WeakRef

```js
const refs = new Map();
refs.set(id, new WeakRef(obj));
```

### 2. TTL eviction

```js
setTimeout(() => refs.delete(id), TTL_MS);
```

### 3. Periodic cleanup

```js
setInterval(() => {
  for (const [id, ref] of refs) {
    if (!ref.deref()) refs.delete(id);
  }
}, 60000);
```

---

## Verification

- Monitor memory with `process.memoryUsage()`
- Heap does not grow unbounded after 1 hour soak test.
- Jest regression tests pass.

---

## Rollback / Troubleshooting

- If objects disappear prematurely, adjust TTL or WeakRef usage.
- Remove WeakRef and revert to strong refs if issues.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-2.2