/**
 * Simple logger for consciousness utilities
 */

class Logger {
  info(message, meta = {}) {
    console.log(`[INFO] ${message}`, meta);
  }
  
  warn(message, meta = {}) {
    console.warn(`[WARN] ${message}`, meta);
  }
  
  error(message, meta = {}) {
    console.error(`[ERROR] ${message}`, meta);
  }
  
  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG) {
      console.log(`[DEBUG] ${message}`, meta);
    }
  }
}

const logger = new Logger();

module.exports = { logger };