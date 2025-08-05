# B4: Tenant Namespace Key Schema

**Goal:**  
Isolate sigils by tenant with key prefixing.

## Background
- All sigils in single namespace.
- Multi-tenant support missing.

## Tasks
- [ ] Prefix storage keys with tenantId.
- [ ] Enforce in all drivers.

## Acceptance Criteria
- No cross-tenant sigil access.

## Risks
- Key collision on migration.

## Blockers
- None identified.