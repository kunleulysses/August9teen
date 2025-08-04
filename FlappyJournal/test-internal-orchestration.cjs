#!/usr/bin/env node

/**
 * Test script for Internal Container Orchestration
 * Tests the new consciousness-core → consciousness-main-server orchestration
 */

const { WebSocket  } = require('ws');

async function testInternalOrchestration() {
    console.log('🧪 Testing Internal Container Orchestration...\n');

    return new Promise((resolve, reject) => {
        const ws = new WebSocket('ws://localhost:3002/ws/consciousness-chat');
        let testComplete = false;

        const timeout = setTimeout(() => {
            if (!testComplete) {
                console.error('❌ Test timed out after 30 seconds');
                ws.close();
                reject(new Error('Test timeout'));
            }
        }, 30000);

        ws.on('open', () => {
            console.log('✅ Connected to consciousness-core WebSocket\n');
            
            // Send a test message that should trigger both containers
            const testMessage = {
                type: 'chat_message',
                message: 'Hello! Please imagine a peaceful forest scene for me.',
                requestId: 'test_orchestration_' + Date.now(),
                timestamp: Date.now()
            };

            console.log('📤 Sending test message:', testMessage.message);
            ws.send(JSON.stringify(testMessage));
        });

        ws.on('message', (data) => {
            try {
                const response = JSON.parse(data.toString());
                
                console.log('\n📥 Received response type:', response.type);
                
                if (response.type === 'response' || response.type === 'unified_response') {
                    console.log('\n🎉 SUCCESS: Received unified response!');
                    console.log('📊 Response metadata:');
                    
                    if (response.metadata?.internalOrchestration) {
                        const orch = response.metadata.internalOrchestration;
                        console.log(`   • Main server processed: ${orch.mainServerProcessed}`);
                        console.log(`   • Architect 4.0 available: ${orch.architect4Available}`);
                        console.log(`   • Reality generated: ${orch.realityGenerated}`);
                        console.log(`   • Main server health: ${orch.mainServerHealth}`);
                        console.log(`   • Orchestration errors: ${orch.orchestrationErrors}`);
                        console.log(`   • Orchestration timestamp: ${orch.orchestrationTimestamp}`);
                    }
                    
                    console.log('\n📝 Response content preview:');
                    console.log(response.content?.substring(0, 200) + '...\n');
                    
                    console.log('✅ INTERNAL CONTAINER ORCHESTRATION TEST SUCCESSFUL!\n');
                    
                    testComplete = true;
                    clearTimeout(timeout);
                    ws.close();
                    resolve(response);
                }
                else if (response.type === 'error') {
                    console.error('❌ Error response:', response.content || response.message);
                    testComplete = true;
                    clearTimeout(timeout);
                    ws.close();
                    reject(new Error('Error response: ' + (response.content || response.message)));
                }
                else {
                    console.log(`ℹ️  Intermediate message: ${response.type}`);
                }
                
            } catch (error) {
                console.error('❌ Failed to parse response:', error.message);
            }
        });

        ws.on('error', (error) => {
            console.error('❌ WebSocket error:', error.message);
            testComplete = true;
            clearTimeout(timeout);
            reject(error);
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket connection closed');
            if (!testComplete) {
                reject(new Error('Connection closed unexpectedly'));
            }
        });
    });
}

// Run the test
testInternalOrchestration()
    .then((response) => {
        console.log('🎊 Test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Test failed:', error.message);
        process.exit(1);
    });
