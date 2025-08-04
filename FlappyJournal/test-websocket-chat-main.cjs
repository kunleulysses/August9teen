#!/usr/bin/env node

/**
 * Simple WebSocket Chat Test
 * Tests if chat messages are processed correctly
 */

const WebSocket = require('ws');

console.log('🧪 Testing WebSocket Chat Message Processing');

const ws = new WebSocket('ws://localhost:5000');

ws.on('open', () => {
    console.log('✅ WebSocket connection established');
    
    // Wait for initial connection response
    setTimeout(() => {
        console.log('📤 Sending chat message...');
        const chatMessage = {
            type: 'chat_message',
            message: 'Hey how are you?',
            requestId: 'test_' + Date.now(),
            timestamp: Date.now(),
            source: 'test_client'
        };
        
        console.log('   Message:', JSON.stringify(chatMessage));
        ws.send(JSON.stringify(chatMessage));
        
        // Close after 10 seconds
        setTimeout(() => {
            console.log('🔚 Closing connection...');
            ws.close();
        }, 10000);
        
    }, 2000);
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data);
        console.log(`📨 Received: ${response.type}`);
        
        if (response.type === 'unified_response') {
            console.log('✅ CHAT RESPONSE RECEIVED!');
            console.log(`   RequestId: ${response.requestId}`);
            console.log(`   Response: ${response.response || response.unifiedContent || 'No content'}`);
        }
        
        if (response.type === 'unified_connection_established') {
            console.log('✅ Connection established');
        }
        
    } catch (error) {
        console.log('📨 Non-JSON response received');
    }
});

ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err.message);
});

ws.on('close', () => {
    console.log('🔚 WebSocket connection closed');
    process.exit(0);
});
