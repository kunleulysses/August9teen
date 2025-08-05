# 04 – Alerting Rules

## Goal
Establish actionable, automated alerts for all major SLOs: frame budget overruns, recursion depth, WS rate-limits, and GPU memory pressure.

## Prerequisites
- Prometheus, Alertmanager, and Grafana running
- All metrics and panel updates from previous tasks
- Access to `monitoring/prometheus/alerts/`

## Step-by-Step Instructions

1. **Edit Prometheus Alert Rules File**
   - File: `monitoring/prometheus/alerts/holograph_rules.yml`
   - Add rules:
     ```yaml
     groups:
       - name: Holograph SLO Alerts
         rules:
           - alert: HoloFPSDegradation
             expr: histogram_quantile(0.95, rate(holograph_fps_bucket[5m])) < 55
             for: 3m
             labels: { severity: page }
             annotations:
               summary: "Holograph FPS p95 below 55"

           - alert: RecursiveExplosion
             expr: holograph_scene_max_depth > 10
             for: 1m
             labels: { severity: warning }
             annotations:
               summary: "Scene graph depth exceeded safe threshold"

           - alert: FrameBudgetBreach
             expr: rate(holograph_frames_over_budget_total[5m]) > 0.2
             for: 2m
             labels: { severity: warning }
             annotations:
               summary: "Frequent frame budget overruns"

           - alert: GPUOOMRisk
             expr: holograph_gpu_memory_bytes > 0.9 * 6.0e9
             for: 1m
             labels: { severity: page }
             annotations:
               summary: "GPU memory usage at risk threshold"
     ```

2. **Reload Prometheus and Alertmanager**
   - Command:
     ```sh
     docker exec -it prometheus kill -HUP 1
     docker exec -it alertmanager kill -HUP 1
     ```

3. **Test Alerts**
   - Temporarily lower thresholds or inject test metrics to validate firing in staging.

4. **Document Alert Playbooks**
   - In `docs/holograph/Alerting.md`, describe each alert and escalation process.

## Verification & Acceptance Criteria
- [ ] All key SLOs have alerts configured
- [ ] Alerts fire and resolve as expected in staging
- [ ] Playbook entries exist for every alert

## Time Estimate & Owner
- 0.5 day (SRE/Security)

## Common Pitfalls & Mitigations
- **Pitfall:** Alertmanager not reloaded after rule change  
  **Mitigation:** Always reload after editing and verify config syntax

- **Pitfall:** Alerts too noisy or too lax  
  **Mitigation:** Tune thresholds with real traffic data; review weekly

- **Pitfall:** Missing playbook entries  
  **Mitigation:** Make playbook update part of done criteria for new/changed alerts