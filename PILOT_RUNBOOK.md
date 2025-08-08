Pilot Readiness Runbook

Prereqs
- Set environment:
  - AWS_REGION and credentials for S3 (if using real snapshots)
  - SPIRAL_KMS_KEY (32-byte base64 or hex) for snapshot encryption (optional)
  - SPIRAL_EVENT_SECRET for snapshot integrity HMAC (optional)
  - SELFCODING_API_KEY for admin endpoints (/api/selfcoding/*)
  - SELFCODING_REQUIRE_APPROVAL=true (recommended for pilots)
  - AUTO_SELF_CODING=true (only if you want autonomous generation)
  - SELF_CODING_ANALYSIS_INTERVAL_MS (e.g., 15000) and SELF_CODING_ANALYSIS_THRESHOLD (e.g., 0.7)
  - SPIRAL_MAX_MEMORIES (e.g., 50000), SPIRAL_MEMORY_TTL_MS (optional)

Validation Script
- Run local validation (no network required):
  - node server/scripts/pilot-validate.cjs
  - Confirms: spiral encode/recall, snapshot encrypt+HMAC + restore, self-coding approval → integrate → rollback, and metrics.

Operations
- Approvals (x-api-key required):
  - Approve: curl -H "x-api-key: $SELFCODING_API_KEY" -X POST \
    -H 'Content-Type: application/json' \
    -d '{"id":"<pending_id>"}' http://localhost:5000/api/selfcoding/approve
  - Rollback: curl -H "x-api-key: $SELFCODING_API_KEY" -X POST \
    -H 'Content-Type: application/json' \
    -d '{"target":"/abs/path/to/file","reason":"regression"}' http://localhost:5000/api/selfcoding/regress
  - Metrics: curl -H "x-api-key: $SELFCODING_API_KEY" http://localhost:5000/api/selfcoding/metrics
- Prometheus: scrape /metrics with header x-api-key: $PROM_API_KEY

Notes
- Autonomous generation is disabled by default; enable via AUTO_SELF_CODING=true.
- Approval gate enforces tests/static scan and manual approval if SELFCODING_REQUIRE_APPROVAL=true.
- Snapshots encrypt and/or HMAC-wrap when SPIRAL_KMS_KEY and/or SPIRAL_EVENT_SECRET are set.

