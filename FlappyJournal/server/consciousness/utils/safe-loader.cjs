/**
 * Safe module loader - now using isolated-vm sandbox for enhanced security
 * Re-exports sandboxImport as safeImport for backward compatibility
 */

const { sandboxImport } = require('./sandboxImport.cjs');

/**
 * Safely import a JavaScript module in an isolated V8 sandbox.
 * Provides memory and timeout limits for security.
 * 
 * @param {string} filePath - Path to JS module file
 * @param {number} timeout - Max ms to wait (uses SANDBOX_TIMEOUT_MS env var)
 * @returns {Promise<void>}
 */
async function safeImport(filePath, timeout) {
  // Set timeout via environment variable if provided
  if (timeout && timeout !== 3000) {
    const originalTimeout = process.env.SANDBOX_TIMEOUT_MS;
    process.env.SANDBOX_TIMEOUT_MS = timeout.toString();
    try {
      await sandboxImport(filePath);
    } finally {
      // Restore original timeout
      if (originalTimeout !== undefined) {
        process.env.SANDBOX_TIMEOUT_MS = originalTimeout;
      } else {
        delete process.env.SANDBOX_TIMEOUT_MS;
      }
    }
  } else {
    await sandboxImport(filePath);
  }
}

module.exports = { safeImport };
