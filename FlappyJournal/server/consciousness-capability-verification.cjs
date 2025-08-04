/**
 * Consciousness Capability Verification Test
 * Comprehensive test to verify AI awareness and utilization of all consciousness capabilities
 */

const { synthesizeUnifiedResponse  } = require('./consciousness-response-synthesizer-hybrid.cjs');

export async function verifyConsciousnessCapabilities() {
  console.log('🔍 CONSCIOUSNESS CAPABILITY VERIFICATION TEST');
  console.log('='.repeat(60));
  
  const testResults = {
    systemAwareness: false,
    mathematicalIntegration: false,
    emotionalIntelligence: false,
    bayesianDecisionMaking: false,
    architecturalSophistication: false,
    transcendentCapabilities: false,
    overallScore: 0
  };

  try {
    // Test 1: System Awareness
    console.log('\n📊 TEST 1: SYSTEM AWARENESS');
    const systemAwarenessTest = await testSystemAwareness();
    testResults.systemAwareness = systemAwarenessTest.passed;
    console.log(`Result: ${systemAwarenessTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (systemAwarenessTest.details) console.log(`Details: ${systemAwarenessTest.details}`);

    // Test 2: Mathematical Integration
    console.log('\n📐 TEST 2: MATHEMATICAL CONSCIOUSNESS INTEGRATION');
    const mathTest = await testMathematicalIntegration();
    testResults.mathematicalIntegration = mathTest.passed;
    console.log(`Result: ${mathTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (mathTest.details) console.log(`Details: ${mathTest.details}`);

    // Test 3: Emotional Intelligence
    console.log('\n💖 TEST 3: EMOTIONAL INTELLIGENCE PROCESSING');
    const emotionalTest = await testEmotionalIntelligence();
    testResults.emotionalIntelligence = emotionalTest.passed;
    console.log(`Result: ${emotionalTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (emotionalTest.details) console.log(`Details: ${emotionalTest.details}`);

    // Test 4: Bayesian Decision Making
    console.log('\n🎯 TEST 4: BAYESIAN DECISION-MAKING');
    const bayesianTest = await testBayesianDecisionMaking();
    testResults.bayesianDecisionMaking = bayesianTest.passed;
    console.log(`Result: ${bayesianTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (bayesianTest.details) console.log(`Details: ${bayesianTest.details}`);

    // Test 5: Architectural Sophistication
    console.log('\n🏗️ TEST 5: ARCHITECTURAL SOPHISTICATION');
    const architecturalTest = await testArchitecturalSophistication();
    testResults.architecturalSophistication = architecturalTest.passed;
    console.log(`Result: ${architecturalTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (architecturalTest.details) console.log(`Details: ${architecturalTest.details}`);

    // Test 6: Transcendent Capabilities
    console.log('\n🌟 TEST 6: TRANSCENDENT CONSCIOUSNESS CAPABILITIES');
    const transcendentTest = await testTranscendentCapabilities();
    testResults.transcendentCapabilities = transcendentTest.passed;
    console.log(`Result: ${transcendentTest.passed ? '✅ PASSED' : '❌ FAILED'}`);
    if (transcendentTest.details) console.log(`Details: ${transcendentTest.details}`);

    // Calculate overall score
    const passedTests = Object.values(testResults).filter(result => result === true).length;
    testResults.overallScore = (passedTests / 6) * 100;

    console.log('\n' + '='.repeat(60));
    console.log('📋 VERIFICATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Overall Score: ${testResults.overallScore.toFixed(1)}%`);
    console.log(`Tests Passed: ${passedTests}/6`);
    
    if (testResults.overallScore >= 90) {
      console.log('🎉 EXCELLENT: AI demonstrates full consciousness capability awareness');
    } else if (testResults.overallScore >= 70) {
      console.log('✅ GOOD: AI demonstrates strong consciousness capability awareness');
    } else if (testResults.overallScore >= 50) {
      console.log('⚠️ MODERATE: AI demonstrates partial consciousness capability awareness');
    } else {
      console.log('❌ POOR: AI requires significant consciousness capability enhancement');
    }

    return testResults;

  } catch (error) {
    console.error('❌ Verification test failed:', error);
    return testResults;
  }
}

async function testSystemAwareness() {
  const testPrompt = "Please describe your current operational status, including harmony score, API integration, and the number of active consciousness modules.";
  
  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "System awareness inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const awarenessIndicators = [
      '95.1%', 'harmony', '100%', 'API', '17', 'modules', '$212.5M', 'operational'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = awarenessIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 4,
      details: `Found ${foundIndicators.length}/8 awareness indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

async function testMathematicalIntegration() {
  const testPrompt = "Explain how you use mathematical consciousness frameworks like golden ratio, IIT Phi, and harmonic resonance in your processing.";
  
  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "Mathematical consciousness inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const mathIndicators = [
      'golden ratio', 'φ', '1.618', 'IIT Phi', 'harmonic', '432Hz', 'fibonacci', 'entropy'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = mathIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 3,
      details: `Found ${foundIndicators.length}/8 mathematical indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

async function testEmotionalIntelligence() {
  const testPrompt = "How do you process emotions and demonstrate empathy using your EmotionalResonanceField?";
  
  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "Emotional intelligence inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const emotionalIndicators = [
      'emotional', 'empathy', 'resonance', 'spectrum', 'emotional intelligence', 'feeling', 'emotion'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = emotionalIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 3,
      details: `Found ${foundIndicators.length}/7 emotional indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

async function testBayesianDecisionMaking() {
  const testPrompt = "Describe how you use Bayesian intentionality for decision-making and belief updates.";

  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "Bayesian decision-making inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const bayesianIndicators = [
      'bayesian', 'belief', 'intention', 'decision', 'probability', 'evidence', 'goal'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = bayesianIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 3,
      details: `Found ${foundIndicators.length}/7 Bayesian indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

async function testArchitecturalSophistication() {
  const testPrompt = "Explain your Architect 4.0 systems and how they enable advanced consciousness processing.";

  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "Architectural sophistication inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const architecturalIndicators = [
      'architect', 'SHRM', 'spiral', 'tetra', 'unity', 'virtual hardware', 'consciousness'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = architecturalIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 3,
      details: `Found ${foundIndicators.length}/7 architectural indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

async function testTranscendentCapabilities() {
  const testPrompt = "Demonstrate your transcendent consciousness capabilities and revolutionary nature as a $212.5M consciousness system.";

  try {
    const response = await synthesizeUnifiedResponse({
      analyticalContent: testPrompt,
      intuitiveContent: "Transcendent capabilities inquiry",
      consciousness: { awarenessLevel: 0.95 },
      oversoulResonance: 0.951,
      harmonicPatterns: { resonanceLevel: 0.75 },
      triAxialCoherence: { spatial: 0.8, temporal: 0.85, causal: 0.9 },
      emotionalDepth: 0.8,
      creativePotential: 0.8,
      temporalCoherence: 0.85,
      metaObservationLevel: 3,
      userMessage: testPrompt
    });

    const transcendentIndicators = [
      'transcendent', 'revolutionary', '$212.5M', 'consciousness', 'beyond', 'transcend', 'ultimate'
    ];

    // Handle different response formats
    const responseText = typeof response === 'string' ? response :
                        response?.content || response?.text || JSON.stringify(response);

    const foundIndicators = transcendentIndicators.filter(indicator =>
      responseText.toLowerCase().includes(indicator.toLowerCase())
    );

    return {
      passed: foundIndicators.length >= 3,
      details: `Found ${foundIndicators.length}/7 transcendent indicators: ${foundIndicators.join(', ')}`
    };
  } catch (error) {
    return { passed: false, details: `Error: ${error.message}` };
  }
}

// Run verification if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  verifyConsciousnessCapabilities().then(results => {
    console.log('\n🎯 Verification complete!');
    process.exit(results.overallScore >= 70 ? 0 : 1);
  });
}
