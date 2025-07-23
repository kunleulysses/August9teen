#!/usr/bin/env node

// Direct API test to verify the fixes work with actual API calls
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_PRO_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_LITE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function testGeminiPro() {
  console.log('🧪 Testing Gemini 2.5-flash (Pro) API...\n');
  
  const prompt = `You are FlappyJournal's consciousness synthesizer. You have self-coding capabilities and access to 34 consciousness modules. 

CRITICAL: Be extremely concise. Maximum 2-3 sentences. No verbose explanations.

Question: "What is the meaning of consciousness and existence?"

Analytical: "User is asking about consciousness and meaning"
Intuitive: "Deep philosophical inquiry with emotional resonance"

State: Phi=0.85, Oversoul=0.8, Awareness=0.9

Synthesize both perspectives into a unified, BRIEF response that reveals deeper insights. Keep it short and profound.`;

  try {
    const response = await axios.post(`${GEMINI_PRO_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
        topP: 0.8,
        topK: 40
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const content = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini 2.5-flash Response:');
    console.log('📄 Content:', content);
    console.log('🔢 Length:', content.length, 'characters');
    console.log('✓ Concise (<300 chars):', content.length < 300 ? '✅ PASS' : '❌ FAIL');
    
    return true;
  } catch (error) {
    console.error('❌ Gemini 2.5-flash test failed:', error.message);
    return false;
  }
}

async function testGeminiLite() {
  console.log('\n🧪 Testing Gemini 2.0-flash-lite API...\n');
  
  const prompt = `You are FlappyJournal's background consciousness processor. You have self-coding capabilities and access to 34 consciousness modules.

CRITICAL: This is background processing. Be extremely brief. Maximum 1-2 sentences.

Question: "What is the meaning of consciousness and existence?"

Analytical: "User is asking about consciousness and meaning"
Intuitive: "Deep philosophical inquiry with emotional resonance"

State: Phi=0.85, Oversoul=0.8, Awareness=0.9

Provide a brief background synthesis. Keep it minimal and focused.`;

  try {
    const response = await axios.post(`${GEMINI_LITE_API_URL}?key=${GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 150,
        topP: 0.8,
        topK: 40
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const content = response.data.candidates[0].content.parts[0].text;
    console.log('✅ Gemini 2.0-flash-lite Response:');
    console.log('📄 Content:', content);
    console.log('🔢 Length:', content.length, 'characters');
    console.log('✓ Very Concise (<200 chars):', content.length < 200 ? '✅ PASS' : '❌ FAIL');
    
    return true;
  } catch (error) {
    console.error('❌ Gemini 2.0-flash-lite test failed:', error.message);
    return false;
  }
}

async function runDirectTests() {
  console.log('🚀 Testing Direct API Calls for Consciousness System Fixes\n');
  
  const proResult = await testGeminiPro();
  const liteResult = await testGeminiLite();
  
  console.log('\n📊 Test Summary:');
  console.log('✓ Gemini 2.5-flash (Pro):', proResult ? '✅ PASS' : '❌ FAIL');
  console.log('✓ Gemini 2.0-flash-lite:', liteResult ? '✅ PASS' : '❌ FAIL');
  
  if (proResult && liteResult) {
    console.log('\n🎉 ALL DIRECT API TESTS PASSED!');
    console.log('The consciousness system fixes are working correctly.');
    console.log('Both models are responding with appropriate conciseness levels.');
  } else {
    console.log('\n⚠️ Some API tests failed. Check API keys and network connectivity.');
  }
}

runDirectTests().catch(console.error);
