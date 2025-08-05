# Sprint-A Ticket Stubs: Holographic Reality Generation Hardening

## A-1: CI/Jest/coverage scaffold
- [ ] Add CI workflow (GitHub Actions)
- [ ] Ensure Jest is configured and minimal passing tests exist
- [ ] Coverage threshold ≥ 80%
- [ ] Add coverage report artifact to CI

## A-2: JWT Auth + WS Rate-Limit
- [ ] Integrate JWT authentication middleware (reuse from Spiral-Memory)
- [ ] Add WebSocket rate-limiting (lib: express-rate-limit or rate-limiter-flexible)

## A-3: Basic Prometheus Gauges
- [ ] Expose FPS, scene node count, and GPU memory metrics using prom-client
- [ ] Document metrics endpoint

## A-4: Frame-budget Enforcement & Back-pressure
- [ ] Enforce frame-time cap (≤16ms) with back-pressure if over budget
- [ ] Log and emit metrics for frames over budget

## A-5: Initial Threat Model Doc
- [ ] Create and document initial threat model (attack surface, key risks, mitigations)

---
_Reference: See roadmap and audit in `Recursive Holographic Reality Generation` handoff doc._