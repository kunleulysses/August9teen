/**
 * Test: EventBus ring buffer event history
 */

const assert = require('assert');
const bus = require('../consciousness/core/ConsciousnessEventBus.js').default || require('../consciousness/core/ConsciousnessEventBus.js');

bus.clearHistory();

for (let i = 0; i < 120; ++i) {
    bus.emit('test', { v: i });
}

const hist = bus.getEventHistory();
assert.strictEqual(hist.length, 100, 'History should only keep 100 most recent events');
assert.strictEqual(hist[0].data.v, 20, 'Oldest event should be v=20');
assert.strictEqual(hist[hist.length - 1].data.v, 119, 'Newest event should be v=119');

console.log('✅ ring buffer event history test passed');