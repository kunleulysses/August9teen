# C-3: Collision Mitigation for Resonance-IDs (Hash Slice 10)

## Objective & Success Criteria
**Objective:**  
Add a 10-character hash slice to all resonance node/connection IDs to prevent collisions.

**Success Criteria:**  
- All IDs include a hash slice.
- No duplicate IDs in any test/run.

## Prerequisites / Dependencies
- Node.js `crypto` module.

## Architectural Context
- ID generation in `ConsciousnessResonanceNetworks.cjs` and related modules.

## Step-by-Step Implementation Plan

1. **Update ID Generation**
   - Use `crypto.createHash('sha256').update(data).digest('hex').slice(0, 10)` for hash.
   - Prepend/append to node/connection IDs.

2. **Test for Collisions**
   - Create 10,000+ IDs in parallel, assert uniqueness.

3. **Backfill Existing IDs**
   - If needed, update Redis keys to new format.

4. **Document Format**
   - Update RUNBOOK and developer docs.

## Observability Hooks
- Gauge: `resonance_id_collision_count`
- Log collisions

## Security or Performance Considerations
- Never use predictable input data for hashing.

## Validation / Acceptance Checklist
- [ ] All IDs have hash slice
- [ ] No collisions in stress test

## Rollback / Cleanup Notes
- Restore old ID format.