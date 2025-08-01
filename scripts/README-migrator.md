# Store Migrator CLI

A utility for exporting and importing all data between store backends.

## Usage

**Export from memory:**
```
node scripts/store-migrator.js export --backend memory --output dump.json
```

**Import to postgres:**
```
node scripts/store-migrator.js import --backend postgres --input dump.json
```

- Supported backends: `memory` (InMemoryStore), `postgres` (PostgresStore)
- By default, uses `STORE_BACKEND` env or memory
- Output is a JSON array of all objects (must have `.id` field for import)