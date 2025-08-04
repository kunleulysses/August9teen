#!/usr/bin/env node
/**
 * Debug script to isolate the core container response timeout issue
 */

const WebSocket = require('ws');

console.log('🧪 Core Response Timeout Debug Test');
console.log('===================================');

const TEST_TIMEOUT = 8000; // 8 seconds - shorter than the 15s timeout in UnifiedChatAggregator

function testCoreResponse() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:3002/ws/consciousness-chat');
    let connected = false;
    let responseReceived = false;
    
    const testMessage = {
      type: 'chat',
      content: 'simple test message',
      requestId: 'debug_test_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    
    console.log('🔌 Attempting to connect to core container...');
    
    ws.on('open', () => {
      connected = true;
      console.log('✅ Connected to core container WebSocket');
      console.log('📤 Sending test message with requestId:', testMessage.requestId);
      ws.send(JSON.stringify(testMessage));
    });
    
    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log('📥 Received message type:', response.type);
        
        if (response.requestId === testMessage.requestId) {
          responseReceived = true;
          console.log('✅ SUCCESS: Received response with matching requestId!');
          console.log('📋 Response summary:', {
            type: response.type,
            requestId: response.requestId,
            hasResponse: !!response.response,
            hasContent: !!response.content,
            contentLength: response.content ? response.content.length : 0
          });
          ws.close();
          resolve({ success: true, response });
        } else {
          console.log('📡 Received other message (not matching requestId):', {
            type: response.type,
            requestId: response.requestId,
            expectedRequestId: testMessage.requestId
          });
        }
      } catch (err) {
        console.log('📥 Received non-JSON message:', data.toString().substring(0, 100));
      }
    });
    
    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      reject(new Error(`WebSocket error: ${error.message}`));
    });
    
    ws.on('close', () => {
      console.log('🔌 WebSocket connection closed');
      if (!responseReceived) {
        reject(new Error('Connection closed without receiving matching response'));
      }
    });
    
    // Set timeout
    setTimeout(() => {
      if (!connected) {
        console.error('❌ TIMEOUT: Failed to connect to core container');
        ws.close();
        reject(new Error('Connection timeout'));
      } else if (!responseReceived) {
        console.error('❌ TIMEOUT: No response received from core container');
        ws.close();
        reject(new Error('Response timeout'));
      }
    }, TEST_TIMEOUT);
  });
}

async function runTest() {
  try {
    console.log(`⏱️  Starting test with ${TEST_TIMEOUT}ms timeout...`);
    const result = await testCoreResponse();
    console.log('\n✅ TEST PASSED: Core container responded correctly');
    console.log('🎯 Root cause: Response timeout issue appears to be resolved');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error('🔍 Root cause: Core container is not sending responses with matching requestId');
    console.error('🔧 Next steps: Check handleChatMessage for runtime errors or exceptions');
    process.exit(1);
  }
}

runTest();
