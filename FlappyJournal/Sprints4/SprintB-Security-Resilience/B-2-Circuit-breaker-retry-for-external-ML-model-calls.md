# B-2: Circuit-Breaker + Retry for External ML Model Calls

## Objective & Success Criteria
**Objective:**  
Ensure all calls to external ML models (e.g. VeniceAI) are resilient to transient failures using circuit-breakers and retry/backoff.

**Success Criteria:**  
- External model calls do not block or crash the system on error.
- Circuit-breaker trips after N failures, resets after M seconds.
- Retries use exponential backoff with jitter.
- Metrics and logs show circuit state.

## Prerequisites / Dependencies
- `cockatiel` (or `opossum`) for resilience patterns.
- All external ML calls isolated in `oversoul-resonance.ts`.

## Architectural Context
- `FlappyJournal/server/oversoul-resonance.ts`
- External: VeniceAI, etc.

## Step-by-Step Implementation Plan

1. **Install Cockatiel**
   ```sh
   pnpm add cockatiel
   ```

2. **Wrap ML Calls**
   - Import `Policy` from cockatiel.
   - Define circuit-breaker + retry policy:
     ```js
     const { Policy, ConsecutiveBreaker } = require('cockatiel');
     const breaker = Policy.handleAll().circuitBreaker(5, new ConsecutiveBreaker({ halfOpenAfter: 15*1000 }));
     const retry = Policy.handleAll().retry().exponential({ maxAttempts: 3 });
     ```
   - Wrap all VeniceAI/external calls:
     ```js
     await breaker.execute(() => retry.execute(() => callVeniceAI(...)));
     ```

3. **Log Circuit State**
   - Listen for breaker events; log state transitions.

4. **Test Failure Modes**
   - Simulate ML outage; assert circuit trips, resets, retries.

## Observability Hooks
- Counter: `resonance_ml_retries_total`
- Gauge: `resonance_ml_circuit_state`
- Log circuit transitions/errors

## Security or Performance Considerations
- Never log sensitive model input/output.
- Ensure breaker does not mask persistent outages.

## Validation / Acceptance Checklist
- [ ] ML calls are retried on transient failure
- [ ] Circuit-breaker prevents system-wide stalls
- [ ] Metrics/logs show state

## Rollback / Cleanup Notes
- Remove cockatiel wrappers to revert.