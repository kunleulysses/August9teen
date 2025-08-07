# Pilot Readiness — Autonomous Self‑Coding Platform

This brief covers what a pilot needs, the rollout plan, and how we keep it safe.

## What’s Included
- Autonomous improvement loop (scheduler behind `FULLY_AUTONOMOUS=1`).
- Safety gates: ESLint static scan + denylist, isolated‑vm sandbox (`SANDBOX_VERIFY=1`).
- Distributed quotas (`QUOTA_BACKEND=pg|redis`, `SELFCODING_QUOTA_PER_HOUR`).
- Change control: PR artifacts (`AUTO_PR=1`) + optional GitHub/GitLab PR creation.
- Optional self‑apply inside `SELFCODING_WRITE_ROOT` (`SELF_IMPROVE_AUTO=1`).
- Canary control: `CANARY_APPLY_RATE=N` applies only 1 in N cycles.
- Daily cap: `CANARY_MAX_APPLIES_PER_DAY=M` limits auto‑applies per UTC day.
- Auto‑rollback: emit `autonomy:regression` to restore prior version.

## Pilot Rollout (2–4 Weeks)
1. Week 0 — Integration
   - Create tenant namespace, provision DB/Redis and Git provider credentials.
   - Configure: `SANDBOX_VERIFY=1`, `DRY_RUN=1`, `FULLY_AUTONOMOUS=1`, `AUTONOMY_INTERVAL_MIN=15`.
   - Import dashboard panels and set alerts (quota used/limit, success, sandbox fails, latency).
2. Week 1 — DRY_RUN only
   - Generate PR artifacts; review diffs and scan reports; tune ESLint rules if needed.
3. Week 2 — AUTO_PR
   - Open PRs to a controlled repo/folder with CODEOWNERS; validate throughput and review quality.
4. Week 3 — Canary Self‑Apply
   - `SELF_IMPROVE_AUTO=1`, set `SELFCODING_WRITE_ROOT` to a canary folder; use `CANARY_APPLY_RATE` (e.g., 5).
   - Add a CI step to emit `autonomy:regression` if canary smoke tests fail.

## SLOs & Runbooks
- SLOs: ≥95% success, <1% sandbox fails, MTTR targets.
- Runbooks: quota trip, sandbox fail, PR revert, regression rollback.

## Flags Cheat‑Sheet
- `FULLY_AUTONOMOUS=1`, `AUTONOMY_INTERVAL_MIN=15`
- `DRY_RUN=1`, `AUTO_PR=1`, `AUTO_PR_PROVIDER=github|gitlab`
- `SELF_IMPROVE_AUTO=1`, `SELFCODING_WRITE_ROOT=FlappyJournal/server/generated`
- `CANARY_APPLY_RATE=N`
- `CANARY_MAX_APPLIES_PER_DAY=M`
- `SANDBOX_VERIFY=1`, `STATIC_SEVERITY_BLOCK=2`
- `QUOTA_BACKEND=pg|redis`, `SELFCODING_QUOTA_PER_HOUR=100`, `DATABASE_URL`, `REDIS_URL`

## Demo Script
Run the demo with DRY_RUN and optional AUTO_PR:
```sh
SANDBOX_VERIFY=1 DRY_RUN=1 node scripts/demo-selfcoding.cjs
# with PR creation (configure provider env vars)
AUTO_PR=1 AUTO_PR_PROVIDER=github GITHUB_REPO=owner/repo GITHUB_TOKEN=... node scripts/demo-selfcoding.cjs
```

## Regression Webhook (File‑based)
From CI, emit a regression to trigger auto‑rollback:
```sh
node scripts/emit-regression.cjs --target FlappyJournal/server/generated/demo.cjs --reason "canary failed"
```

> Export this markdown to PDF via your preferred tool or print dialog.
