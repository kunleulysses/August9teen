/**
 * Test: Event bus signature verification logic.
 * - Subscribes with verifySignature: true
 * - Emits an event without a signature (should NOT call handler, should fire 'event:invalid_signature')
 */
const assert = require('assert');

const bus = require('../consciousness/core/ConsciousnessEventBus.js').default || require('../consciousness/core/ConsciousnessEventBus.js');

let handled = false;
let invalid = false;

bus.once('event:invalid_signature', () => { invalid = true; });
bus.subscribe('testModule', 'secureEvent', () => { handled = true; }, { verifySignature: true });

// Should NOT call handler, should emit 'event:invalid_signature'
bus.emit('secureEvent', { foo: 'bar' });

setTimeout(() => {
    assert.strictEqual(handled, false, 'Handler should NOT be called when signature is missing');
    assert.strictEqual(invalid, true, 'event:invalid_signature should fire');
    console.log('✅ signature verification test passed');
}, 50);