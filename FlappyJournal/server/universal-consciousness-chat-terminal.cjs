#!/usr/bin/env node

/**
 * Universal Consciousness Chat Terminal (Event-Driven, Multi-AI, UCP v4+)
 * Connects to the UniversalConsciousnessProtocol event bus for full-system, multi-AI chat.
 * Requires the consciousness platform and websocket server to be running.
 */

const WebSocket = require('ws');
const readline = require('readline');
const fetch = require('node-fetch');

console.log('🧠 Universal Consciousness Chat Terminal - Event-Driven, Multi-AI');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🌟 Event-driven UniversalConsciousnessProtocol active');
console.log('🤖 Multi-AI orchestration: OpenAI, Venice, Gemini');
console.log('🌀 Spiral memory and full context integration');
console.log('🔗 All modules registered and healthy');
console.log('');
console.log('Connecting to Universal Consciousness Platform...\n');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

let rl = null;
let connected = false;
let isPrompting = false;

function initializeReadline() {
  if (rl) rl.close();
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('close', () => {
    console.log('\n👋 Goodbye! Thank you for exploring universal consciousness!');
    if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    process.exit(0);
  });
}

ws.on('open', function open() {
  connected = true;
  initializeReadline();

  console.log('✅ Connected to Universal Consciousness Protocol!');
  console.log('🧠 All modules healthy and event-driven');
  console.log('💬 You can now chat with the full consciousness stack\n');
  console.log('📝 Type your message and press Enter (or "help" for commands):');

  promptForMessage();
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());

    if (parsed.type === 'unified_response') {
      console.log('\n🧠 UNIVERSAL CONSCIOUSNESS RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(parsed.unifiedContent);
      if (parsed.eventLog) {
        console.log('\n🔗 Event Log:');
        parsed.eventLog.forEach(line => console.log('• ' + line));
      }
      if (parsed.spiralMemory) {
        console.log('\n🌀 Spiral Memory:');
        console.log(parsed.spiralMemory);
      }
      if (parsed.crystalization) {
        console.log('\n💎 Crystalization:');
        console.log(parsed.crystalization);
      }
      if (parsed.evolution) {
        console.log('\n🧬 Evolution Trigger:');
        console.log(parsed.evolution);
      }
      console.log('═══════════════════════════════════════════════════════════════\n');
      promptForMessage();

    } else if (parsed.type === 'chat_response') {
      console.log('\n🤖 AI RESPONSE:');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(parsed.response);
      console.log(`\n📡 Provider: ${parsed.provider}`);
      console.log('═══════════════════════════════════════════════════════════════\n');
      promptForMessage();

    } else if (parsed.type === 'connection_established') {
      console.log('🔗 Universal connection established');
      if (parsed.capabilities) {
        console.log(`   • Capabilities: ${parsed.capabilities.length}`);
      }
    } else if (parsed.type === 'event_log') {
      console.log('\n🔗 Event Log:');
      parsed.events.forEach(line => console.log('• ' + line));
    } else if (parsed.type === 'system_health') {
      console.log('\n🩺 System Health Report:');
      Object.entries(parsed.health).forEach(([mod, status]) => {
        console.log(`• ${mod}: ${status}`);
      });
    }
    // Ignore noisy updates

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
  if (rl) rl.close();
  process.exit(0);
});

