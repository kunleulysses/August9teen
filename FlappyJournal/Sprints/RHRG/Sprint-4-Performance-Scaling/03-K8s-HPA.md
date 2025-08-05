# 03 – K8s HPA (Horizontal Pod Autoscaler)

## Goal
Automatically scale renderer worker pods in Kubernetes based on load, using the `holograph_frames_over_budget_total` Prometheus metric.

## Prerequisites
- K8s cluster with Prometheus Adapter
- `k8s/` manifests directory
- Metrics emitted from renderer as in previous sprints

## Step-by-Step Instructions

1. **Expose Custom Metric in Prometheus Adapter**
   - Update `custom-metrics-config.yaml`:
     ```yaml
     rules:
       - seriesQuery: 'holograph_frames_over_budget_total'
         resources:
           overrides:
             namespace: {resource: "namespace"}
             pod: {resource: "pod"}
         name:
           matches: "holograph_frames_over_budget_total"
           as: "holograph_frames_over_budget_total"
         metricsQuery: 'rate(holograph_frames_over_budget_total{<<.LabelMatchers>>}[2m])'
     ```

2. **Create HPA Manifest**
   - File: `k8s/holograph-hpa.yaml`
     ```yaml
     apiVersion: autoscaling/v2
     kind: HorizontalPodAutoscaler
     metadata:
       name: holograph-renderer-hpa
     spec:
       scaleTargetRef:
         apiVersion: apps/v1
         kind: Deployment
         name: holograph-renderer
       minReplicas: 2
       maxReplicas: 10
       metrics:
         - type: Pods
           pods:
             metric:
               name: holograph_frames_over_budget_total
             target:
               type: AverageValue
               averageValue: "0.1"
     ```

3. **Apply and Monitor**
   ```sh
   kubectl apply -f k8s/holograph-hpa.yaml
   kubectl describe hpa holograph-renderer-hpa
   ```

4. **Load Test to Trigger Scaling**
   - Use k6 or custom load to increase frame budget overruns.

## Verification & Acceptance Criteria
- [ ] HPA scales pods up/down based on metric
- [ ] Scaling events recorded in Prometheus
- [ ] System maintains SLOs during traffic spikes

## Time Estimate & Owner
- 0.5 day (SRE/DevOps)

## Common Pitfalls & Mitigations
- **Pitfall:** Metric not available to HPA  
  **Mitigation:** Ensure Prometheus Adapter exposes metric, debug with `kubectl get --raw`

- **Pitfall:** Scaling too slow  
  **Mitigation:** Lower `averageValue`, reduce scrape/aggregation interval

- **Pitfall:** Scaling flaps (too frequent)  
  **Mitigation:** Add stabilization window or increase minReplicas