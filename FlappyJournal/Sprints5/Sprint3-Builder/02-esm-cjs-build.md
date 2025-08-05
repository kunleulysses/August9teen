# 02 – ESM + CJS Dual Build

**Objective:**  
Enable build output for both ESM and CommonJS consumers.

**Why it matters:**  
Supports modern and legacy consumers, unlocks toolchain flexibility.

---

## Preconditions

- Install `tsup` or `rollup`
- Entry points standardized

---

## Procedure

### 1. Add build script

In `package.json`:

```json
"scripts": {
  "build": "tsup src/index.ts --format esm,cjs --dts"
}
```

### 2. Add exports map

```json
"exports": {
  ".": {
    "import": "./dist/index.mjs",
    "require": "./dist/index.js"
  }
}
```

### 3. Run build

```sh
npm run build
```

---

## Verification

- `dist/` contains both `.js` (CJS) and `.mjs` (ESM) files.
- Consumers can `require()` or `import` as needed.
- All tests pass.

---

## Rollback / Troubleshooting

- Remove `exports` map if module resolution breaks.
- Fallback to single format, debug, then re-enable dual build.

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-3.2