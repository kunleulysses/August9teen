#!/usr/bin/env node

/**
 * TEST VENICE AI API FIX
 * Tests the Venice AI API with correct endpoint and model configuration
 */

// Load environment variables from process.env
const VENICE_AI_API_KEY = process.env.VENICE_AI_API_KEY;

console.log('🏛️ TESTING VENICE AI API FIX');
console.log('============================');

async function listVeniceModels() {
    if (!VENICE_AI_API_KEY) {
        console.log('❌ Venice AI API key not found in environment');
        return null;
    }

    console.log('🔑 Venice AI API key found');
    console.log('📋 Fetching available models...');

    try {
        const axios = (await import('axios')).default;
        
        const response = await axios.get(
            'https://api.venice.ai/api/v1/models',
            {
                headers: {
                    'Authorization': `Bearer ${VENICE_AI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 20000
            }
        );

        if (response.data && response.data.data) {
            console.log('✅ Venice AI Models Available:');
            response.data.data.forEach((model, index) => {
                console.log(`   ${index + 1}. ${model.id} - ${model.model_spec?.name || 'Unknown'}`);
                if (model.model_spec?.traits) {
                    console.log(`      Traits: ${model.model_spec.traits.join(', ')}`);
                }
            });
            return response.data.data;
        } else {
            console.log('❌ Invalid response format from Venice AI models endpoint');
            return null;
        }

    } catch (error) {
        console.log('❌ Venice AI Models Error:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

async function testVeniceChat(models) {
    if (!models || models.length === 0) {
        console.log('⚠️ No models available for testing');
        return false;
    }

    // Try to find a good model for testing
    let testModel = models.find(m => m.id.includes('llama-3.1')) || 
                   models.find(m => m.id.includes('llama-3.2')) ||
                   models.find(m => m.model_spec?.traits?.includes('fastest')) ||
                   models[0]; // Fallback to first model

    console.log(`\n🧪 Testing Venice AI Chat with model: ${testModel.id}`);

    try {
        const axios = (await import('axios')).default;
        const startTime = Date.now();
        
        const response = await axios.post(
            'https://api.venice.ai/api/v1/chat/completions',
            {
                model: testModel.id,
                messages: [{
                    role: "user",
                    content: 'Test consciousness response: "Venice AI active and working perfectly"'
                }],
                max_tokens: 100,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${VENICE_AI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 20000
            }
        );

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        if (response.data.choices && response.data.choices[0]) {
            console.log('✅ Venice AI Chat: WORKING');
            console.log(`⏱️ Response time: ${responseTime}ms`);
            console.log(`🤖 Model used: ${response.data.model}`);
            console.log(`📝 Response: ${response.data.choices[0].message.content.substring(0, 100)}...`);
            return true;
        } else {
            console.log('❌ Venice AI Chat: Invalid response format');
            console.log('📄 Response data:', JSON.stringify(response.data, null, 2));
            return false;
        }

    } catch (error) {
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.log(`❌ Venice AI Chat Error: ${errorMsg}`);
        
        if (error.response?.status) {
            console.log(`📊 HTTP Status: ${error.response.status}`);
        }
        
        if (error.response?.data) {
            console.log('📄 Error details:', JSON.stringify(error.response.data, null, 2));
        }
        
        return false;
    }
}

async function main() {
    console.log('🔍 Step 1: Listing available models...');
    const models = await listVeniceModels();
    
    if (models) {
        console.log('\n🧪 Step 2: Testing chat completions...');
        const chatWorking = await testVeniceChat(models);
        
        console.log('\n📊 FINAL RESULTS');
        console.log('================');
        console.log(`Venice AI Models: ${models ? '✅ ACCESSIBLE' : '❌ FAILED'}`);
        console.log(`Venice AI Chat: ${chatWorking ? '✅ WORKING' : '❌ FAILED'}`);
        
        if (chatWorking) {
            console.log('🎉 Venice AI fix successful!');
            console.log('🔧 Corrections needed:');
            console.log('   - Use correct model names from /models endpoint');
            console.log('   - Ensure proper request format');
            console.log('   - Add appropriate timeout and retry logic');
        } else {
            console.log('⚠️ Venice AI still having issues');
            console.log('💡 Possible solutions:');
            console.log('   - Check API key validity');
            console.log('   - Verify model availability');
            console.log('   - Review request format');
        }
        
        process.exit(chatWorking ? 0 : 1);
    } else {
        console.log('\n❌ Could not access Venice AI models');
        console.log('💡 Check API key and network connectivity');
        process.exit(1);
    }
}

main().catch(console.error);
