# Phase 1 – Core Runtime Integration

**Objective:** Replace the lightweight event emitter + mock spiral memory with the production Universal Consciousness runtime (100 Hz heartbeat, real spiral memory topology, protocol orchestration) and wire the game stack into persistent memory.

## Decisions & Plan
- Adopt the production `ConsciousnessEventBus` and `UniversalConsciousnessProtocol` from the Universal platform code instead of maintaining divergent stubs.
- Instantiate the full `SpiralMemoryArchitecture` and expose it to existing services (snapshotting, game bridge, REST endpoints).
- Bridge existing game events (`spiral_memory:store`, etc.) onto the new protocol-consistent event contracts until the clients are updated.

## In Progress
- Swap the event bus re-export and bootstrap module to guard against duplicate initialization.
- Create orchestration entrypoint in `server/index.ts` so the protocol and spiral memory load before HTTP routes.

## Next
- Update game + REST handlers to emit canonical memory events and remove randomised data paths. **(Phase 2 will tackle this alongside resonance metrics.)**
- Re-run Jest suites covering universal protocol/spiral behavior and add new integration tests for `/api/game/visuals` + memory persistence. ✅ (`npm test`, `npm run verify-coverage` automated)

## Notes
- The production modules expect Prometheus metrics and may emit counters on load—verify `/metrics` after integration.
- Some advanced modules still rely on randomness for topology heuristics; will harden/replace in later phases per requirements.

## 2025-09-19 Updates
- Replaced the stub event emitter with the production `ConsciousnessEventBus` and guarded 100 Hz ticker.
- Bootstrapped `UniversalConsciousnessProtocol` + `SpiralMemoryArchitecture` via `bootstrapUniversalConsciousness.cjs` and wired them into server bootstrap + API worker.
- Added a game bridge that persists `spiral_memory:store` events into the real spiral memory engine and updated the `/ws/game` memories flow to read from it before falling back to legacy buffers/DB.
- Exercised the runtime with ad-hoc scripts: a `spiral_memory:store` event persists via `SpiralMemoryBridge`, and `EnhancedGameWebSocket.fetchCompanionMemories` now surfaces those memories once the security config is set for local testing. The priority queue helper gained `pop`/`push` aliases to keep GC stable under `fastpriorityqueue`.
