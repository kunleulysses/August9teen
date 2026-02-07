# B-6: Prom Alert Rules + ZAP Baseline Security Scan

## Objective & Success Criteria
**Objective:**  
Deploy Prometheus alerting for core SLOs and configure OWASP ZAP baseline scan in CI to catch security issues.

**Success Criteria:**  
- Prometheus alerts fire on SLO breaches.
- ZAP scan runs in CI; 0 high/medium findings.

## Prerequisites / Dependencies
- Prometheus/Grafana and `/metrics` endpoint live.
- CI/CD pipeline with Docker or Node.
- Exposure of all endpoints in test environment.

## Architectural Context
- `prometheus/alert.rules.yml`
- `.github/workflows/*` or equivalent CI config

## Step-by-Step Implementation Plan

1. **Add Prometheus Alert Rules**
   - Create/edit `prometheus/alert.rules.yml`:
     ```yaml
     groups:
       - name: resonance-alerts
         rules:
           - alert: CascadeLatencyHigh
             expr: histogram_quantile(0.95, sum(rate(resonance_cascade_latency_ms_bucket[5m])) by (le)) > 120
             for: 2m
           - alert: WorkerQueueOverload
             expr: resonance_worker_queue_depth > 50
             for: 1m
           - alert: ErrorRateHigh
             expr: increase(resonance_errors_total[10m]) > 10
     ```
   - Reload Prometheus config.

2. **Integrate ZAP Baseline Scan in CI**
   - Add to GitHub Actions or equivalent:
     ```yaml
     - name: ZAP Baseline Scan
       uses: zaproxy/action-baseline@v0.8.0
       with:
         target: 'http://localhost:8080'
         fail_action: true
     ```
   - Fail build on any high/medium finding.

3. **Test Alerts and ZAP**
   - Simulate SLO breach (force delay/error).
   - Confirm alert fires and is visible in Grafana/alertmanager.
   - Run ZAP scan locally/CI and review findings.

## Observability Hooks
- Alerts for latency, queue depth, error rate.
- ZAP scan status in CI.

## Security or Performance Considerations
- Tune ZAP for endpoints; avoid DoS on test infra.
- Review alert rules for false positives.

## Validation / Acceptance Checklist
- [ ] Alerts fire on SLO breach
- [ ] ZAP scan runs and reports
- [ ] No critical vulnerabilities outstanding

## Rollback / Cleanup Notes
- Remove alert rules or disable ZAP scan in CI.