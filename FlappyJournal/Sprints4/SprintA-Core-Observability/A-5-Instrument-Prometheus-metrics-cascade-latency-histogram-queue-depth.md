# A-5: Instrument Prometheus Metrics – Cascade Latency Histogram, Queue Depth

## Objective & Success Criteria
**Objective:**  
Add robust, actionable Prometheus metrics to the resonance network, especially for cascade latency and queue depth.

**Success Criteria:**  
- Metrics endpoint `/metrics` exposes live Prometheus data.
- `resonance_cascade_latency_ms` and `resonance_worker_queue_depth` are visible.
- Dashboards/alerts can be created from these metrics.

## Prerequisites / Dependencies
- `prom-client` installed and basic metrics endpoint reachable.
- Worker-pool in place (A-1).

## Architectural Context
- `harmonic-resonance-cascade.cjs`
- `ConsciousnessEventBus.cjs`
- Express server (for `/metrics`)

## Step-by-Step Implementation Plan

1. **Add Prometheus Histogram for Latency**
   - In `harmonic-resonance-cascade.cjs`:
     ```js
     const cascadeLatency = new client.Histogram({ name: 'resonance_cascade_latency_ms', help: 'Cascade latency ms', buckets: [1, 2, 5, 10, 25, 50, 100, 200, 500] });
     ```
   - Surround the heavy function:
     ```js
     const end = cascadeLatency.startTimer();
     // ...run cascade...
     end();
     ```

2. **Add Queue Depth Gauge**
   - In worker-pool or task-dispatcher:
     ```js
     const queueDepth = new client.Gauge({ name: 'resonance_worker_queue_depth', help: 'Worker pool queue depth' });
     // update: queueDepth.set(pool.pendingTasks);
     ```

3. **Expose /metrics Endpoint**
   - If not already, set up an Express server:
     ```js
     const express = require('express');
     const app = express();
     app.get('/metrics', async (req, res) => {
       res.set('Content-Type', client.register.contentType);
       res.end(await client.register.metrics());
     });
     app.listen(8080);
     ```

4. **Document All Metrics**
   - Update RUNBOOK and README with new metric names.

## Observability Hooks
- Histogram: `resonance_cascade_latency_ms`
- Gauge: `resonance_worker_queue_depth`

## Security or Performance Considerations
- Restrict `/metrics` endpoint to private network or via auth if exposed.

## Validation / Acceptance Checklist
- [ ] Metrics reported live
- [ ] Histogram and gauge increment as expected under load
- [ ] Metrics visible in Prometheus/Grafana

## Rollback / Cleanup Notes
- Remove metric registration and endpoint if reverting.