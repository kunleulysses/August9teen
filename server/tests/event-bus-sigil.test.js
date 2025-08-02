/**
 * Test: Event bus secureEmit + subscribe with verifySignature.
 */
const assert = require('assert');

const bus = require('../consciousness/core/ConsciousnessEventBus.js').default || require('../consciousness/core/ConsciousnessEventBus.js');

let handled = false;
let payloadValue = undefined;

bus.subscribe('testComponent', 'sigilEvent', (payload) => {
    handled = true;
    payloadValue = payload.data;
}, { verifySignature: true });

bus.secureEmit('testComponent', 'sigilEvent', { data: 123 });

setTimeout(() => {
    assert.strictEqual(handled, true, 'Handler should be called for valid signature');
    assert.strictEqual(payloadValue, 123, 'Payload data should be passed through correctly');
    console.log('✅ sigil event signature/identity test passed');
}, 50);