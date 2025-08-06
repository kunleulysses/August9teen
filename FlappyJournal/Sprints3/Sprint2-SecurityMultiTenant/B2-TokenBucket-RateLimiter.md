# Ticket B2 – Token-Bucket Rate Limiter

## Goal
Implement a per-user, per-tenant token-bucket rate limiter for the /sigil API, enforcing a strict quota (e.g., 200 requests per 10 seconds) to prevent abuse, DoS, or runaway clients.

## Context

Currently, the Sigil-DNA API endpoints (see [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)) are completely unprotected from rapid repeated access. This means a single user or compromised script could flood the API with requests, exhausting compute or storage resources, and potentially impacting all tenants. This is particularly risky for endpoints that mint or verify sigils, as they involve cryptographic computation and persistence.

A rate limiter is a standard security and reliability control for modern APIs. The token-bucket algorithm is preferred for burst-friendly, distributed enforcement. This ticket will:
- Use a high-performance in-memory or distributed rate limiter (e.g., `@koa/rate-limit`, `rate-limiter-flexible`, or custom).
- Track usage per user (from JWT `sub` claim) and per tenant (from JWT `tenantId` claim).
- Expose configuration for rate (200 requests/10s).
- Respond with HTTP 429 (Too Many Requests) if the limit is exceeded, and include `Retry-After` header.
- Log all rate-limited requests for audit and alerting.

Key files:
- [`server/sigil-api.cjs`](../../server/sigil-api.cjs)
- `server/auth/jwtMiddleware.js` (for extracting user/tenant)
- New: `server/middleware/rateLimiter.js`
- Test code in `__tests__/sigil/`

## Prerequisites

- Node.js v18.x or higher
- `rate-limiter-flexible` npm package (`npm install rate-limiter-flexible`)
- Redis instance (optional, for distributed enforcement)
- Working JWT authentication (see B1)
- ENV: `SIGIL_RATE_LIMIT`, `SIGIL_RATE_WINDOW`, `REDIS_URL` (optional)
- Ability to update Express middleware

## Step-by-Step Implementation

### 1. Install and Configure rate-limiter-flexible

```bash
npm install rate-limiter-flexible
```

### 2. Create Rate Limiter Middleware

1. In `server/middleware/rateLimiter.js`:
   ```js
   const { RateLimiterMemory } = require('rate-limiter-flexible');

   const limiter = new RateLimiterMemory({
     points: process.env.SIGIL_RATE_LIMIT || 200, // 200 requests
     duration: process.env.SIGIL_RATE_WINDOW || 10 // per 10 seconds
   });

   function rateLimiter(req, res, next) {
     // Use JWT-derived user and tenant as key
     const userKey = req.user ? `${req.user.tenantId || 'public'}:${req.user.sub}` : req.ip;
     limiter.consume(userKey)
       .then(() => next())
       .catch(() => {
         res.set('Retry-After', limiter.msBeforeNext / 1000);
         res.status(429).json({ error: 'Too Many Requests' });
         req.log && req.log.warn({ userKey }, 'Rate limit exceeded');
       });
   }
   module.exports = rateLimiter;
   ```

### 3. Integrate Middleware into API

1. In `sigil-api.cjs`, apply globally:
   ```js
   const rateLimiter = require('./middleware/rateLimiter');
   router.use(rateLimiter);
   ```
2. Or, for sensitive endpoints:
   ```js
   router.post('/api/consciousness/sigils', rateLimiter, handler);
   ```

### 4. (Optional) Use Redis for Distributed Enforcement

1. If running multiple pods/containers, use `RateLimiterRedis`:
   ```js
   const { RateLimiterRedis } = require('rate-limiter-flexible');
   const Redis = require('ioredis');
   const redis = new Redis(process.env.REDIS_URL);
   const limiter = new RateLimiterRedis({ storeClient: redis, ... });
   ```

### 5. Expose Config and Document ENV

- In `.env.example`:
  ```
  SIGIL_RATE_LIMIT=200
  SIGIL_RATE_WINDOW=10
  ```

### 6. Log All Rate-Limited Events

- In logger, ensure all 429s are logged with userKey and endpoint.

---

## Verification

### Automated

- Unit tests: simulate >200 requests in 10s, assert 429 on 201st.
- Integration test: multiple users, each with independent quota.
- Test fallback to IP if JWT missing.

### Manual

- Use a loop with curl:
  ```bash
  for i in {1..201}; do
    curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/sigil/api/consciousness/sigils
  done
  ```
  201st request should return 429.

- Observe logs for rate-limited warnings.

### Distributed

- On multi-pod setup with Redis, verify limits are consistent across pods.

---

## Rollback

- Remove middleware from API:
  ```
  git checkout HEAD~1 -- server/middleware/rateLimiter.js server/sigil-api.cjs
  ```
- Remove package and ENV vars.

---

## Acceptance Criteria

- 200 requests per user per 10s allowed, 429 beyond that.
- Per-tenant isolation respected.
- All 429s are logged.
- No regressions in test suite.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [rate-limiter-flexible docs](https://github.com/animir/node-rate-limiter-flexible)
- [API Rate Limiting Best Practices](https://konghq.com/blog/api-rate-limiting-the-right-way/)
- [Express.js middleware](https://expressjs.com/en/guide/using-middleware.html)
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0xa4-rate-limiting/)
- [Token bucket algorithm](https://en.wikipedia.org/wiki/Token_bucket)