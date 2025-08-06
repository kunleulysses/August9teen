# Security Middleware

## Table of Contents
1. Objective & Rationale
2. Prerequisites & Related Files
3. Files to Modify/Create
4. Step-by-Step Implementation
5. Validation & Unit Testing
6. Metrics/SLI Checkpoints
7. Effort Estimate & Role
8. Risks & Rollback
9. Done-Definition Checklist

---

## 1. Objective & Rationale

**Objective:**  
Enforce enterprise-grade security for all OS endpoints: TLS everywhere, JWT authentication (Keycloak), rate-limiting, and default-on signature verification.

**Rationale:**  
Current code exposes unauthenticated, plaintext sockets and APIs, posing a risk of data leakage, impersonation, and denial-of-service.

---

## 2. Prerequisites & Related Files

- Node.js v18+
- `fastify`, `@fastify/jwt`, `@fastify/rate-limit`, `@fastify/https` npm packages
- Keycloak or compatible OIDC provider
- `FlappyJournal/server/consciousness/core/security/`
- All WebSocket connection points

---

## 3. Files to Modify/Create

- **Create:**  
  - `FlappyJournal/server/consciousness/core/security/secure-server.js`
- **Modify:**  
  - All WebSocket upgrades and HTTP endpoints to go through secure-server.js

---

## 4. Step-by-Step Implementation

1. **Install Packages:**
   ```sh
   npm install fastify @fastify/jwt @fastify/rate-limit @fastify/https
   ```

2. **Scaffold Secure Server:**
   ```js
   // FlappyJournal/server/consciousness/core/security/secure-server.js
   const fastify = require('fastify')({ https: { key: ..., cert: ... } });
   fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET });
   fastify.register(require('@fastify/rate-limit'), { max: 20, timeWindow: '1 minute' });
   fastify.addHook('onRequest', async (req, reply) => {
     try {
       await req.jwtVerify();
     } catch (err) {
       reply.code(401).send({ error: 'Unauthorized' });
     }
   });
   // Signature verification middleware
   fastify.addHook('onRequest', require('./signatureVerify.js'));
   module.exports = fastify;
   ```

3. **Refactor All Endpoints:**
   - Import and use `secure-server.js` in all modules exporting HTTP or WS endpoints.
   - Remove any legacy direct server or socket creation.

4. **Configure Keycloak:**
   - Register client, set JWKS URI, assign roles.

---

## 5. Validation & Unit Testing

1. **Test:**
   ```sh
   npx jest FlappyJournal/server/consciousness/core/security/secure-server.test.js
   ```
2. **Sample Test:**
   ```js
   const fastify = require('./secure-server');
   test('rejects invalid JWT', async () => {
     const res = await fastify.inject({ method: 'GET', url: '/', headers: { authorization: 'Bearer FAKE' } });
     expect(res.statusCode).toBe(401);
   });
   ```

3. **Expected Output:**
   ```
   PASS  .../secure-server.test.js
   ✓ rejects invalid JWT (15 ms)
   ```

---

## 6. Metrics/SLI Checkpoints

- 100% of endpoints deny unauthenticated requests
- Rate-limiting returns 429 after burst

---

## 7. Effort Estimate & Role

- **Estimated Time:** 4 hours  
- **Responsible:** Security Engineer

---

## 8. Risks & Rollback

- **Risk:**  
  - Misconfigured JWT/Keycloak settings could block all access.
- **Rollback:**  
  - Revert to previous HTTP server and remove secure-server.js.

---

## 9. Done-Definition Checklist

- [ ] Secure server live for all endpoints
- [ ] JWT + rate-limit enforced everywhere
- [ ] Signature verification default-on
- [ ] All tests passing
- [ ] Peer review complete