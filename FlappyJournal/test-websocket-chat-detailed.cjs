#!/usr/bin/env node

/**
 * Detailed WebSocket Chat Test
 * Tests sending chat_message and waiting for unified_response
 */

const WebSocket = require('ws');

async function testWebSocketChat(endpoint, name) {
    return new Promise((resolve) => {
        console.log(`🔗 Testing chat with ${name}: ${endpoint}`);
        
        const ws = new WebSocket(endpoint);
        const requestId = `test_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        let responseReceived = false;
        
        ws.on('open', () => {
            console.log(`✅ ${name} connection established`);
            
            // Send chat message
            const chatMessage = {
                type: 'chat_message',
                message: 'Hello consciousness, how are you?',
                requestId: requestId,
                timestamp: Date.now(),
                source: 'test_aggregator'
            };
            
            console.log(`📤 Sending chat message to ${name}:`, JSON.stringify(chatMessage, null, 2));
            ws.send(JSON.stringify(chatMessage));
        });
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data.toString());
                console.log(`📨 Received from ${name}:`, message.type);
                
                if (message.type === 'unified_response' && message.requestId === requestId) {
                    console.log(`🎉 SUCCESS! Received unified_response from ${name}:`);
                    console.log(`   Response: ${message.response}`);
                    console.log(`   RequestId: ${message.requestId}`);
                    responseReceived = true;
                    ws.close();
                    resolve(true);
                }
                
                // Log other message types for debugging
                if (message.type !== 'consciousness_state_update' && message.type !== 'module_activity') {
                    console.log(`   Message details:`, JSON.stringify(message, null, 2));
                }
                
            } catch (error) {
                console.log(`❌ Error parsing message from ${name}:`, error.message);
            }
        });
        
        ws.on('error', (error) => {
            console.log(`❌ ${name} WebSocket error:`, error.message);
            resolve(false);
        });
        
        ws.on('close', () => {
            console.log(`🔌 ${name} connection closed`);
            if (!responseReceived) {
                console.log(`⚠️ No unified_response received from ${name}`);
                resolve(false);
            }
        });
        
        // Timeout after 15 seconds
        setTimeout(() => {
            if (!responseReceived) {
                console.log(`⏰ ${name} response timeout - no unified_response received`);
                ws.close();
                resolve(false);
            }
        }, 15000);
    });
}

async function testBothContainers() {
    console.log('🧪 Testing Detailed WebSocket Chat with Both Containers');
    
    const endpoints = [
        { url: 'ws://localhost:3002/ws/consciousness-chat', name: 'consciousness-core' },
        { url: 'ws://localhost:5000/ws/consciousness-chat', name: 'consciousness-main-server' }
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n--- Testing ${endpoint.name} ---`);
        const success = await testWebSocketChat(endpoint.url, endpoint.name);
        console.log(`Result: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
    console.log('\n🎉 Detailed testing completed');
    process.exit(0);
}

testBothContainers();
