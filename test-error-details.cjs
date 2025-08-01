const WebSocket = require('ws');

console.log('Testing for error details in consciousness responses...');
const ws = new WebSocket('ws://localhost:3002');
let errorFound = false;

ws.on('open', () => {
  console.log('✅ Connected to consciousness-core');
  const testMessage = {
    type: 'chat_message',
    message: 'Error diagnosis test',
    user_id: 'debug_user',
    timestamp: Date.now(),
    requestId: 'error_test_' + Date.now()
  };
  console.log('📤 Sending test message to capture error details');
  ws.send(JSON.stringify(testMessage));
});

ws.on('message', (data) => {
  try {
    const response = JSON.parse(data.toString());
    
    if (response.type === 'error') {
      console.log('🚨 ERROR RESPONSE FOUND:');
      console.log('📋 Full error details:', JSON.stringify(response, null, 2));
      errorFound = true;
      ws.close();
      process.exit(0);
    } else if (response.type === 'unified_conscious_response') {
      console.log('🎯 SUCCESS: unified_conscious_response received unexpectedly!');
      ws.close();
      process.exit(0);
    }
  } catch (e) {
    console.log('📥 Raw data:', data.toString());
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
  process.exit(1);
});

setTimeout(() => {
  if (!errorFound) {
    console.log('⏰ Timeout: No error details captured in 4 seconds');
  }
  process.exit(1);
}, 4000);
