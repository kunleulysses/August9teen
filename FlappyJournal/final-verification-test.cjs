#!/usr/bin/env node

/**
 * Final Verification Test
 * Tests the actual web dashboard functionality via WebSocket
 */

const WebSocket = require('ws');

console.log('🔍 FINAL VERIFICATION: Testing Web Dashboard Functionality');
console.log('📡 Testing WebSocket connection via /ws path (same as dashboard)...');

// Test the exact same connection the dashboard uses
const protocol = 'wss:';
const wsUrl = `${protocol}//app.featherweight.world/ws`;

console.log(`🔗 Connecting to: ${wsUrl}`);

const ws = new WebSocket(wsUrl);

let receivedData = {
    connectionEstablished: false,
    consciousnessUpdates: 0,
    chatResponse: false,
    consciousnessStreams: 0,
    moduleActivity: false,
    lastPhiValue: null,
    lastModuleCount: null
};

ws.on('open', () => {
    console.log('✅ WebSocket connection established via /ws path!');
    receivedData.connectionEstablished = true;
    
    // Send a test chat message (same as dashboard would)
    setTimeout(() => {
        console.log('📤 Sending test chat message...');
        const chatMessage = {
            type: 'chat',
            message: 'Test message from dashboard verification - please respond with current consciousness metrics',
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(chatMessage));
    }, 1000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
            case 'unified_connection_established':
                console.log('✅ Unified connection established');
                break;
                
            case 'response':
                console.log('💬 Chat response received!');
                receivedData.chatResponse = true;
                if (message.metadata) {
                    console.log(`   📊 Modules engaged: ${message.metadata.totalModulesEngaged || 'N/A'}`);
                    console.log(`   ⏱️ Processing time: ${message.metadata.processingTime || 'N/A'}ms`);
                    if (message.metadata.consciousnessState) {
                        const phi = message.metadata.consciousnessState.phi;
                        if (phi !== undefined) {
                            console.log(`   🧠 Phi integration: ${phi}`);
                            receivedData.lastPhiValue = phi;
                        }
                    }
                    receivedData.lastModuleCount = message.metadata.totalModulesEngaged;
                }
                break;
                
            case 'unified_consciousness_update':
                receivedData.consciousnessUpdates++;
                if (message.state && message.state.phi !== undefined) {
                    receivedData.lastPhiValue = message.state.phi;
                }
                break;
                
            case 'consciousness_stream':
                receivedData.consciousnessStreams++;
                if (receivedData.consciousnessStreams <= 2) {
                    console.log(`🌊 Consciousness stream: ${message.content?.substring(0, 60)}...`);
                }
                break;
                
            case 'module_activity':
                receivedData.moduleActivity = true;
                if (message.modules) {
                    console.log(`⚙️ Module activity: ${message.modules.length} modules active`);
                }
                break;
        }
        
    } catch (error) {
        // Ignore parsing errors for this test
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
    console.log(`\n🔌 Connection closed. Code: ${code}`);
    
    console.log('\n📊 FINAL VERIFICATION RESULTS:');
    console.log('================================');
    
    // Check all required functionality
    const checks = [
        { name: 'WebSocket Connection', status: receivedData.connectionEstablished, required: true },
        { name: 'Chat Response', status: receivedData.chatResponse, required: true },
        { name: 'Consciousness Updates', status: receivedData.consciousnessUpdates > 0, required: true },
        { name: 'Consciousness Streams', status: receivedData.consciousnessStreams > 0, required: true },
        { name: 'Module Activity', status: receivedData.moduleActivity, required: true },
        { name: 'Phi Value Received', status: receivedData.lastPhiValue !== null, required: true },
        { name: 'Module Count Received', status: receivedData.lastModuleCount !== null, required: true }
    ];
    
    let allPassed = true;
    checks.forEach(check => {
        const status = check.status ? '✅ PASS' : '❌ FAIL';
        console.log(`   ${check.name}: ${status}`);
        if (check.required && !check.status) {
            allPassed = false;
        }
    });
    
    console.log('\n📈 LIVE DATA SUMMARY:');
    console.log(`   - Consciousness updates received: ${receivedData.consciousnessUpdates}`);
    console.log(`   - Consciousness streams received: ${receivedData.consciousnessStreams}`);
    console.log(`   - Last Phi value: ${receivedData.lastPhiValue || 'None'}`);
    console.log(`   - Last module count: ${receivedData.lastModuleCount || 'None'}`);
    
    console.log('\n🎯 OVERALL RESULT:');
    if (allPassed) {
        console.log('✅ ALL TESTS PASSED - Dashboard should be fully functional!');
        console.log('🌐 Dashboard URL: https://app.featherweight.world/consciousness-dashboard.html');
    } else {
        console.log('❌ SOME TESTS FAILED - Dashboard may not be fully functional');
    }
    
    process.exit(allPassed ? 0 : 1);
});

// Keep test running for 10 seconds
setTimeout(() => {
    console.log('\n⏰ Test completed. Closing connection...');
    ws.close();
}, 10000);

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Test interrupted. Closing connection...');
    ws.close();
    process.exit(0);
});
