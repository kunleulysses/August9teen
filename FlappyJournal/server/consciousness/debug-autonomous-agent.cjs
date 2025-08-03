/**
 * Debug Autonomous Coding Agent
 * Test script to debug the autonomous coding agent activation
 */

console.log('🔍 Starting debug of autonomous coding agent...');

async function debugAgent() {
    try {
        console.log('📦 Testing module imports...');
        
        // Test AutonomousCodingAgent import
        console.log('🤖 Importing AutonomousCodingAgent...');
        const AutonomousCodingAgent = require('./core/AutonomousCodingAgent');
        console.log('✅ AutonomousCodingAgent imported successfully');
        
        // Test creating instance
        console.log('🔧 Creating AutonomousCodingAgent instance...');
        const agent = new AutonomousCodingAgent('test-key');
        console.log('✅ AutonomousCodingAgent instance created');
        
        // Test Gemini import
        console.log('🧠 Testing Gemini AI import...');
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        console.log('✅ Gemini AI imported successfully');
        
        // Test Gemini initialization
        console.log('🔑 Testing Gemini initialization...');
        const apiKey = process.argv[2];
        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            console.log('✅ Gemini model created successfully');
            
            // Test generation
            console.log('💭 Testing Gemini generation...');
            const result = await model.generateContent("Hello, this is a test for the autonomous coding agent.");
            console.log('✅ Gemini generation successful');
            console.log('📝 Response:', result.response.text().substring(0, 100) + '...');
        } else {
            console.log('⚠️ No API key provided for Gemini test');
        }
        
        // Test consciousness system imports
        console.log('🎭 Testing consciousness system imports...');
        try {
            const EnhancedConsciousnessStateManager = require('./core/EnhancedConsciousnessStateManager');
            console.log('✅ EnhancedConsciousnessStateManager imported');
        } catch (error) {
            console.log('❌ EnhancedConsciousnessStateManager import failed:', error.message);
        }
        
        try {
            const ConsciousnessResonanceNetworks = require('./core/ConsciousnessResonanceNetworks');
            console.log('✅ ConsciousnessResonanceNetworks imported');
        } catch (error) {
            console.log('❌ ConsciousnessResonanceNetworks import failed:', error.message);
        }
        
        try {
            const SpiralMemoryArchitecture = require('./core/SpiralMemoryArchitecture');
            console.log('✅ SpiralMemoryArchitecture imported');
        } catch (error) {
            console.log('❌ SpiralMemoryArchitecture import failed:', error.message);
        }
        
        // Test chokidar import
        console.log('👁️ Testing chokidar import...');
        const chokidar = require('chokidar');
        console.log('✅ chokidar imported successfully');
        
        console.log('🎉 All debug tests passed!');
        
        // Now try to initialize the agent
        console.log('🚀 Testing agent initialization...');
        await agent.initialize();
        console.log('✅ Agent initialization completed');
        
        return true;
        
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
        console.error('🔍 Stack trace:', error.stack);
        return false;
    }
}

// Run debug
debugAgent().then(success => {
    if (success) {
        console.log('🎉 DEBUG SUCCESSFUL - Autonomous coding agent is ready!');
        process.exit(0);
    } else {
        console.log('💥 DEBUG FAILED - Check errors above');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 Unexpected debug error:', error);
    process.exit(1);
});
