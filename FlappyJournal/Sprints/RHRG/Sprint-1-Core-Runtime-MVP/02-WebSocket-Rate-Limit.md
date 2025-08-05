# 02 – WebSocket Rate Limit

## Goal
Prevent abuse and DoS by rate-limiting WebSocket connections and messages per user and per-IP, using Redis-backed `rate-limiter-flexible`.

## Prerequisites
- `rate-limiter-flexible` and `ioredis` installed
- Redis running for dev and test
- JWT middleware from previous step

## Step-by-Step Instructions

1. **Install Packages**
   ```sh
   npm install rate-limiter-flexible ioredis
   ```

2. **Setup Redis RateLimiter**
   - File: `server/api/modules/holograph/rateLimit.ts`
   ```ts
   import { RateLimiterRedis } from 'rate-limiter-flexible';
   import Redis from 'ioredis';

   const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
   export const wsRateLimiter = new RateLimiterRedis({
     storeClient: redisClient,
     keyPrefix: 'ws-rate',
     points: 100, // messages
     duration: 10, // per 10 seconds
     blockDuration: 5 // block for 5 seconds on abuse
   });
   ```

3. **Enforce in WS Gateway**
   - File: `server/api/modules/holograph/gateway.ts`
   - Pseudocode:
     ```ts
     ws.on('message', async (msg) => {
       try {
         await wsRateLimiter.consume(req.user.id);
         // handle message
       } catch {
         ws.send(JSON.stringify({ code: 429, error: 'Rate limit exceeded' }));
         ws.close(4008, 'Rate limit');
       }
     });
     ```

4. **Test Under Load**
   - Use `wscat` or custom script to send bursts of messages.

5. **Add Metrics**
   - Emit `holo_ws_rate_limited_total` in Prometheus endpoint.

## Verification & Acceptance Criteria
- [ ] Burst over 100 messages/10s triggers rate-limit and closes connection
- [ ] Block duration is enforced (subsequent attempts blocked for 5s)
- [ ] Prometheus metric is incremented on each limit event
- [ ] Integration test covers limit and normal flow

## Time Estimate & Owner
- 0.5 day (Backend)

## Common Pitfalls & Mitigations
- **Pitfall:** Redis connection leaks or timeouts  
  **Mitigation:** Monitor Redis logs, use health checks

- **Pitfall:** Rate-limiter blocks all traffic due to misconfig  
  **Mitigation:** Start with permissive settings, test incrementally

- **Pitfall:** No feedback to user on limit  
  **Mitigation:** Always send structured rate-limit error before closing socket