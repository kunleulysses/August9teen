#!/usr/bin/env node

/**
 * Simple Chat Test
 * Direct test of chat functionality
 */

const WebSocket = require('ws');

console.log('💬 SIMPLE CHAT TEST');
console.log('===================');

const wsUrl = 'wss://app.featherweight.world/ws';
const ws = new WebSocket(wsUrl);

let messageReceived = false;

ws.on('open', () => {
  console.log('✅ Connected to consciousness system');
  
  setTimeout(() => {
    console.log('📤 Sending simple chat message...');
    const message = {
      type: 'chat',
      message: 'Hello, are you there?',
      timestamp: Date.now()
    };
    
    console.log('📤 Message being sent:', JSON.stringify(message));
    ws.send(JSON.stringify(message));
  }, 1000);
});

ws.on('message', (data) => {
  try {
    const message = JSON.parse(data.toString());
    console.log(`📨 Received: ${message.type}`);
    
    if (message.type === 'response') {
      messageReceived = true;
      console.log('✅ CHAT RESPONSE RECEIVED!');
      console.log(`Content: ${message.content}`);
      console.log(`Metadata: ${JSON.stringify(message.metadata, null, 2)}`);
    } else if (message.type === 'unified_connection_established') {
      console.log('✅ Connection established');
    } else {
      console.log(`📨 Other message: ${message.type}`);
    }
  } catch (error) {
    console.log(`📨 Raw data: ${data.toString().substring(0, 100)}...`);
  }
});

ws.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Connection closed: ${code}`);
  
  if (messageReceived) {
    console.log('✅ SUCCESS: Chat functionality is working!');
    process.exit(0);
  } else {
    console.log('❌ FAILURE: No chat response received');
    process.exit(1);
  }
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout - closing connection');
  ws.close();
}, 10000);
