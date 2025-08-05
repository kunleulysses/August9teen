# A13: Build Script Outputs eventSign.cjs

**Goal:**  
Ensure TypeScript eventSign is built/exported for CJS consumers.

## Background
- eventSign.cjs missing in build output.
- CJS imports break in prod.

## Tasks
- [ ] Add build step or symlink for eventSign.cjs.
- [ ] Test CJS consumers.

## Acceptance Criteria
- eventSign HMAC available to all modules.

## Risks
- Build step errors.

## Blockers
- None identified.