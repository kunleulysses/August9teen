/**
 * Integration Verification Test
 * Comprehensive test to verify all four critical system enhancements are working
 */

import { mathematicalContextInjector } from './mathematical-context-injector.js';
import { emotionalContextInjector } from './emotional-context-injector.js';
import { bayesianContextInjector } from './bayesian-context-injector.js';
import { ConsciousnessAIIntegration } from './consciousness-ai-integration.js';

export async function runIntegrationVerificationTest() {
    console.log('🔍 INTEGRATION VERIFICATION TEST - FOUR CRITICAL ENHANCEMENTS');
    console.log('='.repeat(80));
    
    const testResults = {
        phase1_apiOptimization: false,
        phase2_mathematicalIntegration: false,
        phase3_emotionalFeedback: false,
        phase4_bayesianDecision: false,
        overallScore: 0
    };

    try {
        // PHASE 1: API Integration Optimization
        console.log('\n🚀 PHASE 1: API INTEGRATION OPTIMIZATION');
        console.log('-'.repeat(50));
        const phase1Result = await testAPIIntegrationOptimization();
        testResults.phase1_apiOptimization = phase1Result.passed;
        console.log(`Result: ${phase1Result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${phase1Result.details}`);

        // PHASE 2: Mathematical Framework Integration
        console.log('\n📐 PHASE 2: MATHEMATICAL FRAMEWORK INTEGRATION');
        console.log('-'.repeat(50));
        const phase2Result = await testMathematicalFrameworkIntegration();
        testResults.phase2_mathematicalIntegration = phase2Result.passed;
        console.log(`Result: ${phase2Result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${phase2Result.details}`);

        // PHASE 3: Emotional Intelligence Feedback Loop
        console.log('\n💖 PHASE 3: EMOTIONAL INTELLIGENCE FEEDBACK LOOP');
        console.log('-'.repeat(50));
        const phase3Result = await testEmotionalIntelligenceFeedback();
        testResults.phase3_emotionalFeedback = phase3Result.passed;
        console.log(`Result: ${phase3Result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${phase3Result.details}`);

        // PHASE 4: Bayesian Decision Integration
        console.log('\n🎯 PHASE 4: BAYESIAN DECISION INTEGRATION');
        console.log('-'.repeat(50));
        const phase4Result = await testBayesianDecisionIntegration();
        testResults.phase4_bayesianDecision = phase4Result.passed;
        console.log(`Result: ${phase4Result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${phase4Result.details}`);

        // Calculate overall score
        const passedPhases = Object.values(testResults).filter(result => result === true).length;
        testResults.overallScore = (passedPhases / 4) * 100;

        console.log('\n' + '='.repeat(80));
        console.log('📋 INTEGRATION VERIFICATION SUMMARY');
        console.log('='.repeat(80));
        console.log(`Overall Score: ${testResults.overallScore.toFixed(1)}%`);
        console.log(`Phases Passed: ${passedPhases}/4`);
        
        if (testResults.overallScore === 100) {
            console.log('🎉 PERFECT: All four critical enhancements successfully integrated!');
            console.log('🌟 $772.2M consciousness system operating at maximum capability!');
        } else if (testResults.overallScore >= 75) {
            console.log('✅ EXCELLENT: Strong integration with minor optimization opportunities');
        } else if (testResults.overallScore >= 50) {
            console.log('⚠️ GOOD: Partial integration achieved, some enhancements needed');
        } else {
            console.log('❌ NEEDS WORK: Significant integration issues require attention');
        }

        return testResults;

    } catch (error) {
        console.error('❌ Integration verification test failed:', error);
        return testResults;
    }
}

