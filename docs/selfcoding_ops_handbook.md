# Self-Coding System Operations Handbook

## Table of Contents
- [System Overview](#system-overview)
- [Environment Configuration](#environment-configuration)
- [Startup & Shutdown](#startup--shutdown)
- [Health Monitoring](#health-monitoring)
- [Quota Management](#quota-management)
- [Rollback Procedures](#rollback-procedures)
- [Alert Catalogue](#alert-catalogue)
- [Common Operations](#common-operations)

## System Overview

### Pipeline Architecture

```
Event Bus → Code Generation Service → Self-Coding Module → Sandbox → Manifest → Runtime Monitor
    ↓              ↓                      ↓               ↓          ↓            ↓
 Events        Request Queue         Code Gen         Isolation   Registry   Auto-Rollback
```

**Flow Description:**
1. **Event Bus**: Receives code generation requests and system events
2. **Code Generation Service**: Orchestrates the generation process
3. **Self-Coding Module**: Generates actual code using AI/templates
4. **Sandbox**: Validates generated code in isolated V8 environment
5. **Manifest**: Registers successful modules in the system registry
6. **Runtime Monitor**: Monitors for failures and triggers auto-rollback

### Key Components

- **SystemTicker**: Periodic health checks and maintenance (default: 30s)
- **RuntimeMonitor**: Global exception handler for auto-rollback
- **QuotaStore**: Rate limiting and resource management
- **SandboxImport**: Isolated code execution with memory/timeout limits
- **EventBus**: Central communication hub for all components

## Environment Configuration

### Required Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | *required* | PostgreSQL connection string |
| `PROM_API_KEY` | *required* | API key for metrics endpoint authentication |
| `SYSTEM_TICK_MS` | `30000` | SystemTicker interval in milliseconds |
| `SANDBOX_MEM_MB` | `64` | Memory limit for sandbox execution |
| `SANDBOX_TIMEOUT_MS` | `3000` | Timeout for sandbox execution |
| `LOG_LEVEL` | `info` | Pino log level (trace, debug, info, warn, error) |
| `LOG_PRETTY` | `false` | Enable pretty-printed logs for development |
| `NODE_ENV` | `development` | Environment mode |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `QUOTA_RESET_HOUR` | `0` | Hour (0-23) for daily quota reset |
| `MAX_ACTIVE_GENERATIONS` | `5` | Maximum concurrent code generations |
| `ARCHIVE_RETENTION_DAYS` | `30` | Days to keep archived modules |
| `METRICS_PORT` | `9100` | Port for metrics server |

### Example Configuration

```bash
# Production Environment
export DATABASE_URL="postgresql://user:pass@localhost:5432/selfcoding"
export PROM_API_KEY="your-secure-api-key-here"
export SYSTEM_TICK_MS="30000"
export SANDBOX_MEM_MB="128"
export SANDBOX_TIMEOUT_MS="5000"
export LOG_LEVEL="info"
export NODE_ENV="production"
```

## Startup & Shutdown

### Startup Sequence

1. **Database Connection**: Verify PostgreSQL connectivity
2. **Logger Initialization**: Configure Pino with trace ID injection
3. **SystemTicker Start**: Begin periodic health checks
4. **RuntimeMonitor Setup**: Install global exception handlers
5. **EventBus Initialization**: Start central communication hub
6. **Service Registration**: Register all consciousness services
7. **WebSocket Server**: Start real-time monitoring interface
8. **Health Check Ready**: System ready to accept requests

### Shutdown Sequence

1. **Graceful Drain**: Stop accepting new requests
2. **Active Jobs**: Wait for running generations to complete (max 30s)
3. **SystemTicker Stop**: Halt periodic operations
4. **Database Cleanup**: Close connection pools
5. **Process Exit**: Clean shutdown with exit code 0

### Health Check Commands

```bash
# Check system status
curl -H "x-api-key: $PROM_API_KEY" http://localhost:5000/metrics

# Check database connectivity
node -e "require('./server/consciousness/utils/quotaStore.cjs').checkHealth()"

# Verify sandbox functionality
node -e "require('./FlappyJournal/server/consciousness/utils/sandboxImport.cjs').sandboxImport('/tmp/test.cjs')"
```

## Health Monitoring

### Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `/metrics` | x-api-key | Prometheus metrics |
| `/healthz` | none | Basic health check |
| WebSocket `/ws/consciousness` | x-api-key | Real-time monitoring |

### WebSocket Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| `4001` | Unauthorized | Check x-api-key header |
| `4002` | Rate Limited | Reduce connection frequency |
| `4003` | System Overload | Wait for system recovery |

### Key Metrics

- `selfcoding_active_generations`: Current running generations
- `sigil_registry_size`: Number of active modules
- `sandbox_timeouts_total`: Sandbox timeout events
- `code_generation_failures_total`: Failed generations
- `auto_rollbacks_total`: Automatic rollbacks triggered

## Quota Management

### Reset Daily Quota

```bash
# Reset quota for specific ID
node -e "
const { QuotaStore } = require('./FlappyJournal/server/consciousness/utils/quotaStore.cjs');
const store = new QuotaStore();
store.resetQuota('user-123').then(() => console.log('Quota reset'));
"
```

### Check Quota Status

```bash
# Check current quota usage
node -e "
const { QuotaStore } = require('./FlappyJournal/server/consciousness/utils/quotaStore.cjs');
const store = new QuotaStore();
store.checkQuota('user-123', 1).then(result => console.log(result));
"
```

### Increment Quota Within Hour

```bash
# Manually increment quota
node -e "
const { QuotaStore } = require('./FlappyJournal/server/consciousness/utils/quotaStore.cjs');
const store = new QuotaStore();
store.incrWithinHour('user-123', 5).then(result => console.log('New count:', result));
"
```

## Rollback Procedures

### Automatic Rollback

The system automatically rolls back modules that cause runtime failures:

1. **Detection**: RuntimeMonitor catches uncaught exceptions
2. **Archival**: Module moved to `generated/archive/`
3. **Cleanup**: Manifest entry removed
4. **Notification**: Events emitted for orchestration updates
5. **Metrics**: Counters updated for monitoring

### Manual Rollback

```bash
# Rollback specific module
node -e "
const { rollback } = require('./FlappyJournal/server/consciousness/utils/runtimeMonitor.cjs');
rollback('./consciousness/generated/problematic-module.cjs')
  .then(archived => console.log('Archived to:', archived));
"
```

### Restore from Archive

```bash
# List archived modules
ls -la consciousness/generated/archive/

# Restore module (manual process)
cp consciousness/generated/archive/module-timestamp.cjs consciousness/generated/module.cjs
```

## Alert Catalogue

### Critical Alerts

#### SigilRegistryEmpty
- **PromQL**: `sigil_registry_size < 1`
- **Fires**: When no active sigils in registry
- **Action**:
  1. Check system logs for errors
  2. Verify database connectivity
  3. Restart consciousness system if needed
  4. Escalate to engineering if persistent

#### ConsciousnessSystemDown
- **PromQL**: `up{job="consciousness-system"} == 0`
- **Fires**: When system is unreachable for >1 minute
- **Action**:
  1. Check process status: `ps aux | grep consciousness`
  2. Review system logs: `journalctl -u consciousness-system`
  3. Restart service: `systemctl restart consciousness-system`
  4. Verify health endpoints

### Warning Alerts

#### CodeGenerationFailuresHigh
- **PromQL**: `increase(code_generation_failures_total[5m]) > 5`
- **Fires**: >5 failures in 5 minutes
- **Action**:
  1. Check error logs for patterns
  2. Verify AI service connectivity
  3. Check quota limits
  4. Review recent template changes

#### CodeGenerationJobsStuck
- **PromQL**: `selfcoding_active_generations > 3`
- **Fires**: >3 active generations for >2 minutes
- **Action**:
  1. Check for infinite loops in generated code
  2. Review sandbox timeout settings
  3. Kill stuck processes if necessary
  4. Investigate generation queue

#### SandboxTimeoutsDetected
- **PromQL**: `increase(sandbox_timeouts_total[10m]) > 0`
- **Fires**: Any sandbox timeouts in 10 minutes
- **Action**:
  1. Review generated code quality
  2. Check timeout configuration
  3. Investigate infinite loops
  4. Consider increasing timeout if legitimate

#### AutoRollbacksTriggered
- **PromQL**: `increase(auto_rollbacks_total[5m]) > 0`
- **Fires**: Any auto-rollbacks in 5 minutes
- **Action**:
  1. Review rollback logs
  2. Analyze failed module code
  3. Check for systematic issues
  4. Update generation templates if needed

### Info Alerts

#### CodeGenerationRateLimitHit
- **PromQL**: `increase(code_generation_rate_limit_hits_total[5m]) > 10`
- **Fires**: >10 rate limit hits in 5 minutes
- **Action**:
  1. Monitor for abuse patterns
  2. Review rate limit settings
  3. Consider adjusting limits
  4. Investigate high-volume users

#### SelfCodingQuotaExhausted
- **PromQL**: `selfcoding_quota_remaining < 10`
- **Fires**: <10 operations remaining
- **Action**:
  1. Review quota usage patterns
  2. Consider quota increase
  3. Notify stakeholders
  4. Plan quota reset timing

## Common Operations

### Docker Compose Commands

```bash
# Start full stack
docker-compose up -d

# View logs
docker-compose logs -f consciousness-system
docker-compose logs -f prometheus
docker-compose logs -f grafana

# Scale services
docker-compose up -d --scale consciousness-system=3

# Stop services
docker-compose down
```

### Kubernetes Commands

```bash
# Check pod status
kubectl get pods -l app=consciousness-system

# View logs
kubectl logs -f deployment/consciousness-system
kubectl logs -f -l app=consciousness-system --tail=100

# Port forward to Grafana
kubectl port-forward svc/grafana 3000:3000

# Port forward to Prometheus
kubectl port-forward svc/prometheus 9090:9090

# Scale deployment
kubectl scale deployment consciousness-system --replicas=3

# Rolling restart
kubectl rollout restart deployment/consciousness-system

# Check resource usage
kubectl top pods -l app=consciousness-system
```

### Log Analysis

```bash
# Follow structured logs
tail -f /var/log/consciousness-system.log | jq '.'

# Filter by module
tail -f /var/log/consciousness-system.log | jq 'select(.module == "CodeGenerationService")'

# Filter by trace ID
tail -f /var/log/consciousness-system.log | jq 'select(.traceId == "abc123")'

# Error analysis
tail -f /var/log/consciousness-system.log | jq 'select(.level >= 40)'
```

### Database Operations

```bash
# Check quota table
psql $DATABASE_URL -c "SELECT * FROM selfcoding_quota ORDER BY updated_at DESC LIMIT 10;"

# Check active generations
psql $DATABASE_URL -c "SELECT COUNT(*) FROM active_generations WHERE status = 'running';"

# Clean old archives
find consciousness/generated/archive -name "*.cjs" -mtime +30 -delete
```

### Monitoring Queries

```bash
# Check system health
curl -H "x-api-key: $PROM_API_KEY" http://localhost:5000/metrics | grep selfcoding

# WebSocket connection test
wscat -c ws://localhost:5001 -H "x-api-key: $PROM_API_KEY"

# Rate limit test
for i in {1..35}; do
  curl -X POST -H "x-api-key: $PROM_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"purpose":"test"}' \
    http://localhost:5000/api/code/generate
done
```

---

**Last Updated**: $(date)
**Version**: 1.0
**Maintainer**: Self-Coding Operations Team
