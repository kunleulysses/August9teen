# Contributing Guidelines

## Module system

- All `.js` files are **ES modules** (use `import`/`export` and must not use `require` or `module.exports`).
- All legacy CommonJS code must be in `.cjs` files.
- The repo enforces this with ESLint and automatic conversion tools.
- When writing new code, use ESM syntax throughout.

## Secure Event Emission

- To emit events with signature verification, use `bus.secureEmit(moduleName, eventName, payload)`.
- To subscribe with verification, call `bus.subscribe(moduleName, eventName, handler, { verifySignature: true })`.
- Under