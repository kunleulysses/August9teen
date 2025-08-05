# Task O1: Prometheus Histograms & Grafana Panel

**Owner:** DevEx  
**Pre-req:** prom-client, Grafana admin  
**Est. hours:** 2

---

## Objective

Expose fine-grained metrics for analysis latency, heartbeat skew, and WebSocket backpressure.

## Steps

1. **Add to `websocket-server.cjs` and/or `metrics/`:**
   - Histogram: `metacog_analysis_latency_ms`
   - Gauge: `heartbeat_skew_ms`
   - Counter: `ws_backpressure_drops_total`
2. **Register with Prometheus client registry**
3. **Measure & record:**
   - On each analysis, observe elapsed ms
   - On heartbeat, measure drift from target
   - On WS send, increment drop if `bufferedAmount` high
4. **Export on `/metrics` endpoint**
5. **Grafana:**
   - Update/Import JSON panel to show:
     - p95 latency (heatmap)
     - Heartbeat skew over time (line)
     - Backpressure drops (alert threshold)
6. **Alert Rules:**
   - Latency > 500ms p95 → warning
   - Backpressure drops > 10/min → critical
7. **Commit Message:**
   ```
   feat(metrics): add Prometheus histograms & Grafana panel
   ```
8. **QA:**
   - Hit `/metrics`, confirm new metrics
   - Grafana panel renders, alerts fire on breach