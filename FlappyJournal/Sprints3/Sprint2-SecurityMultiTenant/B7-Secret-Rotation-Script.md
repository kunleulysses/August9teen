# B7: Secret Rotation Script

**Goal:**  
Automate rotation of HMAC secrets; update live services.

## Background
- Secret static in repo.
- No rotation or revocation process.

## Tasks
- [ ] Script to rotate secret in Vault/k8s.
- [ ] Hot-reload in running services.

## Acceptance Criteria
- Secret can be rotated with zero downtime.

## Risks
- Missed key-sync, downtime.

## Blockers
- None identified.