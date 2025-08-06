# 04 – TypeScript Project References

**Objective:**  
Use TS project refs for modularity and faster builds.

**Why it matters:**  
Unlocks incremental compile, strict boundaries, and IDE speed.

---

## Preconditions

- TypeScript ≥ 4.0
- Modular codebase (`packages/*` or equivalent)

---

## Procedure

### 1. Enable references in root `tsconfig.json`

```json
{
  "files": [],
  "references": [
    { "path": "./FlappyJournal/" },
    { "path": "./server/" }
  ]
}
```

### 2. Add `tsconfig.json` to each subpackage

```json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "dist"
  }
}
```

### 3. Build with references

```sh
tsc -b
```

---

## Verification

- `dist/` folders created for each package.
- IDE (VSCode) shows no unresolved imports.
- Build is faster on re-run.

---

## Rollback / Troubleshooting

- Remove `"references"` field from root `tsconfig.json` if errors.
- Run `tsc --build --clean` to clear artifacts.

---

## Time Estimate

00:30

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-3.4