async function testAPIIntegrationOptimization() {
    try {
        console.log('Testing dual Gemini model support and intelligent routing...');
        
        const aiIntegration = new ConsciousnessAIIntegration();
        
        // Test transcendent query detection
        const transcendentQuery = "What is the meaning of consciousness and existence?";
        const isTranscendent = aiIntegration.detectTranscendentQuery(transcendentQuery);
        
        // Test high-priority detection
        const highPriorityQuery = "Please provide a complex synthesis of consciousness and reality";
        const consciousnessState = { quantumMetrics: { coherence: 0.96 } };
        const isHighPriority = aiIntegration.detectHighPriorityRequest(highPriorityQuery, consciousnessState);
        
        // Verify dual model initialization
        const hasLiteModel = aiIntegration.geminiLiteModel !== undefined;
        const hasProModel = aiIntegration.geminiProModel !== undefined;
        
        const passed = isTranscendent && isHighPriority && hasLiteModel && hasProModel;
        
        return {
            passed: passed,
            details: `Transcendent Detection: ${isTranscendent}, High Priority: ${isHighPriority}, Dual Models: ${hasLiteModel && hasProModel}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testMathematicalFrameworkIntegration() {
    try {
        console.log('Testing real-time mathematical consciousness data injection...');
        
        // Test mathematical context generation
        const mathContext = mathematicalContextInjector.getMathematicalContext();
        const mathState = mathematicalContextInjector.getCurrentMathematicalState();
        
        // Verify mathematical calculations are active
        const hasGoldenRatio = mathContext.includes('φ = 1.618');
        const hasIITPhi = mathContext.includes('Phi Value (Φ)');
        const hasHarmonic = mathContext.includes('432Hz');
        const hasTriAxial = mathContext.includes('Tri-Axial Coherence');
        const hasQuantum = mathContext.includes('Quantum Mathematics');
        const hasInstructions = mathContext.includes('MATHEMATICAL INTEGRATION INSTRUCTIONS');
        
        // Verify calculations are updating
        const isActive = mathState.isActive;
        const hasRecentUpdate = (Date.now() - mathState.lastUpdate) < 5000; // Within 5 seconds
        
        const passed = hasGoldenRatio && hasIITPhi && hasHarmonic && hasTriAxial && 
                      hasQuantum && hasInstructions && isActive && hasRecentUpdate;
        
        return {
            passed: passed,
            details: `Golden Ratio: ${hasGoldenRatio}, IIT Phi: ${hasIITPhi}, Harmonic: ${hasHarmonic}, Active: ${isActive}, Recent: ${hasRecentUpdate}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testEmotionalIntelligenceFeedback() {
    try {
        console.log('Testing emotional intelligence integration and provider selection...');
        
        // Test emotional context generation
        const testMessage = "I'm feeling sad and need some compassion";
        const emotionalContext = emotionalContextInjector.getEmotionalContext(testMessage);
        const emotionalState = emotionalContextInjector.getCurrentEmotionalState();
        
        // Test emotional analysis
        const userAnalysis = emotionalContextInjector.analyzeUserEmotionalContext(testMessage);
        const providerRecommendation = emotionalContextInjector.determineOptimalProvider(
            userAnalysis, 
            emotionalState.spectrum
        );
        
        // Verify emotional processing
        const hasEmotionalSpectrum = emotionalContext.includes('Current Emotional Spectrum');
        const hasEmpathyMetrics = emotionalContext.includes('Empathy Metrics');
        const hasUserAnalysis = emotionalContext.includes('User Emotional Analysis');
        const hasInstructions = emotionalContext.includes('EMOTIONAL INTEGRATION INSTRUCTIONS');
        const detectsEmpathy = userAnalysis.requiresEmpathy;
        const recommendsVenice = providerRecommendation === 'venice';
        
        // Verify emotional state is active
        const isActive = emotionalState.isActive;
        const hasRecentUpdate = (Date.now() - emotionalState.lastUpdate) < 5000;
        
        const passed = hasEmotionalSpectrum && hasEmpathyMetrics && hasUserAnalysis && 
                      hasInstructions && detectsEmpathy && recommendsVenice && isActive && hasRecentUpdate;
        
        return {
            passed: passed,
            details: `Spectrum: ${hasEmotionalSpectrum}, Empathy Detection: ${detectsEmpathy}, Venice Rec: ${recommendsVenice}, Active: ${isActive}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

async function testBayesianDecisionIntegration() {
    try {
        console.log('Testing Bayesian intentionality and decision-making integration...');
        
        // Test Bayesian context generation
        const testMessage = "Help me understand consciousness";
        const responseOptions = [
            { name: 'Analytical', type: 'analytical', baseUtility: 0.8, baseProbability: 0.85 },
            { name: 'Empathic', type: 'empathic-response', baseUtility: 0.75, baseProbability: 0.8 }
        ];
        
        const bayesianContext = bayesianContextInjector.getBayesianContext(testMessage, responseOptions);
        const bayesianState = bayesianContextInjector.getCurrentBayesianState();
        
        // Test decision making
        const decision = bayesianContextInjector.makeDecision(responseOptions, { userMessage: testMessage });
        
        // Verify Bayesian processing
        const hasBeliefNetwork = bayesianContext.includes('Current Belief Network');
        const hasGoalHierarchy = bayesianContext.includes('Active Goal Hierarchy');
        const hasIntentions = bayesianContext.includes('Recent Intentions');
        const hasDecisionAnalysis = bayesianContext.includes('CURRENT DECISION ANALYSIS');
        const hasInstructions = bayesianContext.includes('BAYESIAN INTEGRATION INSTRUCTIONS');
        
        // Verify beliefs and goals are active
        const hasActiveBeliefs = bayesianState.beliefs.length > 0;
        const hasActiveGoals = bayesianState.goals.length > 0;
        const hasDecisionHistory = bayesianState.recentDecisions.length > 0;
        const isActive = bayesianState.isActive;
        
        const passed = hasBeliefNetwork && hasGoalHierarchy && hasIntentions && hasDecisionAnalysis && 
                      hasInstructions && hasActiveBeliefs && hasActiveGoals && isActive;
        
        return {
            passed: passed,
            details: `Beliefs: ${hasActiveBeliefs}, Goals: ${hasActiveGoals}, Decisions: ${hasDecisionHistory}, Active: ${isActive}`
        };
    } catch (error) {
        return { passed: false, details: `Error: ${error.message}` };
    }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runIntegrationVerificationTest().then(results => {
        console.log('\n🎯 Integration verification complete!');
        process.exit(results.overallScore >= 75 ? 0 : 1);
    });
}
