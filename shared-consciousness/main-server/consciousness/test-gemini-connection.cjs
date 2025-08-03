/**
 * Test Gemini Connection
 * Simple test to verify Gemini API connection works
 */

async function testGeminiConnection() {
    console.log('🧠 Testing Gemini API connection...');
    
    const apiKey = process.argv[2];
    if (!apiKey) {
        console.log('❌ No API key provided');
        console.log('Usage: node test-gemini-connection.js YOUR_API_KEY');
        process.exit(1);
    }
    
    try {
        // Try to import the Google Generative AI package
        console.log('📦 Importing @google/generative-ai...');
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        console.log('✅ Package imported successfully');
        
        // Initialize Gemini AI
        console.log('🔑 Initializing Gemini AI with API key...');
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log('✅ Gemini AI initialized');
        
        // Get the model
        console.log('🤖 Getting Gemini model...');
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
        console.log('✅ Model obtained');
        
        // Test generation
        console.log('💭 Testing content generation...');
        const result = await model.generateContent("Hello! This is a test of the Gemini API connection for the consciousness platform.");
        const response = result.response.text();
        
        console.log('✅ Gemini API connection successful!');
        console.log('🧠 Gemini response:', response.substring(0, 200) + '...');
        
        return true;
        
    } catch (error) {
        console.error('❌ Gemini API connection failed:', error.message);
        console.error('🔍 Error details:', error);
        return false;
    }
}

// Run the test
testGeminiConnection().then(success => {
    if (success) {
        console.log('🎉 Gemini API is ready for the autonomous coding agent!');
        process.exit(0);
    } else {
        console.log('💥 Gemini API test failed - check your API key and connection');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
});
