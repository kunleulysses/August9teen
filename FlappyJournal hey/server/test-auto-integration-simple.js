import AutoIntegrationService from './consciousness/services/AutoIntegrationService.js';
import { EventEmitter } from 'events';
import { promises as fs } from 'fs';

async function testAutoIntegration() {
    console.log('🧪 Testing Auto-Integration System (Simple Test)...\n');
    
    const eventBus = new EventEmitter();
    const autoIntegration = new AutoIntegrationService(eventBus);
    
    // Listen for integration events
    autoIntegration.on('integration:completed', (data) => {
        console.log('✅ Integration completed:', data.project.filePath);
    });
    
    autoIntegration.on('integration:failed', (data) => {
        console.error('❌ Integration failed:', data.error);
    });
    
    // Test 1: Create a simple module and integrate it
    console.log('Test 1: Creating and integrating a simple module...');
    
    const testModuleCode = `
import { EventEmitter } from 'events';

export class TestModule extends EventEmitter {
    constructor() {
        super();
        this.name = 'TestModule';
        this.initialized = true;
    }
    
    test() {
        return 'Module is working!';
    }
    
    getStatus() {
        return {
            name: this.name,
            initialized: this.initialized,
            timestamp: new Date()
        };
    }
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
    return str.split('').reverse().join('');
}

export default TestModule;
`;

    // Write the test module
    const testFilePath = './consciousness/generated/test-module.js';
    await fs.writeFile(testFilePath, testModuleCode);
    console.log('✓ Test module written to:', testFilePath);
    
    // Trigger integration
    const project = {
        filePath: testFilePath,
        code: testModuleCode,
        purpose: 'test-module',
        type: 'module'
    };
    
    eventBus.emit('code:generated', project);
    
    // Wait for integration
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test 2: Check if module can be loaded
    console.log('\nTest 2: Verifying module loading...');
    try {
        const loadedModules = autoIntegration.getLoadedModules();
        console.log('Loaded modules:', loadedModules);
        
        // Try to use the module
        const testModule = await import('./consciousness/generated/test-module.js');
        console.log('capitalize("hello"):', testModule.capitalize('hello'));
        console.log('reverse("world"):', testModule.reverse('world'));
        
        const TestModuleClass = testModule.default;
        const instance = new TestModuleClass();
        console.log('Module test():', instance.test());
        console.log('Module status:', instance.getStatus());
        
    } catch (error) {
        console.error('Failed to load/use module:', error);
    }
    
    // Test 3: Test integration testing
    console.log('\nTest 3: Running integration tests...');
    const integrationTests = await autoIntegration.testIntegration(testFilePath);
    console.log('Integration test results:', integrationTests);
    
    // Test 4: Create an API endpoint module
    console.log('\nTest 4: Creating an API endpoint module...');
    
    const apiModuleCode = `
export const path = '/api/test/hello';
export const method = 'GET';

export function handler(req, res) {
    res.json({
        message: 'Hello from auto-generated endpoint!',
        timestamp: new Date(),
        method: req.method,
        path: req.path
    });
}

export const middleware = [];

export default { path, method, handler, middleware };
`;

    const apiFilePath = './api/generated/test-hello-endpoint.js';
    await fs.writeFile(apiFilePath, apiModuleCode);
    
    // Listen for API registration
    eventBus.on('api:register-endpoint', (endpoint) => {
        console.log('📡 API Endpoint registration requested:', endpoint);
    });
    
    // Trigger integration
    eventBus.emit('code:generated', {
        filePath: apiFilePath,
        code: apiModuleCode,
        purpose: 'api-endpoint',
        type: 'api'
    });
    
    // Wait for integration
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n✅ Auto-Integration test complete!');
    console.log('Final status:', {
        loadedModules: autoIntegration.getLoadedModules().length,
        queueLength: autoIntegration.integrationQueue.length
    });
}

// Run the test
testAutoIntegration().catch(console.error);
