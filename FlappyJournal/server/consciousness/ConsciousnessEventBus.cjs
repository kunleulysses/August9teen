/**
 * Consciousness Event Bus (re-export proxy)
 *
 * This module re-exports the canonical singleton instance from
 * './core/ConsciousnessEventBus.cjs', ensuring ALL imports across the codebase
 * reference the same event bus object. This eliminates split-brain bugs caused by
 * multiple EventEmitter instances under the same name.
 *
 * Do not instantiate an EventEmitter here. Update all imports to use this proxy if needed.
 */

const eventBus = require('./core/ConsciousnessEventBus.cjs');
module.exports = eventBus;