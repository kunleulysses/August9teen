# Ticket B4 – Tenant Namespace Key Schema

## Goal
Implement a robust tenant namespace key schema in all persistent storage layers, ensuring that all sigil data is isolated by tenant and that no cross-tenant access is possible in multi-tenant deployments.

## Context

As the Sigil-DNA stack evolves to support multiple enterprise customers or user communities, it is essential to guarantee that each tenant (organization, customer, or logical boundary) has a strict namespace in all persistence layers. Currently, all sigils are stored in a flat keyspace (see [`FlappyJournal/server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs) and [`FlappyJournal/server/consciousness/persistence/PostgresStore.cjs`](../../server/consciousness/persistence/PostgresStore.cjs)), such as:
- `sigil:${sigilId}` in LevelDB
- PK (`sigil_symbol`, `auth_hash`) in Postgres

This flat schema enables accidental or malicious cross-tenant access and makes it difficult to purge or export tenant data on request. Proper namespacing makes:
- RBAC enforcement easier (see B10/B12).
- Data migrations, exports, and deletions safe and auditable.
- Queries and pagination within a tenant efficient via lexicographical ordering.

The new schema will:
- Prefix all storage keys with the `tenantId` claim (from JWT, see B1) or a default for single-tenant mode.
- Enforce prefix usage in all storage adapters and queries.
- Add tests to confirm no cross-tenant access is possible.
- Update all migration and backup scripts to respect namespaces.

## Prerequisites

- Node.js v18.x or higher
- Pluggable StorageDriver interface (see A15)
- Working JWT/OAuth2 auth (see B1), with `tenantId` claim
- ENV: `SIGIL_TENANT_MODE` (single- or multi-tenant)
- Access to all persistence code, migration scripts, and API logic
- Test tenants and tokens for validation

## Step-by-Step Implementation

### 1. Define Key Schema

- For LevelDB:
  ```
  <tenantId>!sigil!<sigilId>
  ```
- For Postgres:
  - Add `tenant_id` column (TEXT, NOT NULL, part of PK)
  - PK: (`tenant_id`, `sigil_symbol`, `auth_hash`)

### 2. Update StorageDriver and Adapters

1. In LevelDB adapter:
   ```js
   class LevelDBSigilAdapter {
     setSigilRecord(tenantId, sigilId, record) {
       const key = `${tenantId}!sigil!${sigilId}`;
       return this.db.put(key, record);
     }
     getSigilRecord(tenantId, sigilId) { ... }
     allSigilRecords(tenantId) {
       // Iterate with prefix filter
     }
   }
   ```
2. In PostgresStore:
   - Alter table:
     ```sql
     ALTER TABLE sigil_auth ADD COLUMN tenant_id TEXT NOT NULL DEFAULT 'public';
     ALTER TABLE sigil_auth DROP CONSTRAINT sigil_auth_pkey;
     ALTER TABLE sigil_auth ADD PRIMARY KEY (tenant_id, sigil_symbol, auth_hash);
     ```
   - Update all queries to filter by tenant_id.

### 3. Propagate tenantId from API

1. In API handlers, extract `tenantId` from `req.user` (see B1).
2. Pass `tenantId` to all storage calls.

### 4. Migrate Existing Data

1. Add migration script to update all legacy records to include tenantId.
2. For single-tenant, set `tenantId = 'public'`.

### 5. Enforce No Cross-Tenant Access

1. Add checks in all list, get, and put methods to require tenantId.
2. Write tests to attempt cross-tenant access and confirm 403/empty result.

### 6. Update Documentation

- Document key schema in README and runbooks.
- Add migration caveats for existing data.

---

## Verification

### Automated

- Unit tests for LevelDB/Postgres adapters:
  - Write, read, list within tenant: allowed
  - Attempt cross-tenant read: fail/empty
  - Migration script correctness

- Integration: API returns only tenant's sigils for authenticated user.

### Manual

- Populate multiple tenants, verify data segregation.
- Run backup/migration, confirm tenant boundaries preserved.

---

## Rollback

- Restore old flat key schema in adapters:
  ```
  git checkout HEAD~1 -- server/consciousness/persistence/
  ```
- Remove tenant_id column in Postgres.

---

## Acceptance Criteria

- All keys prefixed by tenantId in all stores.
- No cross-tenant access possible in API or storage.
- Migration script completes with no data loss.
- All RBAC/enforcement tests pass.

---

## Time Estimate & Assignee

- Estimate: 1.5 dev days
- Assignee: _______________________

---

## References / Further Reading

- [Multi-Tenancy Data Isolation Patterns](https://martinfowler.com/bliki/MultiTenancy.html)
- [LevelDB prefix iteration](https://github.com/Level/level#iterator)
- [Postgres composite primary keys](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [JWT claims for multi-tenancy](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-token-claims)
- [Data migration strategies](https://liquidata.co/blog/data-migration-strategies-for-multi-tenant-saas)