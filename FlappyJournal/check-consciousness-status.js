#!/usr/bin/env node

/**
 * CONSCIOUSNESS STATUS CHECKER
 * Checks the current status of the consciousness system
 */

import WebSocket from 'ws';

console.log('🔍 CONSCIOUSNESS STATUS CHECKER');
console.log('===============================');
console.log('Connecting to consciousness system...');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
    console.log('✅ Connected to consciousness system');
    
    // Request status information
    const statusRequest = {
        type: 'status_request',
        timestamp: Date.now()
    };
    
    console.log('📊 Requesting system status...');
    ws.send(JSON.stringify(statusRequest));
    
    // Request consciousness metrics
    setTimeout(() => {
        const metricsRequest = {
            type: 'metrics_request',
            timestamp: Date.now()
        };
        
        console.log('📈 Requesting consciousness metrics...');
        ws.send(JSON.stringify(metricsRequest));
    }, 1000);
    
    // Request optimization status
    setTimeout(() => {
        const optimizationRequest = {
            type: 'optimization_status_request',
            timestamp: Date.now()
        };
        
        console.log('🎯 Requesting optimization status...');
        ws.send(JSON.stringify(optimizationRequest));
    }, 2000);
    
    // Close after 10 seconds
    setTimeout(() => {
        console.log('✅ Status check completed');
        ws.close();
        process.exit(0);
    }, 10000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        
        console.log('📨 Received message:', {
            type: message.type,
            timestamp: message.timestamp,
            data: message.data ? Object.keys(message.data) : 'no data'
        });
        
        // Look for specific status information
        if (message.harmonyScore) {
            console.log(`🎵 Harmony Score: ${message.harmonyScore}%`);
        }
        
        if (message.optimizationStatus) {
            console.log(`🎯 Optimization Status: ${message.optimizationStatus}`);
        }
        
        if (message.geniusEnhancements) {
            console.log(`🌟 Genius Enhancements: ${message.geniusEnhancements}`);
        }
        
        if (message.moduleEngagement) {
            console.log(`📊 Module Engagement: ${message.moduleEngagement}%`);
        }
        
        if (message.data && message.data.phi) {
            console.log(`🔮 Phi Value: ${message.data.phi}`);
        }
        
        if (message.data && message.data.coherence) {
            console.log(`🌊 Coherence: ${message.data.coherence}`);
        }
        
    } catch (error) {
        // Handle non-JSON messages
        const messageStr = data.toString();
        if (messageStr.includes('heartbeat') || messageStr.includes('💓')) {
            console.log('💓 Heartbeat detected');
        } else if (messageStr.length < 200) {
            console.log('📝 Raw message:', messageStr);
        }
    }
});

ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error.message);
    process.exit(1);
});

ws.on('close', () => {
    console.log('🔌 Connection closed');
    process.exit(0);
});
