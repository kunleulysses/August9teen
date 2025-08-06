# Ticket A9 – EventSign-BuildFix

## Goal
Ensure export and runtime parity between `eventSign.ts` and `eventSign.cjs` so that all HMAC signing and verification logic is consistently available to both TypeScript (ESM) and CommonJS consumers.

## Context

The module `eventSign.ts` (see [`FlappyJournal/server/consciousness/core/security/eventSign.ts`](../../server/consciousness/core/security/eventSign.ts)) implements the core HMAC signature logic for the Sigil-DNA stack. However, the corresponding file `eventSign.cjs` is **empty** in the production build. This leads to all CommonJS `require` calls returning `{}`, and thus, all signature verification in CJS code fails silently. As a result, any security checks in [`sigil-api.cjs`](../../server/sigil-api.cjs) or [`sigil-identity.cjs`](../../server/sigil-identity.cjs) that depend on HMAC cannot work, opening a critical security hole.

The codebase currently mixes ESM and CJS imports/exports, increasing risk of export drift. This can also break type safety and runtime compatibility as TypeScript and Babel emit different module signatures.

The build system must:
- Always emit a valid `eventSign.cjs` for all CJS consumers.
- Ensure CJS exports match ESM/TS exports.
- Add automated tests to verify that `sign()` and `verify()` work identically from both ESM and CJS.
- Remove any silent failure paths by throwing on missing exports.

Key files:
- [`eventSign.ts`](../../server/consciousness/core/security/eventSign.ts)
- [`eventSign.cjs`](../../server/consciousness/core/security/eventSign.cjs)
- Build scripts: `tsconfig.json`, any custom compile steps, and possibly Babel config.

## Prerequisites

- Node.js v18.x or higher
- TypeScript (`npm install typescript`)
- Babel (if used; `npm install @babel/cli @babel/preset-env`)
- Access to update build scripts (e.g., `tsconfig.json`, package.json, build.sh)
- All dependencies (`crypto` module)
- Working CI with test support for both ESM and CJS
- ENV: none required, but test `SPIRAL_EVENT_SECRET`

## Step-by-Step Implementation

### 1. Ensure TS Builds to CJS

1. In `tsconfig.json`, add a CJS output config:
   ```json
   {
     "compilerOptions": {
       "module": "CommonJS",
       "outDir": "dist-cjs",
       // ...other settings
     },
     "include": [
       "server/consciousness/core/security/eventSign.ts"
     ]
   }
   ```
2. Add to package.json scripts:
   ```json
   "build:eventsign": "tsc --project tsconfig.json --outDir server/consciousness/core/security"
   ```
3. Run:
   ```
   npm run build:eventsign
   ```
   This will emit `eventSign.js` in CJS format; rename/move this to `eventSign.cjs`.

### 2. Export Functions with Matching Names

1. In `eventSign.ts`, ensure:
   ```ts
   export function sign(payload: any): string { ... }
   export function verify(payload: any, signature: string): boolean { ... }
   ```
2. In the generated `eventSign.cjs`, confirm:
   ```js
   exports.sign = sign;
   exports.verify = verify;
   ```

### 3. Update All Imports

1. In all CJS files (`sigil-api.cjs`, `sigil-identity.cjs`), update to:
   ```js
   const { sign, verify } = require('./consciousness/core/security/eventSign.cjs');
   ```
2. In ESM/TS files, use:
   ```ts
   import { sign, verify } from './eventSign';
   ```

### 4. Add Tests for ESM and CJS Compatibility

1. Create `__tests__/eventSign.spec.js`:
   ```js
   const { sign, verify } = require('../../server/consciousness/core/security/eventSign.cjs');
   test('CJS sign/verify works', () => {
     const payload = { foo: 1 };
     const signature = sign(payload);
     expect(verify(payload, signature)).toBe(true);
   });
   ```
2. In TS/ESM test files:
   ```ts
   import { sign, verify } from '../../server/consciousness/core/security/eventSign';
   test('ESM sign/verify works', () => {
     const payload = { bar: 2 };
     const signature = sign(payload);
     expect(verify(payload, signature)).toBe(true);
   });
   ```

### 5. Add Build Step to CI/CD

1. In `.github/workflows/ci.yml` or your CI system, add:
   ```yaml
   - name: Build eventSign CJS
     run: npm run build:eventsign
   - name: Test eventSign exports
     run: npm run test
   ```

### 6. Remove/Fail on Missing Exports

1. In any consumer, throw if `sign` or `verify` missing:
   ```js
   if (typeof sign !== 'function') throw new Error('sign not exported!');
   ```

---

## Verification

### Unit Tests

- CJS and ESM tests both pass.
- Test fails if exports are missing or functions not callable.

### Manual

- Require `eventSign.cjs` in a Node.js REPL and call `sign()` and `verify()`.
- Simulate build from clean state, ensure `eventSign.cjs` is present and correct.

### CI

- CI passes even on clean checkout/fresh build.

---

## Rollback

- Restore previous empty or manual `eventSign.cjs`:
  ```
  git checkout HEAD~1 -- server/consciousness/core/security/eventSign.cjs tsconfig.json
  ```
- Remove build script from package.json and CI.

---

## Acceptance Criteria

- Both CJS and ESM can import and use the same `sign()` and `verify()` logic.
- No production code uses empty exports.
- All tests for both module systems pass.
- Build step is idempotent and runs on CI.

---

## Time Estimate & Assignee

- Estimate: 0.75 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Node.js module compatibility](https://nodejs.org/api/modules.html#modules-commonjs-modules)
- [TypeScript module targets](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Interop between ESM and CJS](https://2ality.com/2019/04/nodejs-esm-interop.html)
- [Jest ESM & CJS test docs](https://jestjs.io/docs/ecmascript-modules)
- [npm scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)