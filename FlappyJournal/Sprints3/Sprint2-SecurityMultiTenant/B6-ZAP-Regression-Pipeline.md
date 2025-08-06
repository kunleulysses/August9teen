# Ticket B6 – ZAP Regression Pipeline

## Goal
Fully automate dynamic application security testing (DAST) for the Sigil-DNA API using the OWASP ZAP scanner, integrating it into CI/CD and ensuring every build is checked for regressions against the OWASP Top 10.

## Context

Manual security testing is error-prone, inconsistent, and cannot keep up with rapid code changes. As Sigil-DNA exposes critical cryptographic and identity endpoints (see [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)), it is essential to continuously scan for vulnerabilities such as:
- Injection (SQL, JSON, command)
- Broken authentication
- Sensitive data exposure
- Insecure direct object references
- Missing security headers

OWASP ZAP is a widely adopted DAST tool, ideal for automated API scanning. It can be run as a Docker image in CI, with scripts to launch the API, run scans, and fail builds if critical issues are found.

Key files:
- `.github/workflows/ci.yml` or CI pipeline config
- New: `scripts/zap-regression.sh`
- ZAP config and policy files

## Prerequisites

- Docker installed in CI runners
- Node.js API must be launchable on ephemeral port
- ZAP Docker image (`owasp/zap2docker-stable`)
- ENV: `SIGIL_API_URL`, `CI_COMMIT_SHA`
- Network access between ZAP and API server in CI
- Ability to update CI config

## Step-by-Step Implementation

### 1. Author ZAP Regression Script

1. Create `scripts/zap-regression.sh`:
   ```bash
   #!/bin/bash
   set -euo pipefail
   API_URL=${SIGIL_API_URL:-http://localhost:3000}
   REPORT="zap-report-${CI_COMMIT_SHA:-local}.html"
   docker run --rm -v $(pwd):/zap/wrk:rw -t owasp/zap2docker-stable zap-baseline.py \
     -t "$API_URL" -r "$REPORT" -J "zap-report.json" -x "zap-report.xml" \
     -l INFO -z "-config replacer.full_list(0).description=authheader -config replacer.full_list(0).enabled=true"
   # Check for failure
   if grep -q "FAIL-NEW" "$REPORT"; then
     echo "ZAP scan found critical vulnerabilities!"; exit 1;
   fi
   ```

2. Make it executable:
   ```
   chmod +x scripts/zap-regression.sh
   ```

### 2. Add ZAP Step to CI

1. In `.github/workflows/ci.yml`:
   ```yaml
   - name: Start Sigil-DNA API
     run: npm run start &
   - name: Wait for API
     run: until curl -sSf $SIGIL_API_URL/healthz; do sleep 2; done
   - name: Run ZAP regression scan
     run: ./scripts/zap-regression.sh
   - name: Upload ZAP report
     uses: actions/upload-artifact@v3
     with:
       name: zap-report
       path: zap-report-*.html
   ```

### 3. Configure ZAP Policies

- Add ZAP policy files as needed to tune threshold (e.g., warn-only on missing CSP, fail on XSS or SQLi).

### 4. Test for OWASP Top 10

- Ensure ZAP config includes scans for:
  - Injection
  - Broken authentication
  - Sensitive data exposure
  - CSRF/XSS
  - Insecure transport, etc.

### 5. Document Security Regression Process

- In README and security runbook, explain:
  - How to run ZAP scans locally and in CI
  - How to interpret ZAP reports

---

## Verification

### Automated

- Every CI build runs ZAP scan.
- Build fails if any "FAIL-NEW" found in report.
- Reports archived for review.

### Manual

- Run script locally:
  ```
  SIGIL_API_URL=http://localhost:3000 ./scripts/zap-regression.sh
  ```
- Open report in browser, review findings.

### Security

- Confirm that all new endpoints are scanned.
- Validate ZAP can authenticate if needed (add Bearer tokens via replacer or scripts).

---

## Rollback

- Remove ZAP script from pipeline and CI.
- Restore previous CI config.

---

## Acceptance Criteria

- Every build is scanned for OWASP Top 10 vulns.
- Builds fail on critical findings.
- Reports are archived and actionable.
- No manual security review required for basic checks.

---

## Time Estimate & Assignee

- Estimate: 0.75 dev day
- Assignee: _______________________

---

## References / Further Reading

- [OWASP ZAP Docker](https://www.zaproxy.org/docs/docker/baseline-scan/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ZAP automation](https://www.zaproxy.org/docs/desktop/addons/automation-framework/)
- [ZAP GitHub Actions](https://github.com/marketplace/actions/owasp-zap-full-scan)
- [API Security Testing](https://cheatsheetseries.owasp.org/cheatsheets/REST_Assessment_Cheat_Sheet.html)