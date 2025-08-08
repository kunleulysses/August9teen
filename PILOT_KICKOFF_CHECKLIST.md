Pilot Kickoff Checklist (10 Logos)

1) Success Criteria
- Define KPIs per logo: accuracy uplift vs. baseline RAG, p95 latency, approval-to-merge time, rollback rate.
- Document acceptable thresholds and SLOs (e.g., <1% rollback rate/week, p95 recall < 120ms).

2) Security & Access
- Set: SELFCODING_API_KEY, SPIRAL_KMS_KEY (32B), SPIRAL_EVENT_SECRET, AWS_REGION + creds.
- Confirm /api/selfcoding/* responds only with correct x-api-key.
- Confirm /metrics is scraped by Prometheus with auth as needed.

3) Configuration
- Guardrails: SELFCODING_REQUIRE_APPROVAL=true (initially), AUTO_SELF_CODING=false (enable after baselines).
- Throttle: SELF_CODING_ANALYSIS_INTERVAL_MS=15000, SELF_CODING_ANALYSIS_THRESHOLD=0.70.
- Memory: SPIRAL_MAX_MEMORIES=50000, SPIRAL_MEMORY_TTL_MS (e.g., 3 days = 259200000).

4) Baseline & Data
- Collect baseline metrics from the current RAG/stack for comparison.
- Prepare pilot datasets and define evaluation tasks (top-N recall, typical chat flows).

5) Deploy & Validate
- Deploy services; confirm /metrics and /api/selfcoding/metrics are reachable.
- Run: node server/scripts/pilot-validate.cjs.
- Manually test admin console at /admin/selfcoding (set API key in page) to approve/rollback.

6) Observability
- Import Grafana dashboard (monitoring/grafana/spiral-dashboard.json).
- Add Prometheus alerts (prometheus/alerts.yml) and include rule_files in Prom config.
- Watch counters: spiral_encode_total, spiral_recall_total, spiral_prune_total, spiral_snapshot_*.

7) Dry Run
- Enable AUTO_SELF_CODING=true for a small window; ensure approvals are still required.
- Verify code:approval:required events appear; approve a few; trigger a test rollback; confirm spiral memory encodes outcomes.

8) Go/No-Go
- Review early KPI trends after 24–48h: accuracy uplift, latency, approval times, rollback count.
- If stable, expand scope (more flows/data) and consider relaxing approval for low-risk change types.

9) Support & Cadence
- Set weekly pilot check-in: review KPIs, incidents, approvals, rollbacks.
- Define on-call/point of contact, escalation path.

10) Exit Criteria & Expansion
- Document success metrics per logo and expansion plan (more teams, more data flows, increased AUTO_SELF_CODING scope).

