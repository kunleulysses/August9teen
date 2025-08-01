# Spiral Memory Live Metrics

## Metrics API

A Prometheus-compatible endpoint is now available for live spiral memory metrics.

**Endpoint:**  
`GET http://localhost:9099/metrics`

Sample output:
```
# HELP spiral_memory_total Total spiral memories by tier
# TYPE spiral_memory_total gauge
spiral_memory_total{tier="active"} 123
spiral_memory_total{tier="warm"} 45
...
# HELP spiral_gc_total Total GC runs
# TYPE spiral_gc_total counter
spiral_gc_total 10
...
```

## Grafana Dashboard

Import `monitoring/grafana/spiral-dashboard.json` into your Grafana instance.

![dashboard placeholder](dashboard-screenshot-placeholder.png)

## Operations

- To run metrics server:  
  `npm run spiral:serve`

- To test:  
  `curl http://localhost:9099/metrics`

- See audit/README.md for more, including operations guide.

---