# Ticket C8 – prom-client Histograms & Grafana Panels

## Goal
Expose detailed timing histograms using prom-client for all major operations (encode, verify, storage), and build Grafana panels to visualize these distributions for latency, performance, and anomaly detection.

## Context

While basic counters for encode/verify/error are already exported (see A6), histograms provide a much richer view of system performance, especially for:
- Latency distributions (not just averages)
- P95/P99/maximum time-to-completion
- Identifying slow paths, regressions, or performance anomalies
- SRE alerting on latency spikes

Histograms should be:
- Collected for encode, verify, and all storage (LevelDB/Postgres) writes
- Exposed at `/metrics` using prom-client's `Histogram`
- Tuned with sensible, domain-relevant buckets
- Visualized in Grafana as heatmaps, percentile lines, and time series

Key files:
- `server/metrics/sigilMetrics.js`
- `server/sigil-api.cjs`, `server/sigil-identity.cjs`
- `prometheus/grafana/sigil_dashboard_v2.json`

## Prerequisites

- Node.js v18.x or higher
- prom-client npm package
- Grafana and Prometheus set up with access to `/metrics`
- ENV: None specific
- Access to all code that performs encode/verify/storage ops

## Step-by-Step Implementation

### 1. Define Histograms in prom-client

1. In `server/metrics/sigilMetrics.js`:
   ```js
   const promClient = require('prom-client');
   const sigilEncodeDuration = new promClient.Histogram({
     name: 'sigil_encode_duration_seconds',
     help: 'Encode operation duration (seconds)',
     buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
   });
   const sigilVerifyDuration = new promClient.Histogram({
     name: 'sigil_verify_duration_seconds',
     help: 'Verify operation duration (seconds)',
     buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
   });
   const storageWriteDuration = new promClient.Histogram({
     name: 'sigil_storage_write_seconds',
     help: 'Storage write duration (seconds)',
     buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2]
   });
   module.exports = { sigilEncodeDuration, sigilVerifyDuration, storageWriteDuration, ... };
   ```

### 2. Instrument Code Paths

1. In encode/verify/storage flows:
   ```js
   const end = sigilEncodeDuration.startTimer();
   // ...encode logic...
   end();
   ```
   Similarly for verify and storage writes.

### 3. Expose Metrics

- `/metrics` endpoint via prom-client (already set up, see A6).

### 4. Build Grafana Panels

1. In `sigil_dashboard_v2.json`:
   - Add heatmap panel for encode latency:
     - Query: `rate(sigil_encode_duration_seconds_bucket[5m])`
   - Add percentile line panel:
     - Query: `histogram_quantile(0.99, sum(rate(sigil_encode_duration_seconds_bucket[5m])) by (le))`
   - Add similar panels for verify and storage.

2. Tune panel thresholds and colors for rapid anomaly detection.

### 5. Document Usage

- In runbooks, document how to interpret histogram panels, tune buckets, and respond to alerts.

### 6. Add Alerting

- Grafana alert if P95 latency exceeds thresholds for N minutes.

---

## Verification

### Automated

- Unit tests: simulate fast/slow ops, verify correct histogram bucket increments.

### Manual

- Run encode/verify/storage in a loop, then:
  ```
  curl http://localhost:3000/metrics | grep duration_seconds
  ```
- Observe bucket growth and quantile changes in Grafana.

### Alerting

- Trigger artificial latency and confirm alerts fire.

---

## Rollback

- Remove histogram metrics and dashboard panels.
- Restore to counter-only metrics.

---

## Acceptance Criteria

- Histograms for encode/verify/storage ops are live and accurate.
- Grafana panels show latency distributions and percentiles.
- SREs can identify and alert on latency spikes.

---

## Time Estimate & Assignee

- Estimate: 0.75 dev day
- Assignee: _______________________

---

## References / Further Reading

- [prom-client histogram docs](https://github.com/siimon/prom-client#histogram)
- [Grafana heatmaps](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/heatmap/)
- [Understanding percentiles in Prometheus](https://www.robustperception.io/how-percentiles-work-in-prometheus)
- [API performance monitoring](https://brandur.org/metrics)
- [Grafana alerting](https://grafana.com/docs/grafana/latest/alerting/)