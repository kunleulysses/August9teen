# Coinbase x Featherweight Autopilot — 30‑Day Pilot Kickoff

## Objectives
- 2–3× deploy frequency on 1 service
- MTTR −40%
- CFR ≤10%
- ≥12 approved Autopilot PRs
- 1 rollback drill with signed receipts

## Architecture Overview
- Read‑only by default → policy‑gated canary writes
- DRY_RUN + SANDBOX_VERIFY + approvals + rate caps
- Signed receipts; rollback on regression; kill switch

## Safety & Controls
- DRY_RUN=1; REQUIRE_APPROVAL=1; CANARY_APPLY_RATE=1000; CANARY_MAX_APPLIES_PER_DAY=1
- Canary namespace + least‑privilege SA/RBAC
- Secret denylist; CODEOWNERS enforcement; required CI checks

## Policy Model
- Allow: services/<TARGET_SERVICE>/**, helm/<TARGET_SERVICE>/values‑canary.yaml, k8s/<TARGET_SERVICE>/manifests/canary/**, terraform/<SAFE_MODULE>/**
- Deny: secrets/**, prod‑only/**, *.pem, *.key; secret regex denylist
- Required checks: unit_tests, lint, terraform_plan_no_destroy, kubeconform_canary, smoke_test_canary

## Canary Plan
- Namespace: autopilot‑canary; SA: autopilot‑sa
- Signals: http_5xx_spike, slo_breach, error_budget_burn, custom_regression_file
- Daily cap: 1 apply/day; rollback receipts

## Scope
- 2 repos + 1 service + 1 Terraform module
- GitHub (read), CI logs (read), K8s (read + canary write)

## Integration Plan (Minimal Lift)
- SSO/JWKS; service accounts; CODEOWNERS
- Metrics to existing Datadog/Prom/Grafana

## KPIs & Proof
- DORA (deploy freq, lead time, MTTR, CFR)
- Autopilot (PRs generated/approved/applied, rollbacks, approval latency)
- Evidence mapped to SOX change controls

## Timeline (4 Weeks)
- W1: Connect, policies, DRY_RUN PRs, dashboards, rollback drill (staging)
- W2: Approve low‑blast PRs to canary; verify receipts
- W3: Add Terraform module; incident simulation
- W4: Increase cadence; exec readout; expansion plan

## RACI
- Economic: VP Platform Eng / VP Eng
- Technical: Head of SRE, Platform/DevProd Leads
- Security/GRC: AppSec Director, GRC Lead

## Risks & Mitigations
- Blast radius (canary ns + rate caps)
- CFR (required checks + instant rollback)
- SoD (CODEOWNERS + approvals)

## Next Steps
- Confirm service/repos/ns; approve policy pack v1
- Schedule rollback drill; align SLOs and dashboards
- Kickoff calendar + Slack bridge
