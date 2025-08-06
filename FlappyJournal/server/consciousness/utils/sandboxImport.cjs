const ivm = require('isolated-vm');
const path = require('path');
const fs = require('fs').promises;
const { child: getLogger } = require('./logger.cjs');

const log = getLogger({ module: 'sandboxImport' });

// Metrics for monitoring
let sandboxTimeouts = 0;
let sandboxMemoryLimitExceeded = 0;

const ALERT_THRESHOLD = parseInt(process.env.SANDBOX_ALERT_THRESHOLD || '3', 10);

// Export metrics for Prometheus
function getSandboxMetrics() {
  return {
    sandbox_timeouts_total: sandboxTimeouts,
    sandbox_memory_limit_exceeded_total: sandboxMemoryLimitExceeded
  };
}

const MEM_MB = parseInt(process.env.SANDBOX_MEM_MB || '64', 10);
const TIMEOUT = parseInt(process.env.SANDBOX_TIMEOUT_MS || '3000', 10);

/**
 * Load and execute a module inside an isolated V8 sandbox
 * with memory and timeout limits for safety
 * 
 * @param {string} modulePath - Path to the module to load
 * @returns {Promise<void>} - Resolves when module loads successfully
 * @throws {Error} - If module fails to load or exceeds limits
 */
async function sandboxImport(modulePath) {
  const abs = path.isAbsolute(modulePath) ? modulePath :
              path.resolve(process.cwd(), modulePath);
  
  let code;
  try {
    code = await fs.readFile(abs, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read module file: ${abs} - ${error.message}`);
  }

  let isolate;
  try {
    // Create isolated V8 context with memory limit
    isolate = new ivm.Isolate({ memoryLimit: MEM_MB });
    const context = await isolate.createContext();
    const jail = context.global;

    // Set up minimal environment for code execution
    // Note: We keep console minimal to avoid transfer issues
    await jail.set('global', jail.derefInto());

    // Set up a simple console that just discards output (for safety)
    await context.eval(`
      global.console = {
        log: function() {},
        warn: function() {},
        error: function() {},
        info: function() {},
        debug: function() {}
      };
    `);

    // Set basic globals
    await jail.set('__filename', abs);
    await jail.set('__dirname', path.dirname(abs));

    // Set up require stub and module system
    await context.eval(`
      global.require = function(id) {
        throw new Error('require("' + id + '") not allowed in sandbox');
      };
      global.module = { exports: {} };
      global.exports = global.module.exports;
    `);

    // Host logger for sandbox violations
    await jail.set('_logViolation', new ivm.Reference((msg) => log.warn(msg)));

    // Remove unneeded globals, restrict mutation, and freeze built-ins
    await context.eval(`
      const allowed = new Set(['console','global','__filename','__dirname','module','exports']);
      for (const key of Object.getOwnPropertyNames(global)) {
        if (!allowed.has(key)) {
          delete global[key];
        }
      }

      const handler = {
        set(target, prop) {
          _logViolation.applyIgnored(undefined, ['Sandbox violation: set ' + String(prop)]);
          throw new Error('Sandbox violation: cannot set global property ' + String(prop));
        },
        defineProperty(target, prop) {
          _logViolation.applyIgnored(undefined, ['Sandbox violation: define ' + String(prop)]);
          throw new Error('Sandbox violation: cannot define global property ' + String(prop));
        },
        deleteProperty(target, prop) {
          _logViolation.applyIgnored(undefined, ['Sandbox violation: delete ' + String(prop)]);
          throw new Error('Sandbox violation: cannot delete global property ' + String(prop));
        }
      };
      global = new Proxy(global, handler);
      Object.freeze(global);

      const freeze = (obj) => {
        if (obj && obj.prototype) {
          Object.freeze(obj.prototype);
        }
        Object.freeze(obj);
      };
      ['console'].forEach(name => { if (global[name]) Object.freeze(global[name]); });
      ['Object','Array','Function','String','Number','Boolean','Date','RegExp','Error','Promise','Map','Set','WeakMap','WeakSet'].forEach(name => {
        if (global[name]) freeze(global[name]);
      });
      delete global._logViolation;
    `);

    // Force strict mode and execute the code with timeout
    code = '"use strict";\n' + code;
    await context.eval(code, {
      filename: abs,
      timeout: TIMEOUT
    });
    
    // Module executed successfully
    return;
    
  } catch (error) {
    let wrappedError;
    if (error.message.includes('Sandbox violation')) {
      log.warn(error.message);
      wrappedError = new Error(`Sandbox violation detected in ${abs}: ${error.message}`);
    } else if (error.message.includes('Script execution timed out')) {
      sandboxTimeouts++;
      if (sandboxTimeouts % ALERT_THRESHOLD === 0) {
        log.error(`Sandbox timeouts have occurred ${sandboxTimeouts} times`);
      }
      wrappedError = new Error(`Script execution timed out after ${TIMEOUT}ms: ${abs}`);
    } else if (error.message.includes('memory limit')) {
      sandboxMemoryLimitExceeded++;
      if (sandboxMemoryLimitExceeded % ALERT_THRESHOLD === 0) {
        log.error(`Sandbox memory limit exceeded ${sandboxMemoryLimitExceeded} times`);
      }
      wrappedError = new Error(`Script exceeded memory limit of ${MEM_MB}MB: ${abs}`);
    } else {
      wrappedError = new Error(`Sandbox execution failed for ${abs}: ${error.message}`);
    }

    // Tag the error with the file path for auto-rollback tracking
    wrappedError.filePath = abs;
    throw wrappedError;
  } finally {
    // Always dispose of the isolate to free memory
    if (isolate) {
      isolate.dispose();
    }
  }
}

module.exports = { sandboxImport, getSandboxMetrics };
