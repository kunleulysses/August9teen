# A14: Docker COPY Path & HEALTHCHECK

**Goal:**  
Fix Dockerfile to COPY correct sigil files and add HEALTHCHECK.

## Background
- COPY path incorrect, missing files in image.
- No container healthcheck.

## Tasks
- [ ] Update Dockerfile COPY.
- [ ] Add HEALTHCHECK for /healthz.

## Acceptance Criteria
- Image includes all sigil logic.
- Healthcheck passes in k8s.

## Risks
- Healthcheck flaps.

## Blockers
- None identified.