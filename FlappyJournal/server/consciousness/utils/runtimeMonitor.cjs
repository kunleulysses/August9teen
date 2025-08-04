/**
 * Runtime Monitor - Auto-rollback system for failed modules
 * 
 * Monitors for uncaught exceptions from generated modules and automatically:
 * - Archives the problematic module
 * - Removes manifest entries
 * - Emits invalidation events
 * - Updates metrics
 */

const eventBus = require('../ConsciousnessEventBus.cjs');
const { child: getLogger } = require('./logger.cjs');
const { sigil_registry_size } = require('../metrics/extraMetrics.cjs');

const log = getLogger({ module: 'RuntimeMonitor' });

/**
 * Rollback a module by archiving it and cleaning up references
 * @param {string} filePath - Path to the module to rollback
 * @returns {Promise<string>} - Path to archived file
 */
async function rollback(filePath) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    // Create archive directory if it doesn't exist
    const archiveDir = path.join(path.dirname(filePath), 'archive');
    await fs.mkdir(archiveDir, { recursive: true });
    
    // Generate archive filename with timestamp
    const timestamp = Date.now();
    const basename = path.basename(filePath, path.extname(filePath));
    const ext = path.extname(filePath);
    const archivePath = path.join(archiveDir, `${basename}-${timestamp}${ext}`);
    
    // Move file to archive
    await fs.rename(filePath, archivePath);
    
    log.warn(`Module rolled back to archive: ${filePath} -> ${archivePath}`);
    return archivePath;
    
  } catch (error) {
    log.error(`Failed to rollback module ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Remove manifest entry for a module
 * @param {string} filePath - Path to the module
 */
async function removeManifestEntry(filePath) {
  try {
    // This is a simplified manifest removal - in a real system this would
    // interact with a proper manifest system
    log.info(`Removing manifest entry for: ${filePath}`);
    
    // TODO: Implement actual manifest removal when manifest system is available
    // For now, we just log the action
    
  } catch (error) {
    log.error(`Failed to remove manifest entry for ${filePath}:`, error.message);
  }
}

/**
 * Initialize the runtime monitor
 */
function initializeRuntimeMonitor() {
  log.info('Initializing runtime monitor for auto-rollback...');
  
  // Handle uncaught exceptions from generated modules
  process.on('uncaughtException', async (err) => {
    try {
      // Only act on tagged errors with filePath
      if (!err || !err.filePath) {
        // Re-throw untagged errors to maintain normal error handling
        throw err;
      }
      
      log.error(`Runtime failure detected in module: ${err.filePath}`, err.message);
      
      // Rollback the problematic module
      const archived = await rollback(err.filePath);
      
      // Remove manifest entry
      await removeManifestEntry(err.filePath);
      
      // Emit invalidation events
      eventBus.emit('module:invalid', { 
        filePath: err.filePath, 
        error: err.message,
        archived: archived,
        timestamp: new Date()
      });
      
      eventBus.emit('orchestration:update', { 
        action: 'remove-module', 
        module: err.filePath,
        reason: 'runtime-failure',
        timestamp: new Date()
      });
      
      // Decrement sigil registry size
      if (sigil_registry_size?.dec) {
        sigil_registry_size.dec();
      }
      
      log.info(`Auto-rollback completed for: ${err.filePath}`);
      
    } catch (rollbackError) {
      log.error('Failed to perform auto-rollback:', rollbackError.message);
      // Re-throw the original error if rollback fails
      throw err;
    }
  });
  
  // Handle unhandled promise rejections from generated modules
  process.on('unhandledRejection', async (reason, promise) => {
    try {
      // Check if the rejection has a filePath tag
      if (reason && reason.filePath) {
        log.error(`Unhandled promise rejection in module: ${reason.filePath}`, reason.message || reason);
        
        // Treat as uncaught exception for rollback
        const error = new Error(reason.message || String(reason));
        error.filePath = reason.filePath;
        
        // Trigger the uncaught exception handler
        process.emit('uncaughtException', error);
      } else {
        log.warn('Unhandled promise rejection (not from generated module):', reason);
      }
    } catch (error) {
      log.error('Error handling unhandled rejection:', error.message);
    }
  });
  
  log.info('Runtime monitor initialized successfully');
}

/**
 * Tag an error with a file path for auto-rollback
 * @param {Error} error - The error to tag
 * @param {string} filePath - The file path to associate with the error
 * @returns {Error} - The tagged error
 */
function tagErrorWithFilePath(error, filePath) {
  if (error && filePath) {
    error.filePath = filePath;
  }
  return error;
}

module.exports = {
  initializeRuntimeMonitor,
  rollback,
  removeManifestEntry,
  tagErrorWithFilePath
};
