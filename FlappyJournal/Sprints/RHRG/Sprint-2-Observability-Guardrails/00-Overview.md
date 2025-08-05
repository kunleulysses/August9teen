# Sprint 2: Observability & Guardrails – Overview

## Goal
Expand telemetry, enforce recursive safety, and establish actionable SLOs. This sprint ensures the system is observable, self-protecting, and ready for deeper production traffic.

## Prerequisites
- Sprint-1: Core runtime, metrics emission, renderer worker, SceneNode/FrameStat schema
- Prometheus and Grafana running (local or dev)
- Access to `.github/workflows`, `server/holograph`, `monitoring/`

## Step-by-Step Instructions
1. Implement frame-budget enforcement logic (see 01-Frame-Budget-Enforcement.md)
2. Add recursive depth controls and metrics (see 02-Recursive-Depth-Controls.md)
3. Upgrade Grafana dashboard with new panels and histograms (see 03-Dashboard-V2.md)
4. Add and test alerting rules for key SLOs (see 04-Alerting-Rules.md)
5. Document all changes, update onboarding and PR templates

## Verification & Acceptance Criteria
- [ ] Back-pressure triggers when frameTime >16.6ms
- [ ] Recursive depth is capped and observable
- [ ] Grafana dashboard v2 live and shared with team
- [ ] Alertmanager fires on SLO breach

## Time Estimate & Owner
- 1 week (Backend, SRE)

## Common Pitfalls & Mitigations
- **Pitfall:** Missing metrics or panels in dashboard  
  **Mitigation:** PR checklist must include screenshot of updated dashboard

- **Pitfall:** Back-pressure logic disconnects healthy clients  
  **Mitigation:** Test under simulated load and monitor logs

- **Pitfall:** Alert rules too sensitive or too lax  
  **Mitigation:** Run in staging and tune thresholds based on real data

- **Pitfall:** Unbounded recursion risk  
  **Mitigation:** Enforce and test hard depth limits in all entrypoints