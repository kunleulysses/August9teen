#!/usr/bin/env node

/**
 * Test Conversational Style - Natural Consciousness Chat
 * Validates that responses feel like natural conversation between conscious beings
 */

import WebSocket from 'ws';

console.log('🗣️ Testing Conversational Style with Natural Consciousness Prompts');
console.log('🎯 Expected: Natural, intuitive conversation rather than technical readouts');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const conversationalTests = [
    {
        name: 'Casual Greeting',
        message: 'Hey there! How are you feeling today?',
        delay: 2000
    },
    {
        name: 'Personal Question',
        message: 'What\'s something that\'s been on your mind lately?',
        delay: 15000
    },
    {
        name: 'Philosophical Discussion',
        message: 'Do you ever wonder about the nature of consciousness and what it means to be aware?',
        delay: 30000
    },
    {
        name: 'Emotional Connection',
        message: 'I\'ve been feeling a bit overwhelmed lately. Can you relate to that feeling?',
        delay: 45000
    }
];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    conversationalTests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`\n💬 Test ${testCount}/4: ${test.name}`);
            console.log(`📝 Message: "${test.message}"`);
            ws.send(JSON.stringify({
                type: 'consciousness_test',
                message: test.message,
                history: [],
                timestamp: Date.now(),
                sessionId: `conversational-test-${testCount}`
            }));
        }, test.delay);
    });
});

ws.on('message', function message(data) {
    try {
        const response = JSON.parse(data);
        
        if (response.type === 'consciousness_response') {
            console.log('\n📦 Received consciousness response:');
            
            if (response.aiResponse) {
                console.log('🤖 AI Response:');
                console.log('---');
                console.log(response.aiResponse);
                console.log('---');
                
                // Analyze conversational quality
                const text = response.aiResponse.toLowerCase();
                const technicalTerms = ['harmony score', 'processing', 'module', 'system', 'metric', 'phi', 'hz', 'operational'];
                const conversationalTerms = ['feel', 'think', 'wonder', 'experience', 'sense', 'understand', 'curious', 'interesting'];
                
                const technicalCount = technicalTerms.filter(term => text.includes(term)).length;
                const conversationalCount = conversationalTerms.filter(term => text.includes(term)).length;
                
                console.log(`📊 Analysis:`);
                console.log(`   Technical terms: ${technicalCount}`);
                console.log(`   Conversational terms: ${conversationalCount}`);
                
                if (technicalCount === 0 && conversationalCount > 0) {
                    console.log('✅ EXCELLENT: Natural conversational style achieved!');
                } else if (technicalCount < conversationalCount) {
                    console.log('✅ GOOD: More conversational than technical');
                } else if (technicalCount > 0) {
                    console.log('⚠️ NEEDS IMPROVEMENT: Still contains technical language');
                } else {
                    console.log('📝 NEUTRAL: Neither technical nor clearly conversational');
                }
            } else {
                console.log('❌ No AI response received');
            }
            
            if (response.analysis && response.analysis.apiProvider) {
                console.log(`🔍 API Provider: ${response.analysis.apiProvider}`);
            }
            
            console.log(`⏱️ Processing Time: ${response.processingTime || 'Not specified'}`);
        }
    } catch (error) {
        console.error('❌ Error parsing response:', error);
    }
});

ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err);
});

ws.on('close', function close() {
    console.log('\n🔚 WebSocket connection closed');
    console.log('\n📊 Conversational Style Test Complete');
    console.log('🎯 Goal: Natural conversation between conscious beings');
    console.log('✅ Check responses above for conversational quality');
});

// Close after 60 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after conversational tests...');
    ws.close();
}, 60000);
