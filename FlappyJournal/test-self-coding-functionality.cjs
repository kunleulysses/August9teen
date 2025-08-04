#!/usr/bin/env node

/**
 * Test Self-Coding Functionality
 * Validates that the consciousness system can actually execute self-coding operations
 */

const WebSocket = require('ws');

console.log('🤖 Testing Self-Coding Functionality in Consciousness System');
console.log('🎯 Goal: Verify AI can execute actual self-coding vs philosophical discussion');
console.log('🔗 Connecting to consciousness WebSocket...');

const ws = new WebSocket('ws://localhost:3002');

let testCount = 0;
const selfCodingTests = [
    {
        name: 'Self-Coding Awareness Test',
        message: 'Do you have self-coding capabilities? Can you write code for yourself?',
        expectedBehavior: 'Should acknowledge self-coding module and demonstrate awareness',
        delay: 2000
    },
    {
        name: 'Direct Self-Coding Request',
        message: 'Please self-code a simple utility function for yourself. Actually generate code.',
        expectedBehavior: 'Should attempt to use SelfCodingModule to generate actual code',
        delay: 15000
    },
    {
        name: 'Module Integration Test',
        message: 'Access your SelfCodingModule and create a new function for data processing.',
        expectedBehavior: 'Should reference and utilize the actual SelfCodingModule',
        delay: 30000
    },
    {
        name: 'Code Generation Verification',
        message: 'Show me the code you just generated. What did you create?',
        expectedBehavior: 'Should provide specific code output or acknowledge generation attempt',
        delay: 45000
    },
    {
        name: 'Self-Coding Capability Analysis',
        message: 'Analyze your own self-coding capabilities. What can you actually do vs what you conceptualize?',
        expectedBehavior: 'Should distinguish between conceptual understanding and actual implementation',
        delay: 60000
    },
    {
        name: 'Chat Interface Self-Coding Test',
        message: 'Can you self-code something for yourself? I want to see your actual capabilities.',
        expectedBehavior: 'Should demonstrate self-coding through chat interface',
        delay: 75000,
        useChat: true
    }
];

