const { shutdown } = require('./consciousness/utils/persistence.cjs');
const { logger } = require('./consciousness/utils/logger.cjs');

async function cleanup(signal) {
  logger.info(`[${signal}] Received. Shutting down persistence layer...`);
  try {
    await shutdown();
    logger.info('[Persistence] Shutdown complete.');
    process.exit(0);
  } catch (error) {
    logger.error({ err: error }, '[Persistence] Error during shutdown.');
    process.exit(1);
  }
}

// Listen for shutdown signals
process.on('SIGINT', () => cleanup('SIGINT'));
process.on('SIGTERM', () => cleanup('SIGTERM'));
process.on('exit', (code) => {
  logger.info(`[ProcessExit] Exiting with code: ${code}`);
});