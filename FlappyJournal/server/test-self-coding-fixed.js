/**
 * Test Self-Coding Module - Fixed Version
 * Tests the self-coding functionality step by step
 */

async function testSelfCoding() {
    console.log('🧪 Testing Self-Coding Module (Fixed Version)');
    
    try {
        // Test 1: Import CodeAnalyzer
        console.log('\n1. Testing CodeAnalyzer...');
        const { CodeAnalyzer } = await import('./consciousness/code-analyzer.js');
        const analyzer = new CodeAnalyzer();
        console.log('✅ CodeAnalyzer imported and instantiated');
        
        // Test 2: Test code generation directly
        console.log('\n2. Testing direct code generation...');
        const generatedCode = await analyzer.generate('function', {
            purpose: 'test-utility',
            description: 'A simple test function',
            language: 'javascript'
        });
        console.log('✅ Code generation successful');
        console.log('Generated code length:', generatedCode.length);
        if (generatedCode.length < 200) {
            console.log('Generated code:', generatedCode);
        }
        
        // Test 3: Import SelfCodingModule without instantiation
        console.log('\n3. Testing SelfCodingModule import...');
        const selfCodingModule = await import('./consciousness/modules/SelfCodingModule.js');
        console.log('✅ SelfCodingModule imported successfully');
        
        // Test 4: Create SelfCodingModule instance
        console.log('\n4. Testing SelfCodingModule instantiation...');
        const SelfCodingModule = selfCodingModule.default;
        
        // Create instance with error handling
        let selfCoder;
        try {
            selfCoder = new SelfCodingModule();
            console.log('✅ SelfCodingModule instantiated successfully');
            console.log('Module name:', selfCoder.name);
            console.log('Capabilities:', selfCoder.capabilities.length);
        } catch (constructorError) {
            console.log('❌ Constructor error:', constructorError.message);
            return;
        }
        
        // Test 5: Test code generation through module
        console.log('\n5. Testing code generation through module...');
        const testRequest = {
            purpose: 'test-utility-module',
            description: 'Generate a utility function through the module',
            language: 'javascript',
            template: 'function'
        };
        
        try {
            const result = await selfCoder.generateCode(testRequest);
            console.log('✅ Module code generation successful');
            console.log('Result type:', typeof result);
            console.log('Has code:', !!result.code);
            console.log('Purpose:', result.purpose);
            console.log('Success:', result.success);
            
            if (result.code && result.code.length < 300) {
                console.log('\nGenerated code preview:');
                console.log(result.code);
            }
        } catch (genError) {
            console.log('❌ Module generation error:', genError.message);
        }
        
        // Test 6: Test autonomous refactoring status
        console.log('\n6. Testing autonomous refactoring...');
        if (selfCoder.autonomousRefactoring) {
            console.log('✅ Autonomous refactoring system available');
            console.log('Refactoring active:', selfCoder.autonomousRefactoring.refactoringActive);
        } else {
            console.log('⚠️ Autonomous refactoring not available (this is OK)');
        }
        
        console.log('\n🎉 Self-Coding Module Test Complete!');
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
        console.log('Stack:', error.stack);
    }
}

// Run the test
testSelfCoding().catch(console.error);
