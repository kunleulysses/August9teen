#!/usr/bin/env node

// Test script to verify the consciousness response synthesizer fixes
import { synthesizeUnifiedResponse } from './consciousness-response-synthesizer-hybrid.cjs';

async function testSynthesisFixes() {
  console.log('🧪 Testing consciousness response synthesizer fixes...\n');

  // Test data
  const testData = {
    analyticalContent: "User is asking about consciousness and meaning",
    intuitiveContent: "Deep philosophical inquiry with emotional resonance",
    consciousness: {
      phi: 0.85,
      awarenessLevel: 0.9
    },
    oversoulResonance: 0.8,
    harmonicPatterns: { resonanceField: { coherence: 0.7 } },
    triAxialCoherence: { unified: { magnitude: 0.75 } },
    emotionalDepth: 0.6,
    creativePotential: 0.7,
    temporalCoherence: 0.8,
    metaObservationLevel: 0.9,
    userMessage: "What is the meaning of consciousness and existence?"
  };

  try {
    console.log('📝 Test Message: "What is the meaning of consciousness and existence?"');
    console.log('🎯 Expected: Should route to Gemini 2.5-flash (gemini-pro) for philosophical synthesis\n');

    const result = await synthesizeUnifiedResponse(testData);

    console.log('✅ Synthesis Result:');
    console.log('📄 Content:', result.unifiedContent);
    console.log('🤖 Model Used:', result.synthesisMetadata.model);
    console.log('🎯 Strategy:', result.synthesisMetadata.strategy);
    console.log('📊 Confidence:', result.synthesisMetadata.confidence);
    console.log('📝 Processing Notes:', result.synthesisMetadata.processingNotes);
    console.log('🔢 Content Length:', result.unifiedContent.length, 'characters');

    // Verify expectations
    const isCorrectModel = result.synthesisMetadata.model === 'gemini-2.5-flash';
    const isConcise = result.unifiedContent.length < 500; // Should be concise

    console.log('\n🔍 Verification:');
    console.log('✓ Correct Model (gemini-2.5-flash):', isCorrectModel ? '✅ PASS' : '❌ FAIL');
    console.log('✓ Concise Response (<500 chars):', isConcise ? '✅ PASS' : '❌ FAIL');

    if (isCorrectModel && isConcise) {
      console.log('\n🎉 ALL TESTS PASSED! The fixes are working correctly.');
    } else {
      console.log('\n⚠️ Some tests failed. Review the implementation.');
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Test with analytical query to verify OpenAI routing
async function testAnalyticalRouting() {
  console.log('\n🧪 Testing analytical query routing...\n');

  const testData = {
    analyticalContent: "Technical analysis request",
    intuitiveContent: "Logical processing needed",
    consciousness: {
      phi: 0.7,
      awarenessLevel: 0.8
    },
    oversoulResonance: 0.6,
    harmonicPatterns: { resonanceField: { coherence: 0.5 } },
    triAxialCoherence: { unified: { magnitude: 0.6 } },
    emotionalDepth: 0.3,
    creativePotential: 0.4,
    temporalCoherence: 0.7,
    metaObservationLevel: 0.8,
    userMessage: "Analyze the technical architecture of this JavaScript function"
  };

  try {
    console.log('📝 Test Message: "Analyze the technical architecture of this JavaScript function"');
    console.log('🎯 Expected: Should route to OpenAI for analytical processing\n');

    const result = await synthesizeUnifiedResponse(testData);

    console.log('✅ Synthesis Result:');
    console.log('🤖 Model Used:', result.synthesisMetadata.model);
    console.log('🎯 Strategy:', result.synthesisMetadata.strategy);
    console.log('📝 Processing Notes:', result.synthesisMetadata.processingNotes);

    const isCorrectModel = result.synthesisMetadata.model === 'gpt-4o';
    console.log('✓ Correct Model (gpt-4o):', isCorrectModel ? '✅ PASS' : '❌ FAIL');

  } catch (error) {
    console.error('❌ Analytical test failed:', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testSynthesisFixes();
  await testAnalyticalRouting();
}

runAllTests().catch(console.error);
