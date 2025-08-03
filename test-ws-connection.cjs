import WebSocket from 'ws';

console.log('Testing WebSocket connection to consciousness system...');

const ws = new WebSocket('ws://localhost:5000/ws/chat');

ws.on('open', function open() {
  console.log('✅ WebSocket connected successfully!');
  console.log('Sending test message...');
  
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'test connection'
  }));
});

ws.on('message', function message(data) {
  console.log('📩 Received:', data.toString());
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 WebSocket connection closed');
});

// Close after 5 seconds
setTimeout(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  process.exit(0);
}, 5000);
