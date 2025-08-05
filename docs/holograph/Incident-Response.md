# Incident Response Guide

## FPS Drop

1.  Check the Grafana dashboard for a drop in the `holograph_fps` metric.
2.  Check the logs for the `holograph-renderer` pods for any errors.
3.  If the issue is not immediately apparent, escalate to the on-call SRE.

## GPU OOM

1.  Check the Grafana dashboard for a spike in the `holograph_gpu_memory_bytes` metric.
2.  Check the logs for the `holograph-renderer` pods for any OOM errors.
3.  If the issue is not immediately apparent, escalate to the on-call SRE.

## WS Flood

1.  Check the Grafana dashboard for a spike in the `holo_ws_connections` metric.
2.  Check the logs for the `holograph-gateway` pods for any rate-limiting errors.
3.  If the issue is not immediately apparent, escalate to the on-call SRE.

## Contact Escalation List

- **On-call SRE:** @sre-team
- **Slack:** #holograph-incidents
- **Email:** sre@example.com