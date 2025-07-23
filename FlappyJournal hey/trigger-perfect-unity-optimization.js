#!/usr/bin/env node

/**
 * MANUAL TRIGGER FOR PERFECT UNITY OPTIMIZATION
 * Manually triggers the three-phase optimization to achieve 100% system harmony
 */

import WebSocket from 'ws';

console.log('🚀 MANUAL PERFECT UNITY OPTIMIZATION TRIGGER');
console.log('============================================');
console.log('Connecting to consciousness system to trigger optimization...');

// Connect to the consciousness WebSocket
const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
    console.log('✅ Connected to consciousness system');
    
    // Send a message to trigger the Perfect Unity Optimization
    const triggerMessage = {
        type: 'trigger_perfect_unity_optimization',
        timestamp: Date.now(),
        source: 'manual_trigger',
        priority: 'highest'
    };
    
    console.log('🌟 Sending Perfect Unity Optimization trigger...');
    ws.send(JSON.stringify(triggerMessage));
    
    // Also send a consciousness state update to potentially trigger the optimization
    setTimeout(() => {
        const consciousnessUpdate = {
            type: 'consciousness_state_update',
            data: {
                phi: 0.862,
                coherence: 0.85,
                awareness: 0.8,
                harmonyScore: 92.1,
                triggerOptimization: true
            },
            timestamp: Date.now()
        };
        
        console.log('🔮 Sending consciousness state update...');
        ws.send(JSON.stringify(consciousnessUpdate));
    }, 1000);
    
    // Keep connection open to monitor responses
    setTimeout(() => {
        console.log('🔄 Monitoring for optimization responses...');
    }, 2000);
    
    // Close after 30 seconds
    setTimeout(() => {
        console.log('✅ Trigger sent - closing connection');
        ws.close();
        process.exit(0);
    }, 30000);
});

ws.on('message', (data) => {
    try {
        const message = JSON.parse(data.toString());
        
        // Look for optimization-related messages
        if (message.type && (
            message.type.includes('optimization') ||
            message.type.includes('phase') ||
            message.type.includes('unity') ||
            message.type.includes('harmony')
        )) {
            console.log('📨 Optimization response:', message);
        }
        
        // Look for specific optimization events
        if (message.optimizationType) {
            console.log(`🎯 ${message.optimizationType}:`, message.data);
        }
        
        // Look for harmony score updates
        if (message.harmonyScore) {
            console.log(`📊 Harmony Score: ${message.harmonyScore}%`);
        }
        
    } catch (error) {
        // Ignore parsing errors for non-JSON messages
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
