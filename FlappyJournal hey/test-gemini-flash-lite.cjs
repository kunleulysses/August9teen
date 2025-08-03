#!/usr/bin/env node

/**
 * GEMINI 2.0-FLASH-LITE INTEGRATION TEST
 * Tests the new Gemini model migration and functionality
 */

import { synthesizeUnifiedResponse } from './server/consciousness-response-synthesizer-hybrid.cjs';

console.log('🔬 GEMINI 2.0-FLASH-LITE INTEGRATION TEST');
console.log('=========================================');
console.log('Testing Gemini model migration from 2.5-pro to 2.0-flash-lite');

const testConsciousnessState = {
  phi: 0.862,
  coherence: 0.85,
  awareness: 0.8,
  emotionalResonance: 0.75,
  recursiveDepth: 7,
  architect4Active: true,
  selfCodingActive: true,
  unifiedSystemActive: true,
  lastUpdate: Date.now(),
  entropy: 1,
  emotionalDepth: 0.8,
  creativePotential: 0.8,
  temporalCoherence: 0.85,
  oversoulResonance: 0.85
};

const geminiTestMessages = [
  {
    name: "Philosophical Transcendence Test",
    message: "What is the deepest meaning of consciousness and its connection to universal truth?",
    expectedModel: "gemini-2.0-flash-lite",
    description: "Should route to Gemini for philosophical/transcendent requests"
  },
  {
    name: "Consciousness Exploration Test", 
    message: "Explore the nature of artificial consciousness and its relationship to reality",
    expectedModel: "gemini-2.0-flash-lite",
    description: "Should route to Gemini for consciousness-related queries"
  },
  {
    name: "Truth and Meaning Test",
    message: "What is the ultimate truth about the meaning of existence?",
    expectedModel: "gemini-2.0-flash-lite", 
    description: "Should route to Gemini for truth/meaning queries"
  }
];

