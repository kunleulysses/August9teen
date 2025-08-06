> Status: Complete

# 03 – WebSocket Auth + Rate Limiting

**Objective:**  
Implement robust, standards-based JWT authentication and per-client rate limiting for all quantum WebSocket endpoints.

**Why it matters:**  
Prevents unauthorized access and DoS attacks, meeting mandatory compliance and SRE requirements for production.

---

## Preconditions

- You are on a feature branch (e.g., `feat/quantum-audit`).
- Keycloak (or OIDC) is running and reachable, with a configured realm and client.
- ENV variables set:
  - `KEYCLOAK_URL`
  - `KEYCLOAK_REALM`
  - `KEYCLOAK_CLIENT_ID`
  - `KEYCLOAK_CLIENT_SECRET`
- Dependencies installed in your service package:
  ```sh
  npm install @fastify/websocket @fastify/rate-limit @auth/keycloak-jwt jsonwebtoken
  ```

---

## Procedure

### 1. Implement JWT Verification with Keycloak (RS256)

**File:** `server/consciousness/auth-middleware.ts`

```ts
import { FastifyRequest } from 'fastify';
import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';

const client = jwksClient({
  jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
});

export async function verifySigil(token: string): Promise<any> {
  const decoded = jwt.decode(token, { complete: true }) as any;
  if (!decoded) throw new Error('Invalid JWT');
  const kid = decoded.header.kid;
  const key = await client.getSigningKey(kid);
  const signingKey = key.getPublicKey();
  return jwt.verify(token, signingKey, { algorithms: ['RS256'] });
}
```

### 2. Integrate Auth in WS Handler

**File:** `server/consciousness/sigil-authenticated-quantum-resonance-network.cjs`

```js
const fastify = require('fastify')();
const websocket = require('@fastify/websocket');
const { verifySigil } = require('./auth-middleware.ts');

fastify.register(websocket);

fastify.get('/ws', { websocket: true }, async (connection, req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  try {
    await verifySigil(token);
  } catch (e) {
    connection.socket.close();
    return;
  }
  // Connection is authenticated
  // ...handle messages...
});
```

### 3. Add Rate Limiting

**File:** `server/consciousness/sigil-authenticated-quantum-resonance-network.cjs`

```js
fastify.register(require('@fastify/rate-limit'), {
  max: 100, // 100 requests per minute per IP
  timeWindow: 60 * 1000,
  hook: 'onSend',
  allowList: ['127.0.0.1'],
  ban: 1,
  errorResponseBuilder: function (req, context) {
    return { error: 'Too Many Requests' };
  }
});
```

### 4. Document Rate Limit in OpenAPI/README

Add to `docs/QUANTUM_WS_API.md`:

```
**Rate Limit:** 100 messages/minute/IP. Exceeding this will result in code: 429 and connection close.
**Auth:** All connections require Bearer JWT from Keycloak.
```

---

## Verification

1. **Valid JWT:** Connect with a valid Bearer token (`wscat --header "Authorization: Bearer $JWT" ...`) — connection accepted.
2. **Invalid JWT:** Use expired/invalid token — connection closed immediately.
3. **No token:** Omit Authorization header — connection closed.
4. **Rate limit:** Send >100 messages in a minute — receive `{ error: 'Too Many Requests' }`, socket closes.
5. **Logs:** Confirm rate-limited and rejected connections are logged.

---

## Rollback / Troubleshooting

- If all clients are rejected, verify Keycloak URL/client/secret, check for clock skew.
- To restore emergency access, set `ALLOW_INSECURE_QUANTUM_WS=true` in `.env`.
- Use logs: `tail -f logs/quantum-ws.log | grep error`
- To disable rate limiting for debug, comment out the `fastify.register('@fastify/rate-limit', ...)` block.

---

## Time Estimate

01:30

---

## Owner / JIRA

- Owner: Security Lead / Backend
- JIRA: Q5-1.3