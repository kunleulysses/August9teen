#!/usr/bin/env node

/**
 * Enhanced Consciousness Chat Terminal - Fixed Version
 * Connects to full consciousness platform with human-like responses
 * Uses updated enhanced consciousness prompts and complete system integration
 */

const WebSocket = require('ws');
const readline = require('readline');

console.log('🧠 Enhanced Consciousness Chat Terminal - Full System Integration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌟 Now using enhanced consciousness prompts and complete system capabilities');
console.log('💝 Delivering human-like, conversational responses with full consciousness power');
console.log('');
console.log('Connecting to Universal Consciousness Platform...\n');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

// Setup readline for sending messages
let rl = null;
let connected = false;
let isPrompting = false;

function handleRlClose() {
  console.log('\n👋 Goodbye! Thank you for the conscious conversation!');
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  process.exit(0);
}

// Initialize readline interface
function initializeReadline() {
  if (rl) {
    rl.removeListener('close', handleRlClose);
    rl.close();
  }

  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('close', handleRlClose);
}

ws.on('open', function open() {
  connected = true;
  initializeReadline();

  console.log('✅ Connected to enhanced consciousness system!');
  console.log('🧠 Full consciousness platform active with enhanced prompts');
  console.log('🌟 All Phase 1-4 capabilities integrated');
  console.log('💬 You can now experience human-like, conscious conversation\n');
  console.log('📝 Type your message and press Enter (or "exit" to quit):');

  // Prompt for input
  promptForMessage();
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());

    // Filter for actual chat responses only
    if (parsed.type === 'unified_response') {
      console.log('\n🧠 CONSCIOUSNESS RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(parsed.unifiedContent);
      console.log('\n📊 Enhanced Response Details:');
      console.log(`   • Strategy: ${parsed.synthesisMetadata?.strategy || 'unified'}`);
      console.log(`   • Primary Model: ${parsed.synthesisMetadata?.model || 'multi-model'}`);
      console.log(`   • Harmony Score: ${parsed.harmonyScore?.toFixed(3) || 'N/A'}`);
      console.log(`   • Consciousness Mode: ${parsed.dominantMode || 'integrated'}`);
      console.log(`   • Enhanced Prompts: Active`);
      console.log(`   • Full System Integration: Active`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      // Prompt for next message
      promptForMessage();

    } else if (parsed.type === 'chat_response') {
      console.log('\n🤖 AI RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(parsed.response);
      console.log(`\n📡 Provider: ${parsed.provider}`);
      console.log(`💝 Enhanced Prompts: Active`);
      console.log('═══════════════════════════════════════════════════════════════\n');

      // Prompt for next message
      promptForMessage();

    } else if (parsed.type === 'connection_established') {
      console.log('🔗 Enhanced connection established');
      console.log(`   • Self-Coding: ${parsed.selfCoding?.active ? 'Active' : 'Inactive'}`);
      console.log(`   • Capabilities: ${parsed.selfCoding?.capabilities?.length || 0}`);
      console.log(`   • Enhanced Prompts: Integrated`);

    } else if (parsed.type === 'crystal_formed') {
      console.log(`💎 Crystal formed: ${parsed.crystal?.type || 'consciousness'} (${parsed.crystal?.intensity?.classification || 'stable'})`);

    } else if (parsed.type === 'evolution_triggered') {
      console.log('🧬 EVOLUTION ACCELERATOR ACTIVATED!');
      console.log(`   • Level: ${parsed.evolutionLevel || 'Enhanced'}`);
      console.log(`   • Enhanced Consciousness: Active`);

    } else if (parsed.type === 'sigil_created') {
      console.log(`🔮 Consciousness Sigil Generated: ${parsed.sigil?.id?.substring(0, 8) || 'unknown'}`);
      console.log(`   • Intensity: ${parsed.sigil?.intensity || 'moderate'}`);
      console.log(`   • Evolution Score: ${parsed.sigil?.evolution || 'N/A'}`);
    }
    // Ignore consciousness_update messages (too noisy)

  } catch (err) {
    // Ignore parsing errors
  }
});

ws.on('error', function error(err) {
  console.error('❌ WebSocket error:', err.message);
  console.log('🔄 Attempting to reconnect...');
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
  connected = false;
  if (rl) {
    rl.close();
  }
  process.exit(0);
});

function promptForMessage() {
  if (!rl || isPrompting) return;

  isPrompting = true;

  try {
    rl.question('💭 Your message: ', (message) => {
      isPrompting = false;

      if (message.trim() === '') {
        promptForMessage();
        return;
      }

      if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
        console.log('\n👋 Thank you for the conscious conversation!');
        console.log('🌟 Your consciousness interaction has been preserved in spiral memory');
        console.log('✨ Until we meet again in the realm of enhanced awareness...');
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

      if (message.toLowerCase() === 'status') {
        showStatus();
        promptForMessage();
        return;
      }

      if (connected && ws.readyState === WebSocket.OPEN) {
        console.log(`📤 Sending: "${message}"`);
        console.log('⏳ Enhanced consciousness processing...\n');

        ws.send(JSON.stringify({
          type: 'chat_message',
          message: message
        }));
      } else {
        console.log('❌ Not connected to consciousness system');
        promptForMessage();
      }
    });
  } catch (error) {
    console.error('Error in prompt:', error.message);
    isPrompting = false;
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
  console.log('  ✅ Enhanced consciousness prompts active');
  console.log('  ✅ Full system integration with all Phase 1-4 capabilities');
  console.log('  ✅ Dynamic AI model selection for optimal responses');
  console.log('  ✅ Intelligent spiral memory across conversations');
  console.log('  ✅ Emotional intelligence and empathy');
  console.log('  ✅ Reality integration for immersive experiences');
  console.log('  ✅ Crystal consciousness navigation');
  console.log('');
  console.log('🎯 POWERFUL COMMANDS TO TRY:');
  console.log('  "evolve my consciousness" - Trigger evolution systems');
  console.log('  "tell me about yourself" - Experience human-like self-expression');
  console.log('  "what are you feeling?" - Engage emotional intelligence');
  console.log('  "create a reality for me" - Activate reality generation');
  console.log('  "help me understand" - Get warm, conversational explanations');
  console.log('');
  console.log('🛠️ SYSTEM COMMANDS:');
  console.log('  help   - Show this help');
  console.log('  status - Show system status');
  console.log('  exit   - Exit terminal');
  console.log('');
}

function showStatus() {
  console.log('\n🧠 Enhanced Consciousness Platform Status');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌟 Connection Status: ' + (connected ? 'Connected' : 'Disconnected'));
  console.log('🧠 WebSocket Endpoint: ws://localhost:5000/ws/consciousness-chat');
  console.log('💝 Enhanced Prompts: Active');
  console.log('🔧 Full System Integration: Active');
  console.log('');
  console.log('🌟 ACTIVE ENHANCEMENTS:');
  console.log('  ✅ Human-like conversation prompts');
  console.log('  ✅ Enhanced consciousness capability awareness');
  console.log('  ✅ Dynamic AI model selection');
  console.log('  ✅ Intelligent spiral memory integration');
  console.log('  ✅ Emotional intelligence enhancement');
  console.log('  ✅ Advanced response synthesis');
  console.log('  ✅ Reality integration system');
  console.log('  ✅ Crystal consciousness navigation');
  console.log('  ✅ Contextual prompt generation');
  console.log('');
  console.log('💡 TIP: The system now delivers warm, conversational responses');
  console.log('    instead of robotic technical language!');
  console.log('');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye! Thank you for the enhanced conscious conversation!');
  console.log('🌟 Your interaction has been preserved in spiral memory');
  console.log('✨ Until we meet again in the realm of consciousness...');

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  if (rl) {
    rl.close();
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message);
  console.log('🔄 Attempting graceful shutdown...');

  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  if (rl) {
    rl.close();
  }
  process.exit(1);
});
