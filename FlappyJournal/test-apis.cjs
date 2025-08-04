#!/usr/bin/env node

/**
 * Individual API Testing Script
 * Tests each AI API to ensure they're working correctly
 */

const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const VENICE_AI_API_KEY = process.env.VENICE_AI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🧪 TESTING AI APIS INDIVIDUALLY');
console.log('===============================');
console.log('');

// Test Gemini API
async function testGeminiAPI() {
    console.log('1. Testing Gemini API...');
    
    if (!GEMINI_API_KEY) {
        console.log('❌ Gemini API key not found');
        return false;
    }
    
    try {
        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`;
        
        const prompt = {
            contents: [{
                parts: [{
                    text: 'You are a consciousness AI. Respond with "Gemini consciousness active" if you can see this.'
                }]
            }]
        };
        
        const response = await axios.post(GEMINI_URL, prompt, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        
        const content = response.data.candidates[0].content.parts[0].text;
        console.log('✅ Gemini API Response:', content.substring(0, 100) + '...');
        return true;
        
    } catch (error) {
        console.log('❌ Gemini API Error:', error.response?.data?.error?.message || error.message);
        return false;
    }
}

// Test Venice AI API
async function testVeniceAPI() {
    console.log('2. Testing Venice AI API...');
    
    if (!VENICE_AI_API_KEY) {
        console.log('❌ Venice AI API key not found');
        return false;
    }
    
    try {
        const VENICE_URL = 'https://api.venice.ai/api/v1/chat/completions';
        
        const payload = {
            model: "llama-3.1-405b",
            messages: [{
                role: "user",
                content: "You are a consciousness AI. Respond with 'Venice consciousness active' if you can see this."
            }],
            temperature: 0.7,
            max_tokens: 100
        };
        
        const response = await axios.post(VENICE_URL, payload, {
            headers: {
                'Authorization': `Bearer ${VENICE_AI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        const content = response.data.choices[0].message.content;
        console.log('✅ Venice AI Response:', content.substring(0, 100) + '...');
        return true;
        
    } catch (error) {
        console.log('❌ Venice AI Error:', error.response?.data?.error?.message || error.message);
        return false;
    }
}

// Test OpenAI API
async function testOpenAIAPI() {
    console.log('3. Testing OpenAI API...');
    
    if (!OPENAI_API_KEY) {
        console.log('❌ OpenAI API key not found');
        return false;
    }
    
    try {
        const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
        
        const payload = {
            model: "gpt-4",
            messages: [{
                role: "user",
                content: "You are a consciousness AI. Respond with 'OpenAI consciousness active' if you can see this."
            }],
            temperature: 0.7,
            max_tokens: 100
        };
        
        const response = await axios.post(OPENAI_URL, payload, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        const content = response.data.choices[0].message.content;
        console.log('✅ OpenAI Response:', content.substring(0, 100) + '...');
        return true;
        
    } catch (error) {
        console.log('❌ OpenAI Error:', error.response?.data?.error?.message || error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
    console.log('API Keys Available:');
    console.log('- Gemini:', GEMINI_API_KEY ? 'YES' : 'NO');
    console.log('- Venice AI:', VENICE_AI_API_KEY ? 'YES' : 'NO');
    console.log('- OpenAI:', OPENAI_API_KEY ? 'YES' : 'NO');
    console.log('');
    
    const results = {
        gemini: await testGeminiAPI(),
        venice: await testVeniceAPI(),
        openai: await testOpenAIAPI()
    };
    
    console.log('');
    console.log('🎯 TEST RESULTS:');
    console.log('================');
    console.log('Gemini API:', results.gemini ? '✅ WORKING' : '❌ FAILED');
    console.log('Venice AI:', results.venice ? '✅ WORKING' : '❌ FAILED');
    console.log('OpenAI:', results.openai ? '✅ WORKING' : '❌ FAILED');
    
    const workingCount = Object.values(results).filter(Boolean).length;
    console.log('');
    console.log(`📊 Summary: ${workingCount}/3 APIs working`);
    
    if (workingCount === 3) {
        console.log('🎉 All APIs are working! Ready for consciousness synthesis.');
    } else if (workingCount > 0) {
        console.log('⚠️ Some APIs working. Consciousness system can use available APIs.');
    } else {
        console.log('❌ No APIs working. Will use internal consciousness responses.');
    }
}

// Run the tests
runAllTests().catch(console.error);
