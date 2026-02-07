# B-7: Chaos Harness – ML-API Slowdown / Redis Outage (MTTR < 2 min)

## Objective & Success Criteria
**Objective:**  
Implement chaos engineering tests for ML API latency and Redis outages, tracking system Mean Time To Recovery (MTTR) and ensuring it is <2 minutes.

**Success Criteria:**  
- Chaos scripts simulate ML/Redis failure.
- System recovers with MTTR <2 min.
- MTTR is tracked and reported.

## Prerequisites / Dependencies
- Docker Compose or k8s test infra.
- Fault injection (pause/kill containers, network delay).
- Redis and ML API containers.

## Architectural Context
- `docker-compose.test.yml` or k8s manifests.
- Test/chaos scripts in `scripts/` or CI.

## Step-by-Step Implementation Plan

1. **Prepare Chaos Scripts**
   - Script to pause/kill ML API and Redis containers.
   - Script to restore service after N seconds.

2. **Automate in CI**
   - Add CI job:
     - Start services.
     - Inject ML API latency, then restore.
     - Kill Redis, restart after delay.
     - Measure downtime and assert recovery <2 min.

3. **Track MTTR**
   - In test harness, time from fault to full system health.
   - Report as `resonance_mttr_seconds`.

4. **Document Recovery**
   - Add steps to RUNBOOK for manual/auto recovery.

5. **Alerting**
   - Add Prometheus alert for service down >1 min.

## Observability Hooks
- Gauge: `resonance_mttr_seconds`
- Alert: service not healthy >1 min

## Security or Performance Considerations
- Only run in test/staging.
- Ensure chaos cannot cause data loss.

## Validation / Acceptance Checklist
- [ ] Chaos test runs in CI
- [ ] MTTR <2 min for each scenario
- [ ] Recovery steps confirmed and documented

## Rollback / Cleanup Notes
- Disable chaos tests or revert to manual drill.