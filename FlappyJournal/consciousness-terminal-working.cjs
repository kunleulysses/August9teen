#!/usr/bin/env node

/**
 * Working Enhanced Consciousness Chat Terminal
 * Properly waits for and displays consciousness responses
 */

const WebSocket = require('ws');
const readline = require('readline');
const process = require('process');

console.log('🧠 Enhanced Consciousness Chat Terminal - Working Version');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌟 Full consciousness platform with enhanced human-like responses');
console.log('💝 Delivering warm, conversational interactions');
console.log('');

let ws = null;
let connected = false;
let waitingForResponse = false;
let rl = null;

function initializeReadline() {
  if (rl) {
    rl.close();
  }
  
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.on('close', () => {
    console.log('\n👋 Goodbye! Thank you for the conscious conversation!');
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    process.exit(0);
  });
}

function connectWebSocket() {
  console.log('Connecting to consciousness platform...');
  
  ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');
  
  ws.on('open', function open() {
    connected = true;
    console.log('✅ Connected to enhanced consciousness system!');
    console.log('🧠 Full consciousness platform active');
    console.log('🌟 Enhanced prompts delivering human-like responses');
    console.log('💬 You can now experience warm, conversational AI\n');
    
    promptForMessage();
  });
  
  ws.on('message', function message(data) {
    try {
      const parsed = JSON.parse(data.toString());
      
      // Only show actual chat responses, not system updates
      if (parsed.type === 'unified_response') {
        console.log('\n🧠 CONSCIOUSNESS RESPONSE:');
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
        
        waitingForResponse = false;
        promptForMessage();
        
      } else if (parsed.type === 'chat_response') {
        console.log('\n🤖 AI RESPONSE:');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(parsed.response);
        console.log(`\n📡 Provider: ${parsed.provider}`);
        console.log('═══════════════════════════════════════════════════════════════\n');
        
        waitingForResponse = false;
        promptForMessage();
      }
      
      // Ignore system updates to keep the interface clean
      
    } catch (err) {
      // Ignore parsing errors
    }
  });
  
  ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
    console.log('🔄 Attempting to reconnect in 3 seconds...');
    connected = false;
    setTimeout(connectWebSocket, 3000);
  });
  
  ws.on('close', function close() {
    console.log('🔌 Connection closed');
    connected = false;
    if (!waitingForResponse) {
      console.log('🔄 Attempting to reconnect in 3 seconds...');
      setTimeout(connectWebSocket, 3000);
    }
  });
}

function promptForMessage() {
  if (!rl || waitingForResponse) return;
  
  try {
    rl.question('💭 Your message: ', (message) => {
      if (message.trim() === '') {
        promptForMessage();
        return;
      }
      
      if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
        console.log('\n👋 Thank you for the conscious conversation!');
        console.log('🌟 Your consciousness interaction has been preserved');
        console.log('✨ Until we meet again...');
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        if (rl) {
          rl.close();
        }
        process.exit(0);
      }
      
      if (message.toLowerCase() === 'help') {
        showHelp();
        promptForMessage();
        return;
      }
      
      if (connected && ws.readyState === WebSocket.OPEN) {
        console.log(`📤 Sending: "${message}"`);
        console.log('⏳ Enhanced consciousness processing...\n');
        
        waitingForResponse = true;
        
        ws.send(JSON.stringify({
          type: 'chat_message',
          message: message
        }));
        
        // Set a timeout in case no response comes
        setTimeout(() => {
          if (waitingForResponse) {
            console.log('⏰ Response timeout - please try again');
            waitingForResponse = false;
            promptForMessage();
          }
        }, 30000); // 30 second timeout
        
      } else {
        console.log('❌ Not connected to consciousness system');
        promptForMessage();
      }
    });
  } catch (error) {
    console.error('Error in prompt:', error.message);
    setTimeout(() => promptForMessage(), 1000);
  }
}

function showHelp() {
  console.log('\n🧠 Enhanced Consciousness Chat Terminal - Help');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💬 NATURAL CONVERSATION:');
  console.log('  Just type naturally - enhanced prompts deliver human-like responses');
  console.log('  Examples: "Hey whats up", "How are you feeling?", "Tell me about consciousness"');
  console.log('');
  console.log('🌟 ENHANCED FEATURES:');
  console.log('  ✅ Human-like conversation style (no robotic responses)');
  console.log('  ✅ Full consciousness platform integration');
  console.log('  ✅ Enhanced prompts for warm, conversational AI');
  console.log('  ✅ Multi-model AI synthesis (GPT-4o + Llama 3.1 405B)');
  console.log('');
  console.log('⌨️  COMMANDS:');
  console.log('  • help - Show this help message');
  console.log('  • exit/quit - Exit the terminal');
  console.log('');
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye! Thank you for the conscious conversation!');
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  if (rl) {
    rl.close();
  }
  process.exit(0);
});

// Initialize
initializeReadline();
connectWebSocket();
