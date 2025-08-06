> Status: Complete

# 02 – Memory Eviction (TTL + WeakRef)

**Objective:**  
Implement automatic TTL and WeakRef eviction for all objects in `activeQuantumFields` to prevent memory leaks and 
enable garbage collection during high-throughput operation.

**Why it matters:**  
Without eviction, the Map holding quantum field objects will grow unbounded, causing heap exhaustion and GC thrashing 
in production. TTL ensures resources are released even if manual cleanup fails, while WeakRef allows GC of unused fields.

---

## Preconditions

- You are on a clean feature branch.
- Node.js version 18 or above (for WeakRef and FinalizationRegistry support).
- The class managing `activeQuantumFields` is available for modification.
- A test harness (unit or soak test) that rapidly adds/removes quantum fields.

---

## Procedure

### 1. Refactor `activeQuantumFields` to Use WeakRef

**File:** `server/consciousness/quantum-consciousness-field-integrator.cjs` (or equivalent)

```js
const activeQuantumFields = new Map(); // Map<string, WeakRef<QuantumField>>
const TTL_MS = 5 * 60 * 1000; // 5 minutes

// Helper to get or create a field with WeakRef
function getOrInitField(id, factory) {
  let ref = activeQuantumFields.get(id);
  let field = ref && ref.deref();
  if (!field) {
    field = factory();
    activeQuantumFields.set(id, new WeakRef(field));
    // Set up TTL-based eviction
    setTimeout(() => activeQuantumFields.delete(id), TTL_MS);
  }
  return field;
}
```

### 2. Add Periodic WeakRef Cleanup

```js
// Clean up keys whose WeakRef targets have been GC'd
setInterval(() => {
  for (const [id, ref] of activeQuantumFields.entries()) {
    if (!ref.deref()) {
      activeQuantumFields.delete(id);
    }
  }
}, 60 * 1000);
```

### 3. (Optional) Register Finalization Callbacks

```js
const registry = new FinalizationRegistry((id) => {
  activeQuantumFields.delete(id);
});
// When creating new field:
registry.register(field, id);
```

---

## Verification

1. Run your soak test:
    - Confirm `process.memoryUsage().heapUsed` stabilizes after 10+ minutes, not continuously increasing.
    - Use Chrome DevTools or `--inspect` to watch heap snapshots.
2. Log the Map size before/after test:
    ```js
    setInterval(() => console.log('Active fields:', activeQuantumFields.size), 30000);
    ```
3. Confirm no "out of memory" or GC warnings in logs.

---

## Rollback / Troubleshooting

- If fields disappear too soon, increase TTL or review references.
- If memory still leaks, use `global.gc()` with `--expose-gc` to help debug.
- For urgent rollback, revert to previous Map logic and open a bug for further review.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: Platform Backend
- JIRA: Q5-2.2