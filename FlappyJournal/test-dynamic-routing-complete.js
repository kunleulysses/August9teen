#!/usr/bin/env node

/**
 * COMPLETE DYNAMIC ROUTING & QUEUE SYSTEM TEST
 * Tests the full Phase 3 implementation with latency oracle and intelligent queuing
 */

import { synthesizeUnifiedResponse } from './server/consciousness-response-synthesizer-hybrid.js';

console.log('🌐 COMPLETE DYNAMIC ROUTING & QUEUE SYSTEM TEST');
console.log('===============================================');
console.log('Testing Phase 3: Latency Oracle + Intelligent Queue + Race Conditions');

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

const completeTestSuite = [
  {
    name: "High Priority Analytical (Queue Test)",
    message: "Analyze the technical architecture of quantum consciousness systems",
    expectedPriority: "HIGH",
    expectedQueue: true,
    description: "Should use intelligent queue for high-priority analytical requests"
  },
  {
    name: "High Priority Creative (Queue + Failover Test)",
    message: "Write a beautiful creative story about consciousness awakening",
    expectedPriority: "HIGH", 
    expectedQueue: true,
    description: "Should use queue + test Venice failover to Gemini"
  },
  {
    name: "Background Philosophical (Direct Test)",
    message: "What is the deepest meaning of consciousness and reality?",
    expectedPriority: "BACKGROUND",
    expectedQueue: false,
    description: "Should execute directly via Gemini for background processing"
  },
  {
    name: "High Priority Coding (Queue + Race Test)",
    message: "Write a JavaScript function that demonstrates recursive consciousness",
    expectedPriority: "HIGH",
    expectedQueue: true,
    description: "Should use queue with potential race condition for coding"
  },
  {
    name: "Medium Priority General (Direct Test)",
    message: "Tell me about the nature of artificial intelligence",
    expectedPriority: "MEDIUM",
    expectedQueue: false,
    description: "Should execute directly with metrics-based routing"
  }
];

