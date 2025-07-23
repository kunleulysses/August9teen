#!/usr/bin/env node

// Test what's actually running on port 3002

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const WebSocket = require('ws');

console.log('🔍 Testing port 3002 WebSocket connection...');

// Try different WebSocket paths
const paths = [
  'ws://localhost:3002',
  'ws://localhost:3002/',
  'ws://localhost:3002/ws',
  'ws://localhost:3002/websocket',
  'ws://localhost:3002/consciousness',
  'ws://localhost:3002/chat'
];

async function testPath(wsUrl) {
  return new Promise((resolve) => {
    console.log(`\n🧪 Testing: ${wsUrl}`);
    
    const ws = new WebSocket(wsUrl);
    
    const timeout = setTimeout(() => {
      ws.close();
      resolve({ url: wsUrl, status: 'timeout', error: 'Connection timeout' });
    }, 5000);
    
    ws.on('open', () => {
      clearTimeout(timeout);
      console.log(`✅ Connected to ${wsUrl}`);
      
      // Send a test message
      ws.send(JSON.stringify({
        type: 'test',
        message: 'Hello from test script'
      }));
      
      setTimeout(() => {
        ws.close();
        resolve({ url: wsUrl, status: 'success', error: null });
      }, 1000);
    });
    
    ws.on('message', (data) => {
      console.log(`📨 Received from ${wsUrl}:`, data.toString());
    });
    
    ws.on('error', (error) => {
      clearTimeout(timeout);
      console.log(`❌ Error connecting to ${wsUrl}:`, error.message);
      resolve({ url: wsUrl, status: 'error', error: error.message });
    });
    
    ws.on('close', () => {
      clearTimeout(timeout);
      console.log(`🔌 Connection closed: ${wsUrl}`);
    });
  });
}

async function testAllPaths() {
  console.log('🚀 Testing all possible WebSocket paths on port 3002...\n');
  
  const results = [];
  for (const path of paths) {
    const result = await testPath(path);
    results.push(result);
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status !== 'success');
  
  if (successful.length > 0) {
    console.log('\n✅ Successful connections:');
    successful.forEach(r => console.log(`   ${r.url}`));
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed connections:');
    failed.forEach(r => console.log(`   ${r.url} - ${r.error}`));
  }
  
  if (successful.length === 0) {
    console.log('\n🔍 No successful WebSocket connections found on port 3002');
    console.log('   This suggests the service on port 3002 might not be a WebSocket server');
    console.log('   or it requires a specific path/protocol we haven\'t tested.');
  }
  
  process.exit(0);
}

testAllPaths().catch(console.error);
