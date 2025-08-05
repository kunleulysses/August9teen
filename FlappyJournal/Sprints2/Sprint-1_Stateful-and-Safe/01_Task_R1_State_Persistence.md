# Task R1: State Persistence via RedisSpiralAdapter

**Owner:** Backend Eng  
**Pre-req:** Redis running, env `REDIS_URL` set  
**Est. hours:** 6

---

## Objective
Persist meta/self-awareness state snapshots to Redis using `RedisSpiralAdapter`. Ensure state is restored on restart and snapshots are durable for at least 24h.

## Step-by-Step

1. **Clone/Review RedisSpiralAdapter**  
   - `FlappyJournal/server/consciousness/core/storage/RedisSpiralAdapter.ts`
   - Ensure methods match: `init()`, `get()`, `set()`, `del()`, `keys()`.

2. **Install Dependencies**  
   ```sh
   npm install ioredis msgpack5 lz4
   ```

3. **Bootstrap in `index.cjs` or main entry:**  
   ```js
   const RedisSpiralAdapter = require('./consciousness/core/storage/RedisSpiralAdapter').default;
   const storage = new RedisSpiralAdapter(process.env.REDIS_URL);
   await storage.init();
   ```

4. **Key Schema:**  
   - Snapshots: `meta:snapshot:<epochSec>`
   - Latest: `meta:latest`
   - Metrics: `meta:metrics`
   - Insights: `meta:insight:<id>`

5. **TTL Policy:**  
   - Snapshots: 24h (`EX`, 86400)
   - Latest: no expiry

6. **Serialize State:**  
   - Use `msgpack5` for encoding
   - Compress with `lz4`
   ```js
   const msgpack = require('msgpack5')();
   const lz4 = require('lz4');
   const buf = msgpack.encode(state);
   const compressed = lz4.encode(buf);
   await storage.set(key, compressed);
   ```

7. **Store Snapshots Periodically:**  
   - Every 1s, persist `meta:snapshot:<timestamp>`
   - On every heartbeat, update `meta:latest`

8. **Restore on Boot:**  
   - On startup, attempt to load `meta:latest` and hydrate state

9. **Unit Tests:**  
   - Use `ioredis-mock`
   - Test roundtrip encode/decode, TTL, key scan

10. **Error Handling:**  
    - On Redis failure, log & fallback to in-memory

11. **Update CI:**  
    - Add redis service to CI job for tests

12. **Production Env:**  
    - Set `REDIS_URL` and `REDIS_TLS` in secrets manager

13. **Monitoring:**  
    - Track number of snapshots, age of latest, error count

14. **Rollback:**  
    - Remove Redis bootstrap; revert to in-memory adapter
    - Purge snapshot keys: `redis-cli KEYS "meta:snapshot:*" | xargs redis-cli DEL`

15. **Commit Template:**  
    ```
    feat(meta-persistence): add RedisSpiralAdapter snapshot persistence & restore
    ```

16. **QA Steps:**  
    - Restart pod, confirm state resumes
    - Simulate Redis outage, ensure graceful fallback
    - TTL expiry cleans up old snapshots

17. **Done Criteria:**  
    - Snapshots visible in Redis
    - State is restored after restart
    - No data loss during routine deploy