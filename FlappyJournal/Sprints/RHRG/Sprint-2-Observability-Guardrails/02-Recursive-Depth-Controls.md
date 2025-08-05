# 02 – Recursive Depth Controls

## Goal
Enforce and measure maximum recursion depth in scene graph, preventing runaway resource usage and making system health observable.

## Prerequisites
- SceneNode schema with parentId
- Renderer worker and sceneNode service
- Metrics emission to Prometheus
- Access to `server/holograph/scene/` and worker code

## Step-by-Step Instructions

1. **Add Depth Calculation Utility**
   - File: `server/holograph/scene/sceneNodeService.ts`
   ```ts
   export function getSceneMaxDepth(nodes: SceneNode[]): number {
     // BFS/DFS to compute max depth efficiently
     // ...
   }
   ```

2. **Enforce Max Depth in API**
   - In all SceneNode mutation endpoints (e.g. `server/api/modules/holograph`), check depth before insertion:
   ```ts
   if (proposedDepth > MAX_DEPTH) {
     throw new Error('Scene graph depth limit exceeded');
   }
   ```

3. **Emit Depth Metrics**
   - Prometheus gauges:
     - `holograph_scene_max_depth`
     - `holograph_scene_nodes_depth{level}`

   Example:
   ```js
   promClient.Gauge({ name: 'holograph_scene_max_depth', help: 'Deepest scene graph' });
   promClient.Gauge({ name: 'holograph_scene_nodes_depth', labelNames: ['level'], help: 'Node count by depth' });
   ```

4. **Alert on Excessive Depth**
   - See Alerting-Rules for example Prometheus rule.

5. **Test**
   - Insert deeply nested nodes, ensure limit is enforced and metrics reflect current state.

## Verification & Acceptance Criteria
- [ ] All scene mutations capped at MAX_DEPTH (default: 10)
- [ ] Metrics for depth are exposed and accurate
- [ ] Alerts fire if depth exceeds threshold

## Time Estimate & Owner
- 0.5 day (Backend/SRE)

## Common Pitfalls & Mitigations
- **Pitfall:** Depth check missed in some mutation paths  
  **Mitigation:** Centralize check in service layer, unit test all entry points

- **Pitfall:** Metric not updated on deletion  
  **Mitigation:** Emit metric on all add/remove/update

- **Pitfall:** Alert not firing when depth exceeded  
  **Mitigation:** Test by forcibly inserting deep trees in staging