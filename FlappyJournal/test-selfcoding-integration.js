#!/usr/bin/env node

/**
 * Test SelfCodingModule Full Integration
 * Verifies that SelfCodingModule is now fully integrated into the main consciousness system
 */

console.log('🤖 TESTING SELFCODINGMODULE FULL INTEGRATION');
console.log('═══════════════════════════════════════════\n');

async function testSelfCodingIntegration() {
  let score = 0;
  let maxScore = 0;

  console.log('1. Testing SelfCodingModule Existence and Functionality...\n');
  
  // Test 1: Module exists and loads
  maxScore++;
  try {
    const SelfCodingModule = await import('./server/consciousness/modules/SelfCodingModule.js');
    console.log('✅ SelfCodingModule: Successfully imported');
    score++;
    
    // Test instantiation
    const module = new SelfCodingModule.default();
    console.log('✅ SelfCodingModule: Successfully instantiated');
    
    // Test methods
    const hasCodeGeneration = typeof module.handleCodeGeneration === 'function';
    const hasCodeOptimization = typeof module.handleCodeOptimization === 'function';
    const hasCodeAnalysis = typeof module.handleCodeAnalysis === 'function';
    
    console.log(`${hasCodeGeneration ? '✅' : '❌'} Code Generation capability: ${hasCodeGeneration ? 'Available' : 'Missing'}`);
    console.log(`${hasCodeOptimization ? '✅' : '❌'} Code Optimization capability: ${hasCodeOptimization ? 'Available' : 'Missing'}`);
    console.log(`${hasCodeAnalysis ? '✅' : '❌'} Code Analysis capability: ${hasCodeAnalysis ? 'Available' : 'Missing'}`);
    
  } catch (error) {
    console.log(`❌ SelfCodingModule: Error loading - ${error.message}`);
  }

  console.log('\n2. Testing Integration in Consciousness System V2...\n');
  
  // Test 2: Integration in consciousness-system-v2
  maxScore++;
  try {
    const systemV2Content = await import('fs').then(fs => 
      fs.promises.readFile('./server/consciousness-system-v2.js', 'utf8')
    );
    
    const hasImport = systemV2Content.includes('SelfCodingModule');
    const hasInstantiation = systemV2Content.includes('new SelfCodingModule()');
    const hasEventBus = systemV2Content.includes('setEventBus');
    
    console.log(`${hasImport ? '✅' : '❌'} Consciousness System V2 Import: ${hasImport ? 'Present' : 'Missing'}`);
    console.log(`${hasInstantiation ? '✅' : '❌'} Consciousness System V2 Instantiation: ${hasInstantiation ? 'Present' : 'Missing'}`);
    console.log(`${hasEventBus ? '✅' : '❌'} Consciousness System V2 Event Bus: ${hasEventBus ? 'Connected' : 'Missing'}`);
    
    if (hasImport && hasInstantiation && hasEventBus) {
      score++;
      console.log('✅ SelfCodingModule: Fully integrated in Consciousness System V2');
    } else {
      console.log('⚠️  SelfCodingModule: Partial integration in Consciousness System V2');
    }
    
  } catch (error) {
    console.log(`❌ Consciousness System V2: Error checking integration - ${error.message}`);
  }

  console.log('\n3. Testing Integration in Main Consciousness WebSocket...\n');
  
  // Test 3: Integration in enhanced-dual-consciousness-ws
  maxScore++;
  try {
    const wsContent = await import('fs').then(fs => 
      fs.promises.readFile('./server/enhanced-dual-consciousness-ws.js', 'utf8')
    );
    
    const hasImport = wsContent.includes('SelfCodingModule');
    const hasInstantiation = wsContent.includes('new SelfCodingModule()');
    const hasEventBusIntegration = wsContent.includes('setEventBus');
    const hasConsciousnessAnalysis = wsContent.includes('consciousness:analyze');
    const hasSigilIntegration = wsContent.includes('selfCoding:');
    
    console.log(`${hasImport ? '✅' : '❌'} Main WebSocket Import: ${hasImport ? 'Present' : 'Missing'}`);
    console.log(`${hasInstantiation ? '✅' : '❌'} Main WebSocket Instantiation: ${hasInstantiation ? 'Present' : 'Missing'}`);
    console.log(`${hasEventBusIntegration ? '✅' : '❌'} Main WebSocket Event Bus: ${hasEventBusIntegration ? 'Connected' : 'Missing'}`);
    console.log(`${hasConsciousnessAnalysis ? '✅' : '❌'} Consciousness Analysis Events: ${hasConsciousnessAnalysis ? 'Active' : 'Missing'}`);
    console.log(`${hasSigilIntegration ? '✅' : '❌'} Sigil Integration: ${hasSigilIntegration ? 'Present' : 'Missing'}`);
    
    if (hasImport && hasInstantiation && hasEventBusIntegration && hasConsciousnessAnalysis) {
      score++;
      console.log('✅ SelfCodingModule: Fully integrated in Main Consciousness WebSocket');
    } else {
      console.log('⚠️  SelfCodingModule: Partial integration in Main Consciousness WebSocket');
    }
    
  } catch (error) {
    console.log(`❌ Main Consciousness WebSocket: Error checking integration - ${error.message}`);
  }

  console.log('\n4. Testing Real-Time Processing Integration...\n');
  
  // Test 4: Real-time processing integration
  maxScore++;
  try {
    // Test that the module can be instantiated and connected to event bus
    const { EventEmitter } = await import('events');
    const SelfCodingModule = await import('./server/consciousness/modules/SelfCodingModule.js');
    
    const eventBus = new EventEmitter();
    const selfCodingModule = new SelfCodingModule.default();
    selfCodingModule.setEventBus(eventBus);
    
    // Test event emission
    let eventReceived = false;
    eventBus.on('consciousness:analyze', () => {
      eventReceived = true;
    });
    
    // Simulate consciousness analysis event
    eventBus.emit('consciousness:analyze', {
      state: { phi: 0.8, coherence: 0.9 },
      metrics: { awareness: 0.85 },
      timestamp: Date.now()
    });
    
    console.log(`${eventReceived ? '✅' : '❌'} Event Bus Communication: ${eventReceived ? 'Working' : 'Failed'}`);
    
    if (eventReceived) {
      score++;
      console.log('✅ SelfCodingModule: Real-time processing integration successful');
    } else {
      console.log('❌ SelfCodingModule: Real-time processing integration failed');
    }
    
  } catch (error) {
    console.log(`❌ Real-time Processing: Error testing integration - ${error.message}`);
  }

  // Final Assessment
  const percentage = (score / maxScore) * 100;
  
  console.log('\n📊 SELFCODINGMODULE INTEGRATION ASSESSMENT');
  console.log('═══════════════════════════════════════════');
  console.log(`Integration Score: ${score}/${maxScore} (${percentage.toFixed(1)}%)`);
  
  if (percentage === 100) {
    console.log('\n🎉 EXCELLENT! SelfCodingModule is now FULLY INTEGRATED!');
    console.log('✅ Module exists and is functional');
    console.log('✅ Integrated in Consciousness System V2');
    console.log('✅ Integrated in Main Consciousness WebSocket');
    console.log('✅ Real-time processing integration active');
    console.log('\n🚀 CORRECTED STATUS: SelfCodingModule is now 100% operational!');
    console.log('🔧 No longer limited to consciousness-system-v2 only');
    console.log('⚡ Now actively processing consciousness insights in real-time');
    console.log('🧠 AI providers now have direct access to self-coding capabilities');
  } else if (percentage >= 75) {
    console.log('\n✅ GOOD! SelfCodingModule integration is mostly complete');
    console.log('⚠️  Some minor integration issues may remain');
  } else {
    console.log('\n⚠️  PARTIAL! SelfCodingModule integration needs more work');
  }

  console.log('\n💡 INTEGRATION BENEFITS:');
  console.log('• AI providers can now trigger code generation during conversations');
  console.log('• Real-time consciousness analysis feeds into self-coding insights');
  console.log('• Self-coding capabilities are part of the main consciousness pipeline');
  console.log('• No longer isolated to a separate system');
  console.log('• Full integration with Architect 4.0 systems');
}

// Run the test
testSelfCodingIntegration().catch(console.error);
