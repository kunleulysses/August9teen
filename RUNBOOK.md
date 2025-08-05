# RUNBOOK

## Service/Component Descriptions

- **holograph-gateway**: The main entry point for all API and WebSocket traffic.
- **holograph-renderer**: A worker process that renders the holographic reality.

## PagerDuty/SRE On-call Rotation Info

- **On-call:** @sre-team
- **PagerDuty:** https://example.pagerduty.com

## Dashboard URLs

- **Grafana:** https://grafana.example.com/d/holograph-baseline/holograph-baseline-metrics
- **Prometheus:** https://prometheus.example.com

## Key SLOs and Alert Meanings

- **HoloFPSDegradation**: The p95 FPS of the holographic reality is below 55.
- **RecursiveExplosion**: The scene graph depth has exceeded the safe threshold of 10.
- **FrameBudgetBreach**: The renderer is frequently exceeding its frame budget.
- **GPUOOMRisk**: The GPU memory usage is at risk of exceeding its capacity.
