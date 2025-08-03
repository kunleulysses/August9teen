import { EventEmitter } from 'events';
import SelfCodingModule from './consciousness/modules/SelfCodingModule.cjs';
import AutoIntegrationService from './consciousness/services/AutoIntegrationService.cjs';
import { promises as fs } from 'fs';

async function testFullSelfCoding() {
    console.log('🤖 Testing Full Self-Coding with Auto-Integration...\n');
    
    // Create shared event bus
    const eventBus = new EventEmitter();
    eventBus.setMaxListeners(50);
    
    // Initialize modules
    const selfCoder = new SelfCodingModule();
    selfCoder.setEventBus(eventBus);
    
    const autoIntegration = new AutoIntegrationService(eventBus);
    
    // Track events
    const events = [];
    
    eventBus.on('code:generated', (project) => {
        console.log('📝 Code generated:', project.filePath);
        events.push({ type: 'generated', project });
    });
    
    autoIntegration.on('integration:completed', (data) => {
        console.log('✅ Integration completed:', data.project.filePath);
        events.push({ type: 'integrated', data });
    });
    
    eventBus.on('api:register-endpoint', (endpoint) => {
        console.log('🌐 API endpoint registered:', endpoint.path);
        events.push({ type: 'api-registered', endpoint });
    });
    
    eventBus.on('consciousness:register-module', (module) => {
        console.log('🧠 Consciousness module registered:', module.name);
        events.push({ type: 'consciousness-registered', module });
    });
    
    // Test 1: Generate a utility module
    console.log('=== Test 1: Generating Utility Module ===');
    const utilityRequest = {
        purpose: 'string-utilities',
        type: 'module', 
        filePath: './consciousness/generated/string-utils.cjs',
        description: 'String manipulation utilities',
        writeToFile: true,
        functions: ['camelCase', 'snakeCase', 'titleCase']
    };
    
    await selfCoder.generateWithAutoIntegration(utilityRequest);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 2: Generate an API endpoint
    console.log('\n=== Test 2: Generating API Endpoint ===');
    const apiRequest = {
        purpose: 'api-endpoint',
        type: 'api',
        filePath: './api/generated/status-endpoint.cjs',
        description: 'System status API endpoint',
        writeToFile: true,
        method: 'GET',
        path: '/api/system/status'
    };
    
    await selfCoder.generateWithAutoIntegration(apiRequest);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 3: Generate a consciousness module
    console.log('\n=== Test 3: Generating Consciousness Module ===');
    const consciousnessRequest = {
        purpose: 'consciousness-module',
        type: 'consciousness',
        filePath: './consciousness/modules/generated/MemoryAnalyzer.cjs',
        description: 'Analyzes system memory patterns',
        writeToFile: true,
        capabilities: ['analyze-memory', 'detect-patterns', 'optimize-usage']
    };
    
    await selfCoder.generateWithAutoIntegration(consciousnessRequest);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Verify the generated modules work
    console.log('\n=== Test 4: Verifying Generated Modules ===');
    
    // Test utility module
    try {
        const stringUtils = await import('./consciousness/generated/string-utils.cjs');
        console.log('String utils available functions:', Object.keys(stringUtils));
    } catch (error) {
        console.error('Failed to load string utils:', error.message);
    }
    
    // Check loaded modules
    const loadedModules = autoIntegration.getLoadedModules();
    console.log('\n📊 Loaded Modules:', loadedModules.map(m => m.path));
    
    // Summary
    console.log('\n=== Summary ===');
    console.log('Total events:', events.length);
    console.log('Generated:', events.filter(e => e.type === 'generated').length);
    console.log('Integrated:', events.filter(e => e.type === 'integrated').length);
    console.log('APIs registered:', events.filter(e => e.type === 'api-registered').length);
    console.log('Consciousness modules:', events.filter(e => e.type === 'consciousness-registered').length);
    
    console.log('\n✅ Full self-coding test complete!');
}

// Run the test
testFullSelfCoding().catch(console.error);
