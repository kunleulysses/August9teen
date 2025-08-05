# 02 – Runbook & Ops Docs

## Goal
Equip the operations team with actionable runbooks, escalation paths, and live dashboard links for incident response and ongoing support.

## Prerequisites
- All previous Sprints completed, blue-green rollout run in staging
- Ops team familiar with stack and monitoring tools
- Access to `RUNBOOK.md`, `docs/holograph/`, and Grafana/Prometheus

## Step-by-Step Instructions

1. **Update and Publish RUNBOOK.md**
   - File: `RUNBOOK.md`
   - Include:
     - Service/component descriptions
     - PagerDuty/SRE on-call rotation info
     - Dashboard URLs (Grafana, Prometheus)
     - Key SLOs and alert meanings

2. **Create Incident Response Guide**
   - File: `docs/holograph/Incident-Response.md`
   - Include:
     - Step-by-step for common alerts (“FPS drop”, “GPU OOM”, “WS flood”)
     - Contact escalation list
     - Slack/Email/Phone channels

3. **Link Dashboards**
   - Add permanent direct links to Grafana dashboard in runbook and incident doc.

4. **Simulate Incident and Drill**
   - Run a failover simulation, document time to recovery and handoff.

## Verification & Acceptance Criteria
- [ ] Runbook and incident docs published and linked from README
- [ ] All ops team members briefed and able to find docs
- [ ] Drill conducted and debriefed

## Time Estimate & Owner
- 0.5 day (SRE, Dev Rel)

## Common Pitfalls & Mitigations
- **Pitfall:** Docs go stale or missing links  
  **Mitigation:** Schedule quarterly review and ownership assignment

- **Pitfall:** On-call rotation info not updated  
  **Mitigation:** Automate with PagerDuty/Slack integration

- **Pitfall:** Dashboard URLs change  
  **Mitigation:** Use DNS CNAMEs or permanent redirects for URLs