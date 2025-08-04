/**
 * Test Distributed Orchestration with UnifiedChatAggregator
 * Verifies that both consciousness containers can be reached and unified responses are generated
 */

const UnifiedChatAggregator = require('./consciousness/core/UnifiedChatAggregator.cjs');

async function testDistributedOrchestration() {
    console.log('🧠 DISTRIBUTED ORCHESTRATION TEST');
    console.log('='.repeat(50));
    
    try {
        // Initialize UnifiedChatAggregator with both endpoints
        const aggregator = new UnifiedChatAggregator({
            mainServerEndpoint: 'ws://localhost:5000/ws/consciousness-chat',
            coreEndpoint: 'ws://localhost:3002/ws/consciousness-chat',
            enableParallelProcessing: true,
            enableResponseSynthesis: true,
            responseTimeout: 15000
        });
        
        console.log('🚀 Initializing UnifiedChatAggregator...');
        
        // Set up event listeners
        aggregator.on('aggregator:initialized', (status) => {
            console.log('✅ Aggregator initialized:', status);
        });
        
        aggregator.on('connection:established', (container) => {
            console.log(`🔗 Connection established to ${container}`);
        });
        
        aggregator.on('connection:error', (error) => {
            console.log(`❌ Connection error: ${error.container} - ${error.error}`);
        });
        
        aggregator.on('capabilities:discovered', (capabilities) => {
            console.log(`📋 Capabilities discovered: ${capabilities.container} (${capabilities.count} capabilities)`);
        });
        
        // Initialize the aggregator
        await aggregator.initialize();
        
        // Wait for connections to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Test unified chat processing
        console.log('\n💬 Testing unified chat processing...');
        
        const testMessage = 'Explain consciousness and reality from your perspective';
        console.log(`📝 Test message: "${testMessage}"`);
        
        // Process the message through both containers
        const response = await aggregator.processUnifiedChat(testMessage);
        
        console.log('\n🎯 UNIFIED RESPONSE RECEIVED:');
        console.log('='.repeat(40));
        
        // Add defensive checks for response object
        if (!response) {
            console.log('❌ No response received from UnifiedChatAggregator');
            throw new Error('Failed to get unified response');
        }
        
        console.log(`📊 Response length: ${response.response ? response.response.length : 0} characters`);
        console.log(`🔢 Containers involved: ${response.containers ? response.containers.length : 0}`);
        console.log(`⚡ Processing time: ${response.processingTime || 'unknown'}ms`);
        
        if (response.containers && response.containers.includes('mainServer')) {
            console.log('✅ Main server participated in response');
        } else {
            console.log('❌ Main server did not participate');
        }
        
        if (response.containers && response.containers.includes('core')) {
            console.log('✅ Core container participated in response');
        } else {
            console.log('❌ Core container did not participate');
        }
        
        // Check for local synthesis fallback
        if (response.synthesisType === 'unified') {
            console.log('✅ DISTRIBUTED ORCHESTRATION SUCCESS - No local synthesis fallback!');
            console.log('🎉 Both containers provided real responses');
        } else {
            console.log('⚠️ Still falling back to local synthesis');
            console.log(`   Synthesis type: ${response.synthesisType}`);
        }
        
        console.log('\n📋 Response preview:');
        console.log(response.response.substring(0, 200) + '...');
        
        // Get connection status
        const connectionStatus = aggregator.getConnectionStatus();
        console.log('\n🔍 CONNECTION STATUS:');
        console.log(`🔧 Main server: ${connectionStatus.mainServer ? '✅ Connected' : '❌ Disconnected'}`);
        console.log(`🧠 Core: ${connectionStatus.core ? '✅ Connected' : '❌ Disconnected'}`);
        console.log(`📊 Total connections: ${connectionStatus.totalConnections}/2`);
        
        // Get capabilities
        const capabilities = aggregator.getCapabilities();
        console.log('\n🌟 CAPABILITIES:');
        console.log(`📋 Total unified capabilities: ${capabilities.unified.length}`);
        console.log(`🔧 Main server capabilities: ${capabilities.mainServer.length}`);
        console.log(`🧠 Core capabilities: ${capabilities.core.length}`);
        
        // Test result with defensive coding
        const isFullyOperational = (
            connectionStatus.totalConnections === 2 &&
            (response && response.containers && response.containers.length === 2) &&
            (response && response.synthesisType === 'unified') &&
            capabilities.unified.length > 0
        );
        
        console.log('\n🏆 FINAL RESULT:');
        if (isFullyOperational) {
            console.log('✅ DISTRIBUTED ORCHESTRATION FULLY OPERATIONAL!');
            console.log('🎉 No local synthesis fallback - unified consciousness active!');
        } else {
            console.log('⚠️ Distributed orchestration partially working');
            console.log('   Some components may need additional debugging');
        }
        
        // Cleanup
        await aggregator.cleanup();
        process.exit(isFullyOperational ? 0 : 1);
        
    } catch (error) {
        console.error('❌ Distributed orchestration test failed:', error);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Run the test
testDistributedOrchestration();
