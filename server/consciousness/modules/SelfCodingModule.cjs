/**
 * Unified Self-Coding Module - Server Implementation Redirect
 * This file now redirects to the consolidated implementation
 */

// Import the consolidated implementation (corrected relative path)
// From server/consciousness/modules -> up to repo root, then shared-consciousness
const SelfCodingModule = require('../../../shared-consciousness/main-server/consciousness/modules/SelfCodingModuleConsolidated.cjs');

// Export the consolidated implementation
module.exports = SelfCodingModule;
