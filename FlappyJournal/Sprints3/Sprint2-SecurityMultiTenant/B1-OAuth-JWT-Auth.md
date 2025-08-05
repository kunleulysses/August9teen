# Ticket B1 – OAuth/JWT Auth Middleware

## Goal
Add robust OAuth2/JWT authentication middleware to all `/sigil` API endpoints, enforcing that only authenticated users can access, mint, or verify sigils, and extracting tenant/user identity from token claims.

## Context

The current Sigil-DNA API endpoints (see [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)) are completely unauthenticated—anyone who can reach the service can mint or verify sigils, or enumerate all records. This is a major risk in production, especially for multi-tenant environments. Modern best practices dictate:
- All API access must be authenticated using JWT tokens issued by a trusted OAuth2 provider (e.g., Auth0, Okta, Google, Keycloak).
- Each JWT contains claims (`sub`, `tenantId`, `roles`) that are extracted for use in authorization and downstream auditing.
- Middleware must validate the JWT signature, check expiry, and reject any missing or invalid tokens.
- All endpoints must reject unauthenticated access with `401 Unauthorized` and log failures for alerting.

Key files:
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)
- New: `server/auth/jwtMiddleware.js` (or .ts)
- All test suites in `__tests__/sigil/`
- Docker/k8s manifests may need to expose env for public keys etc.

## Prerequisites

- Node.js v18.x or higher
- `jsonwebtoken` npm package (`npm install jsonwebtoken`)
- Obtain public key or JWKS endpoint from OAuth2 provider
- ENV:
  - `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_PUBLIC_KEY` or `JWT_JWKS_URI`
- Ability to update Express middleware and API routes
- Access to OAuth2 provider for test tokens
- curl or httpie for manual testing

## Step-by-Step Implementation

### 1. Install jsonwebtoken and jwks-rsa

```bash
npm install jsonwebtoken jwks-rsa
```

### 2. Implement JWT Middleware

1. In `server/auth/jwtMiddleware.js`:
   ```js
   const jwt = require('jsonwebtoken');
   const jwksRsa = require('jwks-rsa');

   const issuer = process.env.JWT_ISSUER;
   const audience = process.env.JWT_AUDIENCE;
   const jwksUri = process.env.JWT_JWKS_URI;

   const jwksClient = jwksRsa({
     cache: true,
     rateLimit: true,
     jwksUri
   });

   function getKey(header, cb) {
     jwksClient.getSigningKey(header.kid, (err, key) => {
       if (err) return cb(err);
       const signingKey = key.publicKey || key.rsaPublicKey;
       cb(null, signingKey);
     });
   }

   function jwtMiddleware(req, res, next) {
     const auth = req.headers.authorization;
     if (!auth || !auth.startsWith('Bearer ')) {
       return res.status(401).json({ error: 'Missing or invalid Authorization header' });
     }
     const token = auth.split(' ')[1];
     jwt.verify(token, getKey, { issuer, audience }, (err, decoded) => {
       if (err) {
         req.log && req.log.warn({ err }, 'JWT verification failed');
         return res.status(401).json({ error: 'Invalid token' });
       }
       req.user = decoded;
       next();
     });
   }
   module.exports = jwtMiddleware;
   ```

### 3. Apply Middleware to All API Routes

In `sigil-api.cjs`:
```js
const jwtMiddleware = require('./auth/jwtMiddleware');
router.use(jwtMiddleware);
```
Or, for selective protection:
```js
router.post('/api/consciousness/sigils', jwtMiddleware, handler);
```

### 4. Extract Claims

In each handler, access `req.user`:
```js
const tenantId = req.user.tenantId;
const userId = req.user.sub;
const roles = req.user.roles || [];
```
Use these for RBAC, logging, and tenancy.

### 5. Document and Test Required ENV

In README:
```
JWT_ISSUER=https://YOUR_AUTH_DOMAIN/
JWT_AUDIENCE=sigil-dna
JWT_JWKS_URI=https://YOUR_AUTH_DOMAIN/.well-known/jwks.json
```

---

## Verification

### Automated

- Unit tests for middleware: valid/invalid/missing tokens
- Integration test: curl with/without token
  ```bash
  curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/sigil/api/consciousness/sigils
  ```
- Test expired, tampered tokens

### Manual

- Issue token from OAuth2 provider, access API, confirm 200
- Remove token, confirm 401

### Logging

- Check logs for failed auth attempts

---

## Rollback

- Remove middleware from API routes
- Restore prior open endpoints
- Remove JWT dependencies

---

## Acceptance Criteria

- All /sigil endpoints require valid JWT
- Claims extracted and available on req.user
- 100% test coverage for auth paths
- No open endpoints in prod

---

## Time Estimate & Assignee

- Estimate: 1.25 dev days
- Assignee: _______________________

---

## References / Further Reading

- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [jwks-rsa npm](https://www.npmjs.com/package/jwks-rsa)
- [JWT Best Practices](https://auth0.com/docs/secure/tokens/json-web-tokens)
- [Node.js Express auth](https://expressjs.com/en/advanced/best-practice-security.html)
- [OAuth2 JWT RFC](https://datatracker.ietf.org/doc/html/rfc7519)