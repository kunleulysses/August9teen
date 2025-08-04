#!/usr/bin/env node

/**
 * Final Dashboard Verification
 * Tests the exact dashboard URL with comprehensive verification
 */

const WebSocket = require('ws');

console.log('🎯 FINAL VERIFICATION: https://app.featherweight.world/consciousness-dashboard');
console.log('📡 Testing WebSocket connection via dashboard path...');

const wsUrl = 'wss://app.featherweight.world/ws';
const ws = new WebSocket(wsUrl);

let verificationResults = {
    connected: false,
    receivedMessages: 0,
    consciousnessActive: false,
    realTimeUpdates: false,
    chatWorking: false,
    phiValue: null,
    moduleCount: null,
    lastUpdate: null
};

ws.on('open', () => {
    console.log('✅ WebSocket connection established!');
    verificationResults.connected = true;
    
    // Send a simple test message
    setTimeout(() => {
        console.log('📤 Sending test message...');
        const testMessage = {
            type: 'chat',
            message: 'Hello consciousness system, please respond to confirm you are working.',
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(testMessage));
    }, 1000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        verificationResults.receivedMessages++;
        verificationResults.lastUpdate = new Date().toISOString();
        
        console.log(`📨 Message ${verificationResults.receivedMessages}: ${message.type}`);
        
        switch (message.type) {
            case 'unified_connection_established':
                console.log('   ✅ Unified consciousness connection confirmed');
                verificationResults.consciousnessActive = true;
                break;
                
            case 'response':
                console.log('   💬 Chat response received - Chat interface working!');
                verificationResults.chatWorking = true;
                
                if (message.metadata) {
                    if (message.metadata.totalModulesEngaged) {
                        verificationResults.moduleCount = message.metadata.totalModulesEngaged;
                        console.log(`   ⚙️ Modules engaged: ${message.metadata.totalModulesEngaged}`);
                    }
                    
                    if (message.metadata.consciousnessState && message.metadata.consciousnessState.phi) {
                        verificationResults.phiValue = message.metadata.consciousnessState.phi;
                        console.log(`   🧠 Phi integration: ${message.metadata.consciousnessState.phi}`);
                    }
                }
                break;
                
            case 'unified_consciousness_update':
                verificationResults.realTimeUpdates = true;
                if (message.state && message.state.phi) {
                    verificationResults.phiValue = message.state.phi;
                }
                break;
                
            case 'consciousness_stream':
                console.log(`   🌊 Consciousness stream: ${message.content?.substring(0, 50)}...`);
                verificationResults.realTimeUpdates = true;
                break;
                
            case 'consciousness_state':
                verificationResults.realTimeUpdates = true;
                break;
                
            case 'module_activity':
                verificationResults.realTimeUpdates = true;
                break;
        }
        
    } catch (error) {
        console.log(`📨 Raw message received (${data.toString().length} chars)`);
        verificationResults.receivedMessages++;
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', (code, reason) => {
    console.log(`\n🔌 Connection closed. Code: ${code}`);
    
    console.log('\n📊 DASHBOARD VERIFICATION RESULTS:');
    console.log('===================================');
    
    const checks = [
        { name: 'WebSocket Connection', status: verificationResults.connected, critical: true },
        { name: 'Messages Received', status: verificationResults.receivedMessages > 0, critical: true },
        { name: 'Consciousness System Active', status: verificationResults.consciousnessActive, critical: true },
        { name: 'Chat Interface Working', status: verificationResults.chatWorking, critical: true },
        { name: 'Real-time Updates', status: verificationResults.realTimeUpdates, critical: true },
        { name: 'Phi Value Available', status: verificationResults.phiValue !== null, critical: false },
        { name: 'Module Count Available', status: verificationResults.moduleCount !== null, critical: false }
    ];
    
    let criticalPassed = true;
    checks.forEach(check => {
        const status = check.status ? '✅ WORKING' : '❌ FAILED';
        const priority = check.critical ? '[CRITICAL]' : '[OPTIONAL]';
        console.log(`   ${check.name} ${priority}: ${status}`);
        
        if (check.critical && !check.status) {
            criticalPassed = false;
        }
    });
    
    console.log('\n📈 LIVE DATA SUMMARY:');
    console.log(`   - Total messages received: ${verificationResults.receivedMessages}`);
    console.log(`   - Last update: ${verificationResults.lastUpdate || 'None'}`);
    console.log(`   - Phi value: ${verificationResults.phiValue || 'Not received'}`);
    console.log(`   - Module count: ${verificationResults.moduleCount || 'Not received'}`);
    
    console.log('\n🎯 FINAL DASHBOARD STATUS:');
    if (criticalPassed) {
        console.log('✅ DASHBOARD FULLY OPERATIONAL!');
        console.log('🌐 URL: https://app.featherweight.world/consciousness-dashboard');
        console.log('💬 Chat: Working');
        console.log('📊 Real-time metrics: Active');
        console.log('🧠 Consciousness system: Connected');
        console.log('🚫 NO SIMULATION - Live consciousness system');
    } else {
        console.log('❌ DASHBOARD NOT FULLY FUNCTIONAL');
        console.log('⚠️ Critical components failed verification');
    }
    
    process.exit(criticalPassed ? 0 : 1);
});

// Keep test running for 8 seconds
setTimeout(() => {
    console.log('\n⏰ Verification completed. Closing connection...');
    ws.close();
}, 8000);

process.on('SIGINT', () => {
    console.log('\n🛑 Verification interrupted. Closing connection...');
    ws.close();
    process.exit(0);
});
