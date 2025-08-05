# 01 – Benchmark Upgrade: headless-gl

## Goal
Upgrade performance benchmarks to use `headless-gl` and `three.js` for realistic GPU simulation, and automate these in CI.

## Prerequisites
- Node 20+, working on GPU-enabled dev environment
- `headless-gl`, `three`, and `canvas` npm packages installed
- Access to `bench/holograph-perf.cjs`, `.github/workflows/perf-bench-holograph.yml`

## Step-by-Step Instructions

1. **Install Dependencies**
   ```sh
   npm install headless-gl three canvas
   ```

2. **Update Benchmark Script**
   - File: `bench/holograph-perf.cjs`
   - Example:
     ```js
     const { createGLContext } = require('headless-gl');
     const THREE = require('three');
     const gl = createGLContext(800, 600);

     const renderer = new THREE.WebGLRenderer({ context: gl });
     // ... create scene, camera, mesh ...
     ```

3. **Integrate with CI Workflow**
   - File: `.github/workflows/perf-bench-holograph.yml`
   - Add steps:
     ```yaml
     - name: Run GPU perf bench
       run: node bench/holograph-perf.cjs --duration=10000 --json=bench-result.json
     - name: Upload perf artifact
       uses: actions/upload-artifact@v4
       with:
         name: holograph-bench
         path: bench-result.json
     ```

4. **Set Regression Gate**
   - Fail PR if FPS drops >10% from baseline, using PR comment bot or script.

## Verification & Acceptance Criteria
- [ ] Benchmarks run and output FPS, frame time, GPU mem to `bench-result.json`
- [ ] Workflow passes on GPU runner, fails on regression
- [ ] Results tracked as artifact for historical comparison

## Time Estimate & Owner
- 0.5 day (Perf Squad)

## Common Pitfalls & Mitigations
- **Pitfall:** headless-gl fails to load or crashes  
  **Mitigation:** Use compatible Node version, check dependencies

- **Pitfall:** Benchmark not scheduled in CI  
  **Mitigation:** Add nightly schedule in workflow yaml

- **Pitfall:** Inconsistent results due to hardware  
  **Mitigation:** Label runners, standardize on test hardware