# A-4: Enable Existing Tests in CI, Raise Coverage ≥ 75%

## Objective & Success Criteria
**Objective:**  
Fix test discovery and CI config so all existing and new tests run in CI, and raise test coverage on `resonance/**` modules to at least 75%.

**Success Criteria:**  
- All project tests are executed in CI pipeline.
- Coverage report shows ≥ 75% for resonance code.
- No major regressions missed due to test gaps.

## Prerequisites / Dependencies
- Existing tests in `test-*.cjs` or `tests/`.
- Access to CI config (GitHub Actions, etc.).
- Node.js v16+, Jest set up.

## Architectural Context
- `jest.config.cjs`
- All test files: `test-*.cjs`, `tests/**/*.test.ts`
- CI config: `.github/workflows/`, `package.json` scripts

## Step-by-Step Implementation Plan

1. **Update Jest Config**
   - Edit `jest.config.cjs`:
     ```js
     testMatch: [
       "<rootDir>/test-*.cjs",
       "<rootDir>/tests/**/*.test.ts",
       "<rootDir>/tests/**/*.spec.ts"
     ],
     ```
   - Ensure `transform` covers `.cjs` if needed.

2. **Update CI Workflow**
   - Make sure `pnpm test` (or `npm test`) is run in CI.
   - Add coverage upload step:
     ```yaml
     - run: pnpm test -- --coverage
     - uses: codecov/codecov-action@v3
     ```

3. **Refactor / Add Tests**
   - Update/convert any skipped or commented-out tests.
   - Add new tests for:
     - Worker-pool logic
     - Redis snapshot/restore
     - API endpoints (as they’re added)

4. **Monitor Coverage**
   - Run `pnpm test -- --coverage`
   - Review coverage report for `resonance/**`

## Observability Hooks
- CI badge (build + coverage) in README
- Coverage report artifact in CI

## Security or Performance Considerations
- Validate test mocks don’t leak secrets.
- Avoid overly-slow integration tests in PR gate.

## Validation / Acceptance Checklist
- [ ] Tests run automatically in CI
- [ ] Coverage ≥ 75%
- [ ] All PRs blocked if coverage drops

## Rollback / Cleanup Notes
- Restore original Jest config and exclude `test-*.cjs` (not recommended).