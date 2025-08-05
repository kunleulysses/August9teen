# 04 – Chaos Tests

## Goal
Validate system resilience under real-world failures using k6 load tests, Gremlin for fault injection, and CI automation.

## Prerequisites
- k6 and Gremlin installed
- Kubernetes staging cluster with test namespace
- CI workflow for chaos

## Step-by-Step Instructions

1. **Write k6 Load Test Script**
   - File: `tests/perf/holo-k6-load.js`
   - Example:
     ```js
     import ws from 'k6/ws';
     export default function() {
       ws.connect('ws://localhost:8080/ws', {}, function(socket) {
         socket.on('open', () => {
           for (let i=0; i<100; i++) socket.send('frame');
         });
         socket.on('close', () => {});
       });
     }
     ```

2. **Run Gremlin Attack (Manual/CI)**
   - Inject packet loss, kill pod, or flush Redis:
     ```sh
     gremlin attack-container --type latency --length 60 --delay 2000ms --container holograph-renderer
     ```

3. **Automate in CI**
   - File: `.github/workflows/chaos.yml`
   ```yaml
   name: Chaos Suite
   on:
     workflow_dispatch:
     schedule:
       - cron: '0 3 * * 5'
   jobs:
     k6_chaos:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Run k6 test
           run: k6 run tests/perf/holo-k6-load.js
   ```

4. **Document Outcomes**
   - File: `docs/holograph/ChaosReport.md`
   - Summarize system behavior, time to recover, and lessons learned.

## Verification & Acceptance Criteria
- [ ] System recovers from simulated faults within SLO
- [ ] No data loss or unrecoverable error state
- [ ] Chaos workflow runs at least weekly and reports outcomes

## Time Estimate & Owner
- 0.5 day (SRE/Perf)

## Common Pitfalls & Mitigations
- **Pitfall:** Chaos injures prod/staging stability  
  **Mitigation:** Isolate to test namespace, restrict to off-peak

- **Pitfall:** No automated reporting of chaos outcomes  
  **Mitigation:** Parse logs and send summary to Slack/email

- **Pitfall:** Gremlin/k6 versions drift  
  **Mitigation:** Pin CLI versions in CI config, update quarterly