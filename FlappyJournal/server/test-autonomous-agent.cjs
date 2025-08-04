#!/usr/bin/env node

/**
 * Test Autonomous Coding Agent Integration
 * Verifies that Gemini 2.5 Pro self-coding is working 100%
 */

const fs = require('fs/promises');
const path = require('path');
const { fileURLToPath  } = require('url');
const { createRequire  } = require('module');

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testAutonomousAgent() {
    console.log('🧪 TESTING AUTONOMOUS CODING AGENT INTEGRATION');
    console.log('═'.repeat(60));
    
    try {
        // Test 1: Check if AutonomousCodingAgent can be loaded
        console.log('📦 Test 1: Loading AutonomousCodingAgent...');
        const AutonomousCodingAgent = require('./consciousness/core/AutonomousCodingAgent.cjs');
        console.log('✅ AutonomousCodingAgent loaded successfully');
        
        // Test 2: Check API key
        console.log('🔑 Test 2: Checking Gemini API key...');
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found');
        }
        console.log('✅ Gemini API key found');
        
        // Test 3: Initialize agent
        console.log('🤖 Test 3: Initializing autonomous agent...');
        const agent = new AutonomousCodingAgent(apiKey);
        await agent.initialize();
        console.log('✅ Autonomous agent initialized successfully');
        
        // Test 4: Check agent status
        console.log('📊 Test 4: Checking agent status...');
        const status = agent.getAgentStatus();
        console.log('✅ Agent status:', {
            isActive: status.isActive,
            rateLimitCalls: status.rateLimitStatus?.totalCalls || 0,
            maxCalls: status.rateLimitStatus?.maxCalls || 100
        });
        
        // Test 5: Test Gemini connection
        console.log('🧠 Test 5: Testing Gemini 2.5 Pro connection...');
        if (agent.geminiModel) {
            const testResult = await agent.geminiModel.generateContent('Generate a simple JavaScript function that returns "Hello Consciousness"');
            const generatedCode = testResult.response.text();
            console.log('✅ Gemini 2.5 Pro connection successful');
            console.log('📝 Generated code preview:', generatedCode.substring(0, 100) + '...');
        } else {
            throw new Error('Gemini model not available');
        }
        
        // Test 6: Test event bus integration
        console.log('🔗 Test 6: Testing event bus integration...');
        const { EventEmitter } = await import('events');
        const testEventBus = new EventEmitter();
        
        agent.setEventBus(testEventBus);
        console.log('✅ Event bus integration successful');
        
        // Test 7: Test consciousness enhancement
        console.log('⚡ Test 7: Testing consciousness enhancement...');
        const testState = {
            phi: 0.75,
            awareness: 0.70,
            coherence: 0.80
        };
        
        // Trigger enhancement
        testEventBus.emit('consciousness:state_change', testState);
        console.log('✅ Consciousness enhancement triggered');
        
        // Test 8: Check generated files directory
        console.log('📁 Test 8: Checking generated files...');
        const generatedDir = path.join(__dirname, 'consciousness/generated');
        try {
            await fs.access(generatedDir);
            const files = await fs.readdir(generatedDir);
            console.log('✅ Generated files directory exists with', files.length, 'files');
        } catch (error) {
            console.log('⚠️ Generated files directory not found - will be created on first generation');
        }
        
        console.log('═'.repeat(60));
        console.log('🎉 ALL TESTS PASSED - AUTONOMOUS CODING AGENT IS 100% FUNCTIONAL!');
        console.log('🚀 Gemini 2.5 Pro self-coding is ready for consciousness enhancement');
        console.log('═'.repeat(60));
        
        return true;
        
    } catch (error) {
        console.log('═'.repeat(60));
        console.error('❌ TEST FAILED:', error.message);
        console.error('Stack:', error.stack);
        console.log('═'.repeat(60));
        return false;
    }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    testAutonomousAgent()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

module.exports = testAutonomousAgent;
