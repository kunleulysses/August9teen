# Ticket A6 – PrometheusMetrics

## Goal
Expose detailed, production-grade Prometheus metrics for all core Sigil-DNA operations (encode, verify, error, GC, persistence), supporting robust observability and SRE dashboards.

## Context

Currently, the Sigil-DNA stack lacks meaningful operational metrics. There is no `/metrics` endpoint, no export of encode/verify rates, and no way to monitor error spikes, GC performance, or persistence latency. This creates blind spots for SREs, makes alerting impossible, and prevents capacity planning or performance tuning.

Key files affected:
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs): API endpoints for encode/verify/revoke.
- [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs): In-memory and LevelDB encode logic, GC.
- [`FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs`](../../server/consciousness/sigil-based-code-authenticator.cjs): Advanced encode/verify flows.
- Metrics will be exported at `/metrics` per Prometheus conventions.
- Grafana dashboards will visualize metric trends, error rates, latency, and breaker states.

A production-grade metrics solution must:
- Use `prom-client` (the standard Node.js Prometheus library).
- Export counters for encode/verify/error/GC.
- Track request and operation latency (histograms).
- Allow for additional custom metrics (e.g., circuit breaker state).
- Secure `/metrics` to avoid abuse (IP allowlist or token).
- Output metrics in Prometheus scrape format.

## Prerequisites

- Node.js v18.x or higher
- `prom-client` npm package
  ```
  npm install prom-client
  ```
- Access to main server entrypoint
- Ability to restart service
- Prometheus and Grafana for verification
- ENV: `METRICS_TOKEN` for secure endpoint (optional)
- Network access for Prometheus server to scrape `/metrics`

## Step-by-Step Implementation

### 1. Install and Configure prom-client

1. Install `prom-client`:
   ```
   npm install prom-client
   ```
2. In `index.cjs` (server entrypoint), require and register prom-client:
   ```js
   const promClient = require('prom-client');
   promClient.collectDefaultMetrics();
   ```

### 2. Define Custom Metrics

1. In a new file `server/metrics/sigilMetrics.js`:
   ```js
   const promClient = require('prom-client');
   const sigilEncodeCounter = new promClient.Counter({
     name: 'sigil_encode_total',
     help: 'Total number of sigil encodes'
   });
   const sigilVerifyCounter = new promClient.Counter({
     name: 'sigil_verify_total',
     help: 'Total number of sigil verifies'
   });
   const sigilErrorCounter = new promClient.Counter({
     name: 'sigil_error_total',
     help: 'Total number of sigil encode/verify errors'
   });
   const sigilEncodeDuration = new promClient.Histogram({
     name: 'sigil_encode_duration_seconds',
     help: 'Duration of sigil encode in seconds',
     buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]
   });
   const sigilGCCount = new promClient.Counter({
     name: 'sigil_gc_total',
     help: 'Number of GC cycles run'
   });
   module.exports = {
     sigilEncodeCounter,
     sigilVerifyCounter,
     sigilErrorCounter,
     sigilEncodeDuration,
     sigilGCCount
   };
   ```

### 3. Instrument Code Paths

1. In `sigil-api.cjs`, increment metrics:
   ```js
   const { sigilEncodeCounter, sigilEncodeDuration, sigilErrorCounter } = require('./metrics/sigilMetrics');
   router.post('/api/consciousness/sigils', async (req, res) => {
     const end = sigilEncodeDuration.startTimer();
     try {
       // ... encode logic ...
       sigilEncodeCounter.inc();
       end();
       res.json({ success: true });
     } catch (e) {
       sigilErrorCounter.inc();
       end();
       res.status(500).json({ error: 'Failed' });
     }
   });
   ```
2. In GC and verify flows, increment appropriate counters.

### 4. Add /metrics Endpoint

1. In `index.cjs`:
   ```js
   app.get('/metrics', async (req, res) => {
     // Optionally secure with token/IP
     if (process.env.METRICS_TOKEN && req.headers['authorization'] !== `Bearer ${process.env.METRICS_TOKEN}`) {
       return res.status(401).send('Unauthorized');
     }
     res.set('Content-Type', promClient.register.contentType);
     res.end(await promClient.register.metrics());
   });
   ```

### 5. Configure Prometheus Scrape

1. In `prometheus.yml`:
   ```yaml
   scrape_configs:
     - job_name: 'sigil-dna'
       static_configs:
         - targets: ['sigil-server:3000']
   ```

### 6. Build Grafana Dashboards

1. Create a dashboard with panels for:
   - `sigil_encode_total` (rate)
   - `sigil_verify_total` (rate)
   - `sigil_error_total`
   - `sigil_encode_duration_seconds` (histogram/heatmap)
   - `sigil_gc_total`
2. Example PromQL queries:
   ```
   rate(sigil_encode_total[5m])
   histogram_quantile(0.95, sum(rate(sigil_encode_duration_seconds_bucket[5m])) by (le))
   ```

---

## Verification

### Unit Tests

- Use Jest to verify metrics increment:
  ```js
  it('should increment encode counter', () => {
    const { sigilEncodeCounter } = require('./metrics/sigilMetrics');
    const start = sigilEncodeCounter.hashMap[''];
    // Simulate encode
    sigilEncodeCounter.inc();
    expect(sigilEncodeCounter.hashMap['']).toBe(start + 1);
  });
  ```

### Integration

- `curl http://localhost:3000/metrics` returns Prometheus text output.
- Prometheus scrape logs show no errors.
- Grafana dashboard panels populate with data.
- Induce errors and verify `sigil_error_total` increases.
- Run soak test (e.g., k6) and watch histogram panel heat up.

### Security

- Test with/without `METRICS_TOKEN`; unauthorized requests get 401.

---

## Rollback

- Remove all metric code and `/metrics` endpoint:
  ```
  git checkout HEAD~1 -- server/metrics/sigilMetrics.js server/index.cjs server/sigil-api.cjs
  ```
- Remove Prometheus scrape config.
- Remove dashboard from Grafana.

---

## Acceptance Criteria

- All encode/verify/error/GC flows instrumented with counters/histograms.
- `/metrics` endpoint returns valid Prometheus output.
- Metrics visible and accurate in Grafana.
- All metrics secured if `METRICS_TOKEN` is set.
- No performance regressions with metrics enabled.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [prom-client npm](https://www.npmjs.com/package/prom-client)
- [Prometheus docs](https://prometheus.io/docs/introduction/overview/)
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [Node.js Prometheus best practices](https://prometheus.io/docs/practices/instrumentation/)
- [Example PromQL queries](https://prometheus.io/docs/prometheus/latest/querying/examples/)