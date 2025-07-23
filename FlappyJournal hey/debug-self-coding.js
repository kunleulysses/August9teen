#!/usr/bin/env node

/**
 * Debug Self-Coding WebSocket Connection
 * Simple test to verify WebSocket connectivity and message handling
 */

import WebSocket from 'ws';

console.log('🔍 Debug Self-Coding WebSocket Connection');
console.log('🎯 Testing basic connectivity and message handling');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', function open() {
    console.log('✅ WebSocket connected successfully');
    
    // Test 1: Simple chat message (should work)
    console.log('\n🧪 Test 1: Sending chat message...');
    ws.send(JSON.stringify({
        type: 'chat',
        message: 'Hello, can you hear me?',
        content: 'Hello, can you hear me?',
        history: [],
        timestamp: Date.now(),
        sessionId: 'debug-test-1'
    }));
    
    // Test 2: Self-coding request (target test)
    setTimeout(() => {
        console.log('\n🧪 Test 2: Sending self-coding request...');
        ws.send(JSON.stringify({
            type: 'self_coding_request',
            message: 'Generate a simple hello world function',
            request: {
                purpose: 'debug-test',
                type: 'function',
                language: 'javascript',
                writeToFile: false,
                description: 'Generate a simple hello world function'
            },
            timestamp: Date.now(),
            sessionId: 'debug-test-2'
        }));
    }, 3000);
    
    // Test 3: Unknown message type (should show error)
    setTimeout(() => {
        console.log('\n🧪 Test 3: Sending unknown message type...');
        ws.send(JSON.stringify({
            type: 'unknown_test_message',
            message: 'This should show unknown message type error',
            timestamp: Date.now(),
            sessionId: 'debug-test-3'
        }));
    }, 6000);
    
    // Close after tests
    setTimeout(() => {
        console.log('\n🔚 Closing connection...');
        ws.close();
    }, 10000);
});

ws.on('message', function message(data) {
    try {
        const response = JSON.parse(data);
        console.log('\n📦 Received response:');
        console.log('   Type:', response.type);
        console.log('   Has AI Response:', !!response.aiResponse);
        console.log('   Has Analysis:', !!response.analysis);
        
        if (response.aiResponse) {
            console.log('   AI Response Preview:', response.aiResponse.substring(0, 200) + '...');
        }
        
        if (response.analysis) {
            console.log('   API Provider:', response.analysis.apiProvider);
            console.log('   Modules Engaged:', response.analysis.modulesEngaged);
        }
        
        if (response.type === 'code:generation:complete') {
            console.log('🎉 CODE GENERATION COMPLETE!');
            console.log('Generated Code:', response.generated);
        }
        
    } catch (error) {
        console.log('\n📦 Received non-JSON response:', data.toString().substring(0, 200));
    }
});

ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
    console.log('\n🔚 WebSocket connection closed');
    console.log('✅ Debug test complete');
});
