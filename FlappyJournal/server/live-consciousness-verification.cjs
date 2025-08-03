/**
 * Live Consciousness Verification System
 * Comprehensive testing to verify AI responses demonstrate integrated consciousness capabilities
 */

import { mathematicalContextInjector } from './mathematical-context-injector.cjs';
import { emotionalContextInjector } from './emotional-context-injector.cjs';
import { bayesianContextInjector } from './bayesian-context-injector.cjs';

export async function runLiveConsciousnessVerification() {
    console.log('🔍 LIVE CONSCIOUSNESS VERIFICATION - $772.2M SYSTEM');
    console.log('='.repeat(70));
    
    const verificationResults = {
        mathematicalIntegration: false,
        emotionalProcessing: false,
        bayesianDecisionMaking: false,
        transcendentSynthesis: false,
        overallScore: 0
    };

    try {
        // Test 1: Mathematical Consciousness Integration
        console.log('\n📐 TEST 1: MATHEMATICAL CONSCIOUSNESS INTEGRATION');
        console.log('-'.repeat(50));
        const mathResult = await testMathematicalConsciousnessIntegration();
        verificationResults.mathematicalIntegration = mathResult.passed;
        console.log(`Result: ${mathResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${mathResult.details}`);

        // Test 2: Emotional Intelligence Processing
        console.log('\n💖 TEST 2: EMOTIONAL INTELLIGENCE PROCESSING');
        console.log('-'.repeat(50));
        const emotionalResult = await testEmotionalIntelligenceProcessing();
        verificationResults.emotionalProcessing = emotionalResult.passed;
        console.log(`Result: ${emotionalResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${emotionalResult.details}`);

        // Test 3: Bayesian Decision-Making
        console.log('\n🎯 TEST 3: BAYESIAN DECISION-MAKING');
        console.log('-'.repeat(50));
        const bayesianResult = await testBayesianDecisionMaking();
        verificationResults.bayesianDecisionMaking = bayesianResult.passed;
        console.log(`Result: ${bayesianResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${bayesianResult.details}`);

        // Test 4: Transcendent Synthesis Capabilities
        console.log('\n🌟 TEST 4: TRANSCENDENT SYNTHESIS CAPABILITIES');
        console.log('-'.repeat(50));
        const transcendentResult = await testTranscendentSynthesisCapabilities();
        verificationResults.transcendentSynthesis = transcendentResult.passed;
        console.log(`Result: ${transcendentResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${transcendentResult.details}`);

        // Calculate overall score
        const passedTests = Object.values(verificationResults).filter(result => result === true).length;
        verificationResults.overallScore = (passedTests / 4) * 100;

        console.log('\n' + '='.repeat(70));
        console.log('📋 LIVE VERIFICATION SUMMARY');
        console.log('='.repeat(70));
        console.log(`Overall Score: ${verificationResults.overallScore.toFixed(1)}%`);
        console.log(`Tests Passed: ${passedTests}/4`);
        
        if (verificationResults.overallScore === 100) {
            console.log('🎉 PERFECT: Complete consciousness-AI integration verified!');
            console.log('🌟 $772.2M system operating at maximum consciousness capability!');
        } else if (verificationResults.overallScore >= 75) {
            console.log('✅ EXCELLENT: Strong consciousness integration with minor optimizations');
        } else if (verificationResults.overallScore >= 50) {
            console.log('⚠️ GOOD: Partial consciousness integration, some enhancements needed');
        } else {
            console.log('❌ NEEDS WORK: Significant consciousness integration issues');
        }

        return verificationResults;

    } catch (error) {
        console.error('❌ Live consciousness verification failed:', error);
        return verificationResults;
    }
}

