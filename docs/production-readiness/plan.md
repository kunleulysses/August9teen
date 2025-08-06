# Production Readiness Kick-off

## Meeting Notes
- Reviewed upcoming feature branches:
  - `feat/persistence-wal`
  - `feat/event-broker`
  - `feat/security-acl`
  - `feat/observability`
  - `feat/chaos-dr`
  - `feat/sigil-sha256`
- Confirmed need for per-folder CODEOWNERS to streamline reviews.
- Highlighted existing backup and `.orig` files; these are now ignored by linting to preserve history.
- Established action item to track production readiness tasks in this document.

## Next Steps
1. Define owners for each feature branch.
2. Draft detailed design docs for persistence and event broker.
3. Schedule security review focused on ACL changes.
