# Ticket C9 – k6 Soak Tests Pipeline

## Goal
Develop a nightly soak test pipeline using k6 to stress the Sigil-DNA API for hours, capturing regressions, memory leaks, and long-haul performance trends.

## Context

Short-run API tests catch obvious bugs, but only extended load ("soak") testing exposes slow memory leaks, resource exhaustion, and performance drift. As Sigil-DNA moves to production, it's essential to:
- Simulate realistic, sustained load (500-1000 RPS) for several hours
- Track error rates, latency quantiles, and resource usage over time
- Identify slow-degrading failures (file descriptor leaks, heap growth, DB deadlocks)
- Publish and archive reports for SRE and engineering review

k6 is the industry standard for modern, scriptable load and soak testing. It integrates with CI/CD, supports Prometheus output, and can be parameterized for scenario-based tests.

Key files:
- `scripts/soak/k6-sigil-soak.js` (k6 test script)
- Nightly pipeline config (`.github/workflows/nightly-soak.yml`)
- Prometheus/Grafana for metrics
- Slack/email for nightly report notifications

## Prerequisites

- k6 CLI installed (`brew install k6` or [download](https://k6.io/docs/getting-started/installation/))
- Node.js API running and accessible
- ENV: `SIGIL_API_URL` (e.g., `http://localhost:3000/sigil/api/consciousness/sigils`)
- Sufficient CPU/memory for sustained load
- Access to nightly CI/CD pipeline (GitHub Actions, Jenkins, etc.)
- Prometheus metrics configured

## Step-by-Step Implementation

### 1. Write k6 Soak Test Script

1. `scripts/soak/k6-sigil-soak.js`:
   ```js
   import http from 'k6/http';
   import { check, sleep } from 'k6';

   export let options = {
     vus: 50,
     duration: '4h',
     thresholds: {
       http_req_duration: ['p(99)<1500'],
       http_req_failed: ['rate<0.01']
     }
   };

   export default function () {
     let url = __ENV.SIGIL_API_URL;
     let payload = JSON.stringify({ data: { foo: Math.random() } });
     let headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${__ENV.SIGIL_TOKEN}` };
     let res = http.post(url, payload, { headers });
     check(res, { 'status is 200': (r) => r.status === 200 });
     sleep(0.2);
   }
   ```

2. Add more scenarios (verify, list, error case) as needed.

### 2. Run Locally

```bash
export SIGIL_API_URL=http://localhost:3000/sigil/api/consciousness/sigils
export SIGIL_TOKEN=<your-jwt>
k6 run scripts/soak/k6-sigil-soak.js
```

### 3. Integrate with Nightly Pipeline

1. In `.github/workflows/nightly-soak.yml`:
   ```yaml
   on:
     schedule:
       - cron:  '0 2 * * *'
   jobs:
     soak:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Start Sigil-DNA API
           run: npm run start &
         - name: Wait for API
           run: until curl -sSf $SIGIL_API_URL/healthz; do sleep 2; done
         - name: Run k6 soak test
           run: k6 run scripts/soak/k6-sigil-soak.js
         - name: Upload k6 report
           uses: actions/upload-artifact@v3
           with:
             name: k6-report
             path: k6-report.json
   ```

### 4. Publish and Archive Reports

- Save k6 summary output and attach to nightly job artifacts
- Email or Slack summary to SRE/engineering

### 5. Monitor Metrics in Grafana

- Build panel to track:
  - Soak test error rate over time
  - Latency quantiles during soak
  - Change vs. previous runs

### 6. Document and Tune

- Update runbook with soak test schedule, scenarios, and troubleshooting.
- Tune VUs, RPS, thresholds as system scales.

---

## Verification

### Automated

- Nightly pipeline runs for full duration; all thresholds pass.
- k6 report uploaded and archived.
- Alerts fire if error or latency thresholds breached.

### Manual

- Review Grafana panels and k6 output after each soak.
- Check for memory/cpu/fd growth in service logs.

---

## Rollback

- Remove soak test script and pipeline from repo.
- Disable nightly job in CI config.

---

## Acceptance Criteria

- Soak test runs nightly for ≥4h at target load.
- No regressions or leaks detected.
- Reports and alerts are visible to stakeholders.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [k6 soak testing](https://k6.io/docs/test-types/soak-testing/)
- [GitHub Actions schedule](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule)
- [k6 thresholds](https://k6.io/docs/using-k6/thresholds/)
- [API performance monitoring](https://brandur.org/metrics)
- [Grafana alerting](https://grafana.com/docs/grafana/latest/alerting/)