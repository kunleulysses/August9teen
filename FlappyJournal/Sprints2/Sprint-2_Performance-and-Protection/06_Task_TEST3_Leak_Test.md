# Task TEST3: Memory Leak/GC Test

**Owner:** QA/Backend  
**Pre-req:** Jest, Node >=18  
**Est. hours:** 2

---

## Objective

Ensure no memory leaks or excessive GC under sustained load.

## Steps

1. **Test Script:**
   - Write Jest test or standalone node script:
     ```js
     const { fork } = require('child_process');
     const proc = fork('./heartbeat-test.js', { execArgv: ['--expose-gc'] });
     proc.on('message', msg => { ... });
     ```
   - In `heartbeat-test.js`:
     - Start HeartbeatEngine at 10Hz for 15min
     - Global.gc() every 30s, log heap
   - Assert heap plateau, no >10% climb
2. **CI Integration:**
   - Add test to pipeline, fail on excessive heap
3. **QA:**
   - Run under stress, confirm flat heap
4. **Commit Message:**
   ```
   test(gc): add memory leak test for heartbeat/analysis
   ```
5. **Done Criteria:**
   - No detectable leak under 15min load
   - CI passes