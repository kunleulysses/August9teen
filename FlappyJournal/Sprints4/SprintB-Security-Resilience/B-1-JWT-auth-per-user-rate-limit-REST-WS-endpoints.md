# B-1: JWT Auth + Per-User Rate-Limit on REST/WS Endpoints

## Objective & Success Criteria
**Objective:**  
Secure all new REST and WebSocket endpoints for resonance with JWT authentication and enforce per-user rate-limiting.

**Success Criteria:**  
- All API/WS endpoints require valid JWT.
- Rate-limit enforced per user (e.g. 100 req/min).
- Unauthorized or over-limit requests rejected with 401/429.
- Audit logs for all auth failures and rate-limits.

## Prerequisites / Dependencies
- Express server for REST/WS.
- Keycloak or other JWT issuer details.
- `express-jwt`, `express-rate-limit`, `ws` available.

## Architectural Context
- New: `FlappyJournal/server/routes/resonance.ts`
- New: `FlappyJournal/server/ws/resonance-ws.js`
- Config: `.env` with `JWT_ISSUER`, `JWT_AUDIENCE`

## Step-by-Step Implementation Plan

1. **Install Dependencies**
   ```sh
   pnpm add express express-jwt express-rate-limit ws
   ```

2. **REST Auth Middleware**
   - Use `express-jwt`:
     ```js
     const jwt = require('express-jwt');
     app.use(jwt({ secret: ..., audience: ..., issuer: ... }));
     ```

3. **Rate Limit Middleware**
   - Use `express-rate-limit`:
     ```js
     const rateLimit = require('express-rate-limit');
     app.use(rateLimit({ windowMs: 60*1000, max: 100, keyGenerator: req => req.user.sub }));
     ```

4. **Protect WS**
   - Parse JWT from query/header during handshake.
   - Attach user to connection; reject if invalid.
   - Track per-user connections for rate limiting.

5. **Audit Logging**
   - Log all denied requests with user, reason.

6. **Add Tests**
   - Unit/integration tests for:
     - Auth required
     - Rate-limit triggers
     - JWT expiry/revocation

## Observability Hooks
- Counter: `resonance_auth_failures_total`
- Counter: `resonance_rate_limit_triggered_total`
- Log all 401/429 events

## Security or Performance Considerations
- Use HTTPS; never accept JWT over plaintext.
- Protect rate-limit store (in-memory or Redis).

## Validation / Acceptance Checklist
- [ ] All endpoints reject unauthenticated
- [ ] Rate-limits work per user
- [ ] Audit logs for failures

## Rollback / Cleanup Notes
- Remove auth/rate-limit middleware to revert (emergency only).