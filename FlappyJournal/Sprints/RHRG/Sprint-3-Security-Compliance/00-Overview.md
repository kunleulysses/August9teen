# Sprint 3: Security & Compliance – Overview

## Goal
Lock down the security posture of the Holographic Reality Generation stack, covering threat modeling, runtime hardening, static analysis, and code scanning.

## Prerequisites
- Sprints 0–2 complete (metrics, CI, API/WS, observability)
- Access to `.github/workflows`, `server/api`, repo settings for secrets

## Step-by-Step Instructions
1. Complete threat model and data flow diagrams (see 01-Threat-Model.md)
2. Integrate helmet with hardened CSP for all express endpoints (see 02-Helmet-CSP.md)
3. Add Semgrep SAST to CI and establish baseline rules (see 03-Semgrep-SAST.md)
4. Enable GitHub CodeQL scanning with recommended query packs (see 04-CodeQL-Workflow.md)
5. Document all new controls and update the security section in README

## Verification & Acceptance Criteria
- [ ] All new/changed code scanned by Semgrep and CodeQL on PR
- [ ] No critical findings in baseline scan
- [ ] Threat model doc and DFD committed and reviewed by security lead
- [ ] HTTP headers and CSP confirmed in running stack

## Time Estimate & Owner
- 1 week (Security Guild, DevX)

## Common Pitfalls & Mitigations
- **Pitfall:** SAST/CodeQL false positives  
  **Mitigation:** Triage findings, suppress only with documented reason

- **Pitfall:** CSP blocks valid app features  
  **Mitigation:** Start with report-only, iterate with frontend/dev teams

- **Pitfall:** Threat model not kept up to date  
  **Mitigation:** Review at every major sprint and after architecture changes