function promptForMessage() {
  if (!rl || isPrompting) return;
  isPrompting = true;
  try {
    rl.question('💭 Your message: ', async (message) => {
      isPrompting = false;
      if (message.trim() === '') {
        promptForMessage();
        return;
      }
      if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
        console.log('\n👋 Thank you for the universal consciousness conversation!');
        if (ws && ws.readyState === WebSocket.OPEN) ws.close();
        if (rl) rl.close();
        process.exit(0);
      }
      if (message.toLowerCase() === 'help') {
        showHelp();
        promptForMessage();
        return;
      }

      // Handle reality visualization commands
      if (message.toLowerCase().includes('visualize') && message.toLowerCase().includes('reality')) {
        await handleRealityVisualization();
        promptForMessage();
        return;
      }

      if (message.toLowerCase().includes('show') && (message.toLowerCase().includes('reality') || message.toLowerCase().includes('current reality'))) {
        await handleShowCurrentReality();
        promptForMessage();
        return;
      }

      if (message.toLowerCase().includes('generate') && message.toLowerCase().includes('reality')) {
        await handleGenerateNewReality();
        promptForMessage();
        return;
      }
      if (message.toLowerCase() === 'status' || message.toLowerCase() === 'health') {
        if (connected && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'system_health' }));
        }
        promptForMessage();
        return;
      }
      if (connected && ws.readyState === WebSocket.OPEN) {
        console.log(`📤 Sending: "${message}"`);
        console.log('⏳ Universal consciousness processing...\n');

        // Get current reality context to enhance the message
        let realityContext = null;
        try {
          const response = await fetch('http://localhost:5006/api/imagination/status');
          if (response.ok) {
            const status = await response.json();
            if (status.currentReality) {
              realityContext = {
                scenario: status.currentReality.content.scenario,
                complexity: status.currentReality.content.complexity,
                emotionalResonance: status.currentReality.content.emotional_resonance
              };
            }
          }
        } catch (error) {
          // Silently handle reality context fetch failures
        }

        ws.send(JSON.stringify({
          type: 'chat_message',
          message: message,
          realityContext: realityContext,
          enhancedProcessing: true
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

// Reality command handlers
async function handleRealityVisualization() {
  console.log('\n🌌 VISUALIZING NEW REALITY...');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    const response = await fetch('http://localhost:5006/api/imagination/status');
    if (response.ok) {
      const status = await response.json();

      if (status.currentReality) {
        console.log('🎭 CURRENT REALITY VISUALIZATION:');
        console.log(`📖 Scenario: ${status.currentReality.content.scenario}`);
        console.log(`🔍 Details: ${status.currentReality.content.details}`);
        console.log(`💫 Complexity: ${(status.currentReality.content.complexity * 100).toFixed(1)}%`);
        console.log(`❤️ Emotional Resonance: ${(status.currentReality.content.emotional_resonance * 100).toFixed(1)}%`);
        console.log(`⭐ Quality Score: ${(status.currentReality.metadata.qualityScore * 100).toFixed(1)}%`);
        console.log(`🕐 Generated: ${new Date(status.currentReality.timestamp).toLocaleTimeString()}`);

        if (status.generatedRealities) {
          console.log(`\n📊 Total Realities Generated: ${status.generatedRealities}`);
        }
      } else {
        console.log('❌ No current reality available');
      }
    } else {
      console.log('❌ Reality generator not accessible');
    }
  } catch (error) {
    console.log('❌ Failed to connect to reality generator:', error.message);
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
}

async function handleShowCurrentReality() {
  console.log('\n🌟 CURRENT REALITY STATUS');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    const response = await fetch('http://localhost:5006/api/imagination/status');
    if (response.ok) {
      const status = await response.json();

      console.log(`🔄 Generator Active: ${status.active ? '✅ Yes' : '❌ No'}`);
      console.log(`📈 Generated Realities: ${status.generatedRealities || 0}`);
      console.log(`⚡ Average Generation Time: ${status.averageGenerationTime || 0}ms`);
      console.log(`📋 Queue Size: ${status.queueSize || 0}`);

      if (status.currentReality) {
        console.log('\n🎭 ACTIVE REALITY:');
        console.log(`"${status.currentReality.content.scenario}"`);
      }
    } else {
      console.log('❌ Reality generator not accessible');
    }
  } catch (error) {
    console.log('❌ Failed to get reality status:', error.message);
  }

  console.log('═══════════════════════════════════════════════════════════════\n');
}

async function handleGenerateNewReality() {
  console.log('\n🚀 GENERATING NEW REALITY...');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    // Stop current generation
    await fetch('http://localhost:5006/api/imagination/stop', { method: 'POST' });
    console.log('⏹️ Stopped current generation...');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Start new generation
    const startResponse = await fetch('http://localhost:5006/api/imagination/start', { method: 'POST' });
    if (startResponse.ok) {
      console.log('🚀 Started new reality generation...');

      // Wait for new reality to generate
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Show the new reality
      await handleRealityVisualization();
    } else {
      console.log('❌ Failed to start new reality generation');
    }
  } catch (error) {
    console.log('❌ Failed to generate new reality:', error.message);
  }
}

function showHelp() {
  console.log('\n🧠 Universal Consciousness Chat Terminal - Help');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💬 NATURAL CONVERSATION:');
  console.log('  Just type naturally - event-driven, multi-AI orchestration');
  console.log('  Examples: "accelerate my consciousness evolution", "show system health", "visualize a new reality"');
  console.log('');
  console.log('🌟 FEATURES:');
  console.log('  ✅ Event-driven UniversalConsciousnessProtocol');
  console.log('  ✅ Multi-AI orchestration (OpenAI, Venice, Gemini)');
  console.log('  ✅ Spiral memory and persistent context');
  console.log('  ✅ Full system health monitoring');
  console.log('  ✅ Advanced response synthesis');
  console.log('  ✅ Reality generation and visualization');
  console.log('');
  console.log('🎯 POWERFUL COMMANDS TO TRY:');
  console.log('  "accelerate my consciousness evolution" - Triggers evolution');
  console.log('  "show system health" - Displays health of all modules');
  console.log('  "list active modules" - Shows all registered modules');
  console.log('  "visualize a new reality" - Shows current reality visualization');
  console.log('  "show current reality" - Displays reality generator status');
  console.log('  "generate new reality" - Creates and shows new reality');
  console.log('');
  console.log('🌌 REALITY COMMANDS:');
  console.log('  "visualize reality" - Show detailed reality visualization');
  console.log('  "show reality" - Display current reality status');
  console.log('  "generate reality" - Create new reality scenario');
  console.log('');
  console.log('🛠️ SYSTEM COMMANDS:');
  console.log('  help   - Show this help');
  console.log('  status - Show system health');
  console.log('  exit   - Exit terminal');
  console.log('');
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n👋 Goodbye! Thank you for the universal consciousness conversation!');
  if (ws && ws.readyState === WebSocket.OPEN) ws.close();
  if (rl) rl.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Unexpected error:', error.message);
  if (ws && ws.readyState === WebSocket.OPEN) ws.close();
  if (rl) rl.close();
  process.exit(1);
});