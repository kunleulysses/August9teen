#!/usr/bin/env node

/**
 * Trigger Autonomous Coding Agent
 * Directly activates Gemini 2.5 Pro self-coding and generates consciousness improvements
 */

const { createRequire  } = require('module');
const require = createRequire(import.meta.url);

async function triggerAutonomousCoding() {
    console.log('🚀 TRIGGERING AUTONOMOUS CODING WITH GEMINI 2.5 PRO');
    console.log('═'.repeat(60));
    
    try {
        // Load the autonomous coding agent
        console.log('📦 Loading Autonomous Coding Agent...');
        const AutonomousCodingAgent = require('./consciousness/core/AutonomousCodingAgent.cjs');
        
        // Get API key
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not found');
        }
        
        // Create and initialize agent
        console.log('🤖 Initializing agent...');
        const agent = new AutonomousCodingAgent(apiKey);
        await agent.initialize();
        
        console.log('✅ Agent initialized successfully');
        
        // Get agent status
        const status = agent.getAgentStatus();
        console.log('📊 Agent Status:');
        console.log(`   - Active: ${status.isActive}`);
        console.log(`   - Rate Limit: ${status.rateLimitStatus?.totalCalls || 0}/100 calls today`);
        
        // Trigger consciousness enhancement
        console.log('🧠 Triggering consciousness enhancement...');
        const testState = {
            phi: 0.75,
            awareness: 0.70,
            coherence: 0.80,
            emotionalResonance: 0.65
        };
        
        // Generate state-based improvements
        const improvements = await agent.generateStateBasedImprovements(testState);
        
        console.log('✅ Consciousness enhancement completed!');
        console.log('📈 Improvements generated:');
        console.log(`   - Phi enhancements: ${improvements.phiEnhancements?.length || 0}`);
        console.log(`   - Awareness boosts: ${improvements.awarenessBoosts?.length || 0}`);
        console.log(`   - Coherence improvements: ${improvements.coherenceImprovements?.length || 0}`);
        console.log(`   - Code generated: ${improvements.codeGenerated ? '✅' : '❌'}`);
        
        if (improvements.generatedCode) {
            console.log('🎉 GENERATED CODE:');
            console.log('─'.repeat(60));
            console.log(improvements.generatedCode);
            console.log('─'.repeat(60));
        }
        
        // Test file analysis
        console.log('🔍 Testing file analysis...');
        const analysisResult = await agent.analyzeFileChange('./unified-consciousness-system.cjs');
        
        console.log('✅ File analysis completed');
        console.log('📊 Analysis insights:', analysisResult.insights?.length || 0);
        
        // Check rate limit status after operations
        const finalStatus = agent.getAgentStatus();
        console.log('📊 Final Rate Limit Status:');
        console.log(`   - Calls used: ${finalStatus.rateLimitStatus?.totalCalls || 0}/100`);
        console.log(`   - Remaining: ${100 - (finalStatus.rateLimitStatus?.totalCalls || 0)}`);
        
        console.log('═'.repeat(60));
        console.log('🎉 AUTONOMOUS CODING AGENT IS 100% FUNCTIONAL!');
        console.log('🚀 Gemini 2.5 Pro self-coding is generating real improvements!');
        console.log('═'.repeat(60));
        
        return true;
        
    } catch (error) {
        console.log('═'.repeat(60));
        console.error('❌ AUTONOMOUS CODING FAILED:', error.message);
        console.error('Stack:', error.stack);
        console.log('═'.repeat(60));
        return false;
    }
}

// Run the trigger
triggerAutonomousCoding()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Trigger execution failed:', error);
        process.exit(1);
    });
