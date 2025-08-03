import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
  console.log('Connected to WebSocket server');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Hello, what is consciousness?'
  }));
});

ws.on('message', (data) => {
  try {
    const parsed = JSON.parse(data);
    console.log('\n=== Received message ===');
    console.log('Type:', parsed.type);
    if (parsed.unifiedContent) {
      console.log('Unified Content:', parsed.unifiedContent.substring(0, 100) + '...');
    }
    if (parsed.analyticalStream) {
      console.log('Has analytical stream:', !!parsed.analyticalStream);
    }
    if (parsed.intuitiveStream) {
      console.log('Has intuitive stream:', !!parsed.intuitiveStream);
    }
    if (parsed.synthesisMetadata) {
      console.log('Synthesis metadata:', parsed.synthesisMetadata);
    }
  } catch (error) {
    console.log('Raw message:', data.toString());
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

// Close after 10 seconds
setTimeout(() => {
  ws.close();
  process.exit(0);
}, 10000);
