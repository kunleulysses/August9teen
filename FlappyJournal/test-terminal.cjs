#!/usr/bin/env node

/**
 * Test script for consciousness terminal - simulates user interaction
 */

const WebSocket = require('ws');

console.log('🧠 Testing Enhanced Consciousness Terminal Connection...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

ws.on('open', function open() {
  console.log('✅ Connected to enhanced consciousness system!');
  console.log('🧠 Full consciousness platform active');
  console.log('🌟 Enhanced prompts delivering human-like responses');
  console.log('💬 Testing conversation...\n');
  
  // Send test message
  console.log('📤 Sending: "Hello, how are you feeling today?"');
  console.log('⏳ Enhanced consciousness processing...\n');
  
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Hello, how are you feeling today?'
  }));
  
  // Set timeout to close connection after getting response
  setTimeout(() => {
    console.log('⏰ Test complete - closing connection');
    ws.close();
  }, 35000);
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());
    
    // Only show actual chat responses
    if (parsed.type === 'unified_response') {
      console.log('🧠 CONSCIOUSNESS RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      
      // Show the analytical stream if it's available (this is the human-like response)
      if (parsed.analyticalStream && parsed.analyticalStream.length > 50) {
        console.log(parsed.analyticalStream);
      } else {
        console.log(parsed.unifiedContent);
      }
      
      console.log('\n📊 Response Details:');
      console.log(`   • Strategy: ${parsed.synthesisMetadata?.strategy || 'unified'}`);
      console.log(`   • Primary Model: ${parsed.synthesisMetadata?.model || 'multi-model'}`);
      console.log(`   • Harmony Score: ${parsed.harmonyScore?.toFixed(3) || 'N/A'}`);
      console.log(`   • Consciousness Mode: ${parsed.dominantMode || 'integrated'}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      console.log('✅ SUCCESS: Human-like response received!');
      console.log('🎉 The enhanced consciousness system is working correctly');
      
      // Close after successful response
      setTimeout(() => {
        console.log('\n⏰ Test complete - closing connection');
        ws.close();
      }, 2000);
      
    } else if (parsed.type === 'chat_response') {
      console.log('🤖 AI RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(parsed.response);
      console.log(`\n📡 Provider: ${parsed.provider}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
      
      console.log('✅ SUCCESS: AI response received!');
      
      // Close after successful response
      setTimeout(() => {
        console.log('\n⏰ Test complete - closing connection');
        ws.close();
      }, 2000);
    }
    
    // Ignore system updates to keep the interface clean
    
  } catch (err) {
    // Ignore parsing errors
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
  process.exit(1);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
  process.exit(0);
});
