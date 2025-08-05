# A16: SigilEngine Core (Merge Identity + Auth)

**Goal:**  
Create unified SigilEngine that merges encode/decode/verify/revoke logic.

## Background
- 3 code paths for sigil creation/validation.
- Drift between cryptographic routines.

## Tasks
- [ ] Merge sigil-identity and code-authenticator logic.
- [ ] Expose encode/decode/verify/revoke APIs.
- [ ] Add integration tests.

## Acceptance Criteria
- Single source of truth for sigil logic.
- All endpoints use unified API.

## Risks
- Missed edge-case in merge.
- Verification drift.

## Blockers
- None identified.