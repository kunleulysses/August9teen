#!/bin/bash
set -euo pipefail

# C4: Nightly Integrity CronJob Script
# Checks all sigil records for corruption and integrity issues

echo "🔍 Starting Nightly Sigil Integrity Check"
echo "========================================"

REPORT_FILE="integrity-report-$(date +%Y%m%d-%H%M%S).json"
FAILED_COUNT=0
CHECKED_COUNT=0

# Initialize report
cat > "$REPORT_FILE" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "checked": 0,
  "failed": 0,
  "failures": [],
  "status": "running"
}
EOF

# Check sigil integrity
node -e "
const { LevelDBSigilAdapter } = require('./server/consciousness/persistence/LevelDBSigilAdapter.cjs');
const crypto = require('crypto');
const fs = require('fs');

async function checkIntegrity() {
  const adapter = new LevelDBSigilAdapter();
  const report = { checked: 0, failed: 0, failures: [] };
  
  try {
    const records = await adapter.allSigilRecords('public');
    
    for (const record of records) {
      report.checked++;
      
      if (!record.id || !record.signature) {
        report.failed++;
        report.failures.push({ id: record.id, reason: 'Missing required fields' });
        continue;
      }
      
      // Verify checksum if present
      if (record.checksum) {
        const raw = JSON.stringify(record.data || {});
        const realChecksum = crypto.createHash('sha256').update(raw).digest('hex');
        if (realChecksum !== record.checksum) {
          report.failed++;
          report.failures.push({ id: record.id, reason: 'Checksum mismatch' });
        }
      }
    }
    
    report.status = report.failed > 0 ? 'failed' : 'passed';
    report.timestamp = new Date().toISOString();
    
    fs.writeFileSync('$REPORT_FILE', JSON.stringify(report, null, 2));
    
    if (report.failed > 0) {
      console.error(\`❌ Integrity check failed: \${report.failed} errors\`);
      process.exit(1);
    } else {
      console.log(\`✅ Integrity check passed: \${report.checked} records verified\`);
    }
    
  } catch (error) {
    console.error('💥 Integrity check error:', error.message);
    process.exit(1);
  } finally {
    await adapter.close();
  }
}

checkIntegrity();
"

# Send alert if failures detected
if [[ -f "$REPORT_FILE" ]]; then
  FAILED_COUNT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$REPORT_FILE')).failed)")
  
  if [[ "$FAILED_COUNT" -gt 0 ]]; then
    echo "🚨 Sending failure alert..."
    
    # Send Slack notification if webhook configured
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
      curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 Sigil integrity check FAILED: $FAILED_COUNT errors detected. Check report: $REPORT_FILE\"}" || true
    fi
  fi
fi

echo "📊 Integrity check complete. Report: $REPORT_FILE"