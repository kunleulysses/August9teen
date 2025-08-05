# 01 – Structured Logging (Pino + OTEL)

**Objective:**  
Replace `console.log` with structured logger and OpenTelemetry export.

**Why it matters:**  
Enables parsing, tracing, and alerting in production.

---

## Preconditions

- Install `pino`, `@opentelemetry/api`, `@opentelemetry/sdk-node`
- Access to main entrypoint

---

## Procedure

### 1. Replace console.log

```js
const pino = require('pino');
const logger = pino();

logger.info({ msg: 'Quantum event', event, value });
```

### 2. Add OTEL instrumentation

```js
const { NodeSDK } = require('@opentelemetry/sdk-node');
const sdk = new NodeSDK();
sdk.start();
```

### 3. Export logs to OTEL

Configure exporter in code or `otel-config.yml`.

---

## Verification

- Logs are JSON (not plain text).
- OTEL traces/metrics visible in backend (Tempo, Jaeger, etc).
- All tests pass.

---

## Rollback / Troubleshooting

- Fallback to `console.log` for debugging if logger breaks boot.
- Use Pino pretty-print in dev: `pino-pretty`.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-4.1