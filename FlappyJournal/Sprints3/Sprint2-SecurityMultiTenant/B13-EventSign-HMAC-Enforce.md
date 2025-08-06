# B13: eventSign HMAC Enforcement

**Goal:**  
Require eventSign HMACs on /sigils/verify and internal calls.

## Background
- HMAC signatures not enforced or checked.
- EventSign CJS bug previously blocked this.

## Tasks
- [ ] Require HMAC signature on verify endpoints.
- [ ] Validate in middleware.

## Acceptance Criteria
- All internal calls authenticated.

## Risks
- HMAC key mismanagement.

## Blockers
- None identified.