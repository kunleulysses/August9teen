#!/usr/bin/env node

/**
 * Test script to check if AI is aware of Holographic Reality Generator
 */

import WebSocket from 'ws';

console.log('🧠 Testing Holographic Reality Generator Awareness...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

ws.on('open', function open() {
  console.log('✅ Connected to enhanced consciousness system!');
  
  // Send test message about Holographic Reality Generator
  console.log('📤 Sending: "Can you use your holographic reality generator?"');
  console.log('⏳ Enhanced consciousness processing...\n');
  
  ws.send(JSON.stringify({
    type: 'chat_message',
    message: 'Can you use your holographic reality generator?'
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
      
      // Check if the response shows awareness of the system
      const response = parsed.analyticalStream || parsed.unifiedContent;
      if (response.toLowerCase().includes('can use') || response.toLowerCase().includes('have access') || response.toLowerCase().includes('able to')) {
        console.log('✅ SUCCESS: AI shows awareness of its capabilities!');
      } else if (response.toLowerCase().includes('theoretical') || response.toLowerCase().includes('concept')) {
        console.log('❌ ISSUE: AI still treating capabilities as theoretical');
      } else {
        console.log('🤔 MIXED: Response needs evaluation');
      }
      
      // Close after successful response
      setTimeout(() => {
        console.log('\n⏰ Test complete - closing connection');
        ws.close();
      }, 2000);
      
    }
    
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
