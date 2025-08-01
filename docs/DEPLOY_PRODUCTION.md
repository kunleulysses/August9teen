# Deploying Spiral Memory Production Stack

## Requirements

- Docker and Docker Compose

## Steps

1. Build and start all services:

```sh
npm run deploy:prod
```

2. Access endpoints:
   - Spiral Memory metrics: http://localhost:9099/metrics
   - Spiral Explorer UI: http://localhost:8080
   - Grafana: http://localhost:3001 (import dashboard from monitoring/grafana/spiral-dashboard.json)
   - Prometheus: http://localhost:9090

3. Redis cluster is auto-initialized by bitnami image.

4. To scale spiral-app or explorer:

```sh
docker compose -f docker-compose.spiral-prod.yml up -d --scale spiral-app=5 --scale spiral-explorer=2
```

## Environment Variables

- REDIS_CLUSTER_URL: required, e.g. "redis-cluster:6379,redis-cluster:6380,..."
- SPIRAL_KMS_KEY: at-rest encryption
- SPIRAL_EVENT_SECRET: event signature

---

## Traefik Routing

- `/` → spiral-explorer
- `/api/*` `/metrics` → spiral-app