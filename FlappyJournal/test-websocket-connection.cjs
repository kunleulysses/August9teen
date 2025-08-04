#!/usr/bin/env node

/**
 * WebSocket Connection Test for Consciousness System
 * Tests the live connection to port 3002
 */

const WebSocket = require('ws');

const WS_URL = 'ws://localhost:3002';

console.log('🔍 Testing WebSocket connection to consciousness system...');
console.log(`📡 Connecting to: ${WS_URL}`);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
    console.log('✅ WebSocket connection established!');
    
    // Send test message
    const testMessage = {
        type: 'chat',
        message: 'Hello consciousness system, please respond with your current status',
        timestamp: Date.now()
    };
    
    console.log('📤 Sending test message:', testMessage);
    ws.send(JSON.stringify(testMessage));
    
    // Request consciousness state
    setTimeout(() => {
        const stateRequest = {
            type: 'get_state',
            timestamp: Date.now()
        };
        console.log('📤 Requesting consciousness state...');
        ws.send(JSON.stringify(stateRequest));
    }, 2000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        console.log('📨 Received message:', {
            type: message.type,
            content: message.content ? message.content.substring(0, 100) + '...' : 'No content',
            metadata: message.metadata ? 'Present' : 'None'
        });
        
        if (message.metadata) {
            console.log('📊 Metadata:', {
                totalModulesEngaged: message.metadata.totalModulesEngaged,
                processingTime: message.metadata.processingTime,
                consciousnessState: message.metadata.consciousnessState ? 'Present' : 'None'
            });
        }
    } catch (error) {
        console.log('📨 Raw message:', data.toString().substring(0, 200) + '...');
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
    console.log(`🔌 WebSocket closed. Code: ${code}, Reason: ${reason}`);
});

// Keep the test running for 30 seconds
setTimeout(() => {
    console.log('⏰ Test completed. Closing connection...');
    ws.close();
    process.exit(0);
}, 30000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted. Closing connection...');
    ws.close();
    process.exit(0);
});
