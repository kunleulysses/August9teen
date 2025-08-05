# Task S1: WebSocket Rate-Limit & Scope Enforcement

**Owner:** BE/Security  
**Pre-req:** Keycloak `metacog.stream` scope, Redis available  
**Est. hours:** 4

---

## Objective

Enforce per-client WebSocket rate-limit and require JWT scope for metacognition streams. Sanitize all outbound payloads.

## Steps

1. **Update `createWsAuth`:**
   - Check `token.scope.includes('metacog.stream')`
   - Reject else: `401 Unauthorized`
2. **Integrate GeminiRateLimiter:**
   - Use per-client Redis bucket (20 frames/sec default)
   - Increment on each send, drop if over
3. **Sanitize Payload:**
   - Add `sanitizeState()` util: strip all reflection/insight text > 80 chars
   - Apply before outbound send
4. **Modify `websocket-server.cjs`:**
   - Before `client.send`, check rate-limit and sanitize
   - Log and drop frame if over
5. **Metrics:**
   - `ws_rate_limit_drops_total`
   - `ws_scope_reject_total`
6. **Flood Test:**
   - Write k6 script: open 10 clients, exceed limit, confirm drops/rejects
   - Sample k6:
   ```js
   import ws from 'k6/ws';
   export default function () {
     ws.connect('ws://localhost:3001', {}, function (socket) {
       for (let i=0;i<30;i++) socket.send('ping');
       socket.close();
     });
   }
   ```
7. **Commit Message:**
   ```
   feat(ws-security): enforce scope/rate-limit, sanitize payloads
   ```
8. **Done Criteria:**
   - Only scoped clients connect
   - No client can exceed 20 Hz
   - No sensitive reflection text leaks