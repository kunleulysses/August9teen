# 03 – CI Hardening & Security Scans

## Goal
Ensure continuous integration blocks insecure code, enforces coverage, and validates all containers and configs before merge.

## Prerequisites
- Access to `.github/workflows/test.yml` and `.github/workflows/security-and-quality.yml`
- Trivy, Gitleaks, Semgrep, and CodeQL jobs enabled in CI

## Step-by-Step Instructions

1. **Verify Security Scans**
   - Ensure `trivy_scan`, `compose_health`, and `gitleaks` jobs exist in `.github/workflows/security-and-quality.yml`.
   - Example Trivy step:
     ```yaml
     - name: Trivy FS scan
       run: trivy fs --exit-code 1 --severity HIGH,CRITICAL .
     ```

2. **Add/Update Compose Health Job**
   - Ensure `compose_health` runs `scripts/compose-health-check.sh` for all compose files.

3. **Enforce Coverage and Lint**
   - File: `.github/workflows/test.yml`
   - Lint (`npm run lint`), type-check (`npm run type-check`), and coverage (`jest --coverage`) must all block PRs on failure.

4. **Review and Commit CI Configs**
   - PR checklist should include: all CI jobs green, security scans pass, coverage met.

## Verification & Acceptance Criteria
- [ ] PRs blocked on any HIGH/CRITICAL vulnerability or failed compose health
- [ ] All containers built and scanned before merge
- [ ] Coverage, lint, and type-check enforced in all environments

## Time Estimate & Owner
- 0.5 day (Security Guild, DevX)

## Common Pitfalls & Mitigations
- **Pitfall:** Security scan jobs marked as “continue-on-error”  
  **Mitigation:** Remove `continue-on-error: true` for Trivy and Gitleaks jobs.

- **Pitfall:** Compose health script not executable  
  **Mitigation:** `chmod +x scripts/compose-health-check.sh` in CI step.

- **Pitfall:** False positives in security scans  
  **Mitigation:** Use Trivy ignore file and Semgrep suppressions for known, documented cases only.