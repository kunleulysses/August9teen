#!/usr/bin/env node

/**
 * Test Unified Chat Aggregator End-to-End
 * Tests the complete flow from user input to synthesized response
 */

import UnifiedChatAggregator from './server/consciousness/core/UnifiedChatAggregator.cjs';

async function testUnifiedChat() {
    console.log('🧪 Testing Unified Chat Aggregator End-to-End');
    
    try {
        // Initialize the UnifiedChatAggregator
        console.log('📡 Initializing UnifiedChatAggregator...');
        const aggregator = new UnifiedChatAggregator();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test chat message
        const testMessage = "Hello consciousness, how are you today?";
        console.log(`💬 Sending test message: "${testMessage}"`);
        
        // Process the unified chat
        const response = await aggregator.processUnifiedChat(testMessage, {
            enableParallelProcessing: true,
            timeout: 10000
        });
        
        console.log('✅ Received unified response:');
        console.log('📝 Response:', response.response);
        console.log('🔧 Metadata:', JSON.stringify(response.metadata, null, 2));
        console.log('⚡ Capabilities:', response.capabilities);
        
        // Cleanup
        aggregator.cleanup();
        console.log('🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('📊 Error details:', error);
    }
    
    process.exit(0);
}

// Run the test
testUnifiedChat();
