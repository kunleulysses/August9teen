> Status: Complete

# 02 – ESM + CJS Dual Build

**Objective:**  
Produce both ESM and CommonJS build outputs for all quantum-core packages, with copy-pasteable configs and
interop for both modern and legacy consumers.

**Why it matters:**  
Some consumers (TS/Node 20, Next.js) require ESM, while many tools and older code require CJS. This ensures
compatibility and enables migration.

---

## Preconditions

- On feature branch.
- Install `tsup`:
  ```sh
  npm install --save-dev tsup
  ```
- All entry points are TypeScript (e.g., `src/index.ts`).

---

## Procedure

### 1. Create `tsup.config.ts`

**File:** `packages/quantum-core/tsup.config.ts`

```ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  clean: true,
  outDir: 'dist',
  minify: false,
  target: 'node20',
});
```

### 2. Update `package.json` for Build and Exports

**File:** `packages/quantum-core/package.json`

```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup"
  }
}
```

### 3. Build

```sh
cd packages/quantum-core
npm run build
ls dist/
# Should show both .js (CJS), .mjs (ESM), and .d.ts files
```

### 4. Usage Example

**CJS:**
```js
const { generateSpiral } = require('quantum-core');
```

**ESM:**
```js
import { generateSpiral } from 'quantum-core';
```

---

## Verification

- `dist/` contains `index.js`, `index.mjs`, and `index.d.ts`
- Both `require()` and `import` work in test scripts
- All tests pass under both Node `--require` and `--loader`
- No "Cannot use import statement outside module" errors

---

## Rollback / Troubleshooting

- If consumers break, try removing `"exports"` and `"type": "module"` to isolate
- For legacy scripts, use only CJS build as fallback

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: Build Systems
- JIRA: Q5-3.2