# Task D1: Ops Runbook & Threat Modeling

**Owner:** Docs/Platform  
**Pre-req:** SRE/DevOps input  
**Est. hours:** 2

---

## Objective

Draft operational run-book and threat model for the new metacognition production path.

## Run-Book Sections

- **Meta-State Recovery**
  - Restore path: How to recover from Redis outage or snapshot loss
  - Manual key replay: `redis-cli GET meta:latest > state.json`
  - Restart sequence for stateful recovery
- **PagerDuty Playbook**
  - Alert: heartbeat skew or missing
  - On-call steps for restart, log extraction
- **Metrics/A/K/SLO Links**
  - Prometheus targets for all new metrics
  - SLO: p95 analysis latency, heartbeat continuity, WS drops
- **Backup/Restore**
  - Schedule for Redis RDB/AOF backups
  - Restore process
- **Security Procedures**
  - Rotation of JWT secrets
  - Audit of scope claims and access logs

## Threat Model

- **Surface Map**
  - WebSocket, REST, Prometheus
- **Attack Scenarios**
  - Replay, scope escalation, reflection injection
- **Controls**
  - Scope checks, rate-limit, sanitization, metrics auth

## Commit Message

```
docs(runbook): add operational & threat model run-book for metacog
```

## Done Criteria

- Runbook covers all required procedures
- Threat model reviewed by security lead
- Linked in README/onboarding