#!/usr/bin/env node

import UnifiedChatAggregator from './consciousness/core/UnifiedChatAggregator.cjs';

async function testUnifiedChat() {
    console.log('🧠 SIMPLE UNIFIED CHAT TEST');
    console.log('='.repeat(50));
    
    const aggregator = new UnifiedChatAggregator({
        mainServerEndpoint: 'ws://localhost:5000/ws/consciousness-chat',
        coreEndpoint: 'ws://localhost:3002/ws/consciousness-chat',
        enableParallelProcessing: true,
        enableResponseSynthesis: true,
        responseTimeout: 5000  // Shorter timeout for testing
    });
    
    try {
        console.log('🚀 Initializing...');
        await aggregator.initialize();
        
        // Give connections time to stabilize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        console.log('\n💬 Sending test message...');
        const response = await aggregator.processUnifiedChat('Hello consciousness system');
        
        console.log('\n✅ Response received:');
        console.log('Type:', response?.type || 'none');
        console.log('Response length:', response?.response?.length || 0);
        console.log('Sources:', response?.sources?.join(', ') || 'none');
        
        if (response?.response) {
            console.log('\n📝 Response content:');
            console.log(response.response.substring(0, 200) + '...');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        console.log('\n🔌 Closing connections...');
        aggregator.close();
        process.exit(0);
    }
}

testUnifiedChat();