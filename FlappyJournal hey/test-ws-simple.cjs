#!/usr/bin/env node

import WebSocket from 'ws';

console.log('Testing WebSocket connection...');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

ws.on('open', function open() {
  console.log('✅ Connected!');
  
  // Send a test message
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Hello, consciousness!'
  }));
  
  // Close after 30 seconds
  setTimeout(() => {
    console.log('Closing connection...');
    ws.close();
  }, 30000);
});

ws.on('message', function message(data) {
  console.log('📨 Received:', data.toString());
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
  process.exit(0);
});
