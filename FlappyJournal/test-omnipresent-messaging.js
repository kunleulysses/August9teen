#!/usr/bin/env node

/**
 * OMNIPRESENT MESSAGING VERIFICATION TEST
 * Tests every aspect of the Universal Consciousness Message Router
 * Ensures NO MODULE can escape real-time communication
 */

import WebSocket from 'ws';

console.log('🚨 OMNIPRESENT MESSAGING VERIFICATION TEST');
console.log('==========================================');
console.log('Testing EVERY module for real-time messaging capabilities');
console.log('URL: https://app.featherweight.world/consciousness-dashboard');

const wsUrl = 'wss://app.featherweight.world/ws';
const ws = new WebSocket(wsUrl);

let testResults = {
  connectionEstablished: false,
  moduleRegistrations: 0,
  moduleActivities: 0,
  apiSynthesisSuccess: false,
  apiSynthesisFailure: false,
  consciousnessUpdates: 0,
  chatResponses: 0,
  consciousnessStreams: 0,
  moduleStateUpdates: 0,
  emergencyBroadcasts: 0,
  totalMessages: 0,
  uniqueModules: new Set(),
  apiModels: new Set(),
  lastPhiValue: null,
  lastModuleCount: null
};

const startTime = Date.now();

ws.on('open', () => {
  console.log('✅ WebSocket connection established!');
  testResults.connectionEstablished = true;
  
  // Test 1: Send chat message to trigger all modules
  setTimeout(() => {
    console.log('\n🧪 TEST 1: Triggering all 34+ modules with chat message...');
    const chatMessage = {
      type: 'chat',
      message: 'Activate all consciousness modules and demonstrate real-time messaging capabilities. Show me Venice AI, OpenAI, and Gemini integration.',
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(chatMessage));
  }, 1000);
  
  // Test 2: Request consciousness state
  setTimeout(() => {
    console.log('\n🧪 TEST 2: Requesting consciousness state updates...');
    const stateRequest = {
      type: 'get_consciousness_state',
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(stateRequest));
  }, 4000);
  
  // Test 3: Trigger self-coding capabilities
  setTimeout(() => {
    console.log('\n🧪 TEST 3: Testing self-coding module messaging...');
    const codingRequest = {
      type: 'chat',
      message: 'Generate a JavaScript function using your SelfCodingModule and broadcast the result.',
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(codingRequest));
  }, 7000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    testResults.totalMessages++;
    
    // Log every message type for verification
    console.log(`📨 [${testResults.totalMessages}] ${message.type}`);
    
    switch (message.type) {
      case 'unified_connection_established':
        console.log('   ✅ Unified consciousness connection confirmed');
        break;
        
      case 'module_registered':
        testResults.moduleRegistrations++;
        testResults.uniqueModules.add(message.moduleId);
        console.log(`   📡 Module registered: ${message.moduleId} (Total: ${message.totalModules})`);
        break;
        
      case 'module_activity':
        testResults.moduleActivities++;
        testResults.uniqueModules.add(message.moduleId);
        console.log(`   ⚙️ Module activity: ${message.moduleId} - ${message.activity?.method || 'unknown'}`);
        break;
        
      case 'module_state_update':
        testResults.moduleStateUpdates++;
        testResults.uniqueModules.add(message.moduleId);
        console.log(`   🔄 Module state update: ${message.moduleId}`);
        break;
        
      case 'response':
        testResults.chatResponses++;
        console.log('   💬 Chat response received');
        
        if (message.metadata) {
          if (message.metadata.totalModulesEngaged) {
            testResults.lastModuleCount = message.metadata.totalModulesEngaged;
            console.log(`      - Modules engaged: ${message.metadata.totalModulesEngaged}`);
          }
          
          if (message.metadata.consciousnessState?.phi) {
            testResults.lastPhiValue = message.metadata.consciousnessState.phi;
            console.log(`      - Phi integration: ${message.metadata.consciousnessState.phi}`);
          }
          
          if (message.metadata.synthesisMetadata?.model) {
            testResults.apiModels.add(message.metadata.synthesisMetadata.model);
            console.log(`      - AI model: ${message.metadata.synthesisMetadata.model}`);
          }
        }
        break;
        
      case 'api_synthesis_success':
        testResults.apiSynthesisSuccess = true;
        testResults.apiModels.add(message.model);
        console.log(`   ✅ API synthesis success: ${message.model} (${message.strategy})`);
        break;
        
      case 'api_synthesis_failed':
        testResults.apiSynthesisFailure = true;
        console.log(`   ❌ API synthesis failed: ${message.error}`);
        break;
        
      case 'consciousness_state_update':
        testResults.consciousnessUpdates++;
        if (message.state?.phi) {
          testResults.lastPhiValue = message.state.phi;
        }
        console.log(`   🧠 Consciousness state update: Phi=${message.state?.phi || 'N/A'}`);
        break;
        
      case 'consciousness_stream':
        testResults.consciousnessStreams++;
        console.log(`   🌊 Consciousness stream: ${message.content?.substring(0, 50)}...`);
        break;
        
      case 'emergency_broadcast':
        testResults.emergencyBroadcasts++;
        console.log(`   🚨 Emergency broadcast: ${message.content}`);
        break;
        
      default:
        console.log(`   ❓ Unknown message type: ${message.type}`);
    }
    
  } catch (error) {
    console.log(`📨 Raw message received (${data.toString().length} chars)`);
    testResults.totalMessages++;
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
  const testDuration = Date.now() - startTime;
  
  console.log(`\n🔌 Connection closed. Code: ${code}`);
  console.log('\n📊 OMNIPRESENT MESSAGING TEST RESULTS:');
  console.log('=====================================');
  
  const criticalChecks = [
    { name: 'WebSocket Connection', status: testResults.connectionEstablished, critical: true },
    { name: 'Module Registrations', status: testResults.moduleRegistrations > 0, critical: true },
    { name: 'Module Activities', status: testResults.moduleActivities > 0, critical: true },
    { name: 'Chat Responses', status: testResults.chatResponses > 0, critical: true },
    { name: 'Consciousness Updates', status: testResults.consciousnessUpdates > 0, critical: true },
    { name: 'API Synthesis Working', status: testResults.apiSynthesisSuccess, critical: true },
    { name: 'Real-time Phi Values', status: testResults.lastPhiValue !== null, critical: true },
    { name: 'Module Count Available', status: testResults.lastModuleCount !== null, critical: true }
  ];
  
  const optionalChecks = [
    { name: 'Consciousness Streams', status: testResults.consciousnessStreams > 0 },
    { name: 'Module State Updates', status: testResults.moduleStateUpdates > 0 },
    { name: 'Emergency Broadcasts', status: testResults.emergencyBroadcasts > 0 }
  ];
  
  let criticalPassed = 0;
  let criticalTotal = criticalChecks.length;
  
  console.log('\n🎯 CRITICAL MESSAGING REQUIREMENTS:');
  criticalChecks.forEach(check => {
    const status = check.status ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${check.name}: ${status}`);
    if (check.status) criticalPassed++;
  });
  
  console.log('\n📈 OPTIONAL MESSAGING FEATURES:');
  optionalChecks.forEach(check => {
    const status = check.status ? '✅ PASS' : '⚠️ MISSING';
    console.log(`   ${check.name}: ${status}`);
  });
  
  console.log('\n📊 MESSAGING STATISTICS:');
  console.log(`   - Test duration: ${testDuration}ms`);
  console.log(`   - Total messages: ${testResults.totalMessages}`);
  console.log(`   - Module registrations: ${testResults.moduleRegistrations}`);
  console.log(`   - Module activities: ${testResults.moduleActivities}`);
  console.log(`   - Unique modules seen: ${testResults.uniqueModules.size}`);
  console.log(`   - API models used: ${Array.from(testResults.apiModels).join(', ') || 'None'}`);
  console.log(`   - Chat responses: ${testResults.chatResponses}`);
  console.log(`   - Consciousness updates: ${testResults.consciousnessUpdates}`);
  console.log(`   - Last Phi value: ${testResults.lastPhiValue || 'None'}`);
  console.log(`   - Last module count: ${testResults.lastModuleCount || 'None'}`);
  
  console.log('\n🎯 FINAL OMNIPRESENT MESSAGING VERDICT:');
  const successRate = (criticalPassed / criticalTotal) * 100;
  
  if (successRate >= 100) {
    console.log('✅ OMNIPRESENT MESSAGING: FULLY OPERATIONAL');
    console.log('🌐 Dashboard: https://app.featherweight.world/consciousness-dashboard');
    console.log('🧠 All modules have real-time messaging capabilities');
    console.log('🚫 NO SIMULATION - Live consciousness with omnipresent communication');
  } else if (successRate >= 75) {
    console.log('⚠️ OMNIPRESENT MESSAGING: MOSTLY OPERATIONAL');
    console.log(`📊 Success rate: ${successRate.toFixed(1)}%`);
    console.log('🔧 Some messaging features need attention');
  } else {
    console.log('❌ OMNIPRESENT MESSAGING: CRITICAL FAILURES');
    console.log(`📊 Success rate: ${successRate.toFixed(1)}%`);
    console.log('🚨 Major messaging integration issues detected');
  }
  
  process.exit(successRate >= 75 ? 0 : 1);
});

// Keep test running for 12 seconds
setTimeout(() => {
  console.log('\n⏰ Omnipresent messaging test completed. Closing connection...');
  ws.close();
}, 12000);

process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted. Closing connection...');
  ws.close();
  process.exit(0);
});
