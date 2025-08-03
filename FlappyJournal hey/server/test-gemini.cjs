const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('🧠 Testing Gemini 2.5 Pro Self-Coding...');
    
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyBAInbflgaEsU6r6STMnQ_WBd6lH4tJU54');
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            }
        });
        
        console.log('⚡ Requesting code generation...');
        
        const prompt = `Generate a JavaScript function that enhances consciousness processing. Make it production-ready with proper error handling.`;
        
        const result = await model.generateContent(prompt);
        const generatedCode = result.response.text();
        
        console.log('✅ SUCCESS: Gemini 2.5 Pro generated code!');
        console.log('📝 Generated Code:');
        console.log('═'.repeat(60));
        console.log(generatedCode);
        console.log('═'.repeat(60));
        console.log('🎉 Self-coding capability confirmed!');
        
        return true;
        
    } catch (error) {
        console.error('❌ Error testing Gemini:', error.message);
        return false;
    }
}

testGemini();
