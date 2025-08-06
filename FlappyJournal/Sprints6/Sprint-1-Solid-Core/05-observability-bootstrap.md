# Observability Bootstrap

## Table of Contents
1. Objective & Rationale
2. Prerequisites & Related Files
3. Files to Modify/Create
4. Step-by-Step Implementation
5. Validation & Unit Testing
6. Metrics/SLI Checkpoints
7. Effort Estimate & Role
8. Risks & Rollback
9. Done-Definition Checklist

---

## 1. Objective & Rationale

**Objective:**  
Instrument all core modules with Prometheus metrics (counters, histograms, gauges), structured logging, and ensure metrics are exported for Grafana dashboarding and alerting.

**Rationale:**  
Without metrics and logs, issues are invisible in production and SLOs cannot be enforced.

---

## 2. Prerequisites & Related Files

- Node.js v18+
- `prom-client` npm package
- Existing `/metrics` endpoint in `secure-metrics-server.ts`
- Core modules to instrument: UCP, CSE, ECSM

---

## 3. Files to Modify/Create

- **Create:**  
  - `FlappyJournal/server/consciousness/core/metrics/ucpMetrics.js`
  - `FlappyJournal/server/consciousness/core/metrics/cseMetrics.js`
- **Modify:**  
  - Instrument all major request paths in core modules

---

## 4. Step-by-Step Implementation

1. **Install Prometheus Client:**
   ```sh
   npm install prom-client
   ```

2. **Add Metrics Exporters:**
   ```js
   // FlappyJournal/server/consciousness/core/metrics/ucpMetrics.js
   const client = require('prom-client');
   const reqCounter = new client.Counter({ name: 'ucp_requests_total', help: 'Total UCP requests', labelNames: ['type'] });
   const errCounter = new client.Counter({ name: 'ucp_errors_total', help: 'Total UCP errors', labelNames: ['type'] });
   const latencyHist = new client.Histogram({ name: 'ucp_request_latency_ms', help: 'UCP latency', buckets: [0.05, 0.1, 0.3, 1, 3, 5] });
   module.exports = { reqCounter, errCounter, latencyHist };
   ```

3. **Instrument Code Paths:**
   ```js
   const { reqCounter, errCounter, latencyHist } = require('./metrics/ucpMetrics');
   reqCounter.inc({ type: 'analysis' });
   const end = latencyHist.startTimer();
   try { /* ... */ } catch (e) { errCounter.inc({ type: 'analysis' }); }
   end();
   ```

4. **Expose Metrics:**
   - Ensure `/metrics` endpoint via `secure-metrics-server.ts` collects all registered metrics.

5. **Update Grafana:**
   - Fork `grafana/spiral-dashboard-v3.json` → `grafana/consciousness-dashboard-v4.json`.
   - Add panels for new metrics.

---

## 5. Validation & Unit Testing

1. **Test:**
   ```sh
   curl http://localhost:9465/metrics | grep ucp_requests_total
   ```
2. **Expected Output:**
   ```
   # HELP ucp_requests_total Total UCP requests
   ucp_requests_total{type="analysis"} 12
   ```

3. **Integration Test:**
   - Trigger requests and observe metric increments in Grafana.

---

## 6. Metrics/SLI Checkpoints

- All new metrics visible in Prometheus
- Dashboard v4 panels green

---

## 7. Effort Estimate & Role

- **Estimated Time:** 3 hours  
- **Responsible:** DevOps Engineer

---

## 8. Risks & Rollback

- **Risk:**  
  - Metrics registration errors can break /metrics endpoint.
- **Rollback:**  
  - Remove new collectors; revert to previous metrics server.

---

## 9. Done-Definition Checklist

- [ ] Metrics exporters added and working
- [ ] All core modules instrumented
- [ ] Grafana dashboard v4 live
- [ ] Peer review complete