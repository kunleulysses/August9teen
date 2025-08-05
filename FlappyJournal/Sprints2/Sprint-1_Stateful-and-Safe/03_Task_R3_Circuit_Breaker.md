# Task R3: Circuit Breaker for Safe Event Emission

**Owner:** Backend Eng  
**Pre-req:** EventEmitter-based bus, `opossum` installed  
**Est. hours:** 3

---

## Objective

Wrap all critical EventBus and WebSocket emits with a circuit-breaker pattern via SafeEmit util and `opossum` fallback.

## Steps

1. **Install dependency:**  
   ```sh
   npm install opossum
   ```
2. **Create `lib/safeEmit.js`:**  
   - Export `safeEmit(event, payload)` that wraps try/catch and logs errors
   - Optionally, integrate `opossum` for trips
3. **Replace all direct `emit` with `safeEmit` in:**  
   - `self-awareness-feedback-loop.cjs`
   - `MetaCognitiveAnalysis.cjs`
   - WebSocket server
4. **Configure breaker:**  
   - Open after 3 failures
   - Reset after 60s
5. **Emit degraded event on trip:**  
   - `metacog.analysis_failed` with error detail
6. **Metrics:**  
   - Counter `circuit_breaker_open_total`
   - Gauge `breaker_state` (0=closed, 1=open)
7. **Tests:**  
   - Unit: force error, assert trip and fallback
8. **Docs:**  
   - Inline usage comments
9. **Commit Message:**  
    ```
    feat(circuit-breaker): add SafeEmit util with opossum guard
    ```
10. **Done Criteria:**  
    - All emits guarded
    - No unhandled promise rejections
    - Degraded event visible in logs and metrics