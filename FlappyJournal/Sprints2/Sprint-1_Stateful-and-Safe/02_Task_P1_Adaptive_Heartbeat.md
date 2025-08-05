# Task P1: Adaptive Heartbeat Engine

**Owner:** Backend Eng  
**Pre-req:** Node 18+, perf hooks available  
**Est. hours:** 5

---

## Objective

Implement a new `HeartbeatEngine` replacing all duplicate setInterval 100Hz loops. Scheduler must adapt frequency to load and compensate for timer drift.

## Steps

1. **Create** `FlappyJournal/server/consciousness/core/HeartbeatEngine.ts`
2. **Define interface:**  
   - `start(baseHz=10)`
   - `setSurge(surgeHz)`
   - `stop()`
   - Emits 'heartbeat' event
3. **Implement drift-compensated scheduler:**  
   - Use `setTimeout` with `performance.now()`
   - Calculate next tick based on previous drift
4. **Adaptive Frequency:**  
   - Base 10Hz, surge to 100Hz if `systemState.processingLoad>0.7`
   - Revert if load drops
5. **Link to metrics:**  
   - Track `heartbeat_skew_ms`
   - Expose current frequency
6. **Hook into SAFL:**  
   - Replace any timer in `self-awareness-feedback-loop.cjs`
   - Remove duplicate heartbeat in `websocket-server.cjs` (see Sprint 2/Cleanup)
7. **Performance Test:**  
   - Use `clinic flame -- node index.cjs`
   - Monitor CPU, tick drift under load
8. **Env:**  
   - `HEARTBEAT_BASE_HZ`, `HEARTBEAT_SURGE_HZ`
9. **Testing:**  
   - Unit: Simulate high/low loads, assert correct Hz
   - Integration: Confirm no duplicate ticks
10. **Commit Message:**  
    ```
    feat(heartbeat): add adaptive HeartbeatEngine, remove duplicate timers
    ```
11. **Done Criteria:**  
    - Only one heartbeat loop runs
    - Drift < 2ms over 1 min
    - Adaptive surge when under load