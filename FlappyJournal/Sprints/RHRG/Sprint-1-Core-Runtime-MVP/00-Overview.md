# Sprint 1: Core Runtime MVP – Overview

## Goal
Deliver a working, secure, event-driven core runtime for Holographic Reality Generation. Implement authentication, foundational websocket controls, persistent scene graph, baseline worker, and initial metrics.

## Prerequisites
- Sprint 0 outputs: CI, perf-bench workflow, baseline dashboard, security scans
- Local dev setup: Node 20+, Docker, PostgreSQL, Redis
- Existing repo structure (`server/api`, `server/holograph`, `.github/workflows`)

## Step-by-Step Instructions
1. Complete JWT middleware (see 01-JWT-Middleware.md)
2. Implement WebSocket rate-limiting (see 02-WebSocket-Rate-Limit.md)
3. Define and run Prisma migration for SceneNode/FrameStat (see 03-Prisma-Migration-SceneNode.md)
4. Build renderer worker thread and link to scene graph (see 04-Renderer-Worker-Skeleton.md)
5. Emit baseline metrics to Prometheus (see 05-Metrics-Emission.md)
6. Link all new services in `server/api/index.ts` and update README

## Verification & Acceptance Criteria
- [ ] Authenticated WS clients can connect, unauthenticated are rejected
- [ ] SceneNode CRUD persists to DB and publishes deltas
- [ ] Renderer worker receives deltas and runs loop
- [ ] Prometheus endpoint exposes live FPS and node count
- [ ] All new code covered by tests (≥80% for new modules)

## Time Estimate & Owner
- 1.5 weeks (Backend squad, with DB and DevX support)

## Common Pitfalls & Mitigations
- **Pitfall:** Breaking changes in DB schema migrations  
  **Mitigation:** Use feature flags and run migration in a staging environment first

- **Pitfall:** WebSocket rate-limit logic blocks all traffic  
  **Mitigation:** Start with permissive limits and test under load

- **Pitfall:** Metrics endpoint not registering new gauges  
  **Mitigation:** Restart metrics server after changes, and test with `curl`