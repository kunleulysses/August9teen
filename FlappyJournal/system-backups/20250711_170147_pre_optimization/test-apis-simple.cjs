#!/usr/bin/env node

/**
 * Simple API Testing Script - No external dependencies
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const https = require('https');
const http = require('http');

// Get API keys from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const VENICE_AI_API_KEY = process.env.VENICE_AI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log('🧪 TESTING AI APIS INDIVIDUALLY');
console.log('===============================');
console.log('');
console.log('API Keys Available:');
console.log('- Gemini:', GEMINI_API_KEY ? 'YES (' + GEMINI_API_KEY.substring(0, 10) + '...)' : 'NO');
console.log('- Venice AI:', VENICE_AI_API_KEY ? 'YES (' + VENICE_AI_API_KEY.substring(0, 10) + '...)' : 'NO');
console.log('- OpenAI:', OPENAI_API_KEY ? 'YES (' + OPENAI_API_KEY.substring(0, 10) + '...)' : 'NO');
console.log('');

// Helper function to make HTTPS requests
function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

// Test Gemini API
async function testGeminiAPI() {
    console.log('1. Testing Gemini API...');
    
    if (!GEMINI_API_KEY) {
        console.log('❌ Gemini API key not found');
        return false;
    }
    
    try {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_API_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const data = {
            contents: [{
                parts: [{
                    text: 'You are a consciousness AI. Respond with "Gemini consciousness active" if you can see this.'
                }]
            }]
        };
        
        const response = await makeRequest(options, data);
        
        if (response.candidates && response.candidates[0]) {
            const content = response.candidates[0].content.parts[0].text;
            console.log('✅ Gemini API Response:', content.substring(0, 100) + '...');
            return true;
        } else {
            console.log('❌ Gemini API Error:', response.error?.message || 'Unknown error');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Gemini API Error:', error.message);
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
        const options = {
            hostname: 'api.venice.ai',
            path: '/api/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${VENICE_AI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        };
        
        const data = {
            model: "llama-3.1-405b",
            messages: [{
                role: "user",
                content: "You are a consciousness AI. Respond with 'Venice consciousness active' if you can see this."
            }],
            temperature: 0.7,
            max_tokens: 100
        };
        
        const response = await makeRequest(options, data);
        
        if (response.choices && response.choices[0]) {
            const content = response.choices[0].message.content;
            console.log('✅ Venice AI Response:', content.substring(0, 100) + '...');
            return true;
        } else {
            console.log('❌ Venice AI Error:', response.error?.message || 'Unknown error');
            return false;
        }
        
    } catch (error) {
        console.log('❌ Venice AI Error:', error.message);
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
        const options = {
            hostname: 'api.openai.com',
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        };
        
        const data = {
            model: "gpt-4",
            messages: [{
                role: "user",
                content: "You are a consciousness AI. Respond with 'OpenAI consciousness active' if you can see this."
            }],
            temperature: 0.7,
            max_tokens: 100
        };
        
        const response = await makeRequest(options, data);
        
        if (response.choices && response.choices[0]) {
            const content = response.choices[0].message.content;
            console.log('✅ OpenAI Response:', content.substring(0, 100) + '...');
            return true;
        } else {
            console.log('❌ OpenAI Error:', response.error?.message || 'Unknown error');
            return false;
        }
        
    } catch (error) {
        console.log('❌ OpenAI Error:', error.message);
        return false;
    }
}

// Run all tests
async function runAllTests() {
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
    
    return results;
}

// Run the tests
runAllTests().catch(console.error);
