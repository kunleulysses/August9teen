# 04 – Feature Flag Rollout

## Goal
Safely roll out the Holographic Reality Generation feature to users using progressive feature flags and controlled activation.

## Prerequisites
- Feature flag system configured (e.g. LaunchDarkly, Unleash, custom YAML)
- Staging and production environments available

## Step-by-Step Instructions

1. **Declare Feature Flag in Config**
   - File: `config/feature_flags.yaml`
   ```yaml
   holograph_reality_enabled:
     enabled: false
     rollout: 0
     description: "Enables Holographic Reality Generation features"
   ```

2. **Integrate Flag in Code**
   - File: `server/api/modules/holograph/gateway.ts`
   ```ts
   if (!featureFlags.holograph_reality_enabled) {
     return res.status(403).json({ error: 'Feature not enabled' });
   }
   ```

3. **Progressive Rollout Steps**
   - Update `rollout` percentage in config:
     ```yaml
     holograph_reality_enabled:
       enabled: true
       rollout: 5
     ```
   - Use percentage-based rollout to gradually enable for more users.
   - Monitor metrics and error rates after each increment.

4. **Full Enablement**
   - Once stable, set to 100%:
     ```yaml
     holograph_reality_enabled:
       enabled: true
       rollout: 100
     ```

5. **Document and Monitor**
   - Track rollout in `docs/holograph/FeatureFlag.md`
   - Add rollback plan: revert flag or reduce percentage if issues detected.

## Verification & Acceptance Criteria
- [ ] Feature flag config present and checked on every request
- [ ] Rollout progresses via controlled increments, monitored for regressions
- [ ] Rollback plan documented and tested in staging

## Time Estimate & Owner
- 0.5 day (Dev Rel, SRE)

## Common Pitfalls & Mitigations
- **Pitfall:** Flag not checked on all code paths  
  **Mitigation:** Audit all entrypoints, enforce in code review

- **Pitfall:** Users see inconsistent behavior during rollout  
  **Mitigation:** Use sticky assignment (user ID hash), document

- **Pitfall:** No fast rollback plan  
  **Mitigation:** Practice reducing flag to 0 quickly in staging before prod