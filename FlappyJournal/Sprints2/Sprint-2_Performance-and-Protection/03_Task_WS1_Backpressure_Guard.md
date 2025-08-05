# Task WS1: WebSocket Backpressure Guard

**Owner:** Backend Eng  
**Pre-req:** Basic ws API knowledge  
**Est. hours:** 2

---

## Objective

Prevent OOM/disconnect due to excessive outbound buffer on WebSockets by adding backpressure checks.

## Steps

1. **In `websocket-server.cjs`:**
   - Before `client.send`, check:
     ```js
     if (client.readyState === 1 && client.bufferedAmount < 512 * 1024) { ... }
     ```
   - If over, skip send, increment `ws_backpressure_drops_total`
2. **Metrics:**
   - Counter for drops
   - Alert if >10/min
3. **Test:**
   - Simulate slow client (use k6 or netcat)
   - Confirm drops, no OOM
4. **Docs:**  
   - Inline comment, link to metric
5. **Commit Message:**  
   ```
   feat(ws-backpressure): guard outbound buffer, count drops
   ```
6. **Done Criteria:**
   - No OOM under slow/flood
   - Drops visible in metrics