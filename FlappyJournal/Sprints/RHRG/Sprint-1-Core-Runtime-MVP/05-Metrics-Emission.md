# 05 – Metrics Emission

## Goal
Expose real-time metrics for FPS, scene node count, and WS connections via Prometheus, enabling monitoring and alerting.

## Prerequisites
- `prom-client` installed
- Metrics endpoint exposed (e.g. `server/holograph/metrics.server.ts`)
- Renderer worker and SceneNode service from previous steps

## Step-by-Step Instructions

1. **Add Prometheus Metrics**
   - File: `server/holograph/metrics.server.ts`
   ```ts
   import promClient from 'prom-client';

   export const fpsGauge = new promClient.Gauge({ name: 'holograph_fps', help: 'Current FPS' });
   export const nodeCountGauge = new promClient.Gauge({ name: 'holograph_scene_node_count', help: 'Scene node count' });
   export const wsConnectionsGauge = new promClient.Gauge({ name: 'holo_ws_connections', help: 'Open WebSocket connections' });

   // Expose /metrics
   import express from 'express';
   const app = express();
   app.get('/metrics', async (req, res) => {
     res.set('Content-Type', promClient.register.contentType);
     res.end(await promClient.register.metrics());
   });
   app.listen(9091);
   ```

2. **Emit Metrics from Worker**
   - File: `server/holograph/worker/renderer.cjs`
   ```js
   // At end of each frame:
   fpsGauge.set(currentFps);
   nodeCountGauge.set(await sceneService.getNodeCount());
   // On connect/disconnect: wsConnectionsGauge.inc()/dec()
   ```

3. **Test with Prometheus**
   - Update `monitoring/prometheus/prometheus.yml` to scrape `localhost:9091/metrics`
   - Use `curl http://localhost:9091/metrics` to verify

4. **Document Metrics**
   - Update `docs/holograph/Metrics.md` with all metric names and help strings.

## Verification & Acceptance Criteria
- [ ] All metrics available at `/metrics` endpoint
- [ ] Prometheus successfully scrapes metrics
- [ ] Dashboard panels show live data

## Time Estimate & Owner
- 0.5 day (SRE/Backend)

## Common Pitfalls & Mitigations
- **Pitfall:** Metrics endpoint not available in all environments  
  **Mitigation:** Add endpoint to all service configs and CI

- **Pitfall:** Metrics not updated (stale values)  
  **Mitigation:** Ensure emission is inside render loop and WS handlers

- **Pitfall:** Metric name collisions  
  **Mitigation:** Use unique, project-prefixed metric names