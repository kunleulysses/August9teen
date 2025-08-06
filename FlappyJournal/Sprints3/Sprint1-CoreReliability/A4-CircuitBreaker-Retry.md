# Ticket A4 – CircuitBreaker-DNAStore

## Goal
Implement a resilient circuit breaker and retry/fallback mechanism for all DNAStore HTTP calls, ensuring the Sigil-DNA service remains robust even during upstream outages or degraded network conditions.

## Context

The Sigil-DNA system interacts with DNAStore, an external service, for certain persistence and validation workflows (see [`FlappyJournal/server/consciousness/dna-sigil-reality-encoding.cjs`](../../server/consciousness/dna-sigil-reality-encoding.cjs) and integration points in [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)). Currently, all DNAStore calls are made over plain HTTP, and the only form of resilience is a basic retry loop. This exposes the platform to several production risks:
- If DNAStore is down or slow, requests may hang or fail, causing cascading timeouts in the API, queue buildup, and potential data loss.
- There is no automatic failover or fallback response—if the dependency is unavailable, all upstream requests fail until it recovers.
- Lack of visibility: no metrics or logs to indicate when the dependency is down, slow, or intermittently failing.
- No clear separation between transient errors (e.g., network blips) and persistent failures (e.g., upstream outage).

A production-grade solution must:
- Detect repeated failures and "trip" a circuit breaker, stopping further requests until a cool-down period elapses.
- Retry failed requests with exponential backoff, up to a sensible limit.
- Provide fallback responses (e.g., cached data, error stubs) to keep the service partially functional.
- Expose metrics (Prometheus) on the breaker's state, error rates, and fallback usage.
- Make circuit breaker logic observable in logs and Grafana dashboards for SREs.

Key files to modify/integrate:
- [`FlappyJournal/server/consciousness/dna-sigil-reality-encoding.cjs`](../../server/consciousness/dna-sigil-reality-encoding.cjs)
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)
- [`FlappyJournal/server/consciousness/core/security/eventSign.ts`](../../server/consciousness/core/security/eventSign.ts) (for authentication on fallback)
- Add new `FlappyJournal/server/utils/circuitBreaker.js` for reusable logic.

## Prerequisites

- Node.js ≥ 18.x
- `opossum` circuit breaker package (`npm install opossum`)
- `prom-client` for Prometheus metrics (`npm install prom-client`)
- Working DNAStore endpoint (test or staging)
- ENV: `DNASTORE_URL`, `DNASTORE_TIMEOUT_MS`, `DNASTORE_CIRCUIT_MAX_FAILURES`, etc.
- Access to modify main sigil API and DNA integration modules
- Docker/k8s cluster for testing readiness/liveness
- Access to Grafana/Prometheus for metrics validation

## Step-by-Step Implementation

### 1. Add Circuit Breaker Utility

**Why:** Encapsulate breaker logic for reuse, make configuration simple.

#### Steps:
1. Create `FlappyJournal/server/utils/circuitBreaker.js`:
   ```js
   const CircuitBreaker = require('opossum');
   const promClient = require('prom-client');

   // Prometheus metrics
   const breakerState = new promClient.Gauge({
     name: 'dnastore_circuit_state',
     help: '0=closed,1=open,2=half-open'
   });
   const breakerTrips = new promClient.Counter({
     name: 'dnastore_circuit_trips_total',
     help: 'Number of times DNAStore circuit breaker tripped'
   });

   function createBreaker(fetchFn, opts) {
     const breaker = new CircuitBreaker(fetchFn, {
       timeout: opts.timeout || 3000,
       errorThresholdPercentage: opts.errorThreshold || 50,
       resetTimeout: opts.resetTimeout || 10000,
       rollingCountTimeout: opts.rollingTimeout || 10000,
       rollingCountBuckets: opts.rollingBuckets || 10,
     });
     breaker.fallback(() => ({ fallback: true, data: null, error: 'DNAStore unavailable' }));
     breaker.on('open', () => { breakerTrips.inc(); breakerState.set(1); });
     breaker.on('halfOpen', () => breakerState.set(2));
     breaker.on('close', () => breakerState.set(0));
     return breaker;
   }
   module.exports = { createBreaker };
   ```

