# A9: eventSign Build Parity Fix

**Goal:**  
Ensure eventSign.cjs exports match eventSign.ts for runtime HMAC.

## Background
- eventSign.cjs is empty; CJS require fails.
- HMAC verification always false.

## Tasks
- [ ] Add build step for eventSign.cjs.
- [ ] Update all imports to built output.
- [ ] Add test for signature verification.

## Acceptance Criteria
- All sigil services use working HMAC.
- No silent require failures.

## Risks
- Type mismatches between TS and CJS.
- Missed signature bugs.

## Blockers
- None identified.