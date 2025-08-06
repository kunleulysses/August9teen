# B-5: Adaptive Batching in Harmonic Cascade

## Objective & Success Criteria
**Objective:**  
Dynamically adjust the batch/window size in the harmonic-resonance-cascade to optimize throughput and maintain p95 latency ≤ 120 ms.

**Success Criteria:**  
- Cascade adaptively increases/decreases window based on load.
- p95 latency ≤ 120 ms @ 100Hz simulated load.
- Metrics reflect window adaptation and latency.

## Prerequisites / Dependencies
- Worker pool refactor from Sprint A complete.
- Prometheus metrics available.
- Load simulation/test harness.

## Architectural Context
- `FlappyJournal/server/harmonic-resonance-cascade.cjs` (main logic)
- Any worker pool/batching code

## Step-by-Step Implementation Plan

1. **Refactor for Batch Processing**
   - Modify core processing loop to accept and process arrays/batches of input.
   - Identify best place to insert adaptive window logic.

2. **Track and Calculate Latency**
   - Use Prometheus histogram to track per-batch latency.
   - Calculate EWMA (Exponentially Weighted Moving Average) for latency.

3. **Implement Adaptive Logic**
   - If EWMA > 90 ms, increase batch/window size by 1 (up to a safe max).
   - If EWMA < 60 ms for 3+ cycles, decrease window by 1 (down to min).
   - Expose current window size as a metric.

4. **Testing**
   - Simulate various loads, assert window adapts and p95 latency SLO is met.
   - Add unit/integration tests for adaptation logic.

## Observability Hooks
- Gauge: `resonance_cascade_window_size`
- Histogram: `resonance_cascade_latency_ms`

## Security or Performance Considerations
- Cap window size to prevent OOM.
- Log/alert if window is pinned at max/min for >5 min.

## Validation / Acceptance Checklist
- [ ] Batch/window adapts under load
- [ ] Latency stays within SLO
- [ ] Metrics visible and correct

## Rollback / Cleanup Notes
- Revert to fixed batch/window size.