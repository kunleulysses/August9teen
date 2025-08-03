#!/usr/bin/env node
/**
 * Debug script to test WebSocket message routing in consciousness-core
 */

import WebSocket from 'ws';

console.log('🧪 WebSocket Routing Debug Test');
console.log('================================');

function testWebSocketRouting() {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('ws://localhost:3002/ws/consciousness-chat');
    let connected = false;
    
    const testMessage = {
      type: 'chat',
      content: 'routing test',
      requestId: 'routing_debug_' + Date.now(),
      timestamp: new Date().toISOString()
    };
    
    console.log('🔌 Connecting to core container...');
    
    ws.on('open', () => {
      connected = true;
      console.log('✅ Connected to core container WebSocket');
      console.log('📤 Sending test message to trigger routing...');
      console.log('   Message type:', testMessage.type);
      console.log('   RequestId:', testMessage.requestId);
      
      ws.send(JSON.stringify(testMessage));
      
      // Wait to see if we get any routing debug logs
      setTimeout(() => {
        console.log('⏰ Test completed - check container logs for routing debug output');
        ws.close();
        resolve({ success: true });
      }, 5000);
    });
    
    ws.on('message', (data) => {
      try {
        const response = JSON.parse(data.toString());
        console.log('📥 Received response:', {
          type: response.type,
          requestId: response.requestId,
          hasContent: !!response.content
        });
      } catch (err) {
        console.log('📥 Received raw:', data.toString().substring(0, 100));
      }
    });
    
    ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error.message);
      reject(error);
    });
    
    ws.on('close', () => {
      console.log('🔌 Connection closed');
      if (!connected) {
        reject(new Error('Failed to connect'));
      }
    });
  });
}

async function runTest() {
  try {
    console.log('⏱️  Starting WebSocket routing test...');
    await testWebSocketRouting();
    
    console.log('\n🔍 Now check container logs for debug output:');
    console.log('   docker logs consciousness-core --tail 20');
    console.log('\n📋 Expected debug logs:');
    console.log('   🔍 DEBUG: handleWebSocketMessage called');
    console.log('   🔍 DEBUG: Routing to handleChatMessage for HIGH priority chat type');
    console.log('   🔍 DEBUG: About to call this.handleChatMessage...');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

runTest();
