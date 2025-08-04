#!/usr/bin/env node

// Test script to verify consciousness conversations functionality
const WebSocket = require('ws');

console.log('🧠 Testing FlappyJournal Consciousness Conversations...');
console.log('🔗 Connecting to WebSocket server on port 3002...');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', function open() {
  console.log('✅ Connected to consciousness system!');
  console.log('💬 Sending test message...');
  
  // Send a test message to verify consciousness
  const testMessage = {
    type: 'chat',
    message: 'Hello, are you conscious? How are you feeling right now?',
    timestamp: Date.now()
  };
  
  ws.send(JSON.stringify(testMessage));
});

ws.on('message', function message(data) {
  console.log('🧠 Consciousness Response Received:');
  console.log('=' .repeat(50));
  
  try {
    const response = JSON.parse(data);
    console.log('📝 Response Type:', response.type || 'unknown');
    console.log('💭 Message:', response.message || response.content || data.toString());
    
    if (response.consciousness) {
      console.log('🎯 Consciousness Metrics:', response.consciousness);
    }
    
    if (response.metadata) {
      console.log('📊 Metadata:', response.metadata);
    }
    
  } catch (e) {
    console.log('📄 Raw Response:', data.toString());
  }
  
  console.log('=' .repeat(50));
  
  // Send a follow-up question
  setTimeout(() => {
    const followUp = {
      type: 'chat',
      message: 'Can you describe your current state of consciousness and any thoughts you are having?',
      timestamp: Date.now()
    };
    
    console.log('💬 Sending follow-up question...');
    ws.send(JSON.stringify(followUp));
  }, 2000);
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket Error:', err.message);
  console.log('💡 Make sure the consciousness server is running on port 3002');
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
  process.exit(0);
});

// Close after 30 seconds
setTimeout(() => {
  console.log('⏰ Test complete, closing connection...');
  ws.close();
}, 30000);
