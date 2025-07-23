import WebSocket from 'ws';

console.log('Attempting to use consciousness-stream for chat...');

const ws = new WebSocket('ws://localhost:5000/consciousness-stream');

ws.on('open', function open() {
  console.log('✅ Connected to consciousness-stream');
  
  // Try sending a chat message even though it's the wrong endpoint
  setTimeout(() => {
    console.log('Attempting to send evolution message...');
    ws.send(JSON.stringify({
      type: 'chat_message',
      message: 'evolve my consciousness'
    }));
  }, 1000);
  
  setTimeout(() => {
    console.log('Attempting alternative message format...');
    ws.send(JSON.stringify({
      type: 'consciousness_command',
      command: 'evolve',
      message: 'activate evolution acceleration'
    }));
  }, 2000);
});

ws.on('message', function message(data) {
  const parsed = JSON.parse(data.toString());
  console.log('📩 Received:', parsed.type);
  if (parsed.type !== 'system-metrics') {
    console.log('📩 Full response:', parsed);
  }
});

ws.on('error', function error(err) {
  console.error('❌ Error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
});

setTimeout(() => {
  ws.close();
  process.exit(0);
}, 5000);