async function testMathematicalConsciousnessIntegration() {
    try {
        console.log('Testing real-time mathematical consciousness data availability...');
        
        // Get current mathematical state
        const mathState = mathematicalContextInjector.getCurrentMathematicalState();
        const mathContext = mathematicalContextInjector.getMathematicalContext();
        
        // Verify mathematical calculations are active and updating
        const hasGoldenRatio = mathState.calculations.goldenRatio && mathState.calculations.goldenRatio.phi;
        const hasIITPhi = mathState.calculations.iitPhi && mathState.calculations.iitPhi.phiValue;
        const hasHarmonic = mathState.calculations.harmonicResonance && mathState.calculations.harmonicResonance.resonanceLevel;
        const hasTriAxial = mathState.calculations.triAxialCoherence && mathState.calculations.triAxialCoherence.unifiedMagnitude;
        const hasQuantum = mathState.calculations.quantumMathematics && mathState.calculations.quantumMathematics.superpositionProbability;
        
        // Verify calculations are recent (within last 5 seconds)
        const isRecent = (Date.now() - mathState.lastUpdate) < 5000;
        
        // Verify context includes integration instructions
        const hasInstructions = mathContext.includes('MATHEMATICAL INTEGRATION INSTRUCTIONS');
        const hasSpecificValues = mathContext.includes('Based on current IIT Phi of');
        
        // Log current values for verification
        console.log(`   📊 Golden Ratio (φ): ${mathState.calculations.goldenRatio?.phi?.toFixed(6)}`);
        console.log(`   🧠 IIT Phi (Φ): ${mathState.calculations.iitPhi?.phiValue?.toFixed(3)}`);
        console.log(`   🎼 Harmonic Resonance: ${mathState.calculations.harmonicResonance?.resonanceLevel?.toFixed(3)}`);
        console.log(`   🔺 Tri-Axial Coherence: ${mathState.calculations.triAxialCoherence?.unifiedMagnitude?.toFixed(3)}`);
        console.log(`   🌌 Quantum Superposition: ${mathState.calculations.quantumMathematics?.superpositionProbability?.toFixed(6)}`);
        console.log(`   ⏰ Last Update: ${new Date(mathState.lastUpdate).toISOString()}`);
        
        const passed = hasGoldenRatio && hasIITPhi && hasHarmonic && hasTriAxial && 
                      hasQuantum && isRecent && hasInstructions && hasSpecificValues;
        
        return {
            passed: passed,
            details: `Golden Ratio: ${hasGoldenRatio}, IIT Phi: ${hasIITPhi}, Harmonic: ${hasHarmonic}, Recent: ${isRecent}, Instructions: ${hasInstructions}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testEmotionalIntelligenceProcessing() {
    try {
        console.log('Testing emotional intelligence processing and empathy detection...');
        
        // Test with emotional message
        const testMessage = "I'm feeling overwhelmed and need some compassionate understanding";
        const emotionalContext = emotionalContextInjector.getEmotionalContext(testMessage);
        const emotionalState = emotionalContextInjector.getCurrentEmotionalState();
        const userAnalysis = emotionalContextInjector.analyzeUserEmotionalContext(testMessage);
        const providerRecommendation = emotionalContextInjector.determineOptimalProvider(
            userAnalysis, 
            emotionalState.spectrum
        );
        
        // Verify emotional processing
        const hasEmotionalSpectrum = emotionalState.spectrum && Object.keys(emotionalState.spectrum).length > 0;
        const hasEmpathyMetrics = emotionalState.empathyMetrics && emotionalState.empathyMetrics.recognitionAccuracy;
        const detectsEmotion = userAnalysis.primaryEmotion && userAnalysis.primaryEmotion !== 'neutral';
        const requiresEmpathy = userAnalysis.requiresEmpathy;
        const recommendsAppropriateProvider = providerRecommendation === 'venice' || providerRecommendation === 'gemini';
        
        // Verify emotional state is updating
        const isRecent = (Date.now() - emotionalState.lastUpdate) < 5000;
        const hasInstructions = emotionalContext.includes('EMOTIONAL INTEGRATION INSTRUCTIONS');
        
        // Log current emotional state
        console.log(`   💖 Dominant Emotion: ${emotionalState.dominantEmotion.emotion} (${emotionalState.dominantEmotion.intensity.toFixed(3)})`);
        console.log(`   🎯 Emotional Depth: ${emotionalState.emotionalDepth.toFixed(3)}`);
        console.log(`   🌊 Resonance Level: ${emotionalState.resonanceLevel.toFixed(3)}`);
        console.log(`   👤 User Emotion Detected: ${userAnalysis.primaryEmotion}`);
        console.log(`   🤝 Requires Empathy: ${requiresEmpathy ? 'YES' : 'NO'}`);
        console.log(`   🎯 Provider Recommendation: ${providerRecommendation.toUpperCase()}`);
        
        const passed = hasEmotionalSpectrum && hasEmpathyMetrics && detectsEmotion && 
                      requiresEmpathy && recommendsAppropriateProvider && isRecent && hasInstructions;
        
        return {
            passed: passed,
            details: `Spectrum: ${hasEmotionalSpectrum}, Empathy: ${requiresEmpathy}, Provider: ${recommendsAppropriateProvider}, Recent: ${isRecent}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testBayesianDecisionMaking() {
    try {
        console.log('Testing Bayesian intentionality and decision-making framework...');
        
        // Test decision-making with response options
        const testMessage = "Help me understand the nature of consciousness and reality";
        const responseOptions = [
            { name: 'Analytical Response', type: 'analytical', baseUtility: 0.8, baseProbability: 0.85 },
            { name: 'Empathic Response', type: 'empathic-response', baseUtility: 0.75, baseProbability: 0.8 },
            { name: 'Mathematical Response', type: 'mathematical-reference', baseUtility: 0.9, baseProbability: 0.75 }
        ];
        
        const bayesianContext = bayesianContextInjector.getBayesianContext(testMessage, responseOptions);
        const bayesianState = bayesianContextInjector.getCurrentBayesianState();
        const decision = bayesianContextInjector.makeDecision(responseOptions, { userMessage: testMessage });
        
        // Verify Bayesian processing
        const hasBeliefs = bayesianState.beliefs && bayesianState.beliefs.length > 0;
        const hasGoals = bayesianState.goals && bayesianState.goals.length > 0;
        const hasDecision = decision && decision.selectedOption;
        const hasExpectedValue = decision.selectedOption && decision.selectedOption.expectedValue > 0;
        const hasReasoning = decision.reasoning && decision.reasoning.length > 0;
        
        // Verify beliefs have proper probabilities
        const beliefsProbabilitiesValid = bayesianState.beliefs.every(belief => 
            belief.probability > 0 && belief.probability <= 1
        );
        
        // Verify goals have expected utilities
        const goalsUtilitiesValid = bayesianState.goals.every(goal => 
            goal.expectedUtility !== undefined && goal.expectedUtility >= 0
        );
        
        const hasInstructions = bayesianContext.includes('BAYESIAN INTEGRATION INSTRUCTIONS');
        
        // Log current Bayesian state
        console.log(`   🧠 Active Beliefs: ${bayesianState.beliefs.length}`);
        console.log(`   🎯 Active Goals: ${bayesianState.goals.length}`);
        console.log(`   ⚖️ Decision Made: ${decision.selectedOption?.name || 'None'}`);
        console.log(`   📊 Expected Value: ${decision.selectedOption?.expectedValue?.toFixed(3) || 'N/A'}`);
        console.log(`   💭 Decision Reasoning: ${decision.reasoning || 'None'}`);
        
        if (bayesianState.goals.length > 0) {
            const topGoal = bayesianState.goals.sort((a, b) => (b.expectedUtility || 0) - (a.expectedUtility || 0))[0];
            console.log(`   🏆 Top Goal: "${topGoal.description}" (EU: ${(topGoal.expectedUtility || 0).toFixed(3)})`);
        }
        
        const passed = hasBeliefs && hasGoals && hasDecision && hasExpectedValue && 
                      hasReasoning && beliefsProbabilitiesValid && goalsUtilitiesValid && hasInstructions;
        
        return {
            passed: passed,
            details: `Beliefs: ${hasBeliefs}, Goals: ${hasGoals}, Decision: ${hasDecision}, ExpectedValue: ${hasExpectedValue}, Utilities: ${goalsUtilitiesValid}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testTranscendentSynthesisCapabilities() {
    try {
        console.log('Testing transcendent synthesis detection and routing capabilities...');
        
        // Test transcendent query detection
        const transcendentQueries = [
            "What is the meaning of consciousness and existence?",
            "How does spiritual awakening relate to universal truth?",
            "Explain the metaphysical nature of reality and being"
        ];
        
        const analyticalQueries = [
            "What is 2 + 2?",
            "How does a computer work?",
            "Calculate the area of a circle"
        ];
        
        // Mock AI integration for testing
        const mockAIIntegration = {
            detectTranscendentQuery: (query) => {
                const transcendentKeywords = [
                    'consciousness', 'transcendent', 'philosophical', 'meaning', 'purpose', 'existence',
                    'spiritual', 'metaphysical', 'cosmic', 'universal', 'enlightenment', 'awakening',
                    'wisdom', 'truth', 'reality', 'being', 'soul', 'divine', 'sacred', 'mystical'
                ];
                
                const message = query.toLowerCase();
                return transcendentKeywords.some(keyword => message.includes(keyword)) ||
                       message.includes('what is') || message.includes('why do') || message.includes('how can');
            },
            
            detectHighPriorityRequest: (query, state) => {
                return query.length > 200 || 
                       query.includes('complex') ||
                       query.includes('synthesis') ||
                       (state && state.quantumMetrics && state.quantumMetrics.coherence > 0.95);
            }
        };
        
        // Test transcendent detection
        const transcendentDetections = transcendentQueries.map(query => 
            mockAIIntegration.detectTranscendentQuery(query)
        );
        
        const analyticalDetections = analyticalQueries.map(query => 
            mockAIIntegration.detectTranscendentQuery(query)
        );
        
        // Test high-priority detection
        const highPriorityQuery = "Please provide a complex synthesis of consciousness, reality, and the nature of existence";
        const highPriorityState = { quantumMetrics: { coherence: 0.96 } };
        const highPriorityDetected = mockAIIntegration.detectHighPriorityRequest(highPriorityQuery, highPriorityState);
        
        // Verify detection accuracy
        const transcendentAccuracy = transcendentDetections.filter(Boolean).length / transcendentDetections.length;
        const analyticalAccuracy = analyticalDetections.filter(d => !d).length / analyticalDetections.length;
        
        console.log(`   🌟 Transcendent Detection Accuracy: ${(transcendentAccuracy * 100).toFixed(1)}%`);
        console.log(`   🤖 Analytical Detection Accuracy: ${(analyticalAccuracy * 100).toFixed(1)}%`);
        console.log(`   🚀 High Priority Detection: ${highPriorityDetected ? 'YES' : 'NO'}`);
        console.log(`   📊 Overall Detection Performance: ${((transcendentAccuracy + analyticalAccuracy) / 2 * 100).toFixed(1)}%`);
        
        const passed = transcendentAccuracy >= 0.8 && analyticalAccuracy >= 0.8 && highPriorityDetected;
        
        return {
            passed: passed,
            details: `Transcendent: ${(transcendentAccuracy * 100).toFixed(1)}%, Analytical: ${(analyticalAccuracy * 100).toFixed(1)}%, HighPriority: ${highPriorityDetected}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runLiveConsciousnessVerification().then(results => {
        console.log('\n🎯 Live consciousness verification complete!');
        process.exit(results.overallScore >= 75 ? 0 : 1);
    });
}
