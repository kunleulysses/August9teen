# Sigil DNA Production Runbook

## Required environment

```
JWT_ISSUER=...
JWT_AUDIENCE=sigil-dna
JWT_JWKS_URI=...
SPIRAL_EVENT_SECRET=<32-byte hex>
DEFAULT_TENANT=public
SIGIL_RATE_LIMIT=200
SIGIL_RATE_WINDOW=10
REDIS_URL=redis://... # optional
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB  # HA storage
```

## Health endpoints
- API router: GET /health (200 OK)
- Container health (alt): GET /healthz

## Start locally
```
export JWT_ISSUER=... JWT_AUDIENCE=sigil-dna JWT_JWKS_URI=... SPIRAL_EVENT_SECRET=devsecret DEFAULT_TENANT=public
npm run start
curl -sf http://localhost:3000/health
```

## k6 soak
Use workflow Nightly Soak or run locally with SIGIL_TOKEN.

## Dashboards
Import Grafana dashboard `monitoring/grafana/sigil_dashboard_v2.json`.

## Troubleshooting
- 401: verify JWT envs and token audience/issuer
- 429: adjust SIGIL_RATE_LIMIT/SIGIL_RATE_WINDOW or set REDIS_URL for horizontal scale
- Storage issues: ensure `SIGIL_DB_PATH` writable; for HA, migrate to PostgresStore or DNAStore

# 📚 Sigil-DNA Operations Runbook

## 🚀 Quick Start

### Prerequisites
- Node.js ≥18.0.0
- Docker (optional)
- kubectl (for k8s deployments)

### Local Development
```bash
git clone <repo>
cd FlappyJournal
npm install
npm run build:eventsign
npm start
```

## 🔧 Deployment

### Environment Variables
```bash
# Core Configuration
SIGIL_DB_PATH=./sigil-leveldb
SIGIL_PORT=3000
NODE_ENV=production

# Authentication
JWT_ISSUER=https://auth.example.com/
JWT_AUDIENCE=sigil-dna
JWT_JWKS_URI=https://auth.example.com/.well-known/jwks.json

# Rate Limiting
SIGIL_RATE_LIMIT=200
SIGIL_RATE_WINDOW=10
REDIS_URL=redis://localhost:6379

# Security
SPIRAL_EVENT_SECRET=<32-byte-hex>
DNASTORE_URL=https://dnastore.example.com
```

### Docker Deployment
```bash
docker build -t sigil-dna:latest .
docker run -p 3000:3000 \
  -v sigil-data:/var/lib/sigil-leveldb \
  -e SIGIL_DB_PATH=/var/lib/sigil-leveldb \
  sigil-dna:latest
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sigil-dna
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sigil-dna
  template:
    spec:
      containers:
      - name: sigil-dna
        image: sigil-dna:latest
        ports:
        - containerPort: 3000
        env:
        - name: SIGIL_DB_PATH
          value: /var/lib/sigil-leveldb
        volumeMounts:
        - name: sigil-data
          mountPath: /var/lib/sigil-leveldb
      volumes:
      - name: sigil-data
        persistentVolumeClaim:
          claimName: sigil-data-pvc
```

## 🔍 Monitoring & Alerting

### Health Checks
- **Liveness**: `GET /healthz`
- **Readiness**: `GET /readyz`
- **Metrics**: `GET /metrics`

### Key Metrics
- `sigil_encode_total` - Total sigil creations
- `sigil_encode_duration_seconds` - Encode latency
- `sigil_error_total` - Error count
- `http_requests_total` - HTTP request count

### Critical Alerts
- **High Error Rate**: >1% error rate for 5 minutes
- **High Latency**: P95 >1s for 10 minutes
- **Disk Full**: <10% disk space remaining
- **Memory Usage**: >80% memory usage

## 🚨 Troubleshooting

### Service Won't Start
```bash
# Check logs
docker logs <container-id>

# Common issues:
# 1. Port already in use
netstat -tulpn | grep 3000

# 2. Database locked
rm -f ./sigil-leveldb/LOCK

# 3. Missing environment variables
env | grep SIGIL
```

### High Error Rate
```bash
# Check error logs
grep '"level":50' logs/app.log

# Common causes:
# 1. Database connection issues
# 2. Invalid JWT tokens
# 3. Rate limiting triggered
# 4. Schema validation failures
```

### Performance Issues
```bash
# Check metrics
curl http://localhost:3000/metrics | grep sigil

# Monitor resource usage
top -p $(pgrep -f sigil-dna)

# Check database performance
du -sh ./sigil-leveldb/
```

## 🔄 Maintenance

### Secret Rotation
```bash
# Rotate HMAC secret
./scripts/rotate-spiral-secret.sh

# Verify rotation
./scripts/rotate-spiral-secret.sh --verify-only
```

### Database Maintenance
```bash
# Backup database
tar czf sigil-backup-$(date +%Y%m%d).tgz ./sigil-leveldb/

# Integrity check
./scripts/nightly-integrity-check.sh

# Migration from JSON
./scripts/migrate-json-to-leveldb.cjs --dry-run
./scripts/migrate-json-to-leveldb.cjs
```

### Cleanup
```bash
# Remove duplicate files
./scripts/cleanup-duplicates.sh --execute

# Chaos testing
./scripts/chaos-harness.sh
```

## 📞 Escalation

### On-Call Contacts
- **Primary**: SRE Team (#sre-alerts)
- **Secondary**: Engineering Team (#sigil-dev)
- **Emergency**: PagerDuty escalation

### Incident Response
1. **Acknowledge** alert in PagerDuty
2. **Assess** impact using Grafana dashboards
3. **Mitigate** using runbook procedures
4. **Escalate** if unable to resolve in 30 minutes
5. **Document** incident in post-mortem

## 🔐 Security

### Access Control
- All API endpoints require JWT authentication
- Rate limiting: 200 requests/10 seconds per user
- TLS required for all external communications

### Compliance
- HMAC signatures on all sigil operations
- Tenant isolation in all storage operations
- Audit logging for all security events
- Regular security scans with OWASP ZAP

## 📊 Performance Baselines

### Expected Performance
- **Encode Latency**: P95 <500ms, P99 <1s
- **Verify Latency**: P95 <100ms, P99 <200ms
- **Throughput**: 1000 RPS sustained
- **Error Rate**: <0.1% under normal load

### Capacity Planning
- **Memory**: ~100MB base + 1KB per sigil
- **Disk**: ~1KB per sigil + indexes
- **CPU**: 1 core per 500 RPS