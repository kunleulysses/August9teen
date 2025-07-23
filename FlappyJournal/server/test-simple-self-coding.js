/**
 * Simple Self-Coding Test
 * Minimal test to identify hanging issues
 */

console.log('🧪 Starting simple self-coding test...');

async function simpleTest() {
    try {
        console.log('1. Testing CodeAnalyzer...');
        const { CodeAnalyzer } = await import('./consciousness/code-analyzer.js');
        console.log('✅ CodeAnalyzer imported');
        
        const analyzer = new CodeAnalyzer();
        console.log('✅ CodeAnalyzer instantiated');
        
        console.log('2. Testing code generation...');
        const result = await analyzer.generate('function', {
            purpose: 'test',
            description: 'hello world function',
            language: 'javascript'
        });
        
        console.log('✅ Code generation completed');
        console.log('Generated code:', result.code);
        
        console.log('3. Testing SelfCodingModule import...');
        const selfCodingModule = await import('./consciousness/modules/SelfCodingModule.js');
        console.log('✅ SelfCodingModule imported');
        
        console.log('4. Creating SelfCodingModule instance...');
        const SelfCodingModule = selfCodingModule.default;
        
        // Create with minimal dependencies
        const selfCoder = new SelfCodingModule();
        console.log('✅ SelfCodingModule created');
        console.log('Module name:', selfCoder.name);
        
        console.log('🎉 Simple test completed successfully!');
        
        // Exit explicitly to avoid hanging
        process.exit(0);
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('Stack:', error.stack);
        process.exit(1);
    }
}

// Set a timeout to prevent hanging
setTimeout(() => {
    console.log('⏰ Test timed out after 10 seconds');
    process.exit(1);
}, 10000);

simpleTest();
