# A4: Circuit Breaker & Retry for DNAStore

**Goal:**  
Add a circuit-breaker and retry/fallback logic for external DNAStore calls.

## Background
- No defense against DNAStore outages.
- Simple retry loop only.

## Tasks
- [ ] Integrate opossum for circuit-breaker.
- [ ] Add fallback cache.
- [ ] Emit circuit breaker Prometheus metrics.

## Acceptance Criteria
- Service survives DNAStore outage.
- Proper state transitions observable.

## Risks
- Mis-tuned breaker causing false trips.
- Cache staleness.

## Blockers
- None identified.