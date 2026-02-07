# B-3: TLS Support for Redis Adapter + Health Probe

## Objective & Success Criteria
**Objective:**  
Ensure all connections to Redis for resonance persistence use TLS encryption and expose a health probe endpoint for readiness/liveness.

**Success Criteria:**  
- Redis used by ResonanceStorageAdapter connects via `rediss://`.
- Health endpoint returns error if Redis is unreachable or not TLS.
- All data in transit to Redis is encrypted.

## Prerequisites / Dependencies
- Redis server with TLS enabled.
- `ioredis` library.

## Architectural Context
- `FlappyJournal/server/consciousness/storage/ResonanceStorageAdapter.js`
- Health check: `/healthz` endpoint.

## Step-by-Step Implementation Plan

1. **Configure Redis URL**
   - Use `rediss://user:pass@host:port` in env/config.

2. **Update Storage Adapter**
   - Ensure `ioredis` instantiated with TLS options.
   - Validate connection is encrypted (log warning if not).

3. **Implement Health Probe**
   - Add `/healthz` REST endpoint.
   - Call `await resonanceStorage.healthCheck()`; return failure if Redis unreachable.

4. **Test Failure Modes**
   - Simulate Redis outage, invalid cert, etc.

## Observability Hooks
- Gauge: `resonance_redis_connection_state`
- Log all health probe failures

## Security or Performance Considerations
- Verify Redis certs; never accept plaintext.
- Limit health probe info on error (no secrets).

## Validation / Acceptance Checklist
- [ ] Redis only accessed over TLS
- [ ] Health probe fails if Redis is unavailable
- [ ] No data leaks in logs

## Rollback / Cleanup Notes
- Fallback to in-memory if Redis TLS fails (emergency only).