# Ticket A16 – SigilEngineUnification

## Goal
Merge all encode, decode, verify, and revoke logic into a single, canonical SigilEngine class, eliminating duplicate code paths and ensuring all API endpoints and internal modules share a unified cryptographic and data model.

## Context

The Sigil-DNA codebase currently contains three parallel implementations for sigil creation and verification:
- `sigil-identity.cjs` (in-memory, spiral/phi logic)
- `sigil-api.cjs` (REST endpoint, JSON file persistence)
- `sigil-based-code-authenticator.cjs` (advanced, Postgres-backed, code DNA logic)

This fragmentation results in:
- Code drift: cryptographic routines, sigil signatures, and resonance logic diverge.
- Maintenance burden: fixing a bug or updating a feature requires changes to multiple modules.
- Security risk: inconsistent signature verification and persistence increases attack surface.
- Integration friction: API endpoints and internal consumers may see different records or validation rules.

A unified SigilEngine class will:
- Expose all necessary methods: `encode()`, `decode()`, `verify()`, `revoke()`, `list()`.
- Accept dependency-injected StorageDriver and cryptographic helpers.
- Standardize all data models and key schemas.
- Be the sole source of truth for all sigil logic in both API and internal modules.

## Prerequisites

- Node.js v18.x or higher
- All prior refactorings (StorageDriver, eventSign parity) completed
- Test coverage for all code paths (unit, integration)
- ENV: `SIGIL_STORAGE_BACKEND`, `SIGIL_ENGINE_CONFIG`
- Ability to migrate data from legacy modules
- Full access to update engine modules, API, and tests

## Step-by-Step Implementation

### 1. Design the Unified SigilEngine API

1. In `server/consciousness/SigilEngine.js`:
   ```js
   class SigilEngine {
     constructor({ storage, crypto, config }) {
       this.storage = storage;
       this.crypto = crypto;
       this.config = config || {};
     }
     async encode(data, options) { ... }
     async decode(sigilId) { ... }
     async verify(data, signature) { ... }
     async revoke(sigilId) { ... }
     async list({ limit, cursor }) { ... }
   }
   module.exports = { SigilEngine };
   ```
2. Document all method signatures, params, and returns.

### 2. Merge Logic from All Existing Modules

1. Move spiral/phi/resonance code from `sigil-identity.cjs` into `SigilEngine.encode`.
2. Move code DNA and HMAC logic from `sigil-based-code-authenticator.cjs` into `SigilEngine`.
3. Standardize all data models and key formats (e.g., `{id, signature, resonancePattern, ...}`).

### 3. Wire StorageDriver and Crypto Helpers

1. Accept injected storage (LevelDB, Postgres, etc.) and crypto (sign/verify) in constructor.
2. Use only the StorageDriver interface for all persistence operations.

### 4. Refactor API and Consumers

1. In `sigil-api.cjs`, replace all direct calls to legacy modules with:
   ```js
   const { SigilEngine } = require('./consciousness/SigilEngine.js');
   const engine = new SigilEngine({ storage, crypto });
   ```
   API endpoints call `engine.encode`, `engine.verify`, etc.

2. In tests and internal modules, update all imports to use `SigilEngine`.

### 5. Add Versioning and Migration Logic

1. Store a version field in all new sigil records.
2. Add `migrateLegacyData()` method to import from JSON files or legacy DBs.

### 6. Write Exhaustive Integration and Property Tests

1. In `__tests__/SigilEngine.spec.js`, cover:
   - Encode/verify round-trip
   - Collision resistance
   - Revoke and list
   - Legacy data migration

2. Use property-based testing for cryptographic edge cases.

### 7. Document the Unified Engine

1. Add full API docs to README and runbooks.
2. Include sample code snippets for all methods.

---

## Verification

### Automated

- All endpoints (REST, WS) use SigilEngine for encode/verify.
- Tests pass for all engine methods and storage backends.
- Property tests show no collisions or regressions.
- Old modules are not referenced anywhere in production.

### Manual

- Mint, verify, revoke sigils via API and internal consumers.
- Migrate legacy data; verify all records are accessible.

---

## Rollback

- Restore previous modules and imports:
  ```
  git checkout HEAD~1 -- server/sigil-identity.cjs server/sigil-api.cjs server/consciousness/sigil-based-code-authenticator.cjs
  ```
- Remove SigilEngine and revert updated API/tests.

---

## Acceptance Criteria

- Only one source of truth for sigil encode/verify/revoke.
- All endpoints and modules use SigilEngine.
- All storage backends supported via config/injection.
- 100% test coverage for all engine methods.
- No regressions or data loss.

---

## Time Estimate & Assignee

- Estimate: 2 dev days (due to migration and test rewriting)
- Assignee: _______________________

---

## References / Further Reading

- [Node.js class patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [Refactoring to a single engine](https://martinfowler.com/bliki/ConsolidateDuplicateConditionalFragments.html)
- [Property-based testing](https://github.com/jackfranklin/testcheck-js)
- [Dependency injection in Node.js](https://blog.logrocket.com/dependency-injection-node-js/)
- [Designing extensible engines](https://khorikov.org/posts/2022-08-designing-pluggable-architecture/)