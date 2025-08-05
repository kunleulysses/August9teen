# Spiral Memory System - Operations Runbook

## Authentication & Rate Limiting

### Overview
All external surfaces (WebSocket ports 3001/3002 and `/metrics` endpoint) are protected with JWT authentication and per-user rate limiting. This ensures secure access and prevents abuse of system resources.

### Authentication

#### JWT Authentication
- **Algorithm**: HS256 (configurable to RS256)
- **Token Extraction**:
  - WebSocket: `Sec-WebSocket-Protocol` header or `token` query parameter
  - HTTP: `Authorization: Bearer <token>` header or `token` query parameter

#### Environment Variables
```env
# Required
JWT_SECRET=your-secret-key  # For HS256
# OR
JWK='{"kty":"RSA",...}'  # For RS256

# Optional
ALLOW_ANONYMOUS_WS=false    # Allow unauthenticated WebSocket connections (not recommended for production)
WS_RATE_LIMIT=100           # Requests per window per user
WS_RATE_WINDOW=10           # Rate limit window in seconds
SPIRAL_RATE_LIMIT=100,10    # 100 requests per 10 seconds for Spiral Memory
GC_BUDGET_SCALE=10          # 10 nodes per ms for GC budget
GC_FORCE_SKIP=3             # Force GC after 3 skips
```

#### Generating Test Tokens
Use the included script to generate test JWTs:

```bash
# Generate a test token
node scripts/generate-test-jwt.cjs --user-id test-user --roles admin,user --tenant test-tenant

# Generate token with custom expiration
node scripts/generate-test-jwt.cjs --expires-in 1d

# Output as environment variables
node scripts/generate-test-jwt.cjs --output env
```

### Rate Limiting

#### Token Bucket Algorithm
- **Default**: 100 requests per 10 seconds per user
- **Storage**: In-memory (Redis recommended for distributed deployments)
- **Headers**:
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Remaining requests in window
  - `X-RateLimit-Reset`: Unix timestamp when limit resets
  - `Retry-After`: Seconds until retry is allowed (when rate limited)

#### Configuration
```javascript
// Customize rate limiting in wsAuth.cjs
const wsAuth = createWsAuth({
  rateLimit: {
    points: 100,        // Requests per window
    duration: 10,       // Window in seconds
    blockDuration: 60,  // Block for 60s after limit reached
    keyPrefix: 'ws:',   // Redis key prefix
    storeClient: redisClient // Optional Redis client
  }
});
```

### Metrics

#### Prometheus Metrics
```
# Authentication
spiral_ws_auth_attempts_total{status="success"} 42
spiral_ws_auth_attempts_total{status="invalid_token"} 3
spiral_ws_auth_attempts_total{status="missing_token"} 7

# Rate Limiting
spiral_ws_rate_limit_exceeded_total{endpoint="/metrics"} 5
spiral_ws_rate_limit_exceeded_total{endpoint="websocket"} 12

# Active Connections
spiral_ws_active_connections 24
spiral_ws_active_users 8

# Spiral Memory Rate Limiting
spiral_store_allowed_total 1024
spiral_store_denied_total 128

# EventBus
eventbus_backlog 0
eventbus_publish_lag_ms_bucket{le="1"} 0
eventbus_publish_lag_ms_bucket{le="2"} 0
eventbus_publish_lag_ms_bucket{le="5"} 0
eventbus_publish_lag_ms_bucket{le="10"} 0
eventbus_publish_lag_ms_bucket{le="50"} 0
eventbus_publish_lag_ms_bucket{le="100"} 0
eventbus_publish_lag_ms_bucket{le="+Inf"} 0
eventbus_publish_lag_ms_sum 0
eventbus_publish_lag_ms_count 0

# Process
process_heap_bytes 10000000
process_rss_bytes 20000000

# WebSocket
ws_messages_in_total 100
ws_messages_out_total 200
ws_bytes_out_total 10000

# Storage
spiral_storage_latency_ms_bucket{le="1",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="2",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="5",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="10",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="25",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="50",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="100",method="get",backend="redis"} 0
spiral_storage_latency_ms_bucket{le="+Inf",method="get",backend="redis"} 0
spiral_storage_latency_ms_sum{method="get",backend="redis"} 0
spiral_storage_latency_ms_count{method="get",backend="redis"} 0
```

### Troubleshooting

#### Common Issues

**401 Unauthorized**
- Verify JWT token is valid and not expired
- Check token includes required claims (sub, roles, tenant)
- Ensure correct secret/key is configured

**429 Too Many Requests**
- Client has exceeded rate limit
- Wait for window to reset or increase limits
- Implement exponential backoff in client

**WebSocket Connection Fails**
- Verify WebSocket URL includes token
- Check CORS and WebSocket proxy settings
- Ensure server is running on correct port

### Security Best Practices

1. **Secrets Management**
   - Never commit JWT secrets to version control
   - Use environment variables or secret management service
   - Rotate secrets regularly

2. **Token Security**
   - Set appropriate token expiration
   - Use HTTPS for all connections
   - Implement token revocation for suspicious activity

3. **Rate Limiting**
   - Adjust limits based on expected load
   - Monitor for abuse patterns
   - Consider IP-based rate limiting for unauthenticated endpoints

4. **Monitoring**
   - Set up alerts for rate limit violations
   - Monitor authentication failure rates
   - Track active users and connections

## Emergency Procedures

### Disabling Authentication (Emergency Only)
```bash
# Set in environment
ALLOW_ANONYMOUS_WS=true

# Or at runtime
process.env.ALLOW_ANONYMOUS_WS = 'true';
```

