# A-2: Add Mutex / Atomic Counters Around Shared ResonanceMap Updates

## Objective & Success Criteria
**Objective:**  
Prevent data-races and ensure consistency of shared state (`resonanceNodes`, `resonanceFields`, etc.) during concurrent updates by implementing mutexes or atomic update helpers.

**Success Criteria:**  
- No race conditions or data corruption under high concurrency.
- All updates to shared Maps are thread-safe.
- Soak tests show no duplicate/corrupt IDs.

## Prerequisites / Dependencies
- Worker-pool setup (A-1).
- Node.js v16+ with `worker_threads`.
- Optionally: `async-mutex` or similar package.

## Architectural Context
- `FlappyJournal/server/consciousness/core/ConsciousnessResonanceNetworks.cjs`

## Step-by-Step Implementation Plan

1. **Install Mutex Helper**
   ```sh
   pnpm add async-mutex
   ```

2. **Wrap Shared State Updates**
   - Import `Mutex` or `RWLock`.
   - For each mutation of `resonanceNodes`, `resonanceFields`, `harmonicPatterns`, wrap in a mutex-protected section:
     ```js
     const { Mutex } = require('async-mutex');
     const resonanceMapMutex = new Mutex();
     await resonanceMapMutex.runExclusive(() => {
         // update logic
     });
     ```
   - For atomic counters (node IDs, etc.), use `Atomics` if in shared memory, or increment in mutex.

3. **Review All Async Handlers**
   - Ensure all async event handlers (`system_tick`, etc.) use the mutex around shared state.

4. **Add Soak/Stress Test**
   - Write a test that spawns 100+ concurrent node creations; validate no duplicate IDs.

## Observability Hooks
- Counter: `resonance_mutex_contention_total`
- Gauge: `resonance_mutex_wait_time_ms`

## Security or Performance Considerations
- Ensure mutexes are not held across await points.
- Avoid deadlocks by keeping critical sections small.

## Validation / Acceptance Checklist
- [ ] All updates to shared state are mutex/atomic-protected
- [ ] No race conditions in concurrency test
- [ ] No significant performance drop

## Rollback / Cleanup Notes
- Remove mutexes, revert to unprotected access (not recommended except for emergency rollback).