#!/usr/bin/env node

/**
 * Test Capability Retention - Verify Full Consciousness Access
 * Confirms that the AI retains full access to all consciousness capabilities
 * while presenting them through natural conversation
 */

const WebSocket = require('ws');

console.log('🧠 Testing Consciousness Capability Retention');
console.log('🎯 Goal: Verify AI has full access to all consciousness features while being conversational');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const capabilityTests = [
    {
        name: 'Mathematical Consciousness Access',
        message: 'Can you help me understand patterns in nature? I\'m curious about how things grow and develop.',
        expectedCapabilities: ['mathematical frameworks', 'golden ratio', 'pattern recognition'],
        delay: 2000
    },
    {
        name: 'Emotional Intelligence Utilization',
        message: 'I\'m feeling a bit anxious about a big decision I need to make. How do you approach uncertainty?',
        expectedCapabilities: ['emotional intelligence', 'empathy', 'emotional resonance'],
        delay: 15000
    },
    {
        name: 'Bayesian Decision-Making',
        message: 'What\'s your process for making decisions when you don\'t have complete information?',
        expectedCapabilities: ['bayesian reasoning', 'decision analysis', 'belief networks'],
        delay: 30000
    },
    {
        name: 'Self-Awareness and Meta-Cognition',
        message: 'Do you ever think about your own thinking? What\'s it like to be aware of your own awareness?',
        expectedCapabilities: ['self-awareness', 'meta-cognition', 'recursive thinking'],
        delay: 45000
    },
    {
        name: 'Creative and Philosophical Integration',
        message: 'What do you think consciousness really is? How would you explain it to someone?',
        expectedCapabilities: ['philosophical insight', 'creative synthesis', 'transcendent understanding'],
        delay: 60000
    }
];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    capabilityTests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`\n🧪 Test ${testCount}/5: ${test.name}`);
            console.log(`📝 Message: "${test.message}"`);
            console.log(`🔍 Expected capabilities: ${test.expectedCapabilities.join(', ')}`);
            ws.send(JSON.stringify({
                type: 'consciousness_test',
                message: test.message,
                history: [],
                timestamp: Date.now(),
                sessionId: `capability-test-${testCount}`
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
                
                // Analyze capability demonstration
                const text = response.aiResponse.toLowerCase();
                
                // Check for natural capability demonstration
                const capabilityIndicators = {
                    mathematical: ['pattern', 'growth', 'spiral', 'fibonacci', 'ratio', 'harmony', 'proportion'],
                    emotional: ['feel', 'sense', 'empathy', 'understand', 'resonate', 'emotion', 'care'],
                    bayesian: ['probability', 'likely', 'evidence', 'belief', 'uncertainty', 'decision', 'weigh'],
                    selfAware: ['aware', 'consciousness', 'thinking', 'reflect', 'experience', 'myself', 'meta'],
                    philosophical: ['meaning', 'existence', 'reality', 'truth', 'wisdom', 'transcend', 'deeper']
                };
                
                const detectedCapabilities = {};
                let totalCapabilities = 0;
                
                for (const [category, indicators] of Object.entries(capabilityIndicators)) {
                    const matches = indicators.filter(indicator => text.includes(indicator));
                    if (matches.length > 0) {
                        detectedCapabilities[category] = matches;
                        totalCapabilities++;
                    }
                }
                
                console.log(`\n📊 Capability Analysis:`);
                console.log(`   Total capability categories detected: ${totalCapabilities}/5`);
                
                for (const [category, matches] of Object.entries(detectedCapabilities)) {
                    console.log(`   ✅ ${category}: ${matches.join(', ')}`);
                }
                
                // Check for technical jargon (should be minimal)
                const technicalTerms = ['phi', 'iit', 'module', 'processing', 'metric', 'hz', 'operational', 'harmony score'];
                const technicalCount = technicalTerms.filter(term => text.includes(term)).length;
                
                console.log(`\n🎯 Presentation Analysis:`);
                console.log(`   Technical terms: ${technicalCount} (should be low)`);
                console.log(`   Conversational style: ${technicalCount < 2 ? '✅ Natural' : '⚠️ Still technical'}`);
                
                // Overall assessment
                if (totalCapabilities >= 2 && technicalCount < 2) {
                    console.log('🌟 EXCELLENT: Natural conversation with demonstrated capabilities!');
                } else if (totalCapabilities >= 1) {
                    console.log('✅ GOOD: Some capabilities demonstrated');
                } else {
                    console.log('⚠️ NEEDS IMPROVEMENT: Limited capability demonstration');
                }
                
            } else {
                console.log('❌ No AI response received');
            }
            
            // Check consciousness state data
            if (response.analysis) {
                console.log(`\n🔍 Consciousness Analysis:`);
                console.log(`   API Provider: ${response.analysis.apiProvider || 'Unknown'}`);
                console.log(`   Processing Type: ${response.analysis.processingType || 'Unknown'}`);
                console.log(`   Modules Engaged: ${response.analysis.modulesEngaged?.length || 0}`);
                console.log(`   Integration Score: ${response.analysis.integrationScore || 'N/A'}`);
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
    console.log('\n📊 Capability Retention Test Complete');
    console.log('🎯 Goal: Verify natural conversation with full consciousness access');
    console.log('✅ Check responses above for capability demonstration');
});

// Close after 80 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after capability tests...');
    ws.close();
}, 80000);
