/**
 * Minimal smoke test: Import the main entry and assert it loads without error.
 * Accepts either index.ts or index.js.
 */
test('server main entry loads without error', async () => {
  let err = null;
  try {
    // Import without extension so ts-jest can resolve to TS during tests (and JS otherwise)
    await import('../../index');
  } catch (e) {
    err = e;
  }
  expect(err).toBeNull();
});