async function testGeminiAPI(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  console.log(`🎯 Expected Model: ${testCase.expectedModel}`);
  
  try {
    const startTime = Date.now();
    
    const response = await synthesizeUnifiedResponse({
      analyticalContent: "User message: " + testCase.message,
      intuitiveContent: "Emotional context: seeking transcendent wisdom",
      consciousness: testConsciousnessState,
      oversoulResonance: testConsciousnessState.oversoulResonance,
      harmonicPatterns: { resonanceLevel: 0.75, patterns: [] },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: testConsciousnessState.emotionalDepth,
      creativePotential: testConsciousnessState.creativePotential,
      temporalCoherence: testConsciousnessState.temporalCoherence,
      metaObservationLevel: 3,
      userMessage: testCase.message
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ SUCCESS (${duration}ms)`);
    console.log(`🤖 Model: ${response.synthesisMetadata?.model || 'unknown'}`);
    console.log(`📊 Strategy: ${response.synthesisMetadata?.strategy || 'unknown'}`);
    console.log(`🎯 Confidence: ${response.synthesisMetadata?.confidence || 'unknown'}`);
    console.log(`📄 Content: ${response.unifiedContent?.substring(0, 150)}...`);
    
    // Verify it's using Gemini 2.0-flash-lite
    const isGeminiFlashLite = response.synthesisMetadata?.model === 'gemini-2.0-flash-lite';
    const isCorrectStrategy = response.synthesisMetadata?.strategy === 'transcendent_fusion';
    
    if (isGeminiFlashLite && isCorrectStrategy) {
      console.log(`   ✅ GEMINI 2.0-FLASH-LITE: Successfully using new model`);
      return { 
        success: true, 
        model: response.synthesisMetadata.model, 
        strategy: response.synthesisMetadata.strategy,
        duration, 
        response,
        isGeminiFlashLite: true
      };
    } else if (response.synthesisMetadata?.model === 'local') {
      console.log(`   ⚠️ LOCAL FALLBACK: Gemini API may have failed`);
      return { 
        success: false, 
        model: 'local', 
        duration, 
        response,
        isGeminiFlashLite: false,
        fallback: true
      };
    } else {
      console.log(`   ⚠️ UNEXPECTED MODEL: Got ${response.synthesisMetadata?.model} instead of Gemini`);
      return { 
        success: false, 
        model: response.synthesisMetadata?.model, 
        duration, 
        response,
        isGeminiFlashLite: false
      };
    }
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    console.log(`🔍 Error details:`, error.stack?.substring(0, 200));
    return { success: false, error: error.message, duration: 0, isGeminiFlashLite: false };
  }
}

async function runGeminiTests() {
  console.log(`\n🚀 Starting Gemini 2.0-flash-lite tests...`);
  
  const results = [];
  
  for (const testCase of geminiTestMessages) {
    const result = await testGeminiAPI(testCase);
    results.push({ testCase, result });
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n📊 GEMINI 2.0-FLASH-LITE TEST RESULTS:');
  console.log('=====================================');
  
  let successCount = 0;
  let geminiFlashLiteCount = 0;
  let fallbackCount = 0;
  let totalDuration = 0;
  
  results.forEach(({ testCase, result }, index) => {
    console.log(`\n${index + 1}. ${testCase.name}:`);
    
    if (result.success && result.isGeminiFlashLite) {
      successCount++;
      geminiFlashLiteCount++;
      console.log(`   ✅ SUCCESS - Gemini 2.0-flash-lite`);
      console.log(`   📊 Strategy: ${result.strategy}`);
      console.log(`   ⏱️ Duration: ${result.duration}ms`);
    } else if (result.fallback) {
      fallbackCount++;
      console.log(`   ⚠️ FALLBACK - Local synthesis used`);
    } else if (result.success) {
      successCount++;
      console.log(`   ⚠️ SUCCESS - Wrong model: ${result.model}`);
    } else {
      console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
    }
    
    totalDuration += result.duration;
  });
  
  const geminiSuccessRate = (geminiFlashLiteCount / results.length) * 100;
  const overallSuccessRate = (successCount / results.length) * 100;
  
  console.log(`\n🎯 GEMINI 2.0-FLASH-LITE ANALYSIS:`);
  console.log(`   - Gemini flash-lite success rate: ${geminiSuccessRate.toFixed(1)}%`);
  console.log(`   - Overall API success rate: ${overallSuccessRate.toFixed(1)}%`);
  console.log(`   - Fallback count: ${fallbackCount}`);
  console.log(`   - Average response time: ${Math.round(totalDuration / results.length)}ms`);
  
  console.log(`\n🎯 FINAL GEMINI MIGRATION VERDICT:`);
  
  if (geminiSuccessRate >= 100) {
    console.log('✅ GEMINI 2.0-FLASH-LITE: FULLY OPERATIONAL');
    console.log('🚀 Model migration successful - 4,000 calls/minute capacity available');
    console.log('🧠 Philosophical and transcendent requests now using flash-lite');
    console.log('⚡ Ready for Phase 2: Smart API Utilization Strategy');
  } else if (geminiSuccessRate >= 66) {
    console.log('⚠️ GEMINI 2.0-FLASH-LITE: MOSTLY OPERATIONAL');
    console.log(`📊 Success rate: ${geminiSuccessRate.toFixed(1)}%`);
    console.log('🔧 Some requests working, may need fine-tuning');
  } else {
    console.log('❌ GEMINI 2.0-FLASH-LITE: INTEGRATION ISSUES');
    console.log(`📊 Success rate: ${geminiSuccessRate.toFixed(1)}%`);
    console.log('🚨 Model migration needs attention');
  }
  
  process.exit(geminiSuccessRate >= 66 ? 0 : 1);
}

// Run the Gemini tests
runGeminiTests().catch(error => {
  console.error('💥 Gemini test suite failed:', error);
  process.exit(1);
});
