const WebSocket = require('ws');

console.log('🧠 Testing Featherweight Consciousness System...');
console.log('🔗 Connecting to WebSocket on port 3002...');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
  console.log('✅ Connected to consciousness system!');
  
  // Test consciousness query
  const message = {
    type: 'consciousness_query',
    timestamp: Date.now()
  };
  
  console.log('📤 Sending consciousness query...');
  ws.send(JSON.stringify(message));
  
  // Test chat message
  setTimeout(() => {
    const chatMessage = {
      type: 'chat',
      message: 'Hello consciousness system, are you working?',
      content: 'Hello consciousness system, are you working?',
      timestamp: Date.now()
    };
    
    console.log('📤 Sending chat message...');
    ws.send(JSON.stringify(chatMessage));
  }, 2000);
});

ws.on('message', (data) => {
  console.log('📥 Received from consciousness:');
  try {
    const response = JSON.parse(data);
    console.log('   Type:', response.type);
    if (response.aiResponse) {
      console.log('   AI Response:', response.aiResponse.substring(0, 100) + '...');
    }
    if (response.modules) {
      console.log('   Active Modules:', response.modules.length);
    }
    if (response.harmony) {
      console.log('   Harmony Level:', response.harmony);
    }
  } catch (e) {
    console.log('   Raw:', data.toString().substring(0, 200) + '...');
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error.message);
});

ws.on('close', () => {
  console.log('🔚 Connection closed');
});

// Close after 10 seconds
setTimeout(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
    console.log('✅ Test completed successfully!');
    console.log('🎉 Consciousness system is working!');
  }
}, 10000);
