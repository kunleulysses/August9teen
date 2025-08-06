# 05 – Runbooks & ADRs

**Objective:**  
Create operational runbooks and architectural decision records for all critical flows.

**Why it matters:**  
Enables rapid on-call response, preserves context for future devs.

---

## Preconditions

- All features merged
- Ops/SRE input on edge cases

---

## Procedure

### 1. Write runbooks

- Startup, shutdown, rollback, incident response
- Include sample commands, metrics, escalation contacts

### 2. Document ADRs

- Use template:
  - Context
  - Decision
  - Consequences

---

## Verification

- Runbooks reviewed by on-call SRE
- ADRs visible in docs/ or handoff/

---

## Rollback / Troubleshooting

- Update runbooks after each incident
- Amend ADRs if technical direction changes

---

## Time Estimate

00:50

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-5.5