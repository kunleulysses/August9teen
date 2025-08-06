# A-3: Persist Resonance Snapshots to Redis (ResonanceStorageAdapter)

## Objective & Success Criteria
**Objective:**  
Implement reliable persistence for resonance network state (nodes, fields, patterns, metrics) via a new Redis-backed storage adapter with TLS support.

**Success Criteria:**  
- All key resonance state is snapshotted to Redis every 10s and/or on shutdown.
- System can restore full state on restart.
- Redis uses TLS.
- No data loss in restart/failure scenario.

## Prerequisites / Dependencies
- Redis with TLS enabled (local or cloud).
- Node.js v16+, `ioredis` installed.
- Worker-pool/mutexes (A-1, A-2).

## Architectural Context
- New: `FlappyJournal/server/consciousness/storage/ResonanceStorageAdapter.js`
- Modified: `ConsciousnessResonanceNetworks.cjs`

## Step-by-Step Implementation Plan

1. **Install Redis Client**
   ```sh
   pnpm add ioredis
   ```

2. **Implement Storage Adapter**
   - Create `ResonanceStorageAdapter.js` (class with `saveSnapshot`, `restoreSnapshot`, `healthCheck`).
   - Use `ioredis` with `rediss://` for TLS.
   - Save:
     - Nodes: `HSET resonance:nodes <id> <json>`
     - Fields: `HSET resonance:fields <type> <json>`
     - Patterns: `HSET resonance:patterns <name> <json>`
     - Metrics: `JSON.SET resonance:metrics $ <json>`
     - Snapshots: `LPUSH resonance:snapshots <json>` (capped list)
   - On shutdown or every N seconds: `await saveSnapshot()`.

3. **Restore on Boot**
   - On init, call `restoreSnapshot()`; merge state into in-memory Maps.

4. **Add Health Probe**
   - Export `healthCheck()` (test ping, round-trip).

5. **Wire Adapter Into CRN**
   - Call `saveSnapshot()` and `restoreSnapshot()` at appropriate points.

6. **Add Integration Test**
   - Test save/restore works (simulate crash).

## Observability Hooks
- Counter: `resonance_snapshot_saves_total`
- Gauge: `resonance_snapshot_last_duration_ms`
- Log Redis connection errors

## Security or Performance Considerations
- Use Redis AUTH + TLS (never plaintext).
- Cap snapshot frequency to avoid write amplification.

## Validation / Acceptance Checklist
- [ ] State saved to Redis on schedule/shutdown
- [ ] State restored correctly after restart
- [ ] Redis health probe passes

## Rollback / Cleanup Notes
- Remove adapter and revert to in-memory only (not recommended except for last-resort rollback).