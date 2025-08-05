# B2: Token-Bucket Rate Limiter

**Goal:**  
Limit API rate per user to 200 req / 10s.

## Background
- No rate limiting in place.
- DoS risk.

## Tasks
- [ ] Integrate token-bucket limiter.
- [ ] Track by user/tenant.

## Acceptance Criteria
- Excess requests are rejected.

## Risks
- False positives, legit users blocked.

## Blockers
- None identified.