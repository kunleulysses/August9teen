/**
 * Sanity test: Both event bus import paths yield the SAME singleton instance.
 * Emits an event from one import, ensures the other receives it.
 */
const assert = require('assert');

// Import via both paths
const busA = require('../consciousness/ConsciousnessEventBus.cjs').default || require('../consciousness/ConsciousnessEventBus.cjs');
const busB = require('../consciousness/core/ConsciousnessEventBus.cjs').default || require('../consciousness/core/ConsciousnessEventBus.cjs');

// Strict equality
assert.strictEqual(busA, busB, 'Event bus instances from both paths should be strictly equal');

// Cross-path event propagation
let received = false;
busB.once('singleton:test', (payload) => {
  received = payload;
});

busA.emit('singleton:test', 42);

setTimeout(() => {
  assert.strictEqual(received, 42, 'Event emitted from one import should be received by the other');
  console.log('✅ Event bus singleton test passed');
}, 100);