# 01 – Repo Hygiene

**Objective:**  
Remove ghost copies and backup folders, enforce monorepo workspace config to prevent confusion and ensure all devs work from a single authoritative codebase.

**Why it matters:**  
Reduces risk of stale code, accidental regressions, and CI failures. Prevents "split-brain" development.

---

## Preconditions

- On a feature branch (e.g. `feat/quantum-audit`)
- Local repo up-to-date with remote
- No uncommitted changes
- Workspace root: project root

---

## Procedure

### 1. Delete backup/ghost dirs

```sh
rm -rf FlappyJournal\ hey/
rm -rf shared-consciousness/
git add -A
```

### 2. Add workspace config

Create `pnpm-workspace.yaml` or add to `package.json`:

```yaml
packages:
  - 'FlappyJournal/'
  - 'server/'
  - 'client/'
```

or in `package.json`:

```json
"workspaces": [
  "FlappyJournal/",
  "server/",
  "client/"
]
```

### 3. Add .gitignore rules

Append to `.gitignore`:

```
FlappyJournal hey/
shared-consciousness/
```

---

## Verification

- Run `git status` — should show only wanted code.
- `ls FlappyJournal/` — confirm no `hey/`.
- Try `pnpm install` or `npm install` — workspace links resolve.

---

## Rollback / Troubleshooting

- If files accidentally deleted: `git restore .`
- If workspace setup fails, check for typos in package paths.

---

## Time Estimate

00:20

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-1.1