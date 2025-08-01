/**
 * Deprecated: IntelligentSpiralMemory is now SpiralMemoryFacade (backed by SpiralMemoryArchitecture).
 */
console.warn('[Spiral] WARNING: FlappyJournal/server/consciousness/intelligent-spiral-memory.js is deprecated—use core/SpiralMemoryFacade.js instead.');
module.exports = require('./core/SpiralMemoryFacade.js');
