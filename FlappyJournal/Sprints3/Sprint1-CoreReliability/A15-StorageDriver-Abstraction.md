# Ticket A15 – StorageDriver-Abstraction

## Goal
Design and implement a unified StorageDriver abstraction for the Sigil-DNA stack, enabling seamless swapping of LevelDB, Postgres, or in-memory backends with full test coverage and zero code drift.

## Context

The Sigil-DNA codebase currently contains multiple persistence backends:
- LevelDB (see [`FlappyJournal/server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs))
- Postgres (see [`FlappyJournal/server/consciousness/persistence/PostgresStore.cjs`](../../server/consciousness/persistence/PostgresStore.cjs))
- In-memory `Map`s (see [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs))

These are invoked in an ad-hoc, module-specific way, resulting in code duplication, interface drift, and fragile migration/testability. There is no consistent interface for persistence operations—each backend exposes different method names, error semantics, and key structures. This makes it difficult to:
- Write integration tests that run against all backends.
- Switch from one backend to another (e.g., for local dev vs. prod).
- Add future backends (e.g., Redis, DynamoDB, S3).
- Ensure all features (atomicity, durability, versioning) are available across storage types.

A production-grade solution requires:
- A canonical `StorageDriver` interface, with well-defined CRUD, list, query, and atomic update semantics.
- Full TypeScript types (or JSDoc for CJS).
- Concrete adapters for LevelDB, Postgres, and in-memory.
- Tests for contract compliance and edge-case coverage.
- Pluggable injection in all engine modules (e.g., SigilEngine, API, Authenticator).

## Prerequisites

- Node.js v18.x or higher
- TypeScript (recommended) or clear JSDoc
- `level` and `pg` npm packages
- Ability to update engine modules and their dependencies
- ENV: `SIGIL_STORAGE_BACKEND`, `SIGIL_DB_PATH`, `DATABASE_URL`
- Access to LevelDB and Postgres for integration tests

## Step-by-Step Implementation

### 1. Define the StorageDriver Interface

1. In `server/consciousness/persistence/StorageDriver.d.ts` (or .js with JSDoc):
   ```ts
   export interface StorageDriver {
     setSigilRecord(symbol: string, authHash: string, record: object): Promise<void>;
     getSigilRecord(symbol: string, authHash: string): Promise<object|undefined>;
     allSigilRecords(): Promise<object[]>;
     deleteSigilRecord(symbol: string, authHash: string): Promise<void>;
     close(): Promise<void>;
   }
   ```

2. Document all method contracts (param types, error semantics, return values).

### 2. Refactor LevelDB and Postgres Adapters

1. Refactor LevelDBSigilAdapter to implement StorageDriver:
   ```js
   class LevelDBSigilAdapter implements StorageDriver { ... }
   ```

2. Refactor PostgresStore to implement StorageDriver:
   ```js
   class PostgresStore implements StorageDriver { ... }
   ```

3. Optionally, add an InMemoryStorageDriver for testing:
   ```js
   class InMemoryStorageDriver implements StorageDriver { ... }
   ```

### 3. Pluggable Injection in Engine Modules

1. In `sigil-identity.cjs`, `sigil-api.cjs`, etc., accept a `storage` argument or set via ENV:
   ```js
   const backend = process.env.SIGIL_STORAGE_BACKEND || 'leveldb';
   let storage;
   if (backend === 'leveldb') storage = new LevelDBSigilAdapter(...);
   else if (backend === 'postgres') storage = new PostgresStore(...);
   else storage = new InMemoryStorageDriver();
   ```

2. Use only `storage.setSigilRecord`, `storage.getSigilRecord`, etc. in all code.

### 4. Integration and Contract Tests

1. In `__tests__/persistence/storageDriver.spec.js`:
   - Write tests that run against every driver:
     ```js
     [LevelDBSigilAdapter, PostgresStore, InMemoryStorageDriver].forEach(Adapter => {
       describe(`StorageDriver contract: ${Adapter.name}`, () => {
         let storage;
         beforeEach(() => { storage = new Adapter(...); });
         afterEach(async () => { await storage.close(); });
         it('should store and retrieve a record', async () => { ... });
         // More CRUD, error, concurrency, and edge-case tests
       });
     });
     ```

### 5. Document and Enforce Usage

1. Document the StorageDriver contract in the developer README and runbook.
2. Add a lint/pre-commit check that all storage calls use the new interface.

---

## Verification

### Automated

- All core modules use only the StorageDriver interface.
- All contract and integration tests pass for every adapter.
- Switching adapters requires no code change, only ENV update.

### Manual

- Start service with each backend, mint and retrieve sigils, verify persistence.
- Simulate storage failures and check error handling.

### Build

- Build/test pipeline runs storageDriver tests for all adapters.

---

## Rollback

- Restore previous adapter-specific code via git:
  ```
  git checkout HEAD~1 -- server/consciousness/persistence/
  ```
- Remove StorageDriver interface file and code.

---

## Acceptance Criteria

- Single StorageDriver interface in codebase, with full docs.
- All backends implement the interface with identical semantics.
- Engine modules never reference backend-specific code.
- All tests pass for every storage adapter.

---

## Time Estimate & Assignee

- Estimate: 1.5 dev days
- Assignee: _______________________

---

## References / Further Reading

- [LevelDB Node.js](https://github.com/Level/level)
- [pg (node-postgres)](https://node-postgres.com/)
- [Strategy pattern](https://refactoring.guru/design-patterns/strategy/js/example)
- [TypeScript interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [Test doubles for adapters](https://martinfowler.com/bliki/TestDouble.html)