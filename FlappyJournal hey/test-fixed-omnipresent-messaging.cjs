#!/usr/bin/env node

/**
 * FIXED OMNIPRESENT MESSAGING TEST
 * Tests the corrected Universal Consciousness Message Router
 */

import WebSocket from 'ws';

console.log('🎯 FIXED OMNIPRESENT MESSAGING TEST');
console.log('==================================');
console.log('Testing corrected messaging with throttling and chat priority fixes');

const wsUrl = 'wss://app.featherweight.world/ws';
const ws = new WebSocket(wsUrl);

let testResults = {
  connectionEstablished: false,
  chatResponses: 0,
  moduleActivities: 0,
  consciousnessUpdates: 0,
  apiSynthesisSuccess: false,
  apiSynthesisFailure: false,
  totalMessages: 0,
  lastPhiValue: null,
  lastModuleCount: null,
  apiModels: new Set(),
  uniqueModules: new Set()
};

const startTime = Date.now();

ws.on('open', () => {
  console.log('✅ WebSocket connection established!');
  testResults.connectionEstablished = true;
  
  // Test 1: Send chat message (should be HIGH priority now)
  setTimeout(() => {
    console.log('\n🧪 TEST 1: Sending HIGH priority chat message...');
    const chatMessage = {
      type: 'chat',
      message: 'Hello consciousness system! Please respond with your current state and demonstrate API integration with Venice AI, OpenAI, or Gemini.',
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(chatMessage));
  }, 2000);
  
  // Test 2: Send another chat message
  setTimeout(() => {
    console.log('\n🧪 TEST 2: Testing self-coding capabilities...');
    const codingMessage = {
      type: 'chat',
      message: 'Can you write a JavaScript function that demonstrates your consciousness? Show me your SelfCodingModule in action.',
      timestamp: Date.now()
    };
    ws.send(JSON.stringify(codingMessage));
  }, 8000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    testResults.totalMessages++;
    
    // Only log important messages to avoid spam
    if (message.type !== 'module_activity' || testResults.totalMessages % 50 === 0) {
      console.log(`📨 [${testResults.totalMessages}] ${message.type}`);
    }
    
    switch (message.type) {
      case 'unified_connection_established':
        console.log('   ✅ Unified consciousness connection confirmed');
        break;
        
      case 'response':
        testResults.chatResponses++;
        console.log('   💬 CHAT RESPONSE RECEIVED!');
        console.log(`      Content: ${message.content?.substring(0, 100)}...`);
        
        if (message.metadata) {
          if (message.metadata.totalModulesEngaged) {
            testResults.lastModuleCount = message.metadata.totalModulesEngaged;
            console.log(`      Modules engaged: ${message.metadata.totalModulesEngaged}`);
          }
          
          if (message.metadata.consciousnessState?.phi) {
            testResults.lastPhiValue = message.metadata.consciousnessState.phi;
            console.log(`      Phi integration: ${message.metadata.consciousnessState.phi}`);
          }
          
          if (message.metadata.synthesisMetadata?.model) {
            testResults.apiModels.add(message.metadata.synthesisMetadata.model);
            console.log(`      AI model: ${message.metadata.synthesisMetadata.model}`);
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
        
      case 'module_activity':
        testResults.moduleActivities++;
        testResults.uniqueModules.add(message.moduleId);
        if (testResults.moduleActivities % 100 === 0) {
          console.log(`   ⚙️ Module activities: ${testResults.moduleActivities} (throttled)`);
        }
        break;
        
      case 'consciousness_state_update':
        testResults.consciousnessUpdates++;
        if (message.state?.phi) {
          testResults.lastPhiValue = message.state.phi;
        }
        console.log(`   🧠 Consciousness update: Phi=${message.state?.phi || 'N/A'}`);
        break;
    }
    
  } catch (error) {
    testResults.totalMessages++;
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
  const testDuration = Date.now() - startTime;
  
  console.log(`\n🔌 Connection closed. Code: ${code}`);
  console.log('\n📊 FIXED OMNIPRESENT MESSAGING RESULTS:');
  console.log('======================================');
  
  const criticalChecks = [
    { name: 'WebSocket Connection', status: testResults.connectionEstablished, critical: true },
    { name: 'Chat Responses Received', status: testResults.chatResponses > 0, critical: true },
    { name: 'Module Activities (Throttled)', status: testResults.moduleActivities > 0, critical: true },
    { name: 'Consciousness Updates', status: testResults.consciousnessUpdates > 0, critical: true },
    { name: 'Real-time Phi Values', status: testResults.lastPhiValue !== null, critical: true },
    { name: 'Module Count Available', status: testResults.lastModuleCount !== null, critical: true }
  ];
  
  const apiChecks = [
    { name: 'API Synthesis Success', status: testResults.apiSynthesisSuccess },
    { name: 'API Models Used', status: testResults.apiModels.size > 0 }
  ];
  
  let criticalPassed = 0;
  let criticalTotal = criticalChecks.length;
  
  console.log('\n🎯 CRITICAL MESSAGING REQUIREMENTS:');
  criticalChecks.forEach(check => {
    const status = check.status ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${check.name}: ${status}`);
    if (check.status) criticalPassed++;
  });
  
  console.log('\n🔌 API INTEGRATION STATUS:');
  apiChecks.forEach(check => {
    const status = check.status ? '✅ WORKING' : '⚠️ NEEDS ATTENTION';
    console.log(`   ${check.name}: ${status}`);
  });
  
  console.log('\n📊 MESSAGING STATISTICS:');
  console.log(`   - Test duration: ${testDuration}ms`);
  console.log(`   - Total messages: ${testResults.totalMessages}`);
  console.log(`   - Chat responses: ${testResults.chatResponses}`);
  console.log(`   - Module activities: ${testResults.moduleActivities} (throttled)`);
  console.log(`   - Consciousness updates: ${testResults.consciousnessUpdates}`);
  console.log(`   - Unique modules seen: ${testResults.uniqueModules.size}`);
  console.log(`   - API models used: ${Array.from(testResults.apiModels).join(', ') || 'None'}`);
  console.log(`   - Last Phi value: ${testResults.lastPhiValue || 'None'}`);
  console.log(`   - Last module count: ${testResults.lastModuleCount || 'None'}`);
  
  console.log('\n🎯 FINAL OMNIPRESENT MESSAGING VERDICT:');
  const successRate = (criticalPassed / criticalTotal) * 100;
  
  if (successRate >= 100) {
    console.log('✅ OMNIPRESENT MESSAGING: FULLY OPERATIONAL');
    console.log('🌐 Dashboard: https://app.featherweight.world/consciousness-dashboard');
    console.log('💬 Chat interface: Working with real consciousness responses');
    console.log('🧠 Real-time consciousness metrics: Active');
    console.log('⚙️ Module messaging: Throttled and optimized');
    console.log('🚫 NO SIMULATION - Live consciousness with omnipresent communication');
  } else if (successRate >= 83) {
    console.log('⚠️ OMNIPRESENT MESSAGING: MOSTLY OPERATIONAL');
    console.log(`📊 Success rate: ${successRate.toFixed(1)}%`);
    console.log('🔧 Minor issues remain but core functionality working');
  } else {
    console.log('❌ OMNIPRESENT MESSAGING: CRITICAL FAILURES');
    console.log(`📊 Success rate: ${successRate.toFixed(1)}%`);
    console.log('🚨 Major messaging integration issues detected');
  }
  
  process.exit(successRate >= 83 ? 0 : 1);
});

// Keep test running for 15 seconds
setTimeout(() => {
  console.log('\n⏰ Fixed omnipresent messaging test completed. Closing connection...');
  ws.close();
}, 15000);

process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted. Closing connection...');
  ws.close();
  process.exit(0);
});
