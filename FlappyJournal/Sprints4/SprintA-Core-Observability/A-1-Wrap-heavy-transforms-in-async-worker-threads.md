# A-1: Wrap Heavy Transforms in Async Worker Threads

## Objective & Success Criteria
**Objective:**  
Migrate CPU-intensive transforms (harmonic cascade, per-node tick) from the Node.js event loop into a worker-pool using `worker_threads` or `Piscina` for true parallelism.

**Success Criteria:**  
- Heavy transforms run outside the main thread.
- Event loop lag reduced by ≥80% under load (target: &lt;50ms p95).
- No functional regressions; all tests pass.
- Instrumentation shows worker utilization.

## Prerequisites / Dependencies
- Node.js v16+
- No open refactors in `harmonic-resonance-cascade.cjs`/CRN.
- `prom-client` instrumentation in place.
- Redis (for later snapshotting) available for local/dev.

## Architectural Context
- `FlappyJournal/server/harmonic-resonance-cascade.cjs`
- `FlappyJournal/server/consciousness/core/ConsciousnessResonanceNetworks.cjs`
- EventBus: `ConsciousnessEventBus.cjs`

## Step-by-Step Implementation Plan

1. **Install Piscina (or prepare worker_threads)**
   ```sh
   pnpm add piscina
   ```

2. **Refactor Harmonic Cascade**
   - Extract the heavy methods (e.g. `analyzeResonance`) to a separate JS/TS file.
   - Wrap them as worker tasks using Piscina.
   - Expose a `runCascade` async method in the main process:
     ```js
     // harmonic-resonance-cascade-worker.js
     module.exports = function (args) { return analyzeResonance(args); }
     // main module
     const Piscina = require('piscina');
     const piscina = new Piscina({ filename: __dirname + '/harmonic-resonance-cascade-worker.js' });
     ```
   - Replace direct calls with `await piscina.runTask(args)`.

3. **Refactor Node Tick Loops**
   - In `ConsciousnessResonanceNetworks.cjs`, replace per-node `setInterval` with master-scheduled tasks dispatched to the pool.
   - Use a single scheduler loop in master.
   - Each tick: send nodeId + state to a worker, receive updated node struct.

4. **Update EventBus Integration**
   - Ensure all async results from workers are posted back (resolve via promise/async).
   - Update event handlers to handle async.

5. **Add Worker Utilization Metrics**
   - Use `prom-client` to add a gauge for active/idle workers.
   - Histogram: `resonance_worker_task_duration_ms`

6. **Update Unit/Integration Tests**
   - Add tests for worker-pool contract (e.g., forced error, high-concurrency).

## Observability Hooks
- Histogram: `resonance_worker_task_duration_ms`
- Gauge: `resonance_worker_pool_size`
- Log task queue depth, errors

## Security or Performance Considerations
- Validate all args passed to workers to avoid prototype pollution/code injection.
- Cap max pool size to prevent resource exhaustion.

## Validation / Acceptance Checklist
- [ ] Cascade tasks run in worker pool
- [ ] Event loop lag &lt;50ms p95 under stress
- [ ] Metrics show worker utilization
- [ ] All tests (incl. new worker tests) pass

## Rollback / Cleanup Notes
- Revert to single-threaded transform by restoring previous function calls.
- Remove any new dependencies if rolled back.