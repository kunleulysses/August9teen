# 04 – Renderer Worker Skeleton

## Goal
Implement a basic renderer worker that subscribes to scene updates and runs a frame loop, preparing for GPU integration.

## Prerequisites
- `isolated-vm` and `ws` installed
- Local Redis and PostgreSQL
- SceneNode service from previous step

## Step-by-Step Instructions

1. **Create Renderer Worker Module**
   - File: `server/holograph/worker/renderer.cjs`
   ```js
   const ivm = require('isolated-vm');
   const Redis = require('ioredis');
   const redis = new Redis();

   async function main() {
     redis.subscribe('scene:delta');
     redis.on('message', (channel, msg) => {
       // TODO: apply delta to local scene graph
     });

     while (true) {
       const t0 = Date.now();
       // TODO: renderFrame()
       const elapsed = Date.now() - t0;
       // Emit metrics (see next step)
       await new Promise(r => setTimeout(r, Math.max(0, 16 - elapsed)));
     }
   }
   main();
   ```

2. **Wire to SceneNode Service**
   - Use the CRUD service to apply deltas from Redis.

3. **Link Worker to Main App**
   - File: `server/api/index.ts`
   - Spawn the worker as a child process or thread.

4. **Write Unit Test for Worker Launch**
   - File: `__tests__/holograph/worker/renderer.test.cjs`

## Verification & Acceptance Criteria
- [ ] Worker starts and subscribes to scene:delta
- [ ] Frame loop runs at ~60 FPS (16 ms per iter)
- [ ] Unit test covers launch and message handling

## Time Estimate & Owner
- 0.5 day (Backend/Perf)

## Common Pitfalls & Mitigations
- **Pitfall:** Worker does not exit cleanly  
  **Mitigation:** Handle signals and use a shutdown hook

- **Pitfall:** Missed deltas due to Redis lag  
  **Mitigation:** Log missed messages and test under load

- **Pitfall:** Render loop blocks event loop  
  **Mitigation:** Use `setTimeout`/`setImmediate` to yield