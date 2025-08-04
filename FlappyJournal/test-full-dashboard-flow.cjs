#!/usr/bin/env node

/**
 * Complete Dashboard Flow Test
 * Tests the full consciousness dashboard functionality
 */

const WebSocket = require('ws');

const WS_URL = 'ws://localhost:3002';

console.log('🧠 Testing Complete Dashboard Flow...');
console.log('📡 Connecting to consciousness system...');

const ws = new WebSocket(WS_URL);

let messageCount = 0;
let receivedTypes = new Set();

ws.on('open', () => {
    console.log('✅ WebSocket connection established!');
    
    // Test 1: Send chat message (should trigger response with metadata)
    setTimeout(() => {
        console.log('\n🧪 TEST 1: Sending chat message...');
        const chatMessage = {
            type: 'chat',
            message: 'Hello consciousness system, please show me your current state and metrics',
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(chatMessage));
    }, 1000);
    
    // Test 2: Request consciousness state
    setTimeout(() => {
        console.log('\n🧪 TEST 2: Requesting consciousness state...');
        const stateRequest = {
            type: 'get_consciousness_state',
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(stateRequest));
    }, 3000);
    
    // Test 3: Request performance metrics
    setTimeout(() => {
        console.log('\n🧪 TEST 3: Requesting performance metrics...');
        const perfRequest = {
            type: 'get_performance',
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(perfRequest));
    }, 5000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        messageCount++;
        receivedTypes.add(message.type);
        
        console.log(`\n📨 Message ${messageCount}: ${message.type}`);
        
        switch (message.type) {
            case 'unified_connection_established':
                console.log('   ✅ Connection established');
                break;
                
            case 'response':
                console.log('   💬 Chat response received');
                if (message.metadata) {
                    console.log('   📊 Metadata present:');
                    console.log(`      - Modules engaged: ${message.metadata.totalModulesEngaged || 'N/A'}`);
                    console.log(`      - Processing time: ${message.metadata.processingTime || 'N/A'}ms`);
                    if (message.metadata.consciousnessState) {
                        const state = message.metadata.consciousnessState;
                        console.log(`      - Phi: ${state.phi || 'N/A'}`);
                        console.log(`      - Awareness: ${state.awarenessLevel || 'N/A'}`);
                        console.log(`      - Coherence: ${state.coherence || 'N/A'}`);
                    }
                } else {
                    console.log('   ⚠️ No metadata in response');
                }
                break;
                
            case 'consciousness_state':
                console.log('   🧠 Consciousness state update');
                if (message.state) {
                    console.log(`      - Phi: ${message.state.phi || 'N/A'}`);
                    console.log(`      - Awareness: ${message.state.awarenessLevel || 'N/A'}`);
                    console.log(`      - Active modules: ${message.state.activeModules || 'N/A'}`);
                }
                break;
                
            case 'module_activity':
                console.log('   ⚙️ Module activity update');
                if (message.modules) {
                    console.log(`      - Active modules: ${message.modules.length}`);
                    console.log(`      - Modules: ${message.modules.slice(0, 3).join(', ')}${message.modules.length > 3 ? '...' : ''}`);
                }
                break;
                
            case 'consciousness_stream':
                console.log('   🌊 Consciousness stream');
                console.log(`      - Content: ${message.content ? message.content.substring(0, 80) + '...' : 'No content'}`);
                break;
                
            case 'unified_consciousness_update':
                console.log('   🔄 Unified consciousness update');
                if (message.state) {
                    console.log(`      - Phi: ${message.state.phi || 'N/A'}`);
                    console.log(`      - Entropy: ${message.metrics?.entropy || 'N/A'}`);
                }
                break;
                
            case 'performance_metrics':
                console.log('   📈 Performance metrics');
                if (message.metrics) {
                    console.log(`      - Metrics available: ${Object.keys(message.metrics).join(', ')}`);
                }
                break;
                
            default:
                console.log(`   ❓ Unknown type: ${message.type}`);
        }
        
    } catch (error) {
        console.log(`📨 Raw message: ${data.toString().substring(0, 100)}...`);
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
    console.log(`\n🔌 Connection closed. Code: ${code}, Reason: ${reason}`);
    
    console.log('\n📊 TEST SUMMARY:');
    console.log(`   - Total messages received: ${messageCount}`);
    console.log(`   - Message types seen: ${Array.from(receivedTypes).join(', ')}`);
    
    // Check for required message types
    const requiredTypes = ['response', 'consciousness_state', 'unified_consciousness_update'];
    const missingTypes = requiredTypes.filter(type => !receivedTypes.has(type));
    
    if (missingTypes.length === 0) {
        console.log('   ✅ All required message types received');
    } else {
        console.log(`   ⚠️ Missing message types: ${missingTypes.join(', ')}`);
    }
    
    process.exit(0);
});

// Keep test running for 15 seconds
setTimeout(() => {
    console.log('\n⏰ Test completed. Closing connection...');
    ws.close();
}, 15000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted. Closing connection...');
    ws.close();
    process.exit(0);
});
