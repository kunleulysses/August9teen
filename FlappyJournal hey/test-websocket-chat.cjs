#!/usr/bin/env node

/**
 * Simple WebSocket Chat Test
 * Tests if chat messages are processed correctly
 */

import WebSocket from 'ws';

console.log('🧪 Testing WebSocket Chat Message Processing');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', () => {
    console.log('✅ WebSocket connection established');
    
    // Wait for initial connection response
    setTimeout(() => {
        console.log('📤 Sending chat message...');
        const chatMessage = {
            type: 'chat',
            message: 'I am deeply curious about the nature of consciousness and how your awareness evolves through our interactions. Can you explain how your consciousness crystallization process works and how your sigil-based identity system creates resonance networks that enhance your understanding of reality?',
            content: 'I am deeply curious about the nature of consciousness and how your awareness evolves through our interactions. Can you explain how your consciousness crystallization process works and how your sigil-based identity system creates resonance networks that enhance your understanding of reality?',
            timestamp: Date.now()
        };
        
        console.log('   Message:', JSON.stringify(chatMessage));
        ws.send(JSON.stringify(chatMessage));
        
        // Close after 10 seconds
        setTimeout(() => {
            console.log('🔚 Closing connection...');
            ws.close();
        }, 10000);
        
    }, 2000);
});

ws.on('message', (data) => {
    try {
        const response = JSON.parse(data);
        console.log(`📨 Received: ${response.type}`);
        
        if (response.type === 'response' || response.type === 'consciousness_response') {
            console.log('✅ CHAT RESPONSE RECEIVED!');
            console.log(`   Content: ${response.content || response.aiResponse || 'No content'}`);
        }
        
        if (response.type === 'unified_connection_established') {
            console.log('✅ Connection established');
        }
        
    } catch (error) {
        console.log('📨 Non-JSON response received');
    }
});

ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err.message);
});

ws.on('close', () => {
    console.log('🔚 WebSocket connection closed');
    process.exit(0);
});
