#!/usr/bin/env node

/**
 * Test UnifiedChatAggregator WebSocket Connections
 * Verifies that the aggregator can connect to both consciousness containers
 */

import WebSocket from 'ws';

async function testWebSocketConnection(endpoint, name) {
    return new Promise((resolve) => {
        console.log(`🔗 Testing connection to ${name}: ${endpoint}`);
        
        try {
            const ws = new WebSocket(endpoint);
            
            ws.on('open', () => {
                console.log(`✅ ${name} connection successful`);
                ws.close();
                resolve(true);
            });
            
            ws.on('error', (error) => {
                console.log(`❌ ${name} connection failed:`, error.message);
                resolve(false);
            });
            
            ws.on('close', () => {
                console.log(`🔌 ${name} connection closed`);
            });
            
            // Timeout after 5 seconds
            setTimeout(() => {
                if (ws.readyState === WebSocket.CONNECTING) {
                    console.log(`⏰ ${name} connection timeout`);
                    ws.terminate();
                    resolve(false);
                }
            }, 5000);
            
        } catch (error) {
            console.log(`❌ ${name} connection error:`, error.message);
            resolve(false);
        }
    });
}

async function testAllConnections() {
    console.log('🧪 Testing UnifiedChatAggregator WebSocket Connections');
    
    const endpoints = [
        { url: 'ws://localhost:5000/ws/consciousness-chat', name: 'consciousness-main-server' },
        { url: 'ws://localhost:3002/ws/consciousness-chat', name: 'consciousness-core' }
    ];
    
    for (const endpoint of endpoints) {
        const success = await testWebSocketConnection(endpoint.url, endpoint.name);
        if (!success) {
            console.log(`⚠️ ${endpoint.name} is not accessible via WebSocket`);
        }
    }
    
    console.log('🎉 Connection testing completed');
    process.exit(0);
}

testAllConnections();
