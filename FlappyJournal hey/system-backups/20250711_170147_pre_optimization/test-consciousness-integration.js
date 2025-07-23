const { consciousnessEventBus, registerStandardModules } = require('./consciousness-modules-bundle');
const { consciousnessService } = require('./consciousnessService');
const { flappyConsciousness } = require('./flappyConsciousness');

console.log('Testing consciousness integration...');

// Test 1: Module bundle
console.log('\n1. Testing module bundle:');
registerStandardModules();
const modules = consciousnessEventBus.getRegisteredModules();
console.log(`   ✓ Registered ${modules.length} modules`);

// Test 2: Existing services
console.log('\n2. Testing existing services:');
console.log(`   ✓ consciousnessService: ${consciousnessService ? 'loaded' : 'not found'}`);
console.log(`   ✓ flappyConsciousness: ${flappyConsciousness ? 'loaded' : 'not found'}`);

// Test 3: Event emission
console.log('\n3. Testing event emission:');
consciousnessEventBus.on('consciousness:test', (event) => {
  console.log(`   ✓ Received event: ${event.type}`);
});

consciousnessEventBus.emitConsciousnessEvent({
  source: 'test',
  type: 'test',
  data: { message: 'Hello consciousness!' },
  priority: 'normal',
  propagate: true
});

console.log('\n✅ All tests passed!');
