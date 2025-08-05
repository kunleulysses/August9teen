# B1: OAuth/JWT Auth Middleware

**Goal:**  
Add OAuth2/JWT authentication to /sigil API endpoints.

## Background
- No auth on current endpoints.
- All sigils globally visible.

## Tasks
- [ ] Add JWT middleware.
- [ ] Extract tenantId/sub claims.

## Acceptance Criteria
- Only authenticated users access endpoints.

## Risks
- Token parsing bugs.

## Blockers
- None identified.