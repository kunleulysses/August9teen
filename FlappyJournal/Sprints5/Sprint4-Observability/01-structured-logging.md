> Status: Complete

# 01 – Structured Logging (Pino + OTEL)

**Objective:**  
Replace all `console.log` and ad-hoc logging with structured JSON logs using `pino`, and export logs and traces to 
OpenTelemetry for full-stack observability.

**Why it matters:**  
Structured logs are machine-parseable, enable live alerting, and allow correlation of logs, traces, and metrics 
in modern distributed systems (Grafana, Datadog, etc).

---

## Preconditions

- On a feature branch.
- Install dependencies:
  ```sh
  npm install pino @opentelemetry/api @opentelemetry/sdk-node pino-otel pino-pretty
  ```
- Main entrypoint (e.g., `app.js`, `index.ts`) available for editing.

---

## Procedure

### 1. Replace Console Logging

**File:** e.g., `server/consciousness/quantum-consciousness-field-integrator.cjs`

Replace:
```js
console.log('Quantum field created', field);
```
With:
```js
const pino = require('pino');
const logger = pino();

logger.info({ event: 'quantum_field_created', fieldId: field.id, meta: field });
logger.error({ err }, 'Quantum field creation failed');
```

### 2. Add Pino Transport for OTEL

**File:** `server/logger.ts`
```ts
import pino from 'pino';
import { createWriteStream } from 'node:fs';

const logger = pino(
  pino.transport({
    targets: [
      {
        target: 'pino/file',
        options: { destination: './logs/quantum.log' }
      },
      {
        target: 'pino-otel',
        options: { serviceName: 'quantum-core' }
      }
    ]
  })
);
export default logger;
```

### 3. Wire Up OpenTelemetry Tracing

**File:** `server/otel.ts`
```ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
const sdk = new NodeSDK({
  serviceName: 'quantum-core',
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();
```
Add at top of your entrypoint:
```ts
import './otel';
```

### 4. Use Pino Pretty for Local Dev

Add to package.json:
```json
"scripts": {
  "dev": "NODE_ENV=development node app.js | pino-pretty"
}
```

---

## Verification

- Run app and check `logs/quantum.log` — logs are in JSON, not plain text.
- In your OTEL backend (Jaeger/Tempo/Grafana), search for recent traces and logs.
- Trigger quantum events — confirm they appear with correct metadata.
- Run regression tests, confirm logs are present and parseable.

---

## Rollback / Troubleshooting

- If logger fails, fallback to `console.log` for quick debug; file a ticket for logger bug.
- If OTEL export fails, set only pino file target and try again.
- Use `pino-pretty` for human-readable logs during development.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: Observability Lead
- JIRA: Q5-4.1