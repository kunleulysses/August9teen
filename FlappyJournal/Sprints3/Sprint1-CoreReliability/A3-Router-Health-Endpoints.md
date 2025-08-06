# Ticket A3 – Router-Mount-Healthchecks

## Goal
Integrate the Sigil API router into the main Express server so that all endpoints are reachable in both dev and prod, and add robust health and readiness endpoints for orchestration and monitoring.

## Context

Sigil endpoints are currently defined in [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs) as an Express router. However, the router is never mounted in the main server entrypoint (`server/index.cjs` or `server/index.ts`), meaning requests to `/api/consciousness/sigils` or similar will always return 404 in production builds. This was a root cause for failed integration and test coverage in prior sprints.

Additionally, observability and orchestration require that all services provide `/healthz` (liveness) and `/readyz` (readiness) endpoints for use by Kubernetes, Docker Swarm, and monitoring tools. The current implementation lacks these endpoints, impeding robust deployment, auto-scaling, and zero-downtime updates.

Key files:
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)
- [`FlappyJournal/server/index.cjs`](../../server/index.cjs)
- [`FlappyJournal/server/consciousness/core/security/eventSign.ts`](../../server/consciousness/core/security/eventSign.ts) (for auth middleware in future)

## Prerequisites

- Node.js v18.x or higher
- Express.js (`npm install express`)
- Access to main server entrypoint (`index.cjs` or `index.ts`)
- Ability to restart the service/container
- curl or httpie for endpoint testing
- k8s or Docker setup for liveness/readiness probe validation
- ENV: `SIGIL_API_MOUNT_PATH` (optional, default `/sigil`)

## Step-by-Step Implementation

### 1. Mount sigil-api Router in Main Server

**Why:** To ensure the API is reachable at a predictable path in all environments.

#### Steps:

1. Open `FlappyJournal/server/index.cjs` (or `index.ts` if using TypeScript).
2. Ensure Express app is created:
   ```js
   const express = require('express');
   const app = express();
   ```
3. Import the router:
   ```js
   const sigilApiRouter = require('./sigil-api.cjs');
   ```
4. Mount the router with a configurable path (default `/sigil`):
   ```js
   const mountPath = process.env.SIGIL_API_MOUNT_PATH || '/sigil';
   app.use(mountPath, sigilApiRouter);
   ```
5. Ensure body-parser middleware is in place for JSON requests:
   ```js
   app.use(express.json());
   ```

### 2. Add /healthz Endpoint

**Why:** k8s/docker needs a fast endpoint to check if the process is alive.

#### Steps:

1. In `index.cjs`, add:
   ```js
   app.get('/healthz', (req, res) => {
     res.status(200).json({ status: 'ok', ts: new Date().toISOString() });
   });
   ```

### 3. Add /readyz Endpoint

**Why:** Readiness should only return 200 if all critical dependencies (e.g., DB, LevelDB, Postgres) are ready.

#### Steps:

1. Add a readiness check, e.g.:
   ```js
   app.get('/readyz', async (req, res) => {
     // Example: check LevelDB/Postgres
     try {
       await sigilEngine.ping();
       res.status(200).json({ ready: true });
     } catch (err) {
       res.status(503).json({ ready: false, error: err.message });
     }
   });
   ```
2. Implement `ping()` in your storage/engine class to check DB connection or return a resolved Promise if not applicable.

### 4. Document Available Endpoints

Update README and quick-start docs to specify:
- `GET /sigil/api/consciousness/sigils`
- `POST /sigil/api/consciousness/sigils`
- `GET /healthz`
- `GET /readyz`

### 5. Add Logging for Health/Readiness

Log all healthcheck pings for traceability.
```js
app.get('/healthz', (req, res) => {
  logger.info({ route: '/healthz', ts: Date.now() }, 'Health check ping');
  res.status(200).json({ status: 'ok' });
});
```

---

## Verification

### Unit Tests

- Use supertest/Jest to verify:
  ```js
  const request = require('supertest');
  test('healthz returns 200', async () => {
    const res = await request(app).get('/healthz');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
  test('readyz returns 200 if DB ready', async () => {
    // mock DB ready here
    const res = await request(app).get('/readyz');
    expect(res.statusCode).toBe(200);
    expect(res.body.ready).toBe(true);
  });
  ```

### Integration

- `curl http://localhost:3000/healthz` returns 200
- `curl http://localhost:3000/readyz` returns 200 (if DB ready) or 503 (if not)
- `curl http://localhost:3000/sigil/api/consciousness/sigils` returns last 10 sigils
- Test with k8s liveness/readiness probes:
  ```yaml
  livenessProbe:
    httpGet:
      path: /healthz
      port: 3000
    initialDelaySeconds: 3
    periodSeconds: 5
  readinessProbe:
    httpGet:
      path: /readyz
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 10
  ```

### Logging

- Check logs for all healthz/readyz hits.

---

## Rollback

- Remove router mounting, healthz/readyz endpoints, and restore prior `index.cjs`.
- `git checkout HEAD~1 -- FlappyJournal/server/index.cjs`
- Remove healthz/readyz from service manifest.

---

## Acceptance Criteria

- `GET /sigil/api/consciousness/sigils` returns 200 with latest sigils.
- `GET /healthz` always returns 200.
- `GET /readyz` returns 200 if all backends ready, 503 otherwise.
- All endpoints visible in logs and documentation.
- No regressions in test suite.

---

## Time Estimate & Assignee

- Estimate: 1 dev day (including PR review)
- Assignee: _______________________

---

## References / Further Reading

- [Express Router docs](https://expressjs.com/en/guide/routing.html)
- [Kubernetes probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- [Official Sigil API router](../../server/sigil-api.cjs)
- [Node.js Express quickstart](https://expressjs.com/en/starter/hello-world.html)