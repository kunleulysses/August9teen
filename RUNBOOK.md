# RUNBOOK

## Service/Component Descriptions

- **holograph-gateway**: The main entry point for all API and WebSocket traffic.
- **holograph-renderer**: A worker process that renders the holographic reality.

## PagerDuty/SRE On-call Rotation Info

- **On-call:** @sre-team
- **PagerDuty:** https://example.pagerduty.com

## Onboarding Steps

1. Request access to the GitHub repository, Kubernetes cluster, and monitoring tools.
2. Clone the repository and run `npm install` followed by `npm test` to verify the environment.
3. Review this runbook and related architecture documents.
4. Deploy to the staging environment using the [Helm chart](https://charts.example.com/holograph).
5. Familiarize yourself with the Grafana and alert dashboards.

## Dashboard URLs

- **Grafana:** https://grafana.example.com/d/holograph-baseline/holograph-baseline-metrics
- **Prometheus:** https://prometheus.example.com
- **Alert Dashboard:** https://grafana.example.com/d/holograph-alerts/holograph-alerts

## Helm Chart

- https://charts.example.com/holograph

## Key SLOs and Alert Meanings

- **HoloFPSDegradation**: The p95 FPS of the holographic reality is below 55.
- **RecursiveExplosion**: The scene graph depth has exceeded the safe threshold of 10.
- **FrameBudgetBreach**: The renderer is frequently exceeding its frame budget.
- **GPUOOMRisk**: The GPU memory usage is at risk of exceeding its capacity.

## Rollback Procedure

1. Identify the previous stable release using `helm history holograph`.
2. Roll back using `helm rollback holograph <revision>`.
3. Monitor the [alert dashboard](https://grafana.example.com/d/holograph-alerts/holograph-alerts) and application logs to confirm recovery.

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

## Disaster Recovery

1. Fetch the latest S3 snapshot of persistent data: `aws s3 cp s3://holograph-backups/latest.tar.gz .`.
2. Restore the snapshot to the database or storage layer.
3. Redeploy the stack using the [Helm chart](https://charts.example.com/holograph).
4. Validate service health on the [alert dashboard](https://grafana.example.com/d/holograph-alerts/holograph-alerts) and Grafana.
