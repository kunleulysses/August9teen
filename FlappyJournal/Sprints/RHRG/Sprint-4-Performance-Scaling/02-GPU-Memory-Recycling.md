# 02 – GPU Memory Recycling

## Goal
Track, limit, and recycle GPU memory in the render worker to prevent leaks and crashes.

## Prerequisites
- headless-gl and three.js benchmark in place
- Access to `server/holograph/worker/renderer.cjs`
- Prometheus metric emission

## Step-by-Step Instructions

1. **Track Allocations**
   - In `renderer.cjs`, wrap all texture/buffer allocations:
     ```js
     let gpuMemBytes = 0;
     function allocateTexture(params) {
       // ... actual allocation ...
       gpuMemBytes += params.size;
       // Store reference for later GC
     }
     ```

2. **Implement Recycling/GC**
   - On scene changes or frame budget breach, free unused resources:
     ```js
     function recycleUnused() {
       // ... free old textures, decrement gpuMemBytes ...
     }
     ```

3. **Emit GPU Memory Metric**
   - Prometheus gauge:
     ```js
     promClient.Gauge({ name: 'holograph_gpu_memory_bytes', help: 'GPU memory usage in bytes' });
     ```

4. **Set Alert Threshold**
   - Alert if `holograph_gpu_memory_bytes > 0.9 * GPU_MAX_MEM` (see alerting rules).

5. **Test with Large Scene**
   - Load test with increasing scene size, verify recycling and metric.

## Verification & Acceptance Criteria
- [ ] GPU memory gauge reflects real usage
- [ ] No OOM crash under heavy load, memory freed on scene unload
- [ ] Alert fires if usage exceeds 90% of GPU node capacity

## Time Estimate & Owner
- 0.5 day (Backend/Perf)

## Common Pitfalls & Mitigations
- **Pitfall:** Memory not freed on scene unload  
  **Mitigation:** Add explicit GC step and test with scene reloads

- **Pitfall:** Metric not updated on allocation/free  
  **Mitigation:** Emit metric after every alloc/free

- **Pitfall:** OOM errors not handled  
  **Mitigation:** Catch and log, trigger emergency GC