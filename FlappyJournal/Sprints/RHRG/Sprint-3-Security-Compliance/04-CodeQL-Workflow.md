# 04 – CodeQL Workflow

## Goal
Enable GitHub CodeQL analysis for JS/TS and Dockerfile security, using recommended query packs and upload SARIF to Security tab.

## Prerequisites
- GitHub repo with Actions enabled
- Sufficient repo permissions to enable Security tab
- `.github/workflows/` write access

## Step-by-Step Instructions

1. **Create CodeQL Workflow**
   - File: `.github/workflows/codeql.yml`
   ```yaml
   name: "CodeQL"

   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
     schedule:
       - cron: '0 0 * * 1'

   jobs:
     analyze:
       name: Analyze
       runs-on: ubuntu-latest
       permissions:
         actions: read
         contents: read
         security-events: write

       strategy:
         matrix:
           language: [ 'javascript', 'typescript' ]

       steps:
         - uses: actions/checkout@v4
         - name: Initialize CodeQL
           uses: github/codeql-action/init@v3
           with:
             languages: ${{ matrix.language }}
             queries: +security-and-quality

         - name: Autobuild
           uses: github/codeql-action/autobuild@v3

         - name: Perform CodeQL Analysis
           uses: github/codeql-action/analyze@v3
           with:
             category: "/language:${{ matrix.language }}"
   ```

2. **Monitor and Triage Alerts**
   - Review findings in GitHub Security tab after each run.

3. **Tune Query Packs as Needed**
   - Reference: https://docs.github.com/en/code-security/code-scanning/using-codeql-code-scanning-with-your-project

## Verification & Acceptance Criteria
- [ ] All PRs and pushes trigger CodeQL scan
- [ ] No critical/high untriaged findings on main
- [ ] SARIF results visible in Security tab

## Time Estimate & Owner
- 0.5 day (Security Guild, DevX)

## Common Pitfalls & Mitigations
- **Pitfall:** Autobuild step fails on monorepo  
  **Mitigation:** Use manual build step if needed

- **Pitfall:** Too many low-severity findings  
  **Mitigation:** Triage and mark as reviewed/false positive in GitHub UI

- **Pitfall:** SARIF not uploaded  
  **Mitigation:** Ensure `security-events: write` permission is set