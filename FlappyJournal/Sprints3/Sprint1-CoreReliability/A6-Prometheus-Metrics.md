# A6: Prometheus Metrics Server

**Goal:**  
Expose operational metrics for encode/verify/error counts.

## Background
- No metrics or instrumentation.
- No /metrics endpoint.

## Tasks
- [ ] Add prom-client.
- [ ] Export counters/histograms.
- [ ] Secure /metrics endpoint.

## Acceptance Criteria
- Metrics scrapeable by Prometheus.
- Grafana dashboard displays live stats.

## Risks
- Metrics overhead.
- Unsecured endpoint DDoS.

## Blockers
- None identified.