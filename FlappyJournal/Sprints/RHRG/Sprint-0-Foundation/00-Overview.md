# Sprint 0: Foundation Overview

## Goal
Establish a secure, automated, and observable development foundation for Holographic Reality Generation. This sprint ensures all future work is built on reliable CI, baseline metrics, and security scan infrastructure.

## Prerequisites
- Node.js 20+ and npm installed
- Access to repository with write permissions
- Docker (for local and CI builds)
- GitHub Actions enabled

## Step-by-Step Instructions

1. **Review and update CI workflows.**
   - Files: `.github/workflows/test.yml`, `.github/workflows/security-and-quality.yml`
   - Ensure lint, type-check, and coverage steps are present and enforced.

2. **Implement performance benchmarking workflow.**
   - File: `bench/holograph-fps.cjs` (or create `bench/holograph-perf.cjs`)
   - Add GitHub Actions job to run this script and upload results as artifacts.

3. **Set up baseline metrics dashboard.**
   - File: `monitoring/grafana/holograph.json`
   - Expose Prometheus metrics endpoint in your dev environment.

4. **Enable Trivy and Compose health checks.**
   - File: `.github/workflows/security-and-quality.yml`
   - Add jobs for `trivy fs .` and image scanning.
   - Use `scripts/compose-health-check.sh` for health validation.

5. **Document outputs and get buy-in from all developers.**
   - PR checklist must include: CI green, lint/type-check/coverage, Trivy, compose-health, and artifact upload.

## Verification & Acceptance Criteria
- [ ] All CI pipelines pass on PR and main
- [ ] Lint, type-check, and minimum 80% test coverage enforced
- [ ] Trivy scan and compose-health jobs run in CI and block merge on failure
- [ ] Baseline performance artifact uploaded from benchmark
- [ ] Grafana dashboard seeded and renders local metrics

## Time Estimate & Owner
- 2 days (DevX/Platform team)

## Common Pitfalls & Mitigations
- **Pitfall:** CI flakes due to missing Docker or misconfigured node versions  
  **Mitigation:** Use `actions/setup-node@v4` and `docker/setup-buildx-action@v3` in workflows.

- **Pitfall:** Security jobs run but do not fail CI on HIGH/CRITICAL  
  **Mitigation:** Verify `--exit-code 1` is set on Trivy steps, and that job dependencies are correct.

- **Pitfall:** Grafana dashboard not updated after metrics changes  
  **Mitigation:** Add a checklist item to update `holograph.json` on metric changes.

- **Pitfall:** Performance benchmark is not run on a GPU-enabled runner  
  **Mitigation:** Tag workflow with `runs-on: [self-hosted, gpu]` if available.