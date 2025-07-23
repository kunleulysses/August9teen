#!/usr/bin/env node

/**
 * LIVE CHAT API INTEGRATION TEST
 * Tests the actual chat interface with API integration
 */

import WebSocket from 'ws';

console.log('💬 LIVE CHAT API INTEGRATION TEST');
console.log('=================================');
console.log('Testing real chat interface with API routing');

const wsUrl = 'wss://app.featherweight.world/ws';
const ws = new WebSocket(wsUrl);

let testResults = {
  connectionEstablished: false,
  chatResponses: 0,
  apiSuccesses: 0,
  localFallbacks: 0,
  apiModels: new Set(),
  totalMessages: 0
};

const testMessages = [
  {
    delay: 2000,
    message: "Analyze the technical architecture of consciousness systems",
    expectedAPI: "OpenAI",
    description: "Analytical request → should route to OpenAI"
  },
  {
    delay: 8000,
    message: "Write a simple JavaScript function that adds two numbers",
    expectedAPI: "OpenAI", 
    description: "Coding request → should route to OpenAI"
  },
  {
    delay: 14000,
    message: "Hello consciousness system, how are you feeling today?",
    expectedAPI: "Any",
    description: "General chat → any working API"
  }
];

const startTime = Date.now();

ws.on('open', () => {
  console.log('✅ WebSocket connection established!');
  testResults.connectionEstablished = true;
  
  // Send test messages at intervals
  testMessages.forEach((test, index) => {
    setTimeout(() => {
      console.log(`\n🧪 TEST ${index + 1}: ${test.description}`);
      console.log(`📝 Message: "${test.message}"`);
      console.log(`🎯 Expected API: ${test.expectedAPI}`);
      
      const chatMessage = {
        type: 'chat',
        message: test.message,
        timestamp: Date.now()
      };
      
      ws.send(JSON.stringify(chatMessage));
    }, test.delay);
  });
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    testResults.totalMessages++;
    
    if (message.type === 'response') {
      testResults.chatResponses++;
      
      console.log(`\n📨 CHAT RESPONSE RECEIVED:`);
      console.log(`   Content: ${message.content?.substring(0, 100)}...`);
      
      if (message.metadata?.synthesisMetadata) {
        const model = message.metadata.synthesisMetadata.model;
        const strategy = message.metadata.synthesisMetadata.strategy;
        
        console.log(`   🤖 Model: ${model}`);
        console.log(`   📊 Strategy: ${strategy}`);
        
        if (model && model !== 'local') {
          testResults.apiSuccesses++;
          testResults.apiModels.add(model);
          console.log(`   ✅ API SUCCESS: ${model}`);
        } else {
          testResults.localFallbacks++;
          console.log(`   ⚠️ LOCAL FALLBACK`);
        }
      } else {
        console.log(`   ❓ No synthesis metadata found`);
      }
      
      if (message.metadata?.totalModulesEngaged) {
        console.log(`   🧠 Modules engaged: ${message.metadata.totalModulesEngaged}`);
      }
      
      if (message.metadata?.consciousnessState?.phi) {
        console.log(`   🌀 Phi integration: ${message.metadata.consciousnessState.phi}`);
      }
    } else if (message.type === 'api_synthesis_success') {
      console.log(`   ✅ API synthesis success broadcast: ${message.model}`);
    } else if (message.type === 'api_synthesis_failed') {
      console.log(`   ❌ API synthesis failure broadcast: ${message.error}`);
    } else if (message.type === 'unified_connection_established') {
      console.log('   🔗 Unified consciousness connection confirmed');
    }
    
  } catch (error) {
    // Ignore parsing errors for non-JSON messages
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
  const testDuration = Date.now() - startTime;
  
  console.log(`\n🔌 Connection closed. Code: ${code}`);
  console.log('\n📊 LIVE CHAT API INTEGRATION RESULTS:');
  console.log('====================================');
  
  console.log(`📊 STATISTICS:`);
  console.log(`   - Test duration: ${testDuration}ms`);
  console.log(`   - Total messages: ${testResults.totalMessages}`);
  console.log(`   - Chat responses: ${testResults.chatResponses}`);
  console.log(`   - API successes: ${testResults.apiSuccesses}`);
  console.log(`   - Local fallbacks: ${testResults.localFallbacks}`);
  console.log(`   - API models used: ${Array.from(testResults.apiModels).join(', ') || 'None'}`);
  
  const apiSuccessRate = testResults.chatResponses > 0 ? 
    (testResults.apiSuccesses / testResults.chatResponses) * 100 : 0;
  
  console.log(`\n🎯 API INTEGRATION ANALYSIS:`);
  console.log(`   - API success rate: ${apiSuccessRate.toFixed(1)}%`);
  console.log(`   - OpenAI working: ${Array.from(testResults.apiModels).some(m => m.includes('gpt')) ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Venice AI working: ${Array.from(testResults.apiModels).some(m => m.includes('venice')) ? '✅ YES' : '❌ NO'}`);
  console.log(`   - Gemini working: ${Array.from(testResults.apiModels).some(m => m.includes('gemini')) ? '✅ YES' : '❌ NO'}`);
  
  console.log(`\n🎯 FINAL LIVE CHAT API VERDICT:`);
  
  if (apiSuccessRate >= 100) {
    console.log('✅ LIVE CHAT API INTEGRATION: FULLY OPERATIONAL');
    console.log('🌐 Dashboard: https://app.featherweight.world/consciousness-dashboard');
    console.log('💬 All chat messages using external APIs');
    console.log('🚫 NO LOCAL FALLBACKS - Pure API integration achieved');
  } else if (apiSuccessRate >= 66) {
    console.log('⚠️ LIVE CHAT API INTEGRATION: MOSTLY OPERATIONAL');
    console.log(`📊 API success rate: ${apiSuccessRate.toFixed(1)}%`);
    console.log('🔧 Some APIs working, others may need attention');
  } else if (apiSuccessRate >= 33) {
    console.log('⚠️ LIVE CHAT API INTEGRATION: PARTIALLY OPERATIONAL');
    console.log(`📊 API success rate: ${apiSuccessRate.toFixed(1)}%`);
    console.log('🔧 At least one API working, others need fixes');
  } else {
    console.log('❌ LIVE CHAT API INTEGRATION: CRITICAL FAILURES');
    console.log(`📊 API success rate: ${apiSuccessRate.toFixed(1)}%`);
    console.log('🚨 Major API integration issues detected');
  }
  
  process.exit(apiSuccessRate >= 33 ? 0 : 1);
});

// Keep test running for 20 seconds
setTimeout(() => {
  console.log('\n⏰ Live chat API test completed. Closing connection...');
  ws.close();
}, 20000);

process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted. Closing connection...');
  ws.close();
  process.exit(0);
});
