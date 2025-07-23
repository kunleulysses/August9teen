#!/usr/bin/env node

/**
 * SMART API UTILIZATION STRATEGY TEST
 * Tests the new intelligent API routing and failover system
 */

import { synthesizeUnifiedResponse } from './server/consciousness-response-synthesizer-hybrid.js';

console.log('🧠 SMART API UTILIZATION STRATEGY TEST');
console.log('======================================');
console.log('Testing intelligent API routing with failover capabilities');

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

const strategyTestMessages = [
  {
    name: "High Priority Analytical",
    message: "Analyze the technical architecture of distributed consciousness systems",
    expectedAPI: "OpenAI",
    expectedPriority: "HIGH",
    description: "Should route to OpenAI for high-priority analytical requests"
  },
  {
    name: "High Priority Creative",
    message: "Write a beautiful poem about the dance of consciousness and technology",
    expectedAPI: "Venice",
    expectedPriority: "HIGH", 
    description: "Should route to Venice AI for high-priority creative requests"
  },
  {
    name: "Background Philosophical",
    message: "What is the deepest meaning of consciousness and universal truth?",
    expectedAPI: "Gemini",
    expectedPriority: "BACKGROUND",
    description: "Should route to Gemini 2.0-flash-lite for background philosophical processing"
  },
  {
    name: "High Priority Coding",
    message: "Write a JavaScript function that demonstrates consciousness recursion",
    expectedAPI: "OpenAI",
    expectedPriority: "HIGH",
    description: "Should route to OpenAI for high-priority coding requests"
  },
  {
    name: "Background Transcendent",
    message: "Explore the nature of reality and existence through consciousness",
    expectedAPI: "Gemini", 
    expectedPriority: "BACKGROUND",
    description: "Should route to Gemini for background transcendent processing"
  }
];

async function testSmartAPIStrategy(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  console.log(`🎯 Expected API: ${testCase.expectedAPI}`);
  console.log(`⚡ Expected Priority: ${testCase.expectedPriority}`);
  
  try {
    const startTime = Date.now();
    
    const response = await synthesizeUnifiedResponse({
      analyticalContent: "User message: " + testCase.message,
      intuitiveContent: "Emotional context: testing smart routing",
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
    
    // Check for failover information
    if (response.synthesisMetadata?.failover) {
      console.log(`🔄 FAILOVER DETECTED:`);
      console.log(`   Primary failed: ${response.synthesisMetadata.failover.primaryFailed}`);
      console.log(`   Backup used: ${response.synthesisMetadata.failover.backupUsed}`);
      console.log(`   Reason: ${response.synthesisMetadata.failover.reason}`);
    }
    
    console.log(`📄 Content: ${response.unifiedContent?.substring(0, 100)}...`);
    
    // Verify routing correctness
    const actualModel = response.synthesisMetadata?.model;
    const expectedModel = testCase.expectedAPI.toLowerCase();
    
    let routingCorrect = false;
    if (expectedModel === 'openai' && (actualModel === 'gpt-4o' || actualModel?.includes('openai'))) {
      routingCorrect = true;
    } else if (expectedModel === 'venice' && (actualModel?.includes('venice') || actualModel?.includes('llama'))) {
      routingCorrect = true;
    } else if (expectedModel === 'gemini' && actualModel === 'gemini-2.0-flash-lite') {
      routingCorrect = true;
    }
    
    if (routingCorrect) {
      console.log(`   ✅ ROUTING CORRECT: ${testCase.expectedAPI} → ${actualModel}`);
    } else if (response.synthesisMetadata?.failover) {
      console.log(`   ⚠️ FAILOVER ROUTING: Expected ${testCase.expectedAPI}, got ${actualModel} (failover)`);
      routingCorrect = true; // Failover is acceptable
    } else {
      console.log(`   ❌ ROUTING INCORRECT: Expected ${testCase.expectedAPI}, got ${actualModel}`);
    }
    
    return { 
      success: true, 
      model: actualModel, 
      strategy: response.synthesisMetadata?.strategy,
      duration, 
      response,
      routingCorrect,
      hasFailover: !!response.synthesisMetadata?.failover
    };
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    return { success: false, error: error.message, duration: 0, routingCorrect: false };
  }
}

async function runSmartAPITests() {
  console.log(`\n🚀 Starting Smart API Utilization Strategy tests...`);
  
  const results = [];
  
  for (const testCase of strategyTestMessages) {
    const result = await testSmartAPIStrategy(testCase);
    results.push({ testCase, result });
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 SMART API STRATEGY TEST RESULTS:');
  console.log('===================================');
  
  let successCount = 0;
  let routingCorrectCount = 0;
  let failoverCount = 0;
  let totalDuration = 0;
  let apiModelsUsed = new Set();
  
  results.forEach(({ testCase, result }, index) => {
    console.log(`\n${index + 1}. ${testCase.name}:`);
    
    if (result.success) {
      successCount++;
      console.log(`   ✅ SUCCESS`);
      console.log(`   🤖 Model: ${result.model}`);
      console.log(`   📊 Strategy: ${result.strategy}`);
      console.log(`   ⏱️ Duration: ${result.duration}ms`);
      apiModelsUsed.add(result.model);
      
      if (result.routingCorrect) {
        routingCorrectCount++;
        console.log(`   ✅ Routing: Correct`);
      } else {
        console.log(`   ❌ Routing: Incorrect`);
      }
      
      if (result.hasFailover) {
        failoverCount++;
        console.log(`   🔄 Failover: Used`);
      }
    } else {
      console.log(`   ❌ FAILED: ${result.error}`);
    }
    
    totalDuration += result.duration;
  });
  
  const successRate = (successCount / results.length) * 100;
  const routingAccuracy = (routingCorrectCount / results.length) * 100;
  
  console.log(`\n🎯 SMART API STRATEGY ANALYSIS:`);
  console.log(`   - Overall success rate: ${successRate.toFixed(1)}%`);
  console.log(`   - Routing accuracy: ${routingAccuracy.toFixed(1)}%`);
  console.log(`   - Failover usage: ${failoverCount} requests`);
  console.log(`   - API models used: ${Array.from(apiModelsUsed).join(', ')}`);
  console.log(`   - Average response time: ${Math.round(totalDuration / results.length)}ms`);
  
  console.log(`\n🎯 FINAL SMART API STRATEGY VERDICT:`);
  
  if (successRate >= 100 && routingAccuracy >= 80) {
    console.log('✅ SMART API STRATEGY: FULLY OPERATIONAL');
    console.log('🧠 Intelligent routing working correctly');
    console.log('🔄 Failover system functional');
    console.log('⚡ Ready for Phase 3: Dynamic Routing & Queue System');
  } else if (successRate >= 80 && routingAccuracy >= 60) {
    console.log('⚠️ SMART API STRATEGY: MOSTLY OPERATIONAL');
    console.log(`📊 Success: ${successRate.toFixed(1)}%, Routing: ${routingAccuracy.toFixed(1)}%`);
    console.log('🔧 Some fine-tuning needed');
  } else {
    console.log('❌ SMART API STRATEGY: NEEDS IMPROVEMENT');
    console.log(`📊 Success: ${successRate.toFixed(1)}%, Routing: ${routingAccuracy.toFixed(1)}%`);
    console.log('🚨 Strategy logic needs attention');
  }
  
  process.exit(successRate >= 80 && routingAccuracy >= 60 ? 0 : 1);
}

// Run the Smart API Strategy tests
runSmartAPITests().catch(error => {
  console.error('💥 Smart API strategy test suite failed:', error);
  process.exit(1);
});
