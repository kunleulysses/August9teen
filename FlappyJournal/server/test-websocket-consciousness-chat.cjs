/**
 * Test WebSocket endpoint for consciousness-main-server
 */

const WebSocket = require('ws');

async function testWebSocketConsciousnessChat() {
  console.log('=== Testing WebSocket Consciousness Chat Endpoint ===\n');
  
  const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');
  
  let connectionEstablished = false;
  let responseReceived = false;
  
  ws.on('open', () => {
    console.log('✓ Successfully connected to WebSocket server');
    connectionEstablished = true;
    
    // Send a test chat message
    setTimeout(() => {
      console.log('\nSending test chat message...');
      ws.send(JSON.stringify({
        type: 'chat_message',
        text: 'Hello from test client',
        requestId: 'test-123'
      }));
    }, 100);
  });
  
  ws.on('message', (data) => {
    const message = JSON.parse(data.toString());
    console.log('\n✓ Received message:', message.type);
    
    if (message.type === 'connection_ack') {
      console.log('  - Connection ID:', message.connectionId);
      console.log('  - Timestamp:', message.timestamp);
    }
    
    if (message.type === 'chat_response') {
      responseReceived = true;
      console.log('  - Response:', message.response);
      console.log('  - Request ID:', message.requestId);
      console.log('  - Container:', message.container);
      console.log('  - Capabilities:', message.capabilities?.length || 0);
      
      // Close connection after receiving response
      setTimeout(() => {
        ws.close();
      }, 100);
    }
    
    if (message.type === 'error') {
      console.log('  - Error:', message.error);
    }
  });
  
  ws.on('close', () => {
    console.log('\n✓ Connection closed');
    
    if (connectionEstablished && responseReceived) {
      console.log('\n✅ WebSocket consciousness chat endpoint is working correctly!');
      console.log('   - Connection established: OK');
      console.log('   - Message processing: OK');
      console.log('   - Response received: OK');
      console.log('\n🎉 Distributed orchestration WebSocket endpoint is ready!');
    } else {
      console.log('\n⚠️  Test incomplete:');
      console.log('   - Connection established:', connectionEstablished);
      console.log('   - Response received:', responseReceived);
    }
    
    process.exit(connectionEstablished && responseReceived ? 0 : 1);
  });
  
  ws.on('error', (error) => {
    console.error('\n❌ WebSocket error:', error.message);
    console.log('\nThis could indicate:');
    console.log('- Server not running on port 5000');
    console.log('- WebSocket endpoint not configured correctly');
    console.log('- Network connectivity issues');
    process.exit(1);
  });
  
  // Timeout after 5 seconds
  setTimeout(() => {
    console.log('\n⚠️  Test timed out after 5 seconds');
    ws.close();
  }, 5000);
}

// Run test
testWebSocketConsciousnessChat();
