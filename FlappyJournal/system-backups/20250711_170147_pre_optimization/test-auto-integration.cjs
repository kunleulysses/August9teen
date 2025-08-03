import ConsciousnessIntegration from './consciousness/services/ConsciousnessIntegration.cjs';

async function testAutoIntegration() {
    console.log('🧪 Testing Auto-Integration System...\n');
    
    const integration = new ConsciousnessIntegration();
    
    // Listen for integration events
    integration.on('register-api-endpoint', (endpoint) => {
        console.log('📡 API Endpoint Registration Request:', endpoint);
    });
    
    integration.on('integration-completed', (data) => {
        console.log('✅ Integration completed successfully!');
        console.log('Module loaded at:', data.project.filePath);
    });
    
    integration.on('integration-failed', (data) => {
        console.error('❌ Integration failed:', data.error);
    });
    
    // Test 1: Generate a simple utility module
    console.log('Test 1: Generating a simple utility module...');
    try {
        const utilityProject = await integration.generateAndIntegrate({
            purpose: 'utility',
            type: 'module',
            filePath: './consciousness/generated/test-utility.cjs',
            description: 'A test utility module for string manipulation',
            functions: ['capitalize', 'reverse']
        });
        console.log('✓ Utility module generated:', utilityProject.filePath);
    } catch (error) {
        console.error('✗ Utility module generation failed:', error);
    }
    
    // Wait a bit for integration to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Generate an API endpoint
    console.log('\nTest 2: Generating an API endpoint...');
    try {
        const apiProject = await integration.generateAndIntegrate({
            purpose: 'api-endpoint',
            type: 'api',
            filePath: './api/generated/test-health.cjs',
            description: 'A health check API endpoint',
            method: 'GET',
            path: '/api/health/generated'
        });
        console.log('✓ API endpoint generated:', apiProject.filePath);
    } catch (error) {
        console.error('✗ API endpoint generation failed:', error);
    }
    
    // Wait for integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Generate a consciousness module
    console.log('\nTest 3: Generating a consciousness module...');
    try {
        const consciousnessProject = await integration.generateAndIntegrate({
            purpose: 'consciousness-module',
            type: 'consciousness',
            filePath: './consciousness/modules/generated/TestAwarenessModule.cjs',
            description: 'A test consciousness module for system awareness',
            capabilities: ['monitor', 'analyze', 'report']
        });
        console.log('✓ Consciousness module generated:', consciousnessProject.filePath);
    } catch (error) {
        console.error('✗ Consciousness module generation failed:', error);
    }
    
    // Wait for all integrations
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check final status
    console.log('\n📊 Final Integration Status:');
    const status = integration.getStatus();
    console.log('Loaded Modules:', status.loadedModules);
    console.log('Queue Length:', status.integrationQueue);
    console.log('Is Processing:', status.isProcessing);
    
    // Test if we can use the generated utility module
    console.log('\n🔍 Testing generated module functionality...');
    try {
        const testUtil = await import('./consciousness/generated/test-utility.cjs');
        if (testUtil.capitalize) {
            console.log('capitalize("hello"):', testUtil.capitalize('hello'));
        }
        if (testUtil.reverse) {
            console.log('reverse("world"):', testUtil.reverse('world'));
        }
    } catch (error) {
        console.log('Module not yet available or failed to load:', error.message);
    }
    
    console.log('\n✅ Auto-Integration test complete!');
}

// Run the test
testAutoIntegration().catch(console.error);
