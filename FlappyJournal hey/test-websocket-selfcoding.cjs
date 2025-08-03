#!/usr/bin/env node

/**
 * Simple WebSocket Self-Coding Test
 * Tests if self-coding requests are processed correctly
 */

import WebSocket from 'ws';

console.log('🧪 Testing WebSocket Self-Coding Request Processing');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
    console.log('✅ WebSocket connection established');
    
    // Wait for initial connection response
    setTimeout(() => {
        console.log('📤 Sending self-coding request...');
        const selfCodingMessage = {
            type: 'self_coding_request',
            request: {
                purpose: 'test-function',
                type: 'function',
                language: 'javascript',
                description: 'Create a simple test function that returns "Hello World"'
            },
            timestamp: Date.now()
        };
        
        console.log('   Message:', JSON.stringify(selfCodingMessage));
        ws.send(JSON.stringify(selfCodingMessage));
        
        // Close after 15 seconds
        setTimeout(() => {
            console.log('🔚 Closing connection...');
            ws.close();
        }, 15000);
        
    }, 2000);
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data);
        console.log(`📨 Received: ${response.type}`);
        
        if (response.type === 'self_coding_progress') {
            console.log('✅ SELF-CODING PROGRESS RECEIVED!');
            console.log(`   Status: ${response.status}`);
            console.log(`   Progress: ${response.progress}%`);
            if (response.code) {
                console.log(`   Generated Code: ${response.code.substring(0, 100)}...`);
            }
        }
        
        if (response.type === 'self_coding_complete') {
            console.log('✅ SELF-CODING COMPLETE!');
            console.log(`   Generated Code: ${response.code}`);
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
