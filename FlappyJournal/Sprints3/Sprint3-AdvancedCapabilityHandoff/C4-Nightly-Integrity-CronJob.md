# Ticket C4 – Nightly Integrity CronJob

## Goal
Implement a nightly scheduled job (cron or k8s CronJob) that walks every sigil record, checks checksums/integrity, and triggers an alert if any corruption or missing data is detected.

## Context

As the Sigil-DNA system matures and scales, silent data corruption or loss becomes a risk—whether due to disk, LevelDB/Postgres faults, or logic bugs. Without regular integrity checks, issues may go undetected for days or weeks, leading to cascading failures or loss of trust.

A robust integrity cronjob should:
- Scan every sigil record in the database (LevelDB/Postgres)
- Verify checksums, schema validity, and essential fields
- Optionally, verify signatures using the current HMAC secret
- Produce a detailed integrity report (JSON or HTML)
- Trigger an alert (Slack, PagerDuty, or email) if any failures are found

Key files:
- [`server/consciousness/persistence/LevelDBSigilAdapter.cjs`](../../server/consciousness/persistence/LevelDBSigilAdapter.cjs)
- [`server/consciousness/persistence/PostgresStore.cjs`](../../server/consciousness/persistence/PostgresStore.cjs)
- New: `scripts/nightly-integrity-check.cjs`
- Prometheus/Grafana for job metrics

## Prerequisites

- Node.js v18.x or higher
- Access to production data store (LevelDB or Postgres)
- cron or k8s CronJob permissions
- ENV: `SIGIL_DB_PATH`, `DATABASE_URL`
- Notification endpoint credentials (Slack webhook, PagerDuty, email)
- Ability to update scripts and deployment manifests

## Step-by-Step Implementation

### 1. Author Integrity Checking Script

1. In `scripts/nightly-integrity-check.cjs`:
   ```js
   const { LevelDBSigilAdapter } = require('../server/consciousness/persistence/LevelDBSigilAdapter.cjs');
   const fs = require('fs');
   const crypto = require('crypto');
   const adapter = new LevelDBSigilAdapter(process.env.SIGIL_DB_PATH || './sigil-leveldb');
   async function check() {
     const report = { checked: 0, failed: 0, failures: [], ok: 0 };
     const all = await adapter.allSigilRecords();
     for (const rec of all) {
       report.checked++;
       if (!rec.id || !rec.signature) {
         report.failed++; report.failures.push({ id: rec.id, reason: 'Missing fields' }); continue;
       }
       // Verify checksum if present
       if (rec.checksum) {
         const raw = JSON.stringify(rec.data || {});
         const realChecksum = crypto.createHash('sha256').update(raw).digest('hex');
         if (realChecksum !== rec.checksum) {
           report.failed++; report.failures.push({ id: rec.id, reason: 'Checksum mismatch' }); continue;
         }
       }
       report.ok++;
     }
     fs.writeFileSync(`integrity-report-${Date.now()}.json`, JSON.stringify(report, null, 2));
     if (report.failed > 0) {
       // Send alert (see step 4)
     }
     console.log(`Checked ${report.checked} sigils. ${report.failed} failures.`);
   }
   check();
   ```

### 2. Schedule CronJob

#### Local (crontab):
```
0 3 * * * cd /app && node scripts/nightly-integrity-check.cjs
```

#### Kubernetes:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: sigil-integrity-check
spec:
  schedule: "0 3 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: integrity-check
            image: sigil-dna:latest
            command: ["node", "scripts/nightly-integrity-check.cjs"]
            env:
            - name: SIGIL_DB_PATH
              value: /var/lib/sigil-leveldb
          restartPolicy: OnFailure
```

### 3. Verify Signatures (Optional)

- If HMAC secret is available, verify all signatures using eventSign.verify.

### 4. Send Alerts on Failure

- On any failure, send notification:
   ```js
   const https = require('https');
   function sendSlackAlert(msg) {
     const req = https.request('https://hooks.slack.com/services/XXX', { method: 'POST' });
     req.write(JSON.stringify({ text: msg }));
     req.end();
   }
   if (report.failed > 0) {
     sendSlackAlert(`Sigil integrity check FAILED: ${report.failed} errors. See report.`);
   }
   ```

### 5. Document and Monitor

- Document in runbooks how to run/interpret/restore from reports.
- Add Prometheus metric for last job status and duration.

---

## Verification

### Automated

- Run script on known-good data, expect 0 failures.
- Corrupt a JSON file, rerun, expect failure detected.

### Manual

- Check generated report file for correct counts.
- Verify Slack or PagerDuty alert fires on failure.

### Metrics

- Add `sigil_integrity_last_status` gauge (1=ok, 0=fail).

---

## Rollback

- Remove cronjob or script from crontab/k8s.
- Restore from last known good backup if major corruption detected.

---

## Acceptance Criteria

- Every sigil is checked nightly for integrity.
- Failures are detected, reported, and alerted within 24h.
- Report files are archived and actionable.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Node.js fs and crypto](https://nodejs.org/api/)
- [Kubernetes CronJobs](https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/)
- [Slack webhook API](https://api.slack.com/messaging/webhooks)
- [Prometheus job metrics](https://prometheus.io/docs/concepts/jobs_instances/)
- [Integrity check patterns](https://martinfowler.com/bliki/IntegrityCheck.html)