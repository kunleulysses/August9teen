# A-6: Grafana Dashboard v1

## Objective & Success Criteria
**Objective:**  
Deliver a first version Grafana dashboard visualizing core resonance metrics (latency, queue, node count, error rate).

**Success Criteria:**  
- Grafana dashboard imported and visible.
- All key metrics (added in A-5) displayed.
- Team has shared access to view live data.

## Prerequisites / Dependencies
- Prometheus metrics (A-5) live and scraped.
- Grafana instance available.
- Metrics endpoint `/metrics` reachable from Prometheus.

## Architectural Context
- `prometheus/` config
- `monitoring/` (optional)
- Dashboard JSON lives in `monitoring/` or `FlappyJournal/Sprints4/SprintA-Core-Observability/`

## Step-by-Step Implementation Plan

1. **Add Prometheus Job**
   - In `prometheus/prometheus.yml`:
     ```yaml
     - job_name: 'resonance'
       static_configs:
         - targets: ['localhost:8080']
     ```

2. **Create Dashboard in Grafana**
   - Add new dashboard.
   - Add panels for:
     - `resonance_cascade_latency_ms` (Histogram)
     - `resonance_worker_queue_depth` (Gauge)
     - `resonance_active_nodes` (Gauge)
     - `resonance_errors_total` (Counter)
   - Configure panel thresholds, units, alerts.

3. **Export Dashboard JSON**
   - Save/export JSON.
   - Place in `monitoring/ResonanceDashboard_v1.json`, commit to repo.

4. **Document in RUNBOOK**
   - Add section on “How to view resonance dashboard”.

## Observability Hooks
- All metrics from A-5 visible in dashboard.

## Security or Performance Considerations
- Restrict Grafana access to authorized users only.

## Validation / Acceptance Checklist
- [ ] Dashboard imported
- [ ] Live data visible for all key metrics
- [ ] Alerts configured for major SLOs

## Rollback / Cleanup Notes
- Remove dashboard JSON and Prometheus job if needed.