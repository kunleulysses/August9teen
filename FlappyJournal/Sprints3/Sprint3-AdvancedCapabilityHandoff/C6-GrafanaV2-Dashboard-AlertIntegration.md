# Ticket C6 – Grafana v2 Dashboard & Alert Integration

## Goal
Upgrade the existing Grafana dashboard to v2, providing advanced visualizations (heatmaps, percentile latency, histograms), integrated alert rules, and actionable panels for SREs and stakeholders.

## Context

While Sprint 1/2 established basic metrics and a v1 dashboard for Sigil-DNA (see [`prometheus/grafana/`](../../../prometheus/grafana/)), current panels are limited to counters and basic timelines. SREs and engineers need richer, actionable observability, including:
- Heatmaps of encode latency and resonance distributions
- 95th/99th percentile charts
- Error spike and circuit breaker visualizations
- Alert rules that route to Slack/PagerDuty

This enables:
- Fast incident detection and triage
- Real-time performance tuning
- Capacity planning for peak/edge cases
- Improved transparency for product and ops teams

Key files:
- `prometheus/grafana/sigil_dashboard_v2.json` (dashboard definition)
- AlertManager/Slack/PagerDuty configs
- Prometheus metrics (see A6, C3, C8)

## Prerequisites

- Grafana ≥ v8.x, Prometheus ≥ 2.x
- Access to update and import dashboards
- Prometheus scrape target for Sigil-DNA
- ENV: `GRAFANA_ADMIN_TOKEN`, `PROMETHEUS_URL`
- Slack and PagerDuty API tokens for alerting
- All metrics from A6/C3/C8 present in `/metrics`
- Test events to trigger alerts

## Step-by-Step Implementation

### 1. Design Grafana v2 Dashboard

1. Panels:
   - Encode/verify latency (heatmap + percentiles)
   - Resonance strength histogram (from C3)
   - Error rates (encode, verify, GC)
   - Circuit breaker state over time (from A4)
   - Heavy test result trends (from A8)
   - Disk/DB health (from C5)
2. Example PromQL:
   ```yaml
   rate(sigil_encode_total[5m])
   histogram_quantile(0.99, sum(rate(sigil_encode_duration_seconds_bucket[5m])) by (le))
   sum by (le) (rate(sigil_resonance_strength_bucket[5m]))
   sigil_error_total
   dnastore_circuit_state
   ```

### 2. Create Dashboard JSON

- Use Grafana UI to build out panels, then export as `sigil_dashboard_v2.json`.
- Example panel config:
   ```json
   {
     "type": "heatmap",
     "title": "Encode Latency Heatmap",
     "targets": [{ "expr": "sigil_encode_duration_seconds_bucket" }],
     "xAxis": { "mode": "series", "show": true },
     "yAxis": { "format": "ms", "logBase": 1 },
     ...
   }
   ```

### 3. Import Dashboard into Grafana

1. Via UI: Import > Upload JSON > Select `sigil_dashboard_v2.json`
2. Or via API:
   ```bash
   curl -X POST -H "Authorization: Bearer $GRAFANA_ADMIN_TOKEN" \
        -H "Content-Type: application/json" \
        -d @sigil_dashboard_v2.json \
        $GRAFANA_URL/api/dashboards/db
   ```

### 4. Integrate Alert Rules

1. In dashboard panel, add alert:
   - E.g. "If 95th percentile encode latency > 1s for 10m, alert"
   - E.g. "If error rate > 1/min, alert"
2. Configure AlertManager:
   - Route alerts to Slack/PagerDuty
   - Example:
     ```yaml
     route:
       receiver: 'sigil-slack'
       group_by: ['alertname']
     receivers:
     - name: 'sigil-slack'
       slack_configs:
       - api_url: 'https://hooks.slack.com/services/XXX'
         channel: '#sigil-alerts'
     ```
3. Test with manual error injection or metric manipulation.

### 5. Document and Onboard

- Update runbook with dashboard URLs and alert policy.
- Hold KT session for SRE and engineering.

---

## Verification

### Automated

- Use `promtool` or Grafana API to validate dashboard JSON.
- Fire test alerts, verify notifications reach on-call channel.

### Manual

- Trigger slow encodes/errors, watch panel and alerts in Grafana.
- SREs can acknowledge and resolve alerts.

### Metrics

- All new metrics populate panels in real time.

---

## Rollback

- Revert to v1 dashboard:
  ```
  grafana-cli dashboards import sigil_dashboard_v1.json
  ```
- Remove/disable new alert rules.

---

## Acceptance Criteria

- Grafana v2 dashboard is live, actionable, and documented.
- All SREs have access and know how to use alert channels.
- Alerts fire and resolve on real incidents.
- Dashboard covers latency, errors, resonance, and health.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Grafana dashboard docs](https://grafana.com/docs/grafana/latest/dashboards/)
- [Alerting best practices](https://prometheus.io/docs/alerting/latest/best_practices/)
- [Grafana HTTP API](https://grafana.com/docs/grafana/latest/developers/http_api/dashboard/)
- [Prometheus heatmaps](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/heatmap/)
- [Slack AlertManager integration](https://prometheus.io/docs/alerting/latest/configuration/#slack_config)