# Sprint 2 – Safe & Observable: Overview

## Table of Contents
1. Objective
2. Key Deliverables
3. Timeline & Owners
4. Acceptance Criteria
5. Related Modules

---

## 1. Objective

Advance platform resilience and transparency with chaos testing, advanced dashboards, automated TLS, robust memory management, coverage gating, and security scanning.

## 2. Key Deliverables

- Chaos harness for OS components
- Grafana dashboard v4 + alert rules
- Automated TLS cert rotation and deployment
- Memory GC job for long-lived state
- CI coverage gates and security scan (ZAP)

## 3. Timeline & Owners

- **Sprint Duration:** 2 weeks
- **Core Owners:**  
  - DevOps Engineer (chaos, GC, TLS automation)
  - Backend Engineer (metrics, dashboard)
  - Security Engineer (ZAP/coverage)
  - QA (test validation)

## 4. Acceptance Criteria

- Chaos harness can kill/delay core modules on demand
- Dashboard v4 deployed, alert rules fire on SLI breach
- TLS certs rotate automatically and reload without downtime
- Memory GC job reclaims >95% of eligible objects nightly
- CI fails on <80% coverage or new ZAP high/medium finding

## 5. Related Modules

See Sprint 1 plus:
- `tools/chaos/`
- `grafana/`
- `prometheus/`
- `bin/`
- `scripts/`
- CI configs