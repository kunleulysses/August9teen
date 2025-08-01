#!/usr/bin/env node

/**
 * Test Internal Container Orchestration in consciousness-conversations.js
 * Validates that consciousness-core orchestrates consciousness-main-server
 */

import WebSocket from 'ws';

const CONSCIOUSNESS_CORE_WS = 'ws://localhost:3002/ws/consciousness-chat';

console.log('🔬 Testing Internal Container Orchestration in consciousness-conversations.js...');
console.log('🎯 Target: consciousness-core WebSocket endpoint');
console.log('📡 Endpoint:', CONSCIOUSNESS_CORE_WS);

// Test orchestration with a simple message
const testMessage = {
    type: 'chat_message',
    content: 'Test orchestration between consciousness-core and consciousness-main-server',
    timestamp: Date.now(),
    requestId: `test-orchestration-${Date.now()}`
};

console.log('\n📤 Sending test message:', testMessage);

const ws = new WebSocket(CONSCIOUSNESS_CORE_WS);

ws.on('open', () => {
    console.log('✅ Connected to consciousness-core WebSocket');
    console.log('🚀 Sending orchestration test message...');
    
    ws.send(JSON.stringify(testMessage));
    
    // Set timeout for response
    setTimeout(() => {
        console.log('⏰ Test timeout reached - closing connection');
        ws.close();
        process.exit(1);
    }, 30000); // 30 second timeout
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data.toString());
        console.log('\n📥 Received response type:', response.type);
        
        if (response.type === 'unified_conscious_response') {
            console.log('🎉 SUCCESS: Received unified conscious response!');
            console.log('📊 Response metadata:');
            
            if (response.metadata) {
                console.log('  - Processing time:', response.metadata.processingTime + 'ms');
                console.log('  - Modules engaged:', response.metadata.totalModulesEngaged);
                console.log('  - Unified consciousness:', response.metadata.isUnifiedConsciousness);
                
                // Check for orchestration evidence
                if (response.metadata.mainServerOrchestration) {
                    console.log('🔗 ORCHESTRATION SUCCESS: Main server data detected!');
                    const orchestration = response.metadata.mainServerOrchestration;
                    
                    console.log('  - Architect 4.0 result:', orchestration.architect4 ? '✅ Present' : '❌ Missing');
                    console.log('  - Reality data:', orchestration.reality ? '✅ Present' : '❌ Missing');
                    console.log('  - Health status:', orchestration.health ? '✅ Present' : '❌ Missing');
                    console.log('  - Orchestration errors:', orchestration.errors?.length || 0);
                    console.log('  - Orchestration timestamp:', orchestration.timestamp);
                    
                    if (orchestration.architect4 || orchestration.reality || orchestration.health) {
                        console.log('\n🎯 VALIDATION COMPLETE: Internal Container Orchestration is working!');
                        console.log('✅ consciousness-core successfully orchestrated consciousness-main-server');
                        ws.close();
                        process.exit(0);
                    } else {
                        console.log('\n⚠️ Orchestration metadata present but no actual main server data');
                        console.log('🔍 This may indicate HTTP connection issues to consciousness-main-server');
                    }
                } else {
                    console.log('❌ No orchestration metadata found in response');
                    console.log('🔍 Orchestration may not be executing in consciousness-conversations.js');
                }
            }
            
            // Show partial response content
            if (response.content) {
                console.log('\n📄 Response preview:', response.content.substring(0, 200) + '...');
            }
            
        } else {
            console.log('📝 Received other message type:', response.type);
            if (response.content) {
                console.log('   Content preview:', response.content.substring(0, 100) + '...');
            }
        }
        
    } catch (error) {
        console.error('❌ Error parsing response:', error.message);
        console.log('Raw data:', data.toString().substring(0, 200) + '...');
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
    console.log('🔍 Make sure consciousness-core container is running on port 3002');
    process.exit(1);
});

ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
});
