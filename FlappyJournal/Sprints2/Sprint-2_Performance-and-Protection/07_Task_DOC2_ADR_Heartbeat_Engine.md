# Task DOC2: Architectural Decision Record – Heartbeat Engine

**Owner:** Docs/Lead Eng  
**Pre-req:** Sprint 1-2 work complete  
**Est. hours:** 1

---

## Objective

Document final design and rationale for HeartbeatEngine, including tradeoffs and alternate paths.

## Sections

- **Context:**  
  - Why replace legacy timers, concurrency, drift
- **Decision:**  
  - Single adaptive HeartbeatEngine, drift-compensated scheduler, worker-thread segregation for heavy analysis
- **Consequences:**  
  - Predictable CPU, memory safe, easier observability
- **Alternatives considered:**  
  - setInterval, cluster, third-party schedulers
- **Rollout:**  
  - Staged via feature flag, soak test, alert thresholds
- **Commit Message:**  
  ```
  docs(adr): document HeartbeatEngine architecture and rationale
  ```
- **Done Criteria:**
  - ADR reviewed, published, and linked from main README