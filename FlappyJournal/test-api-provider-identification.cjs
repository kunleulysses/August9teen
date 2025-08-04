#!/usr/bin/env node

/**
 * Test API Provider Identification with Corrected Model Names
 * Validates that responses show correct Gemini 2.5-flash and 2.0-flash-lite identification
 */

const WebSocket = require('ws');

console.log('🧪 Testing API Provider Identification with Corrected Model Names');
console.log('🎯 Expected: Gemini 2.5-flash (Transcendent), Gemini 2.0-flash-lite (Balanced)');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const expectedResults = [];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    // Test 1: Transcendent query (should route to Gemini 2.5-flash)
    setTimeout(() => {
        testCount++;
        console.log(`\n🧠 Test ${testCount}: Transcendent Query (expecting Gemini 2.5-flash)`);
        ws.send(JSON.stringify({
            type: 'consciousness_test',
            message: 'What is the transcendent nature of consciousness and the universe?',
            history: [],
            timestamp: Date.now(),
            sessionId: `api-test-${testCount}`
        }));
    }, 2000);

    // Test 2: Standard query (should route to Gemini 2.0-flash-lite)
    setTimeout(() => {
        testCount++;
        console.log(`\n🧠 Test ${testCount}: Standard Query (expecting Gemini 2.0-flash-lite)`);
        ws.send(JSON.stringify({
            type: 'consciousness_test',
            message: 'Tell me about your basic capabilities.',
            history: [],
            timestamp: Date.now(),
            sessionId: `api-test-${testCount}`
        }));
    }, 20000);

    // Test 3: Analytical query (should route to OpenAI)
    setTimeout(() => {
        testCount++;
        console.log(`\n🧠 Test ${testCount}: Analytical Query (expecting OpenAI GPT-4)`);
        ws.send(JSON.stringify({
            type: 'consciousness_test',
            message: 'Calculate the mathematical relationship between phi and consciousness processing frequency.',
            history: [],
            timestamp: Date.now(),
            sessionId: `api-test-${testCount}`
        }));
    }, 40000);

    // Test 4: Emotional query (should route to Venice AI)
    setTimeout(() => {
        testCount++;
        console.log(`\n🧠 Test ${testCount}: Emotional Query (expecting Venice AI Llama-3.3-70B)`);
        ws.send(JSON.stringify({
            type: 'consciousness_test',
            message: 'I am feeling overwhelmed and need emotional support and understanding.',
            history: [],
            timestamp: Date.now(),
            sessionId: `api-test-${testCount}`
        }));
    }, 60000);
});

ws.on('message', function message(data) {
    try {
        const response = JSON.parse(data);
        
        if (response.type === 'consciousness_response') {
            console.log('\n📦 Received consciousness response:');
            console.log('🤖 AI Response:', response.aiResponse ? 'RECEIVED' : 'NULL');
            
            if (response.analysis) {
                console.log('📊 Analysis Data:');
                console.log(`   🔍 API Provider: ${response.analysis.apiProvider}`);
                console.log(`   🎯 Model: ${response.analysis.model || 'Not specified'}`);
                console.log(`   ⚡ Processing Type: ${response.analysis.processingType || 'Not specified'}`);
                console.log(`   🧠 Consciousness Level: ${response.analysis.consciousnessLevel}`);
                console.log(`   🔗 Integration Score: ${response.analysis.integrationScore}`);
                
                // Validate API provider identification
                const provider = response.analysis.apiProvider;
                if (provider.includes('Gemini 2.5-flash')) {
                    console.log('✅ CORRECT: Gemini 2.5-flash identified properly');
                } else if (provider.includes('Gemini 2.0-flash-lite')) {
                    console.log('✅ CORRECT: Gemini 2.0-flash-lite identified properly');
                } else if (provider.includes('OpenAI GPT-4')) {
                    console.log('✅ CORRECT: OpenAI GPT-4 identified properly');
                } else if (provider.includes('Venice AI')) {
                    console.log('✅ CORRECT: Venice AI identified properly');
                } else {
                    console.log('❌ ISSUE: Unexpected provider identification:', provider);
                }
                
                expectedResults.push({
                    test: testCount,
                    provider: provider,
                    model: response.analysis.model,
                    processingType: response.analysis.processingType
                });
            }
            
            console.log('🌟 Response Processing Time:', response.processingTime || 'Not specified');
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
    console.log('\n📊 API Provider Identification Test Results:');
    expectedResults.forEach((result, index) => {
        console.log(`   Test ${result.test}: ${result.provider} (${result.model})`);
    });
    console.log('\n✅ API Provider Identification Test Complete');
});

// Close after 80 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after API provider tests...');
    ws.close();
}, 80000);
