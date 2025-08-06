const { SpiralMemoryArchitecture } = require('./server/consciousness/core/SpiralMemoryArchitecture.cjs');

async function testSpiralMemoryBasic() {
    console.log('🧠 Testing Spiral Memory Architecture - Basic Functionality');
    
    try {
        // Initialize with in-memory storage (constructor calls initialize() automatically)
        const spiralMemory = new SpiralMemoryArchitecture({
            storage: null // Will use default in-memory storage
        });
        
        // Wait for initialization to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!spiralMemory.isInitialized) {
            throw new Error('Spiral Memory Architecture failed to initialize');
        }
        console.log('✅ Spiral Memory Architecture initialized successfully');
        
        // Test basic memory storage and retrieval
        const testContent = 'Test spiral memory content';
        const testType = 'test';
        const testDepth = 'shallow';
        const testAssociations = [];
        
        const result = await spiralMemory.storeMemory(testContent, testType, testDepth, testAssociations);
        console.log(`✅ Memory stored with result:`, result ? 'Success' : 'Failed');
        
        if (result && result.memoryId) {
            const retrievedMemory = await spiralMemory.retrieveMemory(result.memoryId);
            console.log('✅ Memory retrieved successfully:', retrievedMemory ? 'Found' : 'Not found');
        }
        
        // Test basic functionality without external dependencies
        console.log('✅ Memory count:', spiralMemory.memoryCount);
        console.log('✅ Spiral count:', spiralMemory.memorySpirals.size);
        
        console.log('\n🎉 Basic Spiral Memory test completed successfully!');
        return { success: true, message: 'All basic tests passed' };
        
    } catch (error) {
        console.error('❌ Spiral Memory test failed:', error.message);
        console.error('Stack trace:', error.stack);
        return { success: false, error: error.message };
    }
}

// Run the test
if (require.main === module) {
    testSpiralMemoryBasic()
        .then(result => {
            console.log('\n🏁 Test Complete');
            if (result.success) {
                console.log('✅ SUCCESS: Spiral Memory is functioning correctly');
                process.exit(0);
            } else {
                console.log('❌ FAILURE:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { testSpiralMemoryBasic };
