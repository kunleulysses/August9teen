# B11: JWT + Tenant Prefix Logic

**Goal:**  
Tie JWT claims to tenant prefixing in storage.

## Background
- Tenancy not enforced in backend.
- JWT not parsed for tenant info.

## Tasks
- [ ] Parse JWT for tenantId.
- [ ] Prefix storage keys accordingly.

## Acceptance Criteria
- All data segregated by tenant.

## Risks
- JWT parsing bugs.

## Blockers
- None identified.