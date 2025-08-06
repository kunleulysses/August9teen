# C-4: Grafana Dashboard v2 + NodeGraph (Live Bonds)

## Objective & Success Criteria
**Objective:**  
Upgrade dashboard to visualize live resonance topology using NodeGraph, showing node/connection status and bonds.

**Success Criteria:**  
- NodeGraph displays real-time network.
- Bonds/connections update live.
- Drill-down into node/bond metrics.

## Prerequisites / Dependencies
- Grafana >= 8.0 with NodeGraph.
- Prometheus `/metrics` or API for topology data.

## Architectural Context
- Dashboard JSON: `monitoring/ResonanceDashboard_v2.json`

## Step-by-Step Implementation Plan

1. **Aggregate Topology Data**
   - Expose current node/connection state via Prometheus or API.

2. **Configure NodeGraph in Grafana**
   - Add NodeGraph panel, map nodes/edges to data.

3. **Enable Live Updates**
   - Use WS or polling for updates.

4. **Panel Drill-down**
   - Add detail popups for node/bond.

5. **Export and Commit**
   - Export JSON, commit to repo.

## Observability Hooks
- NodeGraph panel
- Custom metrics

## Security or Performance Considerations
- Restrict access to dashboard.

## Validation / Acceptance Checklist
- [ ] NodeGraph shows live topology
- [ ] Bonds update live
- [ ] Details visible for each node/bond

## Rollback / Cleanup Notes
- Revert to Dashboard v1.