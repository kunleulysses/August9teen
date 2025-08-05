# 03 – Dashboard V2

## Goal
Upgrade Grafana dashboard to visualize new metrics (frame budget, depth, back-pressure), including histograms and alert panels.

## Prerequisites
- All metrics from previous tasks emitted to Prometheus
- Access to `monitoring/grafana/holograph.json`
- Grafana running and connected to Prometheus

## Step-by-Step Instructions

1. **Add New Panels**
   - Open `monitoring/grafana/holograph.json` in Grafana (import/edit mode)
   - Create panels for:
     - `holograph_frames_over_budget_total`
     - `holograph_scene_max_depth`
     - `holograph_scene_nodes_depth{level}`
     - Histogram: frame times (if tracked as histogram metric)

2. **Panel Examples**
   - FPS Gauge
   - Frames Over Budget Bar
   - Scene Depth Heatmap
   - Table: Top clients by rate-limit events

3. **Save and Commit Dashboard**
   - Export JSON from Grafana, overwrite `monitoring/grafana/holograph.json`
   - PR checklist: attach screenshot of updated dashboard

4. **Document Panel Purpose**
   - Update `docs/holograph/Dashboard.md` with panel descriptions

## Verification & Acceptance Criteria
- [ ] All key metrics visible in dashboard
- [ ] Panels display real-time data; alert panel is present
- [ ] Dashboard JSON in repo matches live version

## Time Estimate & Owner
- 0.5 day (SRE/Frontend)

## Common Pitfalls & Mitigations
- **Pitfall:** Dashboard not updated after metric changes  
  **Mitigation:** Make dashboard update a required PR item for metric changes

- **Pitfall:** Stale data due to Prometheus scrape issues  
  **Mitigation:** Check Prometheus targets and scrape logs after changes

- **Pitfall:** JSON export not in sync with live dashboard  
  **Mitigation:** Always export and commit after UI changes