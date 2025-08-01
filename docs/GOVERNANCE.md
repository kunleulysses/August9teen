# Spiral Memory Governance Engine

## Overview

Spiral Memory now supports DAO-style governance, allowing tenants to vote on runtime memory policies.

## Event Taxonomy

- `governance:proposal_created` – when a new proposal is open.
- `governance:vote_cast` – when a tenant votes.
- `governance:proposal_closed` – auto-emitted on expiry or manual close.

## CLI Usage

```sh
node scripts/spiral-governance-cli.js create tenantA "Increase GC budget" "gc_budget=30,gc_budget=60" 120
node scripts/spiral-governance-cli.js vote tenantB 1 gc_budget=60
node scripts/spiral-governance-cli.js list
node scripts/spiral-governance-cli.js tally 1
```

## Runtime Policy

When a proposal closes, the PolicyAdapter parses the winning option and updates SpiralMemoryArchitecture.memoryConfig live.

- `gc_budget=60` adjusts GC interval to 60s.
- `max_active=200` sets max active tier size.

---

See core/governance/ for engine and policy adapter code.