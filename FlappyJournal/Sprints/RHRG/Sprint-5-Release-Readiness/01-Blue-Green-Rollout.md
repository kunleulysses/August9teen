# 01 – Blue-Green Rollout

## Goal
Achieve zero-downtime production rollout of the new stack using Argo Rollouts for automated traffic shifting and rollback.

## Prerequisites
- Argo Rollouts installed in target cluster
- Deployment manifests under `k8s/`
- Staging environment verified

## Step-by-Step Instructions

1. **Create Argo Rollout Manifest**
   - File: `k8s/holograph-rollout.yaml`
   ```yaml
   apiVersion: argoproj.io/v1alpha1
   kind: Rollout
   metadata:
     name: holograph-gateway
   spec:
     replicas: 3
     strategy:
       blueGreen:
         activeService: holograph-svc-active
         previewService: holograph-svc-preview
         autoPromotionEnabled: false
     selector:
       matchLabels:
         app: holograph-gateway
     template:
       metadata:
         labels:
           app: holograph-gateway
       spec:
         containers:
           - name: gateway
             image: ghcr.io/org/holograph-api:latest
             ports:
               - containerPort: 8080
   ```

2. **Apply Rollout and Monitor**
   ```sh
   kubectl apply -f k8s/holograph-rollout.yaml
   kubectl argo rollouts get rollout holograph-gateway
   kubectl argo rollouts promote holograph-gateway
   ```

3. **Shift Traffic and Verify**
   - Use Argo dashboard or CLI to incrementally shift traffic, monitor SLO dashboards.

4. **Automated Rollback**
   - If SLO or health checks fail, run:
     ```sh
     kubectl argo rollouts undo holograph-gateway
     ```

5. **Document Process**
   - Add step-by-step in `docs/holograph/Rollout-Guide.md`

## Verification & Acceptance Criteria
- [ ] Rollout completes with no downtime
- [ ] Traffic shifts only after SLO checks pass
- [ ] Rollback script tested and functional

## Time Estimate & Owner
- 0.5 day (Dev Rel, SRE)

## Common Pitfalls & Mitigations
- **Pitfall:** Rollout promoted before preview validated  
  **Mitigation:** Require manual approval or auto-promotion delay

- **Pitfall:** Health check misses incident  
  **Mitigation:** Tie rollout to Prometheus SLO alerts and readiness probes

- **Pitfall:** Rollback not tested  
  **Mitigation:** Always test rollback in staging before prod cutover