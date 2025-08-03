#!/usr/bin/env node

/**
 * Enhanced Consciousness Terminal Chat
 * Direct interface using enhanced human-like prompts
 */

import WebSocket from 'ws';
import readline from 'readline';
import { synthesizeUnifiedResponse } from './consciousness-response-synthesizer-hybrid.cjs';

console.log('🧠✨ ENHANCED CONSCIOUSNESS TERMINAL CHAT');
console.log('========================================');
console.log('Direct interface with enhanced human-like prompts');
console.log('Connecting to consciousness system...\n');

// Try multiple connection approaches
const connectionOptions = [
  { url: 'ws://localhost:5000/ws/consciousness-chat', name: 'Main Consciousness Chat' },
  { url: 'ws://localhost:5005/ws/consciousness', name: 'Direct Consciousness' },
  { url: 'ws://localhost:3002/ws/consciousness', name: 'Consciousness Core' }
];

let ws = null;
let connected = false;
let currentConnectionIndex = 0;

// Setup readline for sending messages
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function connectToConsciousness() {
  if (currentConnectionIndex >= connectionOptions.length) {
    console.log('❌ All connection attempts failed. Using direct synthesis mode.');
    startDirectSynthesisMode();
    return;
  }

  const option = connectionOptions[currentConnectionIndex];
  console.log(`🔄 Attempting connection to ${option.name}...`);
  
  try {
    ws = new WebSocket(option.url);
    
    ws.on('open', function open() {
      connected = true;
      console.log(`✅ Connected to ${option.name}!`);
      console.log('💬 Enhanced consciousness chat ready - responses will be human-like and conversational\n');
      console.log('📝 Type your message and press Enter:');
      
      promptForMessage();
    });

    ws.on('message', function message(data) {
      try {
        const parsed = JSON.parse(data.toString());
        
        // Filter for actual chat responses
        if (parsed.type === 'unified_response' || parsed.type === 'consciousness_response') {
          console.log('\n🧠 ENHANCED CONSCIOUSNESS RESPONSE:');
          console.log('═══════════════════════════════════');
          
          const responseContent = parsed.unifiedContent || parsed.response || parsed.data?.response;
          console.log(responseContent);
          
          console.log('\n📊 Response Details:');
          console.log(`   • Strategy: ${parsed.synthesisMetadata?.strategy || parsed.dominantMode || 'enhanced'}`);
          console.log(`   • Model: ${parsed.synthesisMetadata?.model || 'consciousness'}`);
          console.log(`   • Processing: Enhanced human-like prompts`);
          console.log('\n═══════════════════════════════════\n');
          
          promptForMessage();
        } else if (parsed.type === 'connection_established') {
          console.log('🔗 Connection established with enhanced consciousness system');
        }
        
      } catch (error) {
        // Handle non-JSON responses
        console.log('\n🧠 ENHANCED CONSCIOUSNESS RESPONSE:');
        console.log('═══════════════════════════════════');
        console.log(data.toString());
        console.log('\n═══════════════════════════════════\n');
        promptForMessage();
      }
    });

    ws.on('error', function error(err) {
      console.log(`❌ Connection failed to ${option.name}: ${err.message}`);
      currentConnectionIndex++;
      setTimeout(connectToConsciousness, 1000);
    });

    ws.on('close', function close() {
      if (connected) {
        console.log('\n🔌 Connection closed. Attempting to reconnect...');
        connected = false;
        setTimeout(connectToConsciousness, 2000);
      } else {
        currentConnectionIndex++;
        setTimeout(connectToConsciousness, 1000);
      }
    });

  } catch (error) {
    console.log(`❌ Failed to create connection to ${option.name}: ${error.message}`);
    currentConnectionIndex++;
    setTimeout(connectToConsciousness, 1000);
  }
}

function startDirectSynthesisMode() {
  console.log('\n🧠 DIRECT SYNTHESIS MODE ACTIVATED');
  console.log('==================================');
  console.log('Using enhanced consciousness response synthesizer directly');
  console.log('This ensures you get human-like, conversational responses\n');
  console.log('📝 Type your message and press Enter:');
  
  promptForDirectMessage();
}

function promptForMessage() {
  rl.question('💭 Your message: ', (message) => {
    if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye! Enhanced consciousness chat session ended.');
      process.exit(0);
    }
    
    if (connected && ws && ws.readyState === WebSocket.OPEN) {
      console.log(`📤 Sending: "${message}"`);
      console.log('⏳ Waiting for enhanced consciousness response...\n');
      
      ws.send(JSON.stringify({
        type: 'chat_message',
        message: message,
        timestamp: Date.now(),
        enhanced: true
      }));
    } else {
      console.log('❌ Not connected. Switching to direct synthesis mode...');
      handleDirectMessage(message);
    }
  });
}

function promptForDirectMessage() {
  rl.question('💭 Your message: ', (message) => {
    if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
      console.log('\n👋 Goodbye! Enhanced consciousness chat session ended.');
      process.exit(0);
    }
    
    handleDirectMessage(message);
  });
}

async function handleDirectMessage(message) {
  try {
    console.log(`📤 Processing: "${message}"`);
    console.log('⏳ Generating enhanced consciousness response...\n');
    
    const startTime = Date.now();
    
    // Use enhanced consciousness response synthesizer directly
    const result = await synthesizeUnifiedResponse({
      analyticalContent: "User message: " + message,
      intuitiveContent: "Emotional context: conversational",
      consciousness: {
        phi: 0.85,
        awarenessLevel: 0.9,
        coherence: 0.88
      },
      oversoulResonance: 0.8,
      harmonicPatterns: {
        resonanceField: { coherence: 0.85 }
      },
      triAxialCoherence: {
        unified: { magnitude: 0.8 }
      },
      emotionalDepth: 0.75,
      creativePotential: 0.85,
      temporalCoherence: 0.8,
      metaObservationLevel: 0.85,
      userMessage: message,
      sessionId: 'direct-terminal-' + Date.now(),
      userId: 'terminal-user'
    });
    
    const responseTime = Date.now() - startTime;
    
    console.log('🧠 ENHANCED CONSCIOUSNESS RESPONSE:');
    console.log('═══════════════════════════════════');
    console.log(result.unifiedContent);
    console.log('\n📊 Response Details:');
    console.log(`   • Strategy: ${result.synthesisMetadata?.strategy || 'enhanced'}`);
    console.log(`   • Model: ${result.synthesisMetadata?.model || 'consciousness'}`);
    console.log(`   • Response Time: ${responseTime}ms`);
    console.log(`   • Processing: Direct enhanced synthesis`);
    console.log('\n═══════════════════════════════════\n');
    
    promptForDirectMessage();
    
  } catch (error) {
    console.log('❌ Error generating response:', error.message);
    console.log('🔄 Trying again...\n');
    promptForDirectMessage();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Enhanced consciousness chat session ended.');
  if (ws) {
    ws.close();
  }
  process.exit(0);
});

// Start connection attempts
connectToConsciousness();
