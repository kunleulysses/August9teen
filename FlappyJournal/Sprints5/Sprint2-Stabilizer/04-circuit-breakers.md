> Status: Complete

# 04 – Circuit Breakers

**Objective:**  
Implement robust circuit breaker logic for field creation and event backlog to prevent resource exhaustion and ensure 
quantum subsystems auto-heal under load.

**Why it matters:**  
Circuit breakers are critical to prevent cascading failures. They improve reliability and ensure that if a 
quantum field or event bus subsystem is overloaded, the system will degrade gracefully and recover cleanly.

---

## Preconditions

- On feature branch.
- `activeQuantumFields` and `eventBus` (or equivalent) are available for patching.
- Monitoring/metrics system is ready to record CB state.

---

## Procedure

### 1. Create a CircuitBreaker Class

**File:** `server/consciousness/utils/CircuitBreaker.ts`

```ts
// CircuitBreaker.ts
export enum CBState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export class CircuitBreaker {
  private state: CBState = CBState.CLOSED;
  private lastOpened = 0;
  constructor(private max: number, private resetMs: number) {}

  check(current: number): boolean {
    if (this.state === CBState.OPEN) {
      if (Date.now() - this.lastOpened > this.resetMs) {
        this.state = CBState.HALF_OPEN;
        return true; // allow one probe
      }
      return false;
    }
    if (current > this.max) {
      this.state = CBState.OPEN;
      this.lastOpened = Date.now();
      return false;
    }
    return true;
  }

  success() {
    if (this.state === CBState.HALF_OPEN) this.state = CBState.CLOSED;
  }

  getState(): CBState {
    return this.state;
  }
}
```

### 2. Protect Quantum Field Creation

**File:** `server/consciousness/quantum-consciousness-field-integrator.cjs`

```js
const { CircuitBreaker } = require('./utils/CircuitBreaker.ts');
const fieldCB = new CircuitBreaker(500, 30000); // max 500 fields, 30s reset

function createQuantumField(id, data) {
  if (!fieldCB.check(activeQuantumFields.size)) {
    logger.error('Quantum field circuit breaker triggered');
    throw new Error('Quantum field circuit breaker OPEN');
  }
  // ... create field ...
  fieldCB.success();
}
```

### 3. Guard EventBus Backlog

```js
const eventBusCB = new CircuitBreaker(10000, 10000); // max 10k pending, 10s reset

eventBus.on('enqueue', () => {
  if (!eventBusCB.check(eventBus.pending.length)) {
    logger.warn('EventBus CB: pausing event intake');
    eventBus.pause();
    setTimeout(() => eventBus.resume(), eventBusCB.resetMs);
  }
});
```

### 4. Expose CB State to Metrics

```js
const promClient = require('prom-client');
const cbStateGauge = new promClient.Gauge({
  name: 'quantum_cb_state',
  help: 'Quantum circuit breaker state (0=closed, 1=open, 2=half-open)'
});

setInterval(() => {
  cbStateGauge.set(
    fieldCB.getState() === 'OPEN' ? 1 : fieldCB.getState() === 'HALF_OPEN' ? 2 : 0
  );
}, 5000);
```

---

## Verification

- Exceed field or event limits: system blocks requests, logs CB state, Prometheus shows nonzero state.
- After reset, system allows new requests (HALF_OPEN → CLOSED).
- Run soak/integration test: system never OOMs, recovers after overrun.

---

## Rollback / Troubleshooting

- Lower thresholds if circuit trips too aggressively.
- Log state transitions for debugging.
- For emergency, comment out CB logic and file a bug for follow-up.

---

## Time Estimate

00:50

---

## Owner / JIRA

- Owner: Reliability Eng
- JIRA: Q5-2.4