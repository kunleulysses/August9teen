# 03 – Grafana Dashboard

**Objective:**  
Build a Grafana dashboard for quantum system metrics.

**Why it matters:**  
Visualizes health, latency, and reliability at a glance.

---

## Preconditions

- Grafana instance with Prometheus data source
- Prometheus metrics available

---

## Procedure

### 1. Create new dashboard

- In Grafana, click "Create → Dashboard"
- Add new panels for:
  - `quantum_event_total`
  - `quantum_field_process_latency_ms`
  - `quantum_entanglement_links_total`
  - `quantum_cb_state`
  - `security_violation_total{module="quantum"}`

### 2. Configure alert rules

- Set alerts on:
  - Latency p95 > 100ms
  - Link count > 10k
  - Circuit breaker open

---

## Verification

- Dashboard shows live data.
- Alerts fire on test thresholds.
- Visuals update every ~10s.

---

## Rollback / Troubleshooting

- Revert to last known good dashboard JSON.
- Check Prometheus query syntax for typos.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-4.3