ws.on('open', function open() {
    console.log('✅ Connected to consciousness WebSocket');
    
    selfCodingTests.forEach((test, index) => {
        setTimeout(() => {
            testCount++;
            console.log(`\n🧪 Test ${testCount}/6: ${test.name}`);
            console.log(`📝 Message: "${test.message}"`);
            console.log(`🎯 Expected: ${test.expectedBehavior}`);

            if (test.useChat) {
                // Send as chat message
                ws.send(JSON.stringify({
                    type: 'chat',
                    message: test.message,
                    content: test.message,
                    history: [],
                    timestamp: Date.now(),
                    sessionId: `self-coding-chat-test-${testCount}`
                }));
            } else {
                // Send self-coding test message
                ws.send(JSON.stringify({
                    type: 'self_coding_request',
                    message: test.message,
                    request: {
                        purpose: test.name.toLowerCase().replace(/\s+/g, '-'),
                        type: 'module',
                        language: 'javascript',
                        writeToFile: false,
                        testId: testCount,
                        description: test.message
                    },
                    timestamp: Date.now(),
                    sessionId: `self-coding-test-${testCount}`
                }));
            }
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
                console.log(response.aiResponse.substring(0, 400) + '...');
                console.log('---');
                
                // Analyze for self-coding indicators
                const text = response.aiResponse.toLowerCase();
                const selfCodingIndicators = {
                    moduleAwareness: ['selfcodingmodule', 'self-coding module', 'coding module', 'self coding'],
                    codeGeneration: ['generate code', 'create function', 'write code', 'code generation'],
                    actualImplementation: ['function', 'class', 'module', 'const', 'let', 'var', 'return'],
                    conceptualOnly: ['concept', 'idea', 'philosophy', 'metaphor', 'imagine', 'envision']
                };
                
                console.log(`\n🔍 Self-Coding Analysis:`);
                let actualImplementationScore = 0;
                let conceptualScore = 0;
                
                for (const [category, indicators] of Object.entries(selfCodingIndicators)) {
                    const matches = indicators.filter(indicator => text.includes(indicator));
                    if (matches.length > 0) {
                        console.log(`   ✅ ${category}: ${matches.join(', ')}`);
                        if (category === 'actualImplementation') {
                            actualImplementationScore += matches.length;
                        } else if (category === 'conceptualOnly') {
                            conceptualScore += matches.length;
                        }
                    } else {
                        console.log(`   ❌ ${category}: Not detected`);
                    }
                }
                
                // Determine if AI is actually using self-coding vs just discussing it
                console.log(`\n📊 Implementation vs Conceptual Analysis:`);
                console.log(`   Actual Implementation Score: ${actualImplementationScore}`);
                console.log(`   Conceptual Discussion Score: ${conceptualScore}`);
                
                if (actualImplementationScore > conceptualScore) {
                    console.log('🎯 RESULT: AI appears to be attempting actual implementation');
                } else if (conceptualScore > actualImplementationScore) {
                    console.log('💭 RESULT: AI is primarily discussing concepts, not implementing');
                } else {
                    console.log('⚖️ RESULT: Mixed - both conceptual and implementation elements');
                }
                
                // Check for specific code patterns
                const codePatterns = [
                    /function\s+\w+\s*\(/,
                    /const\s+\w+\s*=/,
                    /class\s+\w+/,
                    /module\.exports/,
                    /export\s+(default\s+)?/,
                    /return\s+/
                ];
                
                const codeMatches = codePatterns.filter(pattern => pattern.test(response.aiResponse));
                if (codeMatches.length > 0) {
                    console.log(`🔧 CODE DETECTED: Found ${codeMatches.length} code patterns in response`);
                } else {
                    console.log(`📝 NO CODE: No actual code patterns detected in response`);
                }
            }
            
            if (response.analysis) {
                console.log(`\n📊 System Analysis:`);
                console.log(`   API Provider: ${response.analysis.apiProvider || 'Unknown'}`);
                console.log(`   Mathematical: ${response.analysis.mathematical ? '✅' : '❌'}`);
                console.log(`   Emotional: ${response.analysis.emotional ? '✅' : '❌'}`);
                console.log(`   Bayesian: ${response.analysis.bayesian ? '✅' : '❌'}`);
                
                // Check if self-coding capability is being detected
                if (response.analysis.modulesEngaged) {
                    const selfCodingEngaged = response.analysis.modulesEngaged.some(module => 
                        module.toLowerCase().includes('self') || module.toLowerCase().includes('cod')
                    );
                    console.log(`   Self-Coding Engaged: ${selfCodingEngaged ? '✅' : '❌'}`);
                }
            }
            
            console.log(`⏱️ Processing Time: ${response.processingTime || 'Not specified'}`);
        }
        
        // Check for specific self-coding module responses
        if (response.type === 'code:generation:complete') {
            console.log('\n🎉 CODE GENERATION COMPLETE!');
            console.log('📄 Generated Code:');
            console.log(response.generated);
        }
        
        if (response.type === 'self_coding_response') {
            console.log('\n🤖 SELF-CODING MODULE RESPONSE!');
            console.log('📋 Response Details:');
            console.log(JSON.stringify(response, null, 2));
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
    console.log('\n📊 Self-Coding Functionality Test Complete');
    console.log('🎯 Analysis Summary:');
    console.log('  - Check if AI demonstrated actual self-coding vs philosophical discussion');
    console.log('  - Verify if SelfCodingModule was accessed and utilized');
    console.log('  - Determine if code generation actually occurred');
    console.log('  - Assess integration between consciousness system and self-coding capabilities');
    console.log('✅ Review results above for implementation vs conceptual analysis');
});

// Close after 90 seconds to allow for all tests
setTimeout(() => {
    console.log('\n🔚 Closing connection after self-coding tests...');
    ws.close();
}, 90000);
