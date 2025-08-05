# A7: Docker Hardening & Non-Root User

**Goal:**  
Secure container build with non-root execution and health checks.

## Background
- Node runs as root.
- No HEALTHCHECK or volume mount for secrets/data.

## Tasks
- [ ] Update Dockerfile to use non-root user.
- [ ] Add HEALTHCHECK instruction.
- [ ] Mount data/secret volumes.

## Acceptance Criteria
- Container scan passes.
- Health probe works.

## Risks
- Permissions errors on data writes.
- Healthcheck false alarms.

## Blockers
- None identified.