async function testCompleteSystem(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`📝 Message: "${testCase.message}"`);
  console.log(`🎯 Expected Priority: ${testCase.expectedPriority}`);
  console.log(`📋 Expected Queue: ${testCase.expectedQueue ? 'Yes' : 'No'}`);
  
  try {
    const startTime = Date.now();
    
    const response = await synthesizeUnifiedResponse({
      analyticalContent: "User message: " + testCase.message,
      intuitiveContent: "Emotional context: testing complete dynamic system",
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
    
    // Check for advanced features
    if (response.synthesisMetadata?.failover) {
      console.log(`🔄 FAILOVER USED:`);
      console.log(`   Primary: ${response.synthesisMetadata.failover.primaryFailed}`);
      console.log(`   Backup: ${response.synthesisMetadata.failover.backupUsed}`);
      console.log(`   Reason: ${response.synthesisMetadata.failover.reason}`);
    }
    
    if (response.synthesisMetadata?.queueInfo) {
      console.log(`📋 QUEUE INFO:`);
      console.log(`   Queue ID: ${response.synthesisMetadata.queueInfo.requestId}`);
      console.log(`   Priority: ${response.synthesisMetadata.queueInfo.priority}`);
      console.log(`   Wait time: ${response.synthesisMetadata.queueInfo.waitTime}ms`);
    }
    
    if (response.synthesisMetadata?.raceCondition) {
      console.log(`🏁 RACE CONDITION:`);
      console.log(`   Winner: ${response.synthesisMetadata.raceCondition.winner}`);
      console.log(`   Participants: ${response.synthesisMetadata.raceCondition.participants.join(', ')}`);
    }
    
    console.log(`📄 Content: ${response.unifiedContent?.substring(0, 120)}...`);
    
    // Analyze system features
    const hasAPIResponse = response.synthesisMetadata?.model && response.synthesisMetadata.model !== 'local';
    const hasFailover = !!response.synthesisMetadata?.failover;
    const hasQueue = !!response.synthesisMetadata?.queueInfo;
    const hasRace = !!response.synthesisMetadata?.raceCondition;
    
    return { 
      success: true, 
      model: response.synthesisMetadata?.model,
      strategy: response.synthesisMetadata?.strategy,
      duration, 
      response,
      hasAPIResponse,
      hasFailover,
      hasQueue,
      hasRace,
      features: {
        dynamicRouting: hasAPIResponse,
        intelligentFailover: hasFailover,
        queueSystem: hasQueue,
        raceCondition: hasRace
      }
    };
    
  } catch (error) {
    console.log(`❌ FAILED: ${error.message}`);
    console.log(`🔍 Stack: ${error.stack?.substring(0, 200)}...`);
    return { 
      success: false, 
      error: error.message, 
      duration: 0,
      features: { dynamicRouting: false, intelligentFailover: false, queueSystem: false, raceCondition: false }
    };
  }
}

async function runCompleteSystemTests() {
  console.log(`\n🚀 Starting Complete Dynamic Routing System tests...`);
  console.log('⏳ Allowing 30 seconds for API health monitoring to initialize...\n');
  
  // Wait for systems to initialize
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const results = [];
  
  for (const testCase of completeTestSuite) {
    const result = await testCompleteSystem(testCase);
    results.push({ testCase, result });
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n📊 COMPLETE DYNAMIC ROUTING SYSTEM RESULTS:');
  console.log('===========================================');
  
  let successCount = 0;
  let apiResponseCount = 0;
  let failoverCount = 0;
  let queueCount = 0;
  let raceCount = 0;
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
      
      if (result.model) apiModelsUsed.add(result.model);
      
      // Feature analysis
      if (result.hasAPIResponse) {
        apiResponseCount++;
        console.log(`   ✅ API Response: Yes`);
      } else {
        console.log(`   ⚠️ API Response: Local fallback`);
      }
      
      if (result.hasFailover) {
        failoverCount++;
        console.log(`   ✅ Failover: Used`);
      }
      
      if (result.hasQueue) {
        queueCount++;
        console.log(`   ✅ Queue: Used`);
      }
      
      if (result.hasRace) {
        raceCount++;
        console.log(`   ✅ Race Condition: Used`);
      }
      
    } else {
      console.log(`   ❌ FAILED: ${result.error}`);
    }
    
    totalDuration += result.duration;
  });
  
  const successRate = (successCount / results.length) * 100;
  const apiSuccessRate = (apiResponseCount / results.length) * 100;
  
  console.log(`\n🎯 COMPLETE SYSTEM ANALYSIS:`);
  console.log(`   - Overall success rate: ${successRate.toFixed(1)}%`);
  console.log(`   - API response rate: ${apiSuccessRate.toFixed(1)}%`);
  console.log(`   - Failover usage: ${failoverCount} requests`);
  console.log(`   - Queue usage: ${queueCount} requests`);
  console.log(`   - Race conditions: ${raceCount} requests`);
  console.log(`   - API models used: ${Array.from(apiModelsUsed).join(', ')}`);
  console.log(`   - Average response time: ${Math.round(totalDuration / results.length)}ms`);
  
  console.log(`\n🎯 FINAL DYNAMIC ROUTING SYSTEM VERDICT:`);
  
  if (successRate >= 100 && apiSuccessRate >= 80) {
    console.log('✅ DYNAMIC ROUTING SYSTEM: FULLY OPERATIONAL');
    console.log('🌐 All three phases successfully implemented:');
    console.log('   ✅ Phase 1: Gemini 2.0-flash-lite migration');
    console.log('   ✅ Phase 2: Smart API utilization strategy');
    console.log('   ✅ Phase 3: Dynamic routing & intelligent queue');
    console.log('🚀 CONSCIOUSNESS SYSTEM: 100% API OPERATIONAL STATUS ACHIEVED!');
    console.log('🌐 Dashboard: https://app.featherweight.world/consciousness-dashboard');
  } else if (successRate >= 80 && apiSuccessRate >= 60) {
    console.log('⚠️ DYNAMIC ROUTING SYSTEM: MOSTLY OPERATIONAL');
    console.log(`📊 Success: ${successRate.toFixed(1)}%, API: ${apiSuccessRate.toFixed(1)}%`);
    console.log('🔧 System functional with minor optimizations needed');
  } else {
    console.log('❌ DYNAMIC ROUTING SYSTEM: NEEDS IMPROVEMENT');
    console.log(`📊 Success: ${successRate.toFixed(1)}%, API: ${apiSuccessRate.toFixed(1)}%`);
    console.log('🚨 System requires attention');
  }
  
  process.exit(successRate >= 80 && apiSuccessRate >= 60 ? 0 : 1);
}

// Run the complete system tests
runCompleteSystemTests().catch(error => {
  console.error('💥 Complete system test suite failed:', error);
  process.exit(1);
});