### Blocking Abusive Users
```javascript
// In wsAuth.cjs
const blockedUsers = new Set(['user123', 'abuse456']);

function isBlocked(userId) {
  return blockedUsers.has(userId);
}
```

## Appendix

### JWT Claims
```json
{
  "sub": "user123",
  "roles": ["user", "admin"],
  "tenant": "acme-corp",
  "iat": 1625097600,
  "exp": 1625101200,
  "jti": "550e8400-e29b-41d4-a716-446655440000"
}
```

### WebSocket Protocol
```javascript
// Connect with token
const ws = new WebSocket('ws://localhost:3001', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Or with query parameter
const ws = new WebSocket(`ws://localhost:3001?token=${token}`);
```

### HTTP API
```bash
# With header
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/metrics

# With query parameter
curl "http://localhost:3000/metrics?token=$TOKEN"
```

### Monitoring Dashboard
Grafana dashboard JSON is available in `monitoring/grafana/dashboards/` for tracking authentication and rate limiting metrics.

## Adaptive GC
### Overview
The garbage collector now uses an adaptive budget to prevent starvation and ensure timely cleanup of old memories.
### Configuration
- `GC_BUDGET_SCALE`: The number of nodes to process per millisecond of budget (default: 10)
- `GC_FORCE_SKIP`: The number of times a node can be skipped before it is forcibly collected (default: 3)
### Tuning Guide
- If the GC backlog is consistently high, decrease `GC_BUDGET_SCALE` to increase the budget.
- If the GC is too aggressive, increase `GC_FORCE_SKIP` to allow nodes to live longer.

## Redis Security
### Overview
The Redis adapter supports TLS and authentication.
### Configuration
- `REDIS_URL`: The URL to connect to Redis. Use `rediss://` for TLS.
- `REDIS_CA`: The path to the CA certificate file for TLS.
- `ALLOW_INSECURE_REDIS`: Set to `true` to allow insecure connections (default: `false`)
### Password Rotation
Run the `rotate-redis-secret.sh` script to rotate the Redis password.

## WebSocket Health
### Overview
WebSockets are monitored for idleness and responsiveness.
### Configuration
- `DISABLE_WS_DEFLATE`: Set to `true` to disable per-message deflate (default: `false`)
### Ping-Pong
- A `ping` is sent every 30 seconds.
- If a client misses 2 pongs, it is disconnected with code 4001.
### Idle Timeout
- If no message is received from a client for 5 minutes, it is disconnected with code 4000.

## Performance
### `fastpriorityqueue`
The `MinHeap` implementation has been replaced with `fastpriorityqueue` for a 25% throughput gain.

## Circuit Breaker
### Overview
The storage adapters are protected by a circuit breaker to prevent cascading failures.
### Configuration
- `CB_FAILURES`: The number of failures required to open the circuit (default: 5)
- `CB_WINDOW`: The time in milliseconds to wait before trying again (default: 30000)
- `CB_TIMEOUT`: The time in milliseconds to wait before a request is considered timed out (default: 20000)

## On-Call Procedures
### SpiralEventLagHigh
- Check the EventBus backlog.
- Check the subscribers for the lagging event.
### GCBacklogTooLarge
- Check the GC backlog.
- Check the GC budget.
### CircuitBreakerOpen
- Check the circuit breaker state.
- Check the backend service.
### RedisTLSDisabled
- Check the Redis connection.
- Check the Redis configuration.
### WSClientsDroppedSpike
- Check the WebSocket connection count.
- Check the WebSocket error rate.
### HeapMemoryHigh
- Check the heap memory usage.
- Check for memory leaks.
### RateLimitDenialsSurge
- Check the rate limit denial rate.
- Check for abusive clients.

## Quantum Entanglement
### Overview
The link engine probabilistically entangles spirals with a high degree of harmonic and thematic overlap.
### Configuration
- `ENABLE_QUANTUM_LINKS`: Set to `true` to enable quantum entanglement (default: `false`)

## Hyperdimensional Topology & Knobs
### Overview
The spiral selection algorithm uses a weighted score of distance, load, and age to select the optimal spiral for a new memory.
### Configuration
- `HD_WEIGHT_DISTANCE`: The weight of the harmonic distance in the score (default: 0.5)
- `HD_WEIGHT_LOAD`: The weight of the spiral load in the score (default: 0.3)
- `HD_WEIGHT_AGE`: The weight of the spiral age in the score (default: 0.2)

## Nightly Integrity Job
### Overview
A Kubernetes CronJob runs every night at 02:30 UTC to rebuild the spiral stats.
### Slack Alert
If any corrections are made, a message is sent to the #alerts channel in Slack.

## Sigil ID Space
### Overview
Sigils are generated with a 10-character hash slice to prevent collisions.
### Configuration
- `SIGIL_HASH_SLICE`: The length of the hash slice to use for sigils (default: 10)

## Chaos Harness
### Overview
The chaos harness is a set of scripts and tests that allow us to test the resilience of the system.
### Running the Chaos Harness
Run the `chaos-test` workflow in GitHub Actions.

## Security Response & Patch Process
### Overview
This section outlines the process for responding to security incidents.
### Triage
1. Acknowledge the alert in PagerDuty or Slack.
2. Create a JIRA ticket to track the incident.
3. Assess the impact of the incident.
### Containment
1. Isolate the affected system.
2. Block the attacker's IP address.
### Eradication
1. Identify and remove the root cause of the incident.
2. Patch the vulnerability.
### Recovery
1. Restore the system from a backup.
2. Monitor the system for any further malicious activity.
### Post-Mortem
1. Create a post-mortem report.
2. Identify and implement lessons learned.
