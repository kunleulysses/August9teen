# 01 – Perf-Bench Workflow

## Goal
Automate and validate the baseline performance (FPS, frame time, resource usage) of the Holographic Reality engine in CI, with results tracked in artifacts for future regression detection.

## Prerequisites
- Working `bench/holograph-fps.cjs` or enhanced `bench/holograph-perf.cjs` in `bench/`
- Node.js 20+ and npm
- Access to GitHub Actions or self-hosted runner with GPU for full test

## Step-by-Step Instructions

1. **Create/Verify Benchmark Script**
   - Ensure `bench/holograph-perf.cjs` runs a complete render loop and outputs FPS and frame times.
   - Example command:
     ```sh
     node bench/holograph-perf.cjs --duration=5000 --json=bench-result.json
     ```

2. **Add CI Workflow Step**
   - File: `.github/workflows/perf-bench-holograph.yml`
   - Add steps to checkout, install deps, run the benchmark, and upload `bench-result.json` as artifact.
   - Example step:
     ```yaml
     - name: Run Holograph perf bench
       run: node bench/holograph-perf.cjs --duration=5000 --json=bench-result.json
     - name: Upload perf artifact
       uses: actions/upload-artifact@v4
       with:
         name: holograph-bench
         path: bench-result.json
     ```

3. **Integrate result into PR checks**
   - Make workflow required in branch protection for main.

4. **(Optional) Add PR comment bot**
   - Use a script or GitHub Action to compare the latest result to previous runs and comment on regressions.

## Verification & Acceptance Criteria
- [ ] `bench-result.json` artifact uploaded on every PR and commit to main
- [ ] PR fails if FPS regresses by >10% compared to baseline (optional)
- [ ] Results are human-readable and include FPS, frame time stats, memory

## Time Estimate & Owner
- 0.5 day (Perf Squad or DevX)

## Common Pitfalls & Mitigations
- **Pitfall:** Benchmark not run on GPU hardware, giving false results  
  **Mitigation:** Use `runs-on: [self-hosted, gpu]` label in workflow.

- **Pitfall:** Output file not uploaded or named inconsistently  
  **Mitigation:** Standardize on `bench-result.json` and document artifact name in workflow.

- **Pitfall:** No baseline for regression comparison  
  **Mitigation:** Store baseline result as artifact or in S3 for comparison.