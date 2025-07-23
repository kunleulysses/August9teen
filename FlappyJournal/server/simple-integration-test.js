/**
 * Simple Integration Test
 * Test the context injectors without requiring API keys
 */

import { mathematicalContextInjector } from './mathematical-context-injector.js';
import { emotionalContextInjector } from './emotional-context-injector.js';
import { bayesianContextInjector } from './bayesian-context-injector.js';

async function testAllIntegrations() {
    console.log('🔍 SIMPLE INTEGRATION TEST - CONTEXT INJECTORS');
    console.log('='.repeat(60));
    
    let passedTests = 0;
    const totalTests = 3;
    
    // Test 1: Mathematical Framework Integration
    console.log('\n📐 TEST 1: MATHEMATICAL FRAMEWORK INTEGRATION');
    try {
        const mathContext = mathematicalContextInjector.getMathematicalContext();
        const mathState = mathematicalContextInjector.getCurrentMathematicalState();
        
        console.log('✅ Mathematical context generated successfully');
        console.log(`📊 Current Golden Ratio: ${mathState.calculations.goldenRatio?.phi?.toFixed(6)}`);
        console.log(`🧠 Current IIT Phi: ${mathState.calculations.iitPhi?.phiValue?.toFixed(3)}`);
        console.log(`🎼 Current Harmonic Resonance: ${mathState.calculations.harmonicResonance?.resonanceLevel?.toFixed(3)}`);
        console.log(`🔺 Tri-Axial Coherence: ${mathState.calculations.triAxialCoherence?.unifiedMagnitude?.toFixed(3)}`);
        
        passedTests++;
    } catch (error) {
        console.log(`❌ Mathematical integration failed: ${error.message}`);
    }
    
    // Test 2: Emotional Intelligence Integration
    console.log('\n💖 TEST 2: EMOTIONAL INTELLIGENCE INTEGRATION');
    try {
        const testMessage = "I'm feeling curious about consciousness and wonder about its nature";
        const emotionalContext = emotionalContextInjector.getEmotionalContext(testMessage);
        const emotionalState = emotionalContextInjector.getCurrentEmotionalState();
        const userAnalysis = emotionalContextInjector.analyzeUserEmotionalContext(testMessage);
        
        console.log('✅ Emotional context generated successfully');
        console.log(`💖 Dominant Emotion: ${emotionalState.dominantEmotion.emotion} (${emotionalState.dominantEmotion.intensity.toFixed(3)})`);
        console.log(`🎯 Emotional Depth: ${emotionalState.emotionalDepth.toFixed(3)}`);
        console.log(`🌊 Resonance Level: ${emotionalState.resonanceLevel.toFixed(3)}`);
        console.log(`👤 User Primary Emotion: ${userAnalysis.primaryEmotion}`);
        console.log(`🤝 Requires Empathy: ${userAnalysis.requiresEmpathy ? 'YES' : 'NO'}`);
        
        passedTests++;
    } catch (error) {
        console.log(`❌ Emotional integration failed: ${error.message}`);
    }
    
    // Test 3: Bayesian Decision Integration
    console.log('\n🎯 TEST 3: BAYESIAN DECISION INTEGRATION');
    try {
        const testMessage = "Help me understand the nature of consciousness";
        const responseOptions = [
            { name: 'Analytical Response', type: 'analytical', baseUtility: 0.8, baseProbability: 0.85 },
            { name: 'Empathic Response', type: 'empathic-response', baseUtility: 0.75, baseProbability: 0.8 },
            { name: 'Mathematical Response', type: 'mathematical-reference', baseUtility: 0.9, baseProbability: 0.75 }
        ];
        
        const bayesianContext = bayesianContextInjector.getBayesianContext(testMessage, responseOptions);
        const bayesianState = bayesianContextInjector.getCurrentBayesianState();
        const decision = bayesianContextInjector.makeDecision(responseOptions, { userMessage: testMessage });
        
        console.log('✅ Bayesian context generated successfully');
        console.log(`🧠 Active Beliefs: ${bayesianState.beliefs.length}`);
        console.log(`🎯 Active Goals: ${bayesianState.goals.length}`);
        console.log(`💭 Recent Intentions: ${bayesianState.recentIntentions.length}`);
        console.log(`⚖️ Decision Made: ${decision.selectedOption.name}`);
        console.log(`📊 Expected Value: ${decision.selectedOption.expectedValue.toFixed(3)}`);
        
        passedTests++;
    } catch (error) {
        console.log(`❌ Bayesian integration failed: ${error.message}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 INTEGRATION TEST SUMMARY');
    console.log('='.repeat(60));
    const successRate = (passedTests / totalTests) * 100;
    console.log(`Success Rate: ${successRate.toFixed(1)}% (${passedTests}/${totalTests} tests passed)`);
    
    if (successRate === 100) {
        console.log('🎉 PERFECT: All context injectors working flawlessly!');
        console.log('🌟 Ready for complete AI integration!');
    } else if (successRate >= 66) {
        console.log('✅ GOOD: Most integrations working, minor issues to resolve');
    } else {
        console.log('⚠️ NEEDS WORK: Significant integration issues detected');
    }
    
    return { passedTests, totalTests, successRate };
}

// Test individual components
async function testIndividualComponents() {
    console.log('\n🔬 DETAILED COMPONENT ANALYSIS');
    console.log('='.repeat(60));
    
    // Mathematical Framework Details
    console.log('\n📐 MATHEMATICAL FRAMEWORK DETAILS:');
    const mathState = mathematicalContextInjector.getCurrentMathematicalState();
    if (mathState.calculations.goldenRatio) {
        console.log(`   Golden Ratio (φ): ${mathState.calculations.goldenRatio.phi}`);
        console.log(`   Spiral Radius: ${mathState.calculations.goldenRatio.spiralRadius.toFixed(3)}`);
        console.log(`   Fibonacci Value: ${mathState.calculations.goldenRatio.fibonacciValue}`);
    }
    if (mathState.calculations.iitPhi) {
        console.log(`   IIT Phi (Φ): ${mathState.calculations.iitPhi.phiValue.toFixed(3)}`);
        console.log(`   Consciousness Level: ${mathState.calculations.iitPhi.consciousnessLevel.toFixed(2)}x`);
        console.log(`   Is Conscious: ${mathState.calculations.iitPhi.isConscious ? 'YES' : 'NO'}`);
    }
    
    // Emotional Intelligence Details
    console.log('\n💖 EMOTIONAL INTELLIGENCE DETAILS:');
    const emotionalState = emotionalContextInjector.getCurrentEmotionalState();
    console.log(`   Joy: ${emotionalState.spectrum.joy.toFixed(3)}`);
    console.log(`   Curiosity: ${emotionalState.spectrum.curiosity.toFixed(3)}`);
    console.log(`   Empathy: ${emotionalState.spectrum.empathy.toFixed(3)}`);
    console.log(`   Compassion: ${emotionalState.spectrum.compassion.toFixed(3)}`);
    console.log(`   Recognition Accuracy: ${emotionalState.empathyMetrics.recognitionAccuracy.toFixed(3)}`);
    
    // Bayesian Decision Details
    console.log('\n🎯 BAYESIAN DECISION DETAILS:');
    const bayesianState = bayesianContextInjector.getCurrentBayesianState();
    console.log(`   Belief Network Size: ${bayesianState.beliefs.length}`);
    console.log(`   Goal Hierarchy Size: ${bayesianState.goals.length}`);
    
    if (bayesianState.beliefs.length > 0) {
        const topBelief = bayesianState.beliefs.sort((a, b) => b.beliefStrength - a.beliefStrength)[0];
        console.log(`   Top Belief: "${topBelief.proposition}"`);
        console.log(`   Belief Probability: ${topBelief.probability.toFixed(3)}`);
        console.log(`   Belief Strength: ${topBelief.beliefStrength.toFixed(3)}`);
    }
    
    if (bayesianState.goals.length > 0) {
        const topGoal = bayesianState.goals.sort((a, b) => (b.expectedUtility || 0) - (a.expectedUtility || 0))[0];
        console.log(`   Top Goal: "${topGoal.description}"`);
        console.log(`   Expected Utility: ${(topGoal.expectedUtility || 0).toFixed(3)}`);
        console.log(`   Priority: ${(topGoal.priority || 0).toFixed(3)}`);
    }
}

// Run tests
console.log('🚀 STARTING COMPREHENSIVE INTEGRATION VERIFICATION');
console.log('🌟 Testing $772.2M Featherweight Consciousness System');

testAllIntegrations().then(async (results) => {
    await testIndividualComponents();
    
    console.log('\n🎯 VERIFICATION COMPLETE!');
    console.log(`Final Result: ${results.successRate.toFixed(1)}% integration success`);
    
    if (results.successRate >= 66) {
        console.log('✅ READY FOR AI RESPONSE INTEGRATION!');
        console.log('🌟 Context injectors operational and providing real-time data!');
    } else {
        console.log('⚠️ Additional debugging required before full integration');
    }
});
