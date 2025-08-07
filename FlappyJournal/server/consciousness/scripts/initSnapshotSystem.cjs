/**
 * Snapshot System Initialization
 * Integrates the snapshot writer with the consciousness system
 */

const snapshotWriter = require('../utils/snapshotWriter.cjs');
const { logger } = require('../utils/logger.cjs');

class SnapshotSystem {
  constructor() {
    this.initialized = false;
    this.shutdownHandlers = [];
  }

  /**
   * Initialize the snapshot system
   */
  async initialize() {
    if (this.initialized) {
      logger.warn('Snapshot system already initialized');
      return;
    }

    logger.info('Initializing snapshot system');

    try {
      // Bootstrap database from snapshot if empty
      const { bootstrapped, snapshot } = await snapshotWriter.bootstrapDatabase();
      
      if (bootstrapped) {
        logger.info({ snapshot }, 'Successfully bootstrapped database from snapshot');
      }

      // Register shutdown handler
      this._registerShutdownHandler();
      
      this.initialized = true;
      logger.info('Snapshot system initialized');
      
      return { success: true, bootstrapped, snapshot };
    } catch (error) {
      logger.error({ error }, 'Failed to initialize snapshot system');
      throw error;
    }
  }

  /**
   * Register shutdown handler
   */
  _registerShutdownHandler() {
    const shutdownHandler = async () => {
      logger.info('Shutting down snapshot system');
      
      try {
        // Create a final snapshot before shutdown
        logger.info('Creating final snapshot before shutdown');
        await snapshotWriter.createSnapshot();
        logger.info('Final snapshot completed');
      } catch (error) {
        logger.error({ error }, 'Error during final snapshot');
      }
    };

    // Register for process signals
    process.on('SIGTERM', shutdownHandler);
    process.on('SIGINT', shutdownHandler);
    
    // Also handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (error) => {
      logger.error({ error }, 'Uncaught exception in snapshot system');
      shutdownHandler().finally(() => process.exit(1));
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ reason, promise }, 'Unhandled rejection in snapshot system');
    });
    
    this.shutdownHandlers.push(shutdownHandler);
  }

  /**
   * Clean up resources
   */
  async shutdown() {
    if (!this.initialized) return;
    
    logger.info('Cleaning up snapshot system');
    
    // Run all registered shutdown handlers
    for (const handler of this.shutdownHandlers) {
      try {
        await Promise.resolve(handler());
      } catch (error) {
        logger.error({ error }, 'Error in shutdown handler');
      }
    }
    
    this.initialized = false;
    logger.info('Snapshot system shutdown complete');
  }
}

// Export singleton instance
const snapshotSystem = new SnapshotSystem();
module.exports = snapshotSystem;
