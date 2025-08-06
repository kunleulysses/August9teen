# C-2: Nightly Integrity CronJob (Recompute Resonance Stats)

## Objective & Success Criteria
**Objective:**  
Run a nightly background task to validate and recompute resonance network integrity, storing results and raising alerts on anomalies.

**Success Criteria:**  
- CronJob runs nightly and recomputes stats.
- Anomalies logged and alert metrics exposed.
- Results stored in Redis for audit.

## Prerequisites / Dependencies
- `node-cron` or system cron.
- Redis adapter implemented (A-3).

## Architectural Context
- `scripts/recompute-resonance-integrity.js`
- Cron definition (system or k8s CronJob YAML)

## Step-by-Step Implementation Plan

1. **Implement Integrity Script**
   - Load node/field/pattern state from Redis.
   - Recompute stats, check for anomalies.
   - Log anomalies, write summary to `resonance:integrity:YYYYMMDD`.

2. **Schedule CronJob**
   - Add `0 3 * * * pnpm node scripts/recompute-resonance-integrity.js` to cron.
   - Or k8s CronJob for cloud.

3. **Alerting**
   - If anomalies, set Prometheus gauge/alert.

4. **Testing**
   - Manually corrupt a Redis key, assert anomaly is logged.

## Observability Hooks
- Gauge: `resonance_integrity_failures`
- Log all runs

## Security or Performance Considerations
- Run script with least privilege.

## Validation / Acceptance Checklist
- [ ] Cron runs nightly
- [ ] Stats recomputed, anomalies logged
- [ ] Audit log in Redis

## Rollback / Cleanup Notes
- Remove cron entry or script.