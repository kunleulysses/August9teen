# 05 – ESLint & Prettier in CI

**Objective:**  
Enforce lint and format rules on every PR and push.

**Why it matters:**  
Catches bugs, enforces standards, saves review time.

---

## Preconditions

- ESLint and Prettier installed
- CI config editable

---

## Procedure

### 1. Add script to `package.json`

```json
"scripts": {
  "lint": "eslint . --ext .js,.ts",
  "format": "prettier --check ."
}
```

### 2. Add CI step

**GitHub Actions:**
```yaml
- name: Lint
  run: npm run lint
- name: Format
  run: npm run format
```

### 3. Block PRs on errors

Set required checks in repo settings.

---

## Verification

- PRs fail if lint/format errors.
- `npm run lint` and `npm run format` pass locally.

---

## Rollback / Troubleshooting

- Remove checks from CI if blocking critical hotfix.
- Run `eslint --fix` or `prettier --write .` to auto-fix.

---

## Time Estimate

00:25

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-3.5