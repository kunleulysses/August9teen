# 04 – Trace Context Propagation

**Objective:**  
Propagate trace context across all async boundaries (WS, EventBus, HTTP).

**Why it matters:**  
Allows true end-to-end tracing and debugging.

---

## Preconditions

- OTEL tracing enabled (see previous step)
- All services instrumented

---

## Procedure

### 1. Pass context explicitly

```js
const { context, trace } = require('@opentelemetry/api');
// Example: wrap handler
eventBus.on('event', (payload, parentCtx) => {
  context.with(parentCtx, () => {
    // Handle event with trace context
  });
});
```

### 2. Add traceparent header to WS/HTTP messages

---

## Verification

- End-to-end trace visible in Tempo/Jaeger for a single request.
- No dropped spans across WS → EventBus → storage.

---

## Rollback / Troubleshooting

- If spans missing, check for context loss at async boundaries.
- Use OTEL debug logging.

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-4.4