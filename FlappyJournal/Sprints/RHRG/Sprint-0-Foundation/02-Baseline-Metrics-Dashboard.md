# 02 – Baseline Metrics Dashboard

## Goal
Seed a Grafana dashboard with live Prometheus metrics from the Holographic Reality stack so developers and SREs can monitor FPS, node count, and resource usage from the outset.

## Prerequisites
- Prometheus set up locally or in dev environment
- `prom-client` metrics endpoint exposed (e.g. port 9091)
- Grafana instance running, either local or cloud

## Step-by-Step Instructions

1. **Expose Prometheus Metrics**
   - File: `server/holograph/metrics.server.ts`
   - Ensure endpoint `/metrics` is available and exposes at least:
     - `holograph_fps`
     - `holograph_scene_node_count`
     - `holograph_gpu_memory_bytes`

2. **Configure Prometheus Scrape**
   - File: `monitoring/prometheus/prometheus.yml`
   - Example config:
     ```yaml
     - job_name: 'holograph'
       static_configs:
         - targets: ['localhost:9091']
     ```

3. **Create Grafana Dashboard**
   - File: `monitoring/grafana/holograph.json`
   - Add panels for FPS, scene node count, GPU memory.
   - Save and commit dashboard JSON.

4. **Document Dashboard Location**
   - Add link/reference to dashboard in developer README or onboarding docs.

## Verification & Acceptance Criteria
- [ ] Prometheus successfully scrapes metrics from dev instance
- [ ] Grafana dashboard visualizes all key metrics with working panels
- [ ] Dashboard JSON is version controlled in `monitoring/grafana/holograph.json`

## Time Estimate & Owner
- 0.5 day (SRE/Observability)

## Common Pitfalls & Mitigations
- **Pitfall:** Metrics endpoint not exposed in all environments  
  **Mitigation:** Add `/metrics` to all service configs and local dev setups.

- **Pitfall:** Grafana dashboard not updated after metrics changes  
  **Mitigation:** Include dashboard update in definition of done for metric PRs.

- **Pitfall:** Prometheus config not synced to all team members  
  **Mitigation:** Store config in repo and document in onboarding.