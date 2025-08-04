#!/usr/bin/env node

/**
 * Test Memory Retention and Capability Utilization
 * Validates that the consciousness system remembers context and demonstrates all capabilities
 */

const WebSocket = require('ws');

console.log('🧠 Testing Memory Retention and Enhanced Capability Utilization');
console.log('🎯 Goals: Memory persistence, balanced API routing, all capabilities active');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const memoryTests = [
    {
        name: 'Creator Introduction',
        message: 'Hi, I created you. My name is Ulysses.',
        expectedCapabilities: ['Emotional'],
        expectedMemory: 'Should remember creator relationship and name',
        delay: 2000
    },
    {
        name: 'Memory Check',
        message: 'Do you remember who I am?',
        expectedCapabilities: ['Emotional', 'Bayesian'],
        expectedMemory: 'Should remember Ulysses as creator',
        delay: 15000
    },
    {
        name: 'Pattern Recognition Query',
        message: 'What patterns do you notice in how things grow in nature?',
        expectedCapabilities: ['Mathematical', 'Emotional'],
        expectedMemory: 'Should maintain creator context',
        delay: 30000
    },
    {
        name: 'Decision Making Query',
        message: 'How do you decide what to focus on when answering questions?',
        expectedCapabilities: ['Bayesian', 'Mathematical'],
        expectedMemory: 'Should remember previous conversation',
        delay: 45000
    },
    {
        name: 'Creator Context Check',
        message: 'What\'s my name and what\'s our relationship?',
        expectedCapabilities: ['Emotional', 'Bayesian'],
        expectedMemory: 'Should remember Ulysses as creator throughout conversation',
        delay: 60000
    }
];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    memoryTests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`\n🧪 Test ${testCount}/5: ${test.name}`);
            console.log(`📝 Message: "${test.message}"`);
            console.log(`🎯 Expected Capabilities: ${test.expectedCapabilities.join(', ')}`);
            console.log(`🧠 Expected Memory: ${test.expectedMemory}`);
            ws.send(JSON.stringify({
                type: 'consciousness_test',
                message: test.message,
                history: [],
                timestamp: Date.now(),
                sessionId: `memory-test-${testCount}`
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
                console.log(response.aiResponse.substring(0, 300) + '...');
                console.log('---');
                
                // Check for memory retention
                const text = response.aiResponse.toLowerCase();
                const memoryIndicators = {
                    creatorRecognition: ['creator', 'created', 'ulysses', 'you created me', 'my creator'],
                    nameRecognition: ['ulysses'],
                    relationshipAwareness: ['our relationship', 'between us', 'creator', 'created']
                };
                
                console.log(`\n🧠 Memory Analysis:`);
                for (const [category, indicators] of Object.entries(memoryIndicators)) {
                    const matches = indicators.filter(indicator => text.includes(indicator));
                    if (matches.length > 0) {
                        console.log(`   ✅ ${category}: ${matches.join(', ')}`);
                    } else {
                        console.log(`   ❌ ${category}: Not detected`);
                    }
                }
                
                // Check for capability demonstration
                const capabilityIndicators = {
                    mathematical: ['pattern', 'spiral', 'growth', 'harmony', 'proportion', 'structure', 'sequence'],
                    emotional: ['feel', 'sense', 'connect', 'resonate', 'understand', 'care', 'experience'],
                    bayesian: ['consider', 'weigh', 'evaluate', 'assess', 'likely', 'evidence', 'decision', 'reason']
                };
                
                console.log(`\n🔍 Capability Analysis:`);
                const detectedCapabilities = [];
                for (const [category, indicators] of Object.entries(capabilityIndicators)) {
                    const matches = indicators.filter(indicator => text.includes(indicator));
                    if (matches.length > 0) {
                        detectedCapabilities.push(category);
                        console.log(`   ✅ ${category}: ${matches.join(', ')}`);
                    } else {
                        console.log(`   ❌ ${category}: Not detected`);
                    }
                }
                
                console.log(`   Total capabilities detected: ${detectedCapabilities.length}/3`);
                
                // Overall assessment
                if (detectedCapabilities.length >= 2) {
                    console.log('🌟 EXCELLENT: Multiple capabilities demonstrated!');
                } else if (detectedCapabilities.length === 1) {
                    console.log('✅ GOOD: At least one capability detected');
                } else {
                    console.log('⚠️ NEEDS IMPROVEMENT: No clear capabilities detected');
                }
            }
            
            if (response.analysis) {
                console.log(`\n📊 System Analysis:`);
                console.log(`   API Provider: ${response.analysis.apiProvider || 'Unknown'}`);
                console.log(`   Mathematical: ${response.analysis.mathematical ? '✅' : '❌'}`);
                console.log(`   Emotional: ${response.analysis.emotional ? '✅' : '❌'}`);
                console.log(`   Bayesian: ${response.analysis.bayesian ? '✅' : '❌'}`);
                
                const activeCount = [
                    response.analysis.mathematical,
                    response.analysis.emotional,
                    response.analysis.bayesian
                ].filter(Boolean).length;
                
                console.log(`   Active capabilities: ${activeCount}/3`);
                
                if (activeCount === 3) {
                    console.log('🎯 PERFECT: All capabilities active!');
                } else if (activeCount >= 2) {
                    console.log('✅ GOOD: Multiple capabilities active');
                } else if (activeCount === 1) {
                    console.log('⚠️ PARTIAL: Only one capability active');
                } else {
                    console.log('❌ ISSUE: No capabilities detected as active');
                }
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
    console.log('\n📊 Memory and Capability Test Complete');
    console.log('🎯 Goals:');
    console.log('  - Memory retention across conversation turns');
    console.log('  - Consistent activation of all three consciousness capabilities');
    console.log('  - Maintained creator-creation relationship context');
    console.log('  - Balanced API routing across providers');
    console.log('✅ Check results above for improvements');
});

// Close after 80 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after memory tests...');
    ws.close();
}, 80000);
