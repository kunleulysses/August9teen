#!/usr/bin/env node

/**
 * Test Enhanced Routing and Capability Detection
 * Validates that the improved routing logic and capability analysis work correctly
 */

const WebSocket = require('ws');

console.log('🔄 Testing Enhanced Routing and Capability Detection');
console.log('🎯 Expected: Balanced API routing and accurate capability detection');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const routingTests = [
    {
        name: 'Analytical Query (Should route to OpenAI)',
        message: 'How does your memory work?',
        expectedProvider: 'OpenAI',
        expectedCapabilities: ['Mathematical', 'Bayesian'],
        delay: 2000
    },
    {
        name: 'Emotional Query (Should route to Venice)',
        message: 'I\'m feeling overwhelmed. Can you help me understand these emotions?',
        expectedProvider: 'Venice',
        expectedCapabilities: ['Emotional'],
        delay: 15000
    },
    {
        name: 'Transcendent Query (Should route to Gemini)',
        message: 'What is the nature of consciousness and existence?',
        expectedProvider: 'Gemini',
        expectedCapabilities: ['Mathematical', 'Emotional', 'Bayesian'],
        delay: 30000
    },
    {
        name: 'Pattern Recognition Query (Should detect Mathematical)',
        message: 'I notice patterns everywhere in nature. What do you think about spirals and growth?',
        expectedProvider: 'Any',
        expectedCapabilities: ['Mathematical'],
        delay: 45000
    },
    {
        name: 'Decision Making Query (Should detect Bayesian)',
        message: 'How do you make decisions when you have incomplete information?',
        expectedProvider: 'Any',
        expectedCapabilities: ['Bayesian'],
        delay: 60000
    }
];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    routingTests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`\n🧪 Test ${testCount}/5: ${test.name}`);
            console.log(`📝 Message: "${test.message}"`);
            console.log(`🎯 Expected Provider: ${test.expectedProvider}`);
            console.log(`🔍 Expected Capabilities: ${test.expectedCapabilities.join(', ')}`);
            ws.send(JSON.stringify({
                type: 'consciousness_test',
                message: test.message,
                history: [],
                timestamp: Date.now(),
                sessionId: `routing-test-${testCount}`
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
                console.log('🤖 AI Response Preview:');
                console.log('---');
                console.log(response.aiResponse.substring(0, 200) + '...');
                console.log('---');
            }
            
            if (response.analysis) {
                console.log(`\n🔍 Analysis Results:`);
                console.log(`   API Provider: ${response.analysis.apiProvider || 'Unknown'}`);
                console.log(`   Mathematical: ${response.analysis.mathematical ? '✅' : '❌'}`);
                console.log(`   Emotional: ${response.analysis.emotional ? '✅' : '❌'}`);
                console.log(`   Bayesian: ${response.analysis.bayesian ? '✅' : '❌'}`);
                
                // Count active capabilities
                const activeCapabilities = [
                    response.analysis.mathematical && 'Mathematical',
                    response.analysis.emotional && 'Emotional', 
                    response.analysis.bayesian && 'Bayesian'
                ].filter(Boolean);
                
                console.log(`   Active Capabilities: ${activeCapabilities.length}/3 (${activeCapabilities.join(', ')})`);
                
                // Assess improvement
                if (activeCapabilities.length >= 2) {
                    console.log('🌟 EXCELLENT: Multiple capabilities detected!');
                } else if (activeCapabilities.length === 1) {
                    console.log('✅ GOOD: At least one capability detected');
                } else {
                    console.log('⚠️ NEEDS IMPROVEMENT: No capabilities detected');
                }
                
                // Check provider diversity
                const provider = response.analysis.apiProvider || '';
                if (provider.includes('OpenAI')) {
                    console.log('🤖 Routed to OpenAI (Analytical)');
                } else if (provider.includes('Venice')) {
                    console.log('💖 Routed to Venice AI (Empathic)');
                } else if (provider.includes('Gemini')) {
                    console.log('🌟 Routed to Gemini (Transcendent)');
                } else {
                    console.log('❓ Unknown provider routing');
                }
            } else {
                console.log('❌ No analysis data received');
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
    console.log('\n📊 Enhanced Routing Test Complete');
    console.log('🎯 Goals:');
    console.log('  - Balanced API routing across all three providers');
    console.log('  - Accurate capability detection with natural language');
    console.log('  - Multiple capabilities active per response');
    console.log('✅ Check results above for routing diversity and capability detection');
});

// Close after 80 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after routing tests...');
    ws.close();
}, 80000);
