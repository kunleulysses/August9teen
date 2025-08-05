# A5: Structured Logger (pino) & Request-ID

**Goal:**  
Implement structured logging with per-request traceability.

## Background
- Only console.log is used.
- No request correlation or levels.

## Tasks
- [ ] Integrate pino logger.
- [ ] Add request-id middleware.
- [ ] Redact secrets in logs.

## Acceptance Criteria
- All logs in JSON.
- Each request traceable by ID.

## Risks
- Log volume impact.
- Sensitive info leakage.

## Blockers
- None identified.