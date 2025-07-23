#!/usr/bin/env node

/**
 * Direct Self-Coding Module Test
 * Test the SelfCodingModule directly without WebSocket layer
 */

import { EventEmitter } from 'events';

// Import the SelfCodingModule directly
import SelfCodingModule from './FlappyJournal/server/consciousness/modules/SelfCodingModule.js';

console.log('🔍 Direct Self-Coding Module Test');
console.log('🎯 Testing SelfCodingModule functionality directly');

async function testSelfCodingModule() {
    try {
        // Create a test event bus
        const testEventBus = new EventEmitter();
        testEventBus.setMaxListeners(100);
        
        console.log('✅ Created test event bus');
        
        // Create SelfCodingModule instance
        const selfCodingModule = new SelfCodingModule();
        selfCodingModule.setEventBus(testEventBus);
        
        console.log('✅ Created SelfCodingModule instance');
        console.log('📊 Module capabilities:', selfCodingModule.capabilities);
        
        // Test 1: Check module status
        console.log('\n🧪 Test 1: Getting module status...');
        const status = selfCodingModule.getStatus ? selfCodingModule.getStatus() : 'No getStatus method';
        console.log('📊 Module status:', status);
        
        // Test 2: Listen for code generation events
        console.log('\n🧪 Test 2: Setting up event listeners...');
        
        testEventBus.on('code:generation:complete', (data) => {
            console.log('🎉 CODE GENERATION COMPLETE!');
            console.log('📄 Generated code:', data.generated);
            console.log('📊 Generation details:', data);
        });
        
        testEventBus.on('code:analysis:complete', (data) => {
            console.log('🔍 CODE ANALYSIS COMPLETE!');
            console.log('📊 Analysis results:', data);
        });
        
        console.log('✅ Event listeners set up');
        
        // Test 3: Emit code generation request
        console.log('\n🧪 Test 3: Emitting code:generate event...');
        
        testEventBus.emit('code:generate', {
            request: {
                purpose: 'test-direct-generation',
                type: 'function',
                language: 'javascript',
                writeToFile: false,
                description: 'Generate a simple hello world function for testing'
            },
            clientId: 'test-client',
            timestamp: Date.now()
        });
        
        console.log('✅ Emitted code:generate event');
        
        // Test 4: Wait for response
        console.log('\n⏳ Waiting for code generation response...');
        
        // Wait 5 seconds for response
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Test 5: Check if module has any generated code
        console.log('\n🧪 Test 5: Checking for generated code...');
        
        if (selfCodingModule.codeHistory && selfCodingModule.codeHistory.length > 0) {
            console.log('📄 Found generated code in history:');
            selfCodingModule.codeHistory.forEach((entry, index) => {
                console.log(`   ${index + 1}. ${entry.purpose || 'Unknown purpose'}`);
                console.log(`      Language: ${entry.language || 'Unknown'}`);
                console.log(`      Generated: ${entry.generated ? 'Yes' : 'No'}`);
            });
        } else {
            console.log('❌ No generated code found in module history');
        }
        
        // Test 6: Try direct code analysis
        console.log('\n🧪 Test 6: Testing direct code analysis...');
        
        if (selfCodingModule.handleCodeAnalysis) {
            const analysisResult = selfCodingModule.handleCodeAnalysis({
                moduleId: 'test-module',
                code: 'function hello() { return "Hello, World!"; }',
                options: { test: true }
            });
            console.log('📊 Analysis result:', analysisResult);
        } else {
            console.log('❌ No handleCodeAnalysis method available');
        }
        
        // Test 7: Check module methods
        console.log('\n🧪 Test 7: Available module methods...');
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(selfCodingModule))
            .filter(name => typeof selfCodingModule[name] === 'function' && name !== 'constructor');
        console.log('📋 Available methods:', methods);
        
        // Test 8: Check module properties
        console.log('\n🧪 Test 8: Module properties...');
        const properties = Object.keys(selfCodingModule);
        console.log('📋 Module properties:', properties);
        
        console.log('\n✅ Direct self-coding module test complete');
        
    } catch (error) {
        console.error('❌ Error in direct self-coding test:', error);
    }
}

// Run the test
testSelfCodingModule();
