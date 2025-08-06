# Ticket A13 – BuildScript-EventSignCJS

## Goal
Add an explicit build step or automated process to emit a valid `eventSign.cjs` for all CJS consumers from the canonical TypeScript source, ensuring HMAC logic is never missing in production builds.

## Context

The cryptographic signing and verification logic for the Sigil-DNA stack is authored in TypeScript (`eventSign.ts` in [`FlappyJournal/server/consciousness/core/security/`](../../server/consciousness/core/security/)). However, the CommonJS (`eventSign.cjs`) file is often missing, out-of-date, or empty in the production/dist output. This breaks all CJS `require` calls, silently disables HMAC verification, and opens a critical security gap.

Causes include:
- TypeScript compiler not emitting `.cjs` (due to config or outputDir).
- Build scripts not copying or symlinking the file.
- Manual changes to `eventSign.cjs` that are not tracked or tested.

A robust build script should:
- Always emit a valid `eventSign.cjs` in the correct path.
- Fail the build if the file is missing or out-of-sync.
- Be idempotent and run as part of all build/test/deploy workflows.
- Optionally, support symlinking, copying, or transpiling as needed.

## Prerequisites

- Node.js v18.x or higher
- TypeScript compiler (`npm install typescript`)
- NPM scripts or Makefile access
- All source files committed and up to date
- Ability to run `npm run build` and update package.json
- Optionally, `fs-extra` for copy/symlink

## Step-by-Step Implementation

### 1. Update tsconfig.json for CJS Output

1. Add/verify a secondary outDir for CJS build:
   ```json
   {
     "compilerOptions": {
       "module": "CommonJS",
       "outDir": "./server/consciousness/core/security/cjs"
     },
     "include": ["server/consciousness/core/security/eventSign.ts"]
   }
   ```

### 2. Add Build Script to package.json

1. Add to package.json:
   ```json
   "scripts": {
     "build:eventsign": "tsc --project tsconfig.json && cp server/consciousness/core/security/cjs/eventSign.js server/consciousness/core/security/eventSign.cjs"
   }
   ```

### 3. Automate Build Verification

1. After build script, add a verification step:
   ```json
   "scripts": {
     "verify:eventsign": "node -e \"require('./server/consciousness/core/security/eventSign.cjs');console.log('eventSign.cjs loaded')\""
   }
   ```

2. Add to main build/test pipeline:
   ```
   npm run build:eventsign && npm run verify:eventsign
   ```

### 4. (Optional) Symlink or Copy in Dockerfile

1. In Dockerfile, after npm build:
   ```dockerfile
   RUN ln -sf /app/server/consciousness/core/security/eventSign.cjs /app/server/consciousness/core/security/eventSign.js
   ```

### 5. Document the Build Step

1. In README and developer docs, add:
   ```
   # Build eventSign for CJS consumers
   npm run build:eventsign
   ```

### 6. Add Git Pre-commit Hook (Optional)

1. To prevent accidental commits of stale `eventSign.cjs`, add a pre-commit hook in `.husky` or pre-commit-config.yaml to verify the file is regenerated.

---

## Verification

### Automated Build/Test

- Run `npm run build:eventsign`.
  - Confirm `eventSign.cjs` is created and non-empty.
- Run `npm run verify:eventsign`.
  - Should print "eventSign.cjs loaded" with no error.

### CI/CD

- All builds/deploys should run `build:eventsign` and fail if `eventSign.cjs` is missing.

### Manual

- Open Node REPL:
  ```
  node
  > require('./server/consciousness/core/security/eventSign.cjs').sign({foo:1})
  ```
- Should return a valid signature.

---

## Rollback

- Remove build script from package.json.
- Delete any new outDirs or symlinks.
- Restore manual `eventSign.cjs` if required:
  ```
  git checkout HEAD~1 -- server/consciousness/core/security/eventSign.cjs
  ```

---

## Acceptance Criteria

- `eventSign.cjs` always present, valid, and up-to-date after build.
- All CJS consumers can require and use it.
- Build fails if file missing or broken.
- Build/test pipeline and docs updated.

---

## Time Estimate & Assignee

- Estimate: 0.5 dev day
- Assignee: _______________________

---

## References / Further Reading

- [TypeScript build targets](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [Node.js require()](https://nodejs.org/api/modules.html)
- [Husky hooks](https://typicode.github.io/husky/#/)
- [fs-extra copy/symlink](https://www.npmjs.com/package/fs-extra)