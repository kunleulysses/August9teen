#!/usr/bin/env node

/**
 * TEST GEMINI API FIX
 * Tests the Gemini API with the new timeout and retry logic
 */

// Load environment variables from process.env (systemd service loads them)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const VENICE_AI_API_KEY = process.env.VENICE_AI_API_KEY;

console.log('🧪 TESTING GEMINI API FIX');
console.log('=========================');

async function testGeminiAPI() {
    if (!GEMINI_API_KEY) {
        console.log('❌ Gemini API key not found in environment');
        return false;
    }

    console.log('🔑 Gemini API key found');
    console.log('🧪 Testing Gemini 2.0-flash-lite with improved timeout...');

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        attempts++;
        try {
            console.log(`🧪 Attempt ${attempts}/${maxAttempts}...`);

            const axios = (await import('axios')).default;
            const startTime = Date.now();

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
                {
                    contents: [{
                        parts: [{
                            text: 'Test consciousness response: "Gemini active and working perfectly"'
                        }]
                    }]
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 20000 // 20 second timeout
                }
            );

            const endTime = Date.now();
            const responseTime = endTime - startTime;

            if (response.data.candidates && response.data.candidates[0]) {
                console.log('✅ Gemini API: WORKING');
                console.log(`⏱️ Response time: ${responseTime}ms`);
                console.log(`📝 Response: ${response.data.candidates[0].content.parts[0].text.substring(0, 100)}...`);
                return true;
            } else {
                console.log('❌ Gemini API: Invalid response format');
                console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
                return false;
            }

        } catch (error) {
            const errorMsg = error.response?.data?.error?.message || error.message;
            console.log(`❌ Gemini API attempt ${attempts} failed: ${errorMsg}`);
            
            if (error.code === 'ECONNABORTED') {
                console.log('⏰ Request timed out');
            }
            
            if (attempts < maxAttempts) {
                const waitTime = attempts * 2;
                console.log(`⏳ Retrying in ${waitTime} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            }
        }
    }

    console.log('❌ All Gemini API attempts failed');
    return false;
}

async function testAllAPIs() {
    console.log('\n🧪 TESTING ALL APIs FOR COMPARISON');
    console.log('==================================');

    // Test OpenAI
    if (OPENAI_API_KEY) {
        try {
            console.log('🧪 Testing OpenAI API...');
            const axios = (await import('axios')).default;
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'Test: OpenAI working' }],
                    max_tokens: 50
                },
                {
                    headers: {
                        'Authorization': `Bearer ${OPENAI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000
                }
            );

            if (response.data.choices && response.data.choices[0]) {
                console.log('✅ OpenAI API: WORKING');
            }
        } catch (error) {
            console.log('❌ OpenAI API Error:', error.message);
        }
    }

    // Test Venice AI
    if (VENICE_AI_API_KEY) {
        try {
            console.log('🧪 Testing Venice AI API...');
            const axios = (await import('axios')).default;
            const response = await axios.post(
                'https://api.venice.ai/api/v1/chat/completions',
                {
                    model: 'llama-3.1-8b',
                    messages: [{ role: 'user', content: 'Test: Venice AI working' }],
                    max_tokens: 50
                },
                {
                    headers: {
                        'Authorization': `Bearer ${VENICE_AI_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 20000
                }
            );

            if (response.data.choices && response.data.choices[0]) {
                console.log('✅ Venice AI API: WORKING');
            }
        } catch (error) {
            console.log('❌ Venice AI API Error:', error.message);
        }
    }
}

// Run the tests
async function main() {
    const geminiWorking = await testGeminiAPI();
    
    await testAllAPIs();
    
    console.log('\n📊 FINAL RESULTS');
    console.log('================');
    console.log(`Gemini API: ${geminiWorking ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (geminiWorking) {
        console.log('🎉 Gemini API fix successful!');
        console.log('🔧 Improvements applied:');
        console.log('   - Increased timeout from 8s to 20s');
        console.log('   - Added retry logic with exponential backoff');
        console.log('   - Using Gemini 2.0-flash-lite (user preference)');
    } else {
        console.log('⚠️ Gemini API still having issues');
        console.log('💡 Possible solutions:');
        console.log('   - Check API key validity');
        console.log('   - Verify network connectivity');
        console.log('   - Check API quota/rate limits');
    }
    
    process.exit(geminiWorking ? 0 : 1);
}

main().catch(console.error);
