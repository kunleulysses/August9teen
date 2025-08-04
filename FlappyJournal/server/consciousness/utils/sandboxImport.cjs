const ivm = require('isolated-vm');
const path = require('path');
const fs = require('fs').promises;

const MEM_MB   = parseInt(process.env.SANDBOX_MEM_MB || '64', 10);
const TIMEOUT  = parseInt(process.env.SANDBOX_TIMEOUT_MS || '3000', 10);

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

    // Execute the code with timeout
    await context.eval(code, { 
      filename: abs, 
      timeout: TIMEOUT 
    });
    
    // Module executed successfully
    return;
    
  } catch (error) {
    if (error.message.includes('Script execution timed out')) {
      throw new Error(`Script execution timed out after ${TIMEOUT}ms: ${abs}`);
    } else if (error.message.includes('memory limit')) {
      throw new Error(`Script exceeded memory limit of ${MEM_MB}MB: ${abs}`);
    } else {
      throw new Error(`Sandbox execution failed for ${abs}: ${error.message}`);
    }
  } finally {
    // Always dispose of the isolate to free memory
    if (isolate) {
      isolate.dispose();
    }
  }
}

module.exports = { sandboxImport };
