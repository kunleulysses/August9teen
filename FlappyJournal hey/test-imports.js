#!/usr/bin/env node

/**
 * Test imports for self-coding modules
 */

async function testImports() {
    try {
        console.log('🧪 Testing module imports...');
        
        // Test SelfCodingModule
        const { default: SelfCodingModule } = await import('./server/consciousness/modules/SelfCodingModule.js');
        console.log('✅ SelfCodingModule imported:', !!SelfCodingModule);
        
        // Test SelfCodingContextInjector
        const { default: SelfCodingContextInjector } = await import('./server/self-coding-context-injector.js');
        console.log('✅ SelfCodingContextInjector imported:', !!SelfCodingContextInjector);
        
        // Test SelfCodingProgressTracker
        const { default: SelfCodingProgressTracker } = await import('./server/self-coding-progress-tracker.js');
        console.log('✅ SelfCodingProgressTracker imported:', !!SelfCodingProgressTracker);
        
        console.log('🎉 All imports successful!');
        
    } catch (error) {
        console.error('❌ Import error:', error.message);
        console.error('Stack:', error.stack);
    }
}

testImports();
