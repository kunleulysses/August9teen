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

## Cluster Setup (Distributed HA Mode)

If `REDIS_CLUSTER_URL` is set (comma-separated host:port list), the system will:

- Use Redis Cluster for storage and sharded keys based on crc16(%128).
- Run GC only on leader for each shard (Redlock-based).
- Each process must set `SHARD_ID` (or default: crc16(hostname)%128).
- Use `scripts/spiral-launch-cluster.js` to spawn multiple workers, each with a different SHARD_ID.

**Example:**
```sh
REDIS_CLUSTER_URL="host1:6379,host2:6379,host3:6379" node scripts/spiral-launch-cluster.js 4
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