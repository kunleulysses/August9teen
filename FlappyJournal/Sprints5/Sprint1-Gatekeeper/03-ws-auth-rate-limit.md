# 03 – WebSocket Auth + Rate Limiting

**Objective:**  
Implement robust authentication and rate-limiting for all quantum WS endpoints.

**Why it matters:**  
Prevents unauthorized access, abuse, and denial-of-service attacks.

---

## Preconditions

- Keycloak/identity provider running
- `@fastify/websocket` and `@fastify/rate-limit` installed
- ENV: `KEYCLOAK_URL`, `KEYCLOAK_REALM`, `KEYCLOAK_CLIENT_ID`, `KEYCLOAK_SECRET`

---

## Procedure

### 1. Implement JWT verification

In `server/consciousness/sigil-authenticated-quantum-resonance-network.cjs`:

```js
const { verifyJwt } = require('../../auth-service/auth-middleware.ts');
wsServer.on('connection', (ws, req) => {
  const token = extractJwtFromReq(req);
  if (!verifyJwt(token)) return ws.close();
  // ...
});
```

### 2. Add rate limiting

```js
const fastify = require('fastify')();
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});
```

### 3. Document rate-limit in API docs

---

## Verification

- Attempt WS connection with/without valid JWT — only valid connects.
- `ab -n 200 -c 50 ws://…` should yield rate limit errors after 100/min.
- Check WS logs for denied attempts.

---

## Rollback / Troubleshooting

- If all clients blocked, check Keycloak secret/config.
- Temporarily set `ALLOW_INSECURE_QUANTUM_WS=true` for emergency access.

---

## Time Estimate

01:30

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-1.3