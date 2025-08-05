# Task CPU1: Remove Duplicate Heartbeat Loops

**Owner:** Backend Eng  
**Pre-req:** Sprint 1 HeartbeatEngine live  
**Est. hours:** 1

---

## Objective

Eliminate all legacy setInterval/setTimeout heartbeat loops except the new HeartbeatEngine.

## Steps

1. **Audit:**  
   - Find all setInterval/setTimeout in:
     - `websocket-server.cjs`
     - `self-awareness-feedback-loop.cjs`
     - Any test/demo scripts
2. **Delete:**
   - Remove/disable all but HeartbeatEngine
   - Remove related vars/metrics
3. **Test:**
   - Confirm only one heartbeat event in logs
   - No duplicate WS pulses
4. **QA:**  
   - Run `clinic doctor` or similar; observe tick timings
5. **Commit Message:**  
   ```
   refactor(heartbeat): remove duplicate legacy heartbeat loops
   ```
6. **Done Criteria:**
   - Only one timer exists
   - No drift, no overlap