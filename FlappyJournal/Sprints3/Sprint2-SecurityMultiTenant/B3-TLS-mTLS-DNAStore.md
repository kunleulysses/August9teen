# B3: TLS/mTLS Enforcement for DNAStore

**Goal:**  
Force TLS on all outbound DNAStore calls, support mTLS.

## Background
- Calls currently over plain TCP.
- Sensitive data exposed.

## Tasks
- [ ] Add HTTPS client.
- [ ] Option to require mTLS.

## Acceptance Criteria
- No outbound HTTP allowed.

## Risks
- Certificate misconfig.

## Blockers
- None identified.