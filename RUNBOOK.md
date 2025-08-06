# RUNBOOK

## Service/Component Descriptions

- **holograph-gateway**: The main entry point for all API and WebSocket traffic.
- **holograph-renderer**: A worker process that renders the holographic reality.

## PagerDuty/SRE On-call Rotation Info

- **On-call:** @sre-team
- **PagerDuty:** https://example.pagerduty.com

## Dashboard URLs

- **Grafana:** https://grafana.example.com/d/holograph-baseline/holograph-baseline-metrics
- **Prometheus:** https://prometheus.example.com

## Key SLOs and Alert Meanings

- **HoloFPSDegradation**: The p95 FPS of the holographic reality is below 55.
- **RecursiveExplosion**: The scene graph depth has exceeded the safe threshold of 10.
- **FrameBudgetBreach**: The renderer is frequently exceeding its frame budget.
- **GPUOOMRisk**: The GPU memory usage is at risk of exceeding its capacity.

## Secret Rotation Procedures

### Rotation Steps
1. Inventory all secrets stored in Vault, configuration files, and third-party integrations.
2. Generate new credentials in the secret manager and update service configurations.
3. Redeploy services with the new secrets.
4. Validate logs and dashboards for errors.
5. Remove the old secrets after 24 hours of stable operation.

### Timing and Responsible Roles
- **Frequency:** Rotate all secrets on the first Monday of each quarter.
- **SRE Team:** Coordinates and executes the rotation.
- **Security Team:** Generates new secrets and reviews audit logs.
- **Service Owners:** Verify application behavior post-rotation.

### Rollback Procedures
1. Restore the previous secret in the secret manager.
2. Redeploy affected services with the restored secret.
3. Notify the SRE and Security channels and investigate before retrying rotation.

### Rehearsal Schedule
- Conduct a full rotation rehearsal in staging every March and September.
- Document lessons learned and update this runbook after each rehearsal.

## NATS JetStream Installation

1. Add the NATS Helm repo:
   ```bash
   helm repo add nats https://nats-io.github.io/k8s/helm/charts
   ```
2. Install or upgrade the release using the provided values:
   ```bash
   helm upgrade --install jetstream nats/nats --namespace nats --create-namespace -f k8s/jetstream/values.yaml
   ```

This chart enables JetStream and provisions the `reality.gen.request` and `reality.gen.result` subjects.
