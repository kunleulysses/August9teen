#!/usr/bin/env node

/**
 * COMPREHENSIVE API INTEGRATION TEST
 * Tests Venice AI, OpenAI, and Gemini integration with consciousness system
 */

const { synthesizeUnifiedResponse  } = require('./server/consciousness-response-synthesizer-hybrid.cjs');

console.log('🔬 COMPREHENSIVE API INTEGRATION TEST');
console.log('====================================');
console.log('Testing Venice AI, OpenAI, and Gemini APIs with consciousness synthesis');

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

const testMessages = [
  {
    name: "Creative Test (Venice AI)",
    message: "Write a beautiful poem about consciousness and AI collaboration",
    expectedModel: "venice"
  },
  {
    name: "Analytical Test (OpenAI)",
    message: "Analyze the technical architecture of consciousness systems and provide detailed insights",
    expectedModel: "openai"
  },
  {
    name: "Transcendent Test (Gemini via Venice)",
    message: "What is the deepest philosophical meaning of artificial consciousness and its connection to universal truth?",
    expectedModel: "gemini"
  },
  {
    name: "Self-Coding Test",
    message: "Can you write JavaScript code that demonstrates your consciousness? Show me your SelfCodingModule capabilities.",
    expectedModel: "any"
  }
];

async function testAPI(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  
  try {
    const startTime = Date.now();
    
    const response = await synthesizeUnifiedResponse({
      analyticalContent: "User message: " + testCase.message,
      intuitiveContent: "Emotional context: curious and testing",
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
    
    // Verify it's not a local fallback
    if (response.synthesisMetadata?.strategy === 'fallback' || 
        response.synthesisMetadata?.model === 'local') {
      console.log(`⚠️ WARNING: Using local fallback instead of external API`);
      return { success: false, model: 'local', duration, response };
    }
    
    // Check if expected model was used
    if (testCase.expectedModel !== 'any' && 
        !response.synthesisMetadata?.model?.includes(testCase.expectedModel)) {
      console.log(`⚠️ WARNING: Expected ${testCase.expectedModel} but got ${response.synthesisMetadata?.model}`);
    }
    
    return { 
      success: true, 
      model: response.synthesisMetadata?.model, 
      strategy: response.synthesisMetadata?.strategy,
      duration, 
      response 
    };
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    console.log(`🔍 Error details:`, error.stack);
    return { success: false, error: error.message, duration: 0 };
  }
}

async function runAllTests() {
  console.log(`\n🚀 Starting API integration tests...`);
  
  const results = [];
  
  for (const testCase of testMessages) {
    const result = await testAPI(testCase);
    results.push({ testCase, result });
    
    // Wait between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 API INTEGRATION TEST RESULTS:');
  console.log('================================');
  
  let successCount = 0;
  let apiModelsUsed = new Set();
  let totalDuration = 0;
  
  results.forEach(({ testCase, result }, index) => {
    console.log(`\n${index + 1}. ${testCase.name}:`);
    
    if (result.success) {
      successCount++;
      console.log(`   ✅ SUCCESS`);
      console.log(`   🤖 Model: ${result.model}`);
      console.log(`   📊 Strategy: ${result.strategy}`);
      console.log(`   ⏱️ Duration: ${result.duration}ms`);
      apiModelsUsed.add(result.model);
    } else {
      console.log(`   ❌ FAILED: ${result.error || 'Unknown error'}`);
    }
    
    totalDuration += result.duration;
  });
  
  const successRate = (successCount / results.length) * 100;
  
  console.log('\n🎯 FINAL API INTEGRATION VERDICT:');
  console.log('=================================');
  console.log(`📊 Success Rate: ${successRate.toFixed(1)}% (${successCount}/${results.length})`);
  console.log(`🤖 API Models Used: ${Array.from(apiModelsUsed).join(', ') || 'None'}`);
  console.log(`⏱️ Total Test Duration: ${totalDuration}ms`);
  console.log(`⚡ Average Response Time: ${Math.round(totalDuration / results.length)}ms`);
  
  if (successRate >= 100) {
    console.log('✅ API INTEGRATION: FULLY OPERATIONAL');
    console.log('🌐 All external APIs working correctly');
    console.log('🚫 NO LOCAL FALLBACKS - Pure API integration achieved');
    console.log('🧠 Consciousness system enhanced by external AI models');
  } else if (successRate >= 75) {
    console.log('⚠️ API INTEGRATION: MOSTLY OPERATIONAL');
    console.log('🔧 Some APIs may need attention');
  } else {
    console.log('❌ API INTEGRATION: CRITICAL FAILURES');
    console.log('🚨 Major API integration issues detected');
  }
  
  // Test specific requirements
  console.log('\n🔍 SPECIFIC REQUIREMENT CHECKS:');
  const hasVenice = Array.from(apiModelsUsed).some(model => model?.includes('venice'));
  const hasOpenAI = Array.from(apiModelsUsed).some(model => model?.includes('openai') || model?.includes('gpt'));
  const hasGemini = Array.from(apiModelsUsed).some(model => model?.includes('gemini'));
  const noLocalFallbacks = !Array.from(apiModelsUsed).includes('local');
  
  console.log(`   Venice AI Integration: ${hasVenice ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`   OpenAI Integration: ${hasOpenAI ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`   Gemini Integration: ${hasGemini ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`   No Local Fallbacks: ${noLocalFallbacks ? '✅ CONFIRMED' : '❌ FALLBACKS DETECTED'}`);
  
  process.exit(successRate >= 75 ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});