2. Add required ENV variables to `.env.example`:
   ```
   DNASTORE_URL=http://localhost:9001
   DNASTORE_TIMEOUT_MS=3000
   DNASTORE_CIRCUIT_MAX_FAILURES=5
   ```

### 2. Refactor DNAStore HTTP Calls to Use the Breaker

**Why:** Ensure all outbound dependency calls are protected.

#### Steps:
1. In DNAStore integration files, import the breaker:
   ```js
   const { createBreaker } = require('./utils/circuitBreaker');
   ```
2. Wrap the DNAStore HTTP client:
   ```js
   const fetch = require('node-fetch');
   const breaker = createBreaker(
     (url, opts) => fetch(url, opts).then(r => r.json()),
     { timeout: process.env.DNASTORE_TIMEOUT_MS || 3000 }
   );
   ```
3. Replace all direct fetch calls with:
   ```js
   const response = await breaker.fire(`${process.env.DNASTORE_URL}/api/resource`, { method: 'GET' });
   if (response.fallback) {
     // handle fallback logic, e.g., serve cached data or return 503
   }
   ```

### 3. Add Metrics and Logging

**Why:** Observe the health of dependencies and breaker state.

#### Steps:
1. In main Prometheus metrics exporter, ensure `dnastore_circuit_state` and `dnastore_circuit_trips_total` are scraped.
2. Add logs for breaker state transitions:
   ```js
   breaker.on('open', () => logger.warn('DNAStore circuit breaker OPEN'));
   breaker.on('close', () => logger.info('DNAStore circuit breaker CLOSED'));
   ```

### 4. Add Integration and Fallback Caching

**Why:** Provide partial functionality during DNAStore outages.

#### Steps:
1. Implement an in-memory or Redis/LRU cache for fallback.
2. In fallback handler, serve last-known-good (LKG) data if available.
   ```js
   breaker.fallback(() => cache.get('lkg') || { error: 'unavailable' });
   ```

### 5. Parameterize Configuration

**Why:** Allow tuning of breaker thresholds and timeouts in prod.

#### Steps:
1. Read all breaker settings from ENV, with sane defaults.
2. Document all ENV variables and their effects.

---

## Verification

### Unit Tests (Jest)

- Test breaker opens after N failures:
  ```js
  it('should open breaker after consecutive failures', async () => {
    // simulate fetch always throws, expect breaker.open after threshold
  });
  ```
- Test fallback responses when circuit is open.

### Integration

- Simulate DNAStore outage (stop container/service), check:
  - API returns fallback response, not hangs.
  - Circuit breaker metrics (Prometheus) increment.
  - Logs report state transitions.
  - breaker closes after recovery.

- k6 soak test: sustained 100 rps with DNAStore up/down cycles.

### Metrics and Dashboards

- Prometheus query:
  ```
  dnastore_circuit_trips_total > 0
  dnastore_circuit_state == 1
  ```
- Grafana: visual panel for breaker state, error rate, fallback count.

---

## Rollback

- Restore prior fetch/retry logic via:
  ```sh
  git checkout HEAD~1 -- server/utils/circuitBreaker.js server/consciousness/dna-sigil-reality-encoding.cjs server/sigil-api.cjs
  ```
- Remove breaker metrics from Prometheus exporter.
- Remove breaker ENV variables from deployment manifests.

---

## Acceptance Criteria

- All DNAStore HTTP calls wrapped in breaker.
- API stays responsive when DNAStore is down (fallbacks, no hangs).
- Breaker state and trips visible in Prometheus/Grafana.
- k6 soak test passes with <1% error during failover.
- All logs for breaker transitions present.

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: ___________________________

---

## References / Further Reading

- [opossum npm (circuit breaker)](https://www.npmjs.com/package/opossum)
- [Netflix Hystrix Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Prometheus client Node.js](https://github.com/siimon/prom-client)
- [Circuit breaker best practices](https://docs.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker)
- [Node.js fetch API](https://github.com/node-fetch/node-fetch)