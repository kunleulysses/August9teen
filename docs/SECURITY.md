# Spiral Memory Security & Tenant Isolation

## Encryption

- All data at rest can be encrypted with AES-256-GCM.
- Set `SPIRAL_KMS_KEY` to use your own key (env var), else a default is used for dev.
- LevelDB/Redis adapters encrypt on `.set()` and decrypt on `.get()` if a key is present.

## Tenant Isolation

- Every MemoryNode, Spiral, and Sigil carries a `tenantId`.
- SpiralMemoryFacade enforces that every store/retrieve operation must pass a tenantId (from event data or process.env.TENANT_ID).
- A tenant may only read or write their own data; public is used as fallback.
- CLI/testing: set `TENANT_ID` in your environment.

## Signed EventBus

- All store/retrieve events are signed with HMAC-SHA256 using `SPIRAL_EVENT_SECRET`.
- Verifiers on the bus can opt-in to signature checking.
- Invalid signatures trigger event:invalid_signature and are rejected.

## Migration

- Legacy records (plaintext or missing tenantId) are migrated to encrypted and tenant-aware format on first write.
- If tenantId is missing, 'public' is used.

## Example

```sh
export SPIRAL_KMS_KEY="your-key"
export SPIRAL_EVENT_SECRET="your-evt-secret"
export TENANT_ID="tenantA"
npm run spiral:serve
```

---