/**
 * Central logger singleton for the quantum stack.
 * Uses pino, with pretty-print in non-production. Falls back to console if pino unavailable.
 */

let logger;

try {
  // Dynamically require to avoid crash if not installed
  const pino = require('pino');
  let transport;
  if (process.env.NODE_ENV !== 'production') {
    try {
      require.resolve('pino-pretty');
      transport = pino.transport({
        target: 'pino-pretty',
        options: { colorize: true }
      });
    } catch (e) {
      // pretty not available, fallback to default transport
      transport = undefined;
    }
  }
  logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(transport && { transport }),
  });
} catch (e) {
  // Fallback: basic console shim
  logger = {
    info: (...args) => console.log('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    debug: (...args) => console.debug('[DEBUG]', ...args),
  };
}

module.exports = logger;