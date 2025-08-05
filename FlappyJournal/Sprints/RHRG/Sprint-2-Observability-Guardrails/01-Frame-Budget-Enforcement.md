# 01 – Frame-Budget Enforcement

## Goal
Limit CPU time per render loop to 16.6ms (60 FPS), enforce back-pressure, and expose metrics for over-budget frames.

## Prerequisites
- Renderer worker skeleton from Sprint-1
- `prom-client` available for metrics
- Access to `server/holograph/worker/renderer.cjs`

## Step-by-Step Instructions

1. **Implement Frame Time Measurement**
   - In `server/holograph/worker/renderer.cjs`, wrap the frame loop:
   ```js
   const { performance } = require('perf_hooks');
   const frameBudget = 16.6; // ms

   while (running) {
     const t0 = performance.now();
     renderFrame();
     const elapsed = performance.now() - t0;
     if (elapsed > frameBudget) {
       prom.framesOverBudget.inc();
       // Activate back-pressure: drop/queue updates
       applyBackPressure();
     }
     await sleep(Math.max(0, frameBudget - elapsed));
   }
   ```

2. **Emit Over-Budget Metric**
   - Add to Prometheus metrics setup:
   ```js
   export const framesOverBudget = new promClient.Counter({
     name: 'holograph_frames_over_budget_total',
     help: 'Total frames exceeding time budget'
   });
   ```

3. **Integrate Back-Pressure**
   - In `applyBackPressure()`, throttle incoming WS messages, pause delta propagation, and notify clients.

4. **Unit/Integration Tests**
   - Simulate heavy load, assert `framesOverBudget` increments and clients are throttled.

## Verification & Acceptance Criteria
- [ ] No frame in normal load exceeds 16.6ms
- [ ] `holograph_frames_over_budget_total` increments on overload
- [ ] Back-pressure logic activates and recovers gracefully

## Time Estimate & Owner
- 0.5 day (Backend/Perf)

## Common Pitfalls & Mitigations
- **Pitfall:** All clients disconnected on single over-budget frame  
  **Mitigation:** Apply throttling per-client or per-subtree, not globally

- **Pitfall:** False positives due to GC pauses  
  **Mitigation:** Log and tag GC-induced stalls separately

- **Pitfall:** Metrics not exposed in `/metrics`  
  **Mitigation:** Add test to scrape endpoint and verify