# 02 – Prometheus Metrics

**Objective:**  
Expose all quantum system metrics via Prometheus `/metrics` endpoint.

**Why it matters:**  
Allows live monitoring, alerting, and SLO enforcement.

---

## Preconditions

- Install `prom-client`
- Prometheus instance running

---

## Procedure

### 1. Instrument code

```js
const promClient = require('prom-client');
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Custom metric
const quantumEventTotal = new promClient.Counter({
  name: 'quantum_event_total',
  help: 'Quantum events processed'
});
```

### 2. Expose /metrics endpoint

```js
fastify.get('/metrics', async (req, reply) => {
  reply.type('text/plain');
  return promClient.register.metrics();
});
```

---

## Verification

- `curl http://localhost:3000/metrics` returns Prometheus metrics.
- Prometheus target: up, metrics scraped.
- Alerts fire on test conditions.

---

## Rollback / Troubleshooting

- Disable custom metrics; keep only defaults if errors.
- Check perms and firewall if scrape fails.

---

## Time Estimate

00:35

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-4.2