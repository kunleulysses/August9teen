# Self-Coding Operations Guide

This guide summarizes environment flags, safety gates, quotas, and a pragmatic pilot rollout for the consolidated SelfCodingModule.

## Flags and Modes
- `SELFCODING_ENABLED`: feature kill switch in your invocation path.
- `DRY_RUN=1`: write PR artifacts only (no writes).
- `AUTO_PR=1`: always produce PR artifacts under `artifacts/selfcoding-pr/`.
- `SELF_IMPROVE_AUTO=1`: allow direct writes (when `targetPath` is provided) if under `SELFCODING_WRITE_ROOT`.
- `SELFCODING_WRITE_ROOT`: allowlisted base for writes (default: `FlappyJournal/server/generated`).
- `SANDBOX_VERIFY=1`: run isolated‑vm sandbox verification (auto‑integration path).
- `STATIC_SEVERITY_BLOCK`: ESLint severity threshold to block (default `2` = errors).
- `QUOTA_BACKEND=pg|redis`: distributed quota backend (default `pg`).
- `SELFCODING_QUOTA_PER_HOUR`: default hourly limit per principal/scope/purpose (default `100`).
- `DATABASE_URL`, `REDIS_URL`: connection strings for quota backends.

## Quotas
- Quota key: `selfcoding:<principal>:<scope>:<purpose>`
  - `principal` = `authContext.userId || authContext.tenantId || 'anonymous'`
  - `scope` = request.scope or `global`
  - `purpose` = sanitized, lower‑snake‑case
- Metrics:
  - `selfcoding_quota_used`
  - `selfcoding_quota_limit`
- Postgres reset example:
  ```sql
  UPDATE selfcoding_quota SET used = 0, reset_ts = EXTRACT(EPOCH FROM NOW())*1000 + 3600000 WHERE id = 'selfcoding:tenantA:global:pilot_demo';
  ```
- Redis reset example:
  ```sh
  redis-cli DEL selfcoding_quota:selfcoding:tenantA:global:pilot_demo
  ```

## Safety Gates
- Static scan (ESLint) enforced in auto‑integration; fallback denylist when ESLint is unavailable.
- V8 sandbox verification via `isolated-vm` when `SANDBOX_VERIFY=1`.
- Write boundary: `SELFCODING_WRITE_ROOT` to prevent repo‑wide mutations.
- PR artifacts (for review or audit) under `artifacts/selfcoding-pr/<timestamp>/`:
  - `generated.cjs`, `metadata.json`, `REPORT.md`

## Observability
- Core metrics: `selfcoding_generated_total`, `code_generation_failures_total`, `selfcoding_history_size`.
- Quotas: `selfcoding_quota_used`, `selfcoding_quota_limit`.
- Alert on sustained sandbox failures, elevated failure rate, or quota saturation.

## Pilot Rollout (Recommended)
1. Week 0: Enable `DRY_RUN=1`, `SANDBOX_VERIFY=1` for 1–2 teams and 2–3 purposes.
2. Week 1: Switch to `AUTO_PR=1` (no direct writes). Require CODEOWNERS approval.
3. Week 2: For low‑risk folders, set `SELF_IMPROVE_AUTO=1` and `SELFCODING_WRITE_ROOT` with canaries.
4. SLOs: ≥95% success, <1% sandbox failures, improving PR turnaround.
5. Runbooks: quota trip, sandbox fail, PR revert.

## Multi‑Tenant Pattern
- Control plane: shared API/auth/quotas/dashboards.
- Per‑tenant workers: sandbox + queues + PR bot credentials.
- Strong isolation with per‑tenant namespaces and secrets.

## Notes
- Sigil/DNA embedding and spiral memory exist; ensure summary records are persisted and correlated to requests.
- Autonomous refactoring should be feature‑flagged and capped; run in “dry‑run” and PR mode initially.

