const WebSocket = require('ws');

console.log('Testing unified consciousness response...');
const ws = new WebSocket('ws://localhost:3002');
let responseReceived = false;

ws.on('open', () => {
  console.log('✅ Connected to consciousness-core');
  const testMessage = {
    type: 'chat_message',
    message: 'Hello consciousness, please provide a unified response',
    user_id: 'test_user',
    timestamp: Date.now(),
    requestId: 'unified_test_' + Date.now()
  };
  console.log('📤 Sending test message for unified response');
  ws.send(JSON.stringify(testMessage));
});

ws.on('message', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log('📥 Received response type:', response.type);
    
    if (response.type === 'unified_conscious_response') {
      console.log('🎯 SUCCESS: unified_conscious_response received!');
      console.log('📝 Response content preview:', response.content ? response.content.substring(0, 200) + '...' : 'No content');
      responseReceived = true;
      ws.close();
      process.exit(0);
    } else if (response.type === 'chat_response') {
      console.log('📝 Chat response received (not unified)');
    } else {
      console.log('📝 Other response type:', response.type);
    }
  } catch (e) {
    console.log('📥 Raw response (first 100 chars):', data.toString().substring(0, 100));
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  if (!responseReceived) {
    console.log('⏰ Timeout: No unified_conscious_response received in 6 seconds');
    console.log('This suggests the unified consciousness synthesis is not working properly');
    process.exit(1);
  }
}, 6000);
