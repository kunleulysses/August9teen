# ADR-001: Persistence: Why Postgres + Store Abstraction

## Context

The system must persist all consciousness, resonance, and state data across restarts and scale-out.  
Requirements: durability, horizontal scaling, transactional safety, and ability to support both in-memory and real DBs for dev/test.

## Decision

We implemented a Store abstraction with interchangeable backends:
- **InMemoryStore** for local dev and testing (no persistence)
- **PostgresStore** for durable, transactional backing in production

All top-level collections (realities, resonance nodes, histories, events) are proxied through this Store interface.  
The backend is selected via `STORE_BACKEND` environment variable.

## Consequences

- The system can be run with zero config (ephemeral) or with strong durability.
- We support blue/green migration between storage backends (see store-migrator CLI).
- Future migration to multi-tenant or sharded DBs is easier.
- Dev/test cycles are fast and isolated.
- Some minimal added complexity in async getter patterns and store integration.

*Status: accepted*