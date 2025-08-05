# 04 – Circuit Breakers

**Objective:**  
Implement circuit-breakers for quantum field count and EventBus backlog.

**Why it matters:**  
Prevents resource exhaustion, improves reliability and self-healing.

---

## Preconditions

- Feature branch
- List of critical subsystems (field integrator, event bus)
- Monitoring in place

---

## Procedure

### 1. Field count limiter

```js
if (activeFields.size > MAX_FIELDS) {
  throw new Error('Quantum circuit breaker tripped: too many fields');
}
```

### 2. EventBus backlog guard

```js
if (eventBus.pending.length > MAX_PENDING) {
  eventBus.pause();
  logger.warn('Circuit breaker: EventBus backlog');
}
```

---

## Verification

- Simulate surge: intentionally exceed limits, ensure breaker activates.
- All tests pass after recovery.
- Prometheus: `quantum_cb_state` metric triggers alert.

---

## Rollback / Troubleshooting

- Lower thresholds if false positives.
- Remove/pause breaker for critical hotfix, re-enable after incident.

---

## Time Estimate

00:50

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-2.4