# CI Examples — Demo + Regression Emission

## GitHub Actions

Demo workflow (already added): `.github/workflows/selfcoding-demo.yml`

Emit regression on failed canary tests in another workflow/job:

```yaml
name: Canary Tests
on:
  push:
    branches: [ main ]

jobs:
  canary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - name: Run canary tests
        run: npm run test:canary
      - name: Emit regression on failure
        if: failure()
        run: |
          node scripts/emit-regression.cjs \
            --target FlappyJournal/server/generated/demo.cjs \
            --reason "canary tests failed"
```

## GitLab CI

`.gitlab-ci.yml` snippet to run demo nightly and emit regression on failures.

```yaml
stages: [demo, canary]

demo:selfcoding:
  stage: demo
  image: node:20
  only:
    - schedules
  script:
    - npm ci || true
    - SANDBOX_VERIFY=1 DRY_RUN=1 node scripts/demo-selfcoding.cjs
  artifacts:
    when: always
    paths:
      - artifacts/selfcoding-pr

canary:test:
  stage: canary
  image: node:20
  script:
    - npm ci
    - npm run test:canary || (node scripts/emit-regression.cjs --target FlappyJournal/server/generated/demo.cjs --reason "canary failed" && false)
```

