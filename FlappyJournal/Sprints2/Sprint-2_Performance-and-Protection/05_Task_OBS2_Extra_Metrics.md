# Task OBS2: Extra Observability Metrics

**Owner:** DevEx  
**Pre-req:** Sprint 1 metrics live  
**Est. hours:** 1

---

## Objective

Add additional metrics to catch and alert on edge-case failures.

## Steps

1. **Counters:**
   - `ws_backpressure_drops_total`
   - `ws_rate_limit_drops_total`
2. **Histogram:**
   - `heartbeat_skew_ms` (bucketed)
3. **Gauge:**
   - Heap used (`process.memoryUsage().heapUsed`)
4. **Test:**
   - Trigger events, confirm metrics increment
   - Grafana alerts fire
5. **Docs:**  
   - Update metrics section in runbook
6. **Commit Message:**  
   ```
   feat(metrics): add backpressure, rate-limit, heap metrics
   ```
7. **Done Criteria:**
   - All metrics present in `/metrics`
   - Alerts verified