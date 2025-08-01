/**
 * Minimal smoke test: Import the main entry and assert it loads without error.
 * Accepts either index.ts or index.js.
 */
test('server main entry loads without error', async () => {
  let err = null;
  try {
    // Prefer TS, fallback to JS
    try {
      await import('../../index.ts');
    } catch (e) {
      await import('../../index.js');
    }
  } catch (e) {
    err = e;
  }
  expect(err).toBeNull();
});