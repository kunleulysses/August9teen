# Ticket A11 – DuplicateCleanup

## Goal
Systematically remove all stale, duplicate, or backup sigil-related files and ensure all import/build paths in the codebase refer only to the canonical, production-grade implementation.

## Context

The Sigil-DNA codebase has accumulated significant technical debt in the form of backup folders (`FlappyJournal hey/`), system-backups, and alternate implementations of key files such as `sigil-identity.cjs`, `sigil-api.cjs`, and test modules. Many build scripts, Dockerfiles, and developer workflows have ambiguous or incorrect file references. This creates:
- Build failures when the wrong file is copied (e.g., copying `sigil-identity.js` instead of `.cjs`)
- Confused developer onboarding (multiple "source of truth" files)
- Test and CI drift, as some tests reference backup or deprecated code.
- Security risk if backup/test files are ever accidentally deployed.

Canonical files must be:
- [`FlappyJournal/server/sigil-identity.cjs`](../../server/sigil-identity.cjs)
- [`FlappyJournal/server/sigil-api.cjs`](../../server/sigil-api.cjs)
- [`FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs`](../../server/consciousness/sigil-based-code-authenticator.cjs)

All other sigil-related files outside `FlappyJournal/server/` (except for test code in `__tests__`) should be considered for removal.

## Prerequisites

- Full access to the Git repository
- Authority to remove files and refactor import paths
- `grep` or `ag` for code search
- Ability to update Dockerfiles, build scripts, and CI configs
- ENV: None specific, but awareness of all build/deploy environments
- Backup of the repository or ability to revert with git

## Step-by-Step Implementation

### 1. Audit for Duplicate/Backup Files

1. List all sigil-related files outside canonical paths:
   ```
   find . -type f -iname '*sigil*'
   ```
2. Identify files in:
   - `FlappyJournal hey/`
   - `system-backups/`
   - Any `.bak`, `.backup`, `.orig` files
   - Test modules not in `__tests__/` or not referenced by canonical code

3. Document a full list of files to be removed, and review with the team for safety.

### 2. Remove Duplicates and Backups

1. Remove with git:
   ```
   git rm FlappyJournal\ hey/server/sigil-identity.cjs
   git rm FlappyJournal\ hey/server/sigil-api.cjs
   git rm FlappyJournal/system-backups/*sigil*
   git rm FlappyJournal/*bak*
   ```
2. Commit with a clear message:
   ```
   Remove duplicate/backup sigil implementations (A11)
   ```

### 3. Refactor Import Paths

1. Use `grep` to find all imports/requires of sigil files:
   ```
   grep -r "sigil-identity" .
   grep -r "sigil-api" .
   ```
2. Update all paths to point only to the canonical files in `FlappyJournal/server/`.

3. In Dockerfiles and build scripts:
   - Change any `COPY FlappyJournal/sigil-identity.js ./` to `COPY FlappyJournal/server/sigil-identity.cjs ./`
   - Ensure all docker, compose, and k8s manifests reference only the canonical file.

### 4. Add Lint Rule for Path Correctness

1. In ESLint config (if used), add a rule to disallow importing from backup or deprecated paths.
2. Example (custom rule):
   ```js
   "no-restricted-imports": [
     "error",
     {
       "patterns": ["*FlappyJournal hey/*", "*system-backups/*", "*.bak", "*.backup"]
     }
   ]
   ```

3. Add a pre-commit hook or CI check to grep for forbidden paths.

### 5. Update Documentation

1. In the developer README and onboarding docs, clarify the canonical source of truth for all sigil modules.
2. Document the cleanup policy and any lint rules.

---

## Verification

### Automated

- Run `npm run lint` or `eslint .` and ensure no forbidden import paths remain.
- All builds and Docker images complete with only canonical files.
- CI runs with no references to backup/test sigil files.

### Manual

- Attempt to run the main service, tests, and CI using only the canonical files.
- Confirm that all endpoints and features work as expected.
- Review file tree: no backup or duplicate sigil files exist.

---

## Rollback

- Use `git revert` on the cleanup commit to restore all removed files:
  ```
  git revert <sha-of-duplicate-cleanup-commit>
  ```
- Re-add any imports or build references if needed.

---

## Acceptance Criteria

- Only one canonical implementation of each sigil module exists in the repo.
- All imports, Dockerfiles, and build scripts point to canonical files.
- Lint checks prevent future accidental use of duplicates.
- No production build, test, or CI references backup or deprecated code.

---

## Time Estimate & Assignee

- Estimate: 0.5 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Node.js require/import best practices](https://nodejs.org/api/modules.html)
- [ESLint no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)
- [Docker COPY docs](https://docs.docker.com/engine/reference/builder/#copy)
- [Git rm and revert](https://git-scm.com/docs/git-rm)
- [Technical debt cleanup patterns](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)