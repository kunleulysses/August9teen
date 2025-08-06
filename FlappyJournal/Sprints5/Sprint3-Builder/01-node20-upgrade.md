# 01 – Node.js 20 Upgrade

**Objective:**  
Upgrade all runtime, Docker, and CI environments to Node.js 20 LTS.

**Why it matters:**  
Security, performance, and modern ES module support.

---

## Preconditions

- Access to Dockerfiles, CI config, and runtime hosts
- No legacy Node 14-only dependencies

---

## Procedure

### 1. Update Dockerfiles

```dockerfile
FROM node:20-slim
```

### 2. Update CI config

In `.github/workflows/*` or `Jenkinsfile`:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

### 3. Test locally

```sh
nvm install 20
nvm use 20
npm ci && npm test
```

---

## Verification

- `node --version` returns 20.x
- App boots, tests pass under Node 20.
- Docker builds and runs.

---

## Rollback / Troubleshooting

- If build fails, revert Dockerfile/CI config, rollback with `git reset`.
- Use `nvm use 14` to switch back temporarily.

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-3.1