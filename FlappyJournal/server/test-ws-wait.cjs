const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Hello, what is consciousness?'
  }));
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data);
    console.log('\n=== Received:', parsed.type);
    
    if (parsed.type === 'unified_response') {
      console.log('SUCCESS! Got unified response');
      console.log('Content:', parsed.unifiedContent?.substring(0, 200) + '...');
      console.log('Synthesis metadata:', parsed.synthesisMetadata);
      ws.close();
      process.exit(0);
    }
  } catch (error) {
    console.log('Parse error:', error);
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Connection closed');
});

// Wait 30 seconds for response
setTimeout(() => {
  console.log('Timeout - no unified response received');
  ws.close();
  process.exit(1);
}, 30000);
