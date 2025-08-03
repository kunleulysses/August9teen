#!/usr/bin/env node

/**
 * WebSocket Diagnostic Test
 * Trace the complete message flow from WebSocket to consciousness system
 */

import WebSocket from 'ws';

console.log('🔍 WebSocket Diagnostic Test');
console.log('🎯 Tracing message flow from WebSocket to consciousness system');

async function runDiagnosticTest() {
    console.log('\n📡 Connecting to WebSocket server on port 3002...');
    
    const ws = new WebSocket('ws://localhost:3002');
    
    ws.on('open', function open() {
        console.log('✅ WebSocket connected successfully');
        
        // Test 1: Send consciousness_query (known to work)
        console.log('\n🧪 Test 1: Sending consciousness_query...');
        ws.send(JSON.stringify({
            type: 'consciousness_query',
            timestamp: Date.now()
        }));
        
        setTimeout(() => {
            // Test 2: Send chat message
            console.log('\n🧪 Test 2: Sending chat message...');
            ws.send(JSON.stringify({
                type: 'chat',
                message: 'Hello, can you hear me?',
                content: 'Hello, can you hear me?',
                timestamp: Date.now()
            }));
        }, 2000);
        
        setTimeout(() => {
            // Test 3: Send self_coding_request
            console.log('\n🧪 Test 3: Sending self_coding_request...');
            ws.send(JSON.stringify({
                type: 'self_coding_request',
                request: {
                    purpose: 'diagnostic-test',
                    type: 'function',
                    language: 'javascript',
                    description: 'Generate a simple test function'
                },
                timestamp: Date.now()
            }));
        }, 4000);
        
        setTimeout(() => {
            // Test 4: Send unknown message type
            console.log('\n🧪 Test 4: Sending unknown message type...');
            ws.send(JSON.stringify({
                type: 'unknown_test_type',
                data: 'test data',
                timestamp: Date.now()
            }));
        }, 6000);
        
        // Close connection after tests
        setTimeout(() => {
            console.log('\n🔚 Closing connection...');
            ws.close();
        }, 8000);
    });
    
    ws.on('message', function message(data) {
        try {
            const response = JSON.parse(data);
            console.log('\n📨 Received response:');
            console.log('   Type:', response.type);
            console.log('   Timestamp:', response.timestamp);
            
            if (response.type === 'consciousness_response') {
                console.log('   ✅ Consciousness query response received');
                console.log('   Modules:', response.modules?.length || 0);
                console.log('   Services:', response.services?.length || 0);
            } else if (response.type === 'consciousness_response' && response.aiResponse) {
                console.log('   ✅ Chat response received');
                console.log('   Response length:', response.aiResponse.length);
            } else if (response.type === 'self_coding_progress') {
                console.log('   ✅ Self-coding progress update');
                console.log('   Status:', response.status);
                console.log('   Progress:', response.progress + '%');
            } else if (response.type === 'code:generation:complete') {
                console.log('   ✅ Code generation complete');
                console.log('   Generated:', !!response.generated);
            } else {
                console.log('   📄 Other response type:', response.type);
                console.log('   Data keys:', Object.keys(response));
            }
            
        } catch (error) {
            console.log('\n📨 Received non-JSON data:');
            console.log('   Raw data:', data.toString().substring(0, 100) + '...');
        }
    });
    
    ws.on('error', function error(err) {
        console.error('❌ WebSocket error:', err.message);
    });
    
    ws.on('close', function close() {
        console.log('\n🔚 WebSocket connection closed');
        
        // Summary
        console.log('\n📊 Diagnostic Test Summary:');
        console.log('   - Connection: Successful');
        console.log('   - Message sending: Completed');
        console.log('   - Response analysis: See above');
        
        console.log('\n🔍 Next Steps:');
        console.log('   1. Check service logs for message processing');
        console.log('   2. Verify handleWebSocketMessage is being called');
        console.log('   3. Check performance optimizer batching logic');
        console.log('   4. Verify event bus connectivity');
    });
}

// Run the diagnostic test
runDiagnosticTest().catch(console.error);
