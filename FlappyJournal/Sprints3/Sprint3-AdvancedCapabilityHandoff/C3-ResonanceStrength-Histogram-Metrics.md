# Ticket C3 – Resonance Strength Histogram Metrics

## Goal
Collect, expose, and visualize a Prometheus histogram of resonance strengths between sigils, enabling SREs and analysts to observe distribution, spot anomalies, and tune matching thresholds.

## Context

Resonance strength is a core metric in the Sigil-DNA system, reflecting the similarity or linkage between pairs of sigils (see [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs)). While mean/max/min metrics have some value, a histogram exposes the entire distribution, which is critical for:
- Capacity planning (e.g., how many high-resonance pairs exist)
- Tuning hyper-resonance matching (see C1)
- Alerting on unexpected spikes (e.g., too many high-strength or zero-strength relationships)
- Monitoring the effect of algorithm changes

Prometheus histograms provide bucketed counts and quantiles, which can be visualized in Grafana as heatmaps or time series. The histogram should:
- Be updated on every encode, verify, or resonance calculation event
- Use custom buckets relevant to the resonance algorithm (e.g., 0–1.0 in 0.05 increments)
- Be queryable by PromQL for trend analysis and alerting

## Prerequisites

- Node.js v18.x or higher
- prom-client npm package (already used for A6)
- Working Prometheus and Grafana setup
- Access to all code paths that compute resonance strength
- ENV: None specific, but `PROMETHEUS_SCRAPE_INTERVAL` can affect resolution
- Sample test data with wide resonance variation

## Step-by-Step Implementation

### 1. Define Histogram Metric

1. In `server/metrics/sigilMetrics.js`:
   ```js
   const promClient = require('prom-client');
   const resonanceStrengthHistogram = new promClient.Histogram({
     name: 'sigil_resonance_strength',
     help: 'Histogram of resonance strengths between sigils',
     buckets: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0]
   });
   module.exports = { resonanceStrengthHistogram, ... };
   ```

### 2. Update Code to Observe Histogram

1. In all resonance calculation paths (e.g., `calculateResonance` in `sigil-identity.cjs`):
   ```js
   const { resonanceStrengthHistogram } = require('./metrics/sigilMetrics');
   function calculateResonance(memory1, memory2) {
     // ... existing logic ...
     resonanceStrengthHistogram.observe(resonance);
     return resonance;
   }
   ```

2. Ensure histogram is observed for all encode, verify, and matching events.

### 3. Expose Metrics to Prometheus

- `/metrics` endpoint (already set up for A6/A8).

### 4. Create Grafana Panel

1. In Grafana, create a new panel:
   - Visualization: Heatmap or Histogram
   - PromQL:
     ```
     histogram_quantile(0.95, sum(rate(sigil_resonance_strength_bucket[5m])) by (le))
     ```
   - Show distribution over time.

2. (Optional) Add alert rule: if >X sigils in >0.95 bucket, fire alert.

### 5. Document and Tune Buckets

- Document rationale for bucket selection in runbook.
- Tune buckets as needed for actual data distribution.

---

## Verification

### Automated

- Unit tests: simulate resonance values, observe bucket increments.
- Integration: scrape `/metrics`, confirm expected bucket values.

### Manual

- Run encode/verify flows, then:
  ```
  curl http://localhost:3000/metrics | grep sigil_resonance_strength
  ```
- In Grafana, confirm panel populates and quantiles match expected.

### Alerting

- Create test alert for high quantile.

---

## Rollback

- Remove histogram observe calls and metric definition.
- Delete Grafana panel.

---

## Acceptance Criteria

- Histogram is observed for every resonance calculation.
- Metric is scrapeable and populates with real data.
- Grafana panel shows full distribution over time.
- Alert rules function as intended.

---

## Time Estimate & Assignee

- Estimate: 0.75 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Prometheus histograms](https://prometheus.io/docs/practices/histograms/)
- [Grafana heatmaps](https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/heatmap/)
- [prom-client histogram docs](https://github.com/siimon/prom-client#histogram)
- [Understanding quantiles in Prometheus](https://www.robustperception.io/understanding-the-prometheus-histogram)
- [API metrics design](https://brandur.org/metrics)