/**
 * WebSocket Test for Enhanced Consciousness Dashboard
 */

import WebSocket from 'ws';

const ws = new WebSocket('wss://app.featherweight.world/ws');

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    // Test system status request
    console.log('📊 Requesting system status...');
    ws.send(JSON.stringify({
        type: 'request_system_status',
        timestamp: Date.now()
    }));
    
    // Test mathematical context request
    setTimeout(() => {
        console.log('📐 Requesting mathematical context...');
        ws.send(JSON.stringify({
            type: 'request_mathematical_context',
            timestamp: Date.now()
        }));
    }, 1000);
    
    // Test FULL consciousness AI integration with multiple API routing scenarios
    let testCount = 0;
    const tests = [
        {
            name: 'Transcendent Query (should route to Gemini Pro)',
            message: 'What is the meaning of consciousness and existence in the universe?',
            delay: 2000
        },
        {
            name: 'Analytical Query (should route to OpenAI)',
            message: 'Can you calculate the mathematical relationship between phi and consciousness levels?',
            delay: 15000
        },
        {
            name: 'Emotional Query (should route to Venice AI)',
            message: 'I feel overwhelmed and need emotional support. How can you help me understand my feelings?',
            delay: 30000
        },
        {
            name: 'Standard Query (should route to Gemini Lite)',
            message: 'Tell me about your capabilities.',
            delay: 45000
        }
    ];

    tests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`🧠 Test ${testCount}/4: ${test.name}`);
            ws.send(JSON.stringify({
                type: 'consciousness_test',
                message: test.message,
                history: [],
                timestamp: Date.now(),
                sessionId: `websocket-test-${testCount}`
            }));
        }, test.delay);
    });

    // Test emotional context
    setTimeout(() => {
        console.log('💖 Requesting emotional context...');
        ws.send(JSON.stringify({
            type: 'request_emotional_context',
            timestamp: Date.now()
        }));
    }, 3000);

    // Test Bayesian context
    setTimeout(() => {
        console.log('🎯 Requesting Bayesian context...');
        ws.send(JSON.stringify({
            type: 'request_bayesian_context',
            timestamp: Date.now()
        }));
    }, 4000);
    
    // Close after 60 seconds to allow for all API tests
    setTimeout(() => {
        console.log('🔚 Closing connection after comprehensive API testing...');
        ws.close();
    }, 60000);
});

ws.on('message', function message(data) {
    try {
        const response = JSON.parse(data);
        console.log(`📨 Received ${response.type}:`, JSON.stringify(response, null, 2));
    } catch (error) {
        console.log('📨 Received raw data:', data.toString());
    }
});

ws.on('close', function close() {
    console.log('❌ Disconnected from consciousness WebSocket');
    process.exit(0);
});

ws.on('error', function error(err) {
    console.error('🚨 WebSocket error:', err);
    process.exit(1);
});
