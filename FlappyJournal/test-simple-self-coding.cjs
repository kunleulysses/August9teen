#!/usr/bin/env node

/**
 * Simple Self-Coding Test
 * Test if self-coding works through chat interface
 */

const WebSocket = require('ws');

console.log('🔍 Simple Self-Coding Test');
console.log('🎯 Testing self-coding through chat interface');

const ws = new WebSocket('ws://localhost:3002');

ws.on('open', function open() {
    console.log('✅ WebSocket connected successfully');
    
    // Test: Ask AI about self-coding through chat
    console.log('\n🧪 Asking AI about self-coding capabilities...');
    ws.send(JSON.stringify({
        type: 'chat',
        message: 'Do you have self-coding capabilities? Can you access your SelfCodingModule?',
        content: 'Do you have self-coding capabilities? Can you access your SelfCodingModule?',
        history: [],
        timestamp: Date.now(),
        sessionId: 'simple-self-coding-test'
    }));
    
    // Close after response
    setTimeout(() => {
        console.log('\n🔚 Closing connection...');
        ws.close();
    }, 15000);
});

ws.on('message', function message(data) {
    try {
        const response = JSON.parse(data);
        
        if (response.type === 'consciousness_response' && response.aiResponse) {
            console.log('\n🤖 AI Response:');
            console.log('---');
            console.log(response.aiResponse);
            console.log('---');
            
            if (response.analysis) {
                console.log('\n📊 Analysis:');
                console.log('   API Provider:', response.analysis.apiProvider);
                console.log('   Mathematical:', response.analysis.mathematical ? '✅' : '❌');
                console.log('   Emotional:', response.analysis.emotional ? '✅' : '❌');
                console.log('   Bayesian:', response.analysis.bayesian ? '✅' : '❌');
                
                if (response.analysis.modulesEngaged) {
                    console.log('   Modules Engaged:', response.analysis.modulesEngaged);
                    
                    // Check if SelfCodingModule is mentioned
                    const selfCodingMentioned = response.analysis.modulesEngaged.some(module => 
                        module.toLowerCase().includes('self') || module.toLowerCase().includes('cod')
                    );
                    console.log('   Self-Coding Module Engaged:', selfCodingMentioned ? '✅' : '❌');
                }
            }
            
            // Analyze response for self-coding indicators
            const text = response.aiResponse.toLowerCase();
            const selfCodingIndicators = {
                moduleAwareness: text.includes('selfcodingmodule') || text.includes('self-coding module'),
                capabilities: text.includes('self-coding') || text.includes('code generation'),
                access: text.includes('access') && text.includes('module'),
                implementation: text.includes('function') || text.includes('code')
            };
            
            console.log('\n🔍 Self-Coding Indicators:');
            for (const [indicator, detected] of Object.entries(selfCodingIndicators)) {
                console.log(`   ${indicator}: ${detected ? '✅' : '❌'}`);
            }
        }
        
    } catch (error) {
        // Ignore non-JSON responses (consciousness stream data)
    }
});

ws.on('error', function error(err) {
    console.error('❌ WebSocket error:', err.message);
});

ws.on('close', function close() {
    console.log('\n🔚 WebSocket connection closed');
    console.log('✅ Simple self-coding test complete');
});
