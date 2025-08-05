# 03 – Semgrep SAST

## Goal
Integrate Semgrep OSS static analysis into CI, with a baseline rule set and project-level allowlist for noisy findings.

## Prerequisites
- GitHub Actions enabled
- `.github/workflows/security-and-quality.yml` exists
- `semgrep` installed locally for testing (optional)

## Step-by-Step Instructions

1. **Add Semgrep GitHub Action**
   - File: `.github/workflows/security-and-quality.yml`
   - Under a new `semgrep_sast` job:
   ```yaml
   semgrep_sast:
     name: Semgrep SAST
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - name: Run Semgrep OSS
         uses: returntocorp/semgrep-action@v1
         with:
           config: "p/default"
           generateSarif: "1"
       - name: Upload SARIF results
         uses: github/codeql-action/upload-sarif@v2
         with:
           sarif_file: semgrep.sarif
   ```

2. **Configure Ignore Rules**
   - File: `.semgrepignore`
   ```
   node_modules/
   dist/
   build/
   coverage/
   *.test.*
   ```

3. **Run Locally for Baseline**
   ```sh
   npx semgrep --config p/default --exclude node_modules
   ```

4. **Triage and Document Findings**
   - Suppress only with inline comments and document in `SECURITY.md`

## Verification & Acceptance Criteria
- [ ] All PRs scanned by Semgrep SAST job
- [ ] No critical issues on main branch
- [ ] Ignore file and suppression comments are documented

## Time Estimate & Owner
- 0.5 day (Security Guild, DevX)

## Common Pitfalls & Mitigations
- **Pitfall:** Noisy or irrelevant findings  
  **Mitigation:** Tune ignore file, add inline suppressions with reason

- **Pitfall:** SAST not run on all PRs  
  **Mitigation:** Make job required in branch protection

- **Pitfall:** SAST job slows CI  
  **Mitigation:** Use OSS ruleset, limit to changed files on PRs