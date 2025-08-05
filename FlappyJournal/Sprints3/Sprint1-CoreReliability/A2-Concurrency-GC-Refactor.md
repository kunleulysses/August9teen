# Ticket A2 – Concurrency-GC-Refactor

## Goal
Refactor all concurrency and garbage collection logic in the Sigil-DNA stack to guarantee safe, leak-free operation and atomic state changes, supporting both single and multi-process deployments.

## Context

Current concurrency and GC management in the Sigil-DNA system is both fragile and hazardous for production. The main implementation in [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs) uses direct `setInterval` calls to schedule garbage collection and memory decay, e.g.:
```js
setInterval(() => { this.crystallizeMemoryPatterns(); }, 10000);
setInterval(() => { this.processMemoryDecay(); }, 5000);
```
However, these intervals are never cleared, causing memory leaks on hot reloads or restarts (very common in dev with nodemon or ts-node-dev). Critically, there is no mutex or explicit concurrency guard around mutation of the main in-memory `Map` objects. This means:
- If GC runs while a client encodes a new sigil, data can be lost or corrupted.
- If two requests hit encode simultaneously (e.g. via REST or WS), race conditions may occur.
- No mechanism exists to gracefully stop GC on shutdown or when the module is reloaded.
- In the future, as the platform moves to multi-process or clustered Node.js deployments, these issues will amplify.

Related code paths:
- [sigil-identity.cjs](../../server/sigil-identity.cjs)
- [sigil-api.cjs](../../server/sigil-api.cjs)
- [consciousness/sigil-based-code-authenticator.cjs](../../server/consciousness/sigil-based-code-authenticator.cjs)

## Prerequisites

- Node.js v18.x or higher
- Access to the codebase and the ability to install new NPM packages
- `node-cron` for managed cron jobs:  
  ```
  npm install node-cron
  ```
- `async-mutex` for robust mutex/locking:
  ```
  npm install async-mutex
  ```
- Familiarity with Node.js process signal handling
- Ability to restart Node.js process to verify shutdown paths
- Prometheus (if adding metrics for GC)

## Step-by-Step Implementation

### 1. Replace All `setInterval` with `node-cron`

**Why:** To ensure jobs can be started/stopped, and avoid orphaned intervals on reload.

#### Steps:
1. Remove the two current `setInterval` lines in `sigil-identity.cjs`.
2. Install and require `node-cron` at the top of the file.
   ```js
   const cron = require('node-cron');
   ```
3. Refactor GC start logic:
   ```js
   this.cronJobs = [
     cron.schedule('*/10 * * * * *', () => this.crystallizeMemoryPatterns()),
     cron.schedule('*/5 * * * * *', () => this.processMemoryDecay())
   ];
   ```
4. Store the cron jobs in a class property (`this.cronJobs`) so they can be stopped later.

### 2. Add Mutex/Concurrency Guard

**Why:** Prevent simultaneous, conflicting state mutations in memory.

#### Steps:
1. At the top of the file, require `async-mutex`:
   ```js
   const { Mutex } = require('async-mutex');
   ```
2. In the constructor, initialize the mutex:
   ```js
   this.memoryMutex = new Mutex();
   ```
3. Wrap all mutating operations (encode, GC, crystallize) with mutex:
   ```js
   await this.memoryMutex.runExclusive(async () => {
     // mutation logic
   });
   ```
4. Refactor all locations where `this.sigilMemory`, `this.resonanceNetwork`, etc. are mutated.

### 3. Expose `stop()` and Graceful Shutdown

**Why:** Ensures shutdown cleans up all cron jobs and flushes any in-memory state if needed.

#### Steps:
1. Add a `stop()` method to the class:
   ```js
   stop() {
     this.cronJobs.forEach(job => job.stop());
     // Optionally, flush in-memory state
   }
   ```
2. In your main entrypoint (e.g., `server/index.cjs`), wire process signals:
   ```js
   process.on('SIGINT', () => { sigilEngine.stop(); process.exit(0); });
   process.on('SIGTERM', () => { sigilEngine.stop(); process.exit(0); });
   ```

### 4. Add Prometheus Metric for GC Runs (optional but recommended)

**Why:** Track when GC runs and how long it takes for observability.

#### Steps:
1. In GC/crystallize functions, increment a Prometheus counter:
   ```js
   sigil_gc_sweep_total.inc();
   ```
2. Optionally, record histogram of sweep duration.

### 5. Refactor All Callers

**Why:** Ensure no code path bypasses the concurrency guard.

#### Steps:
1. Grep for all references to mutation functions (encode, crystallize, decay).
2. Confirm all call sites are protected by the mutex.

---

## Verification

### Unit Tests with Jest

- **Test concurrency safety:**
  ```js
  it('should serialize concurrent encodes', async () => {
    const promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(sigilIdentity.encodeSigilMemory({foo: i}));
    }
    await Promise.all(promises);
    expect(sigilIdentity.sigilMemory.size).toBe(50);
  });
  ```
- **Test GC leaks:**
  - Start, reload/re-instantiate, call `stop()`, verify no additional jobs running.
- **Test shutdown:**
  - Simulate SIGINT/SIGTERM, verify all jobs stopped and state flushed.

### Integration

- Hammer encode endpoint with 1000 concurrent requests, ensure no corrupt or missing data.
- Use `lsof` to confirm no orphaned timers/handles after shutdown.

### Metrics

- Scrape `/metrics` and check `sigil_gc_sweep_total` increments as expected.

---

## Rollback

- Restore the previous `setInterval`-based code from git.
- Remove node-cron and async-mutex dependencies:
  ```
  npm uninstall node-cron async-mutex
  ```
- Remove `stop()` and shutdown hooks.

- Git revert:
  ```
  git checkout HEAD~1 -- FlappyJournal/server/sigil-identity.cjs
  ```

---

## Acceptance Criteria

- No memory leaks after service reloads or during hot deploy.
- No data corruption or lost state from concurrent operations.
- GC jobs can be cleanly started and stopped.
- All tests (unit/integration/metrics) pass.
- No open timers or handles after stop.

---

## Time Estimate & Assignee

- Estimate: 1.5–2 dev days (including review)
- Assignee: _______________________

---

## References / Further Reading

- [node-cron npm](https://www.npmjs.com/package/node-cron)
- [async-mutex npm](https://www.npmjs.com/package/async-mutex)
- [`sigil-identity.cjs`](../../server/sigil-identity.cjs)
- [Node.js process signals](https://nodejs.org/api/process.html#signal-events)
- [Prometheus metrics best practices](https://prometheus.io/docs/practices/instrumentation/)
- [Prometheus metrics best practices](https://prometheus.io/docs/practices/instrumentation/)