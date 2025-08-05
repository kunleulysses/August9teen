# A3: Router Mounting & Health Endpoints

**Goal:**  
Expose and integrate Sigil API with the main Express server, including liveness/readiness checks.

## Background
- Router currently not mounted; API unreachable in prod.
- No /healthz or /readyz endpoints.

## Tasks
- [ ] Mount sigil-api router in main server.
- [ ] Add /healthz GET endpoint.
- [ ] Add /readyz readiness probe.

## Acceptance Criteria
- API responds at /sigil.
- Health checks pass in k8s.

## Risks
- Mount path conflicts.
- Health check false-negatives.

## Blockers
- None identified.