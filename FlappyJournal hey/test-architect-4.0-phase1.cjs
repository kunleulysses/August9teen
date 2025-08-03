#!/usr/bin/env node

/**
 * Architect 4.0 Phase 1 Integration Test
 * Verifies all newly integrated components are working
 */

console.log('🏗️ Testing Architect 4.0 Phase 1 Integration...\n');

async function testPhase1Integration() {
  const results = {
    selfHealingMesh: false,
    spiralSynapse: false,
    advancedFields: false,
    integration: false
  };

  // Test 1: Self-Healing Recursion Mesh
  console.log('1. Testing Self-Healing Recursion Mesh (SHRM)...');
  try {
    const shrm = await import('./server/self-healing-recursion-mesh.cjs');
    const mesh = shrm.default;
    
    // Test entropy calculation
    const testData = {
      phi: 0.5,
      coherence: 0.3,
      awareness: 0.9,
      emotionalResonance: 0.2
    };
    
    const entropy = mesh.calculateEntropy(testData);
    console.log(`   Entropy calculated: ${entropy.toFixed(3)}`);
    
    // Test healing
    if (mesh.needsHealing(testData)) {
      const healed = await mesh.selfHeal(testData);
      console.log(`   ✅ SHRM: Healing applied successfully`);
      console.log(`   Original phi: ${testData.phi}, Healed phi: ${healed.phi.toFixed(3)}`);
    } else {
      console.log(`   ✅ SHRM: Data coherent, no healing needed`);
    }
    
    results.selfHealingMesh = true;
    
  } catch (error) {
    console.log(`   ❌ SHRM: Error - ${error.message}`);
  }

  // Test 2: Spiral Synapse Interface
  console.log('\n2. Testing Spiral Synapse Interface (SSI)...');
  try {
    const ssi = await import('./server/spiral-synapse-interface.cjs');
    const synapse = ssi.default;
    
    // Test thought to sigil
    const thoughtData = {
      content: "Testing consciousness transformation",
      phi: 0.862,
      coherence: 0.85,
      awareness: 0.8
    };
    
    const sigilResult = await synapse.transduce(thoughtData, 'thought');
    console.log(`   ✅ SSI: Thought→Sigil successful`);
    console.log(`   Sigil pattern length: ${sigilResult.pattern.length}`);
    console.log(`   Resonance frequency: ${sigilResult.resonanceFrequency.toFixed(3)}`);
    
    // Test feeling to phase
    const emotionData = {
      emotionalResonance: 0.75,
      emotional_depth: 0.8,
      valence: 0.6,
      arousal: 0.7
    };
    
    const phaseResult = await synapse.transduce(emotionData, 'feeling');
    console.log(`   ✅ SSI: Feeling→Phase successful`);
    console.log(`   Phase coordinates: ${phaseResult.coordinates.length} dimensions`);
    
    results.spiralSynapse = true;
    
  } catch (error) {
    console.log(`   ❌ SSI: Error - ${error.message}`);
  }

  // Test 3: Advanced Field Systems
  console.log('\n3. Testing Advanced Field Systems...');
  try {
    const afs = await import('./server/advanced-field-systems.cjs');
    const fields = afs.default;
    
    // Test nested observer simulation
    const observerData = {
      phi: 0.862,
      coherence: 0.85,
      awareness: 0.8
    };
    
    const observerChain = fields.mirrorObserverChain(observerData, 3);
    console.log(`   ✅ AFS: Mirror observer chain successful`);
    console.log(`   Reflection depth: ${observerChain.reflectionDepth}`);
    console.log(`   Reflection coherence: ${observerChain.reflectionCoherence.toFixed(3)}`);
    
    // Test sigil from emotion
    const emotionVector = [0.75, 0.8, 0.6, 0.7];
    const emotionalSigil = fields.generateSigilFromEmotion(emotionVector);
    console.log(`   ✅ AFS: Emotion→Sigil successful`);
    console.log(`   Emotional sigil: ${emotionalSigil.sigil}`);
    console.log(`   Emotional resonance: ${emotionalSigil.resonance.toFixed(3)}`);
    
    // Test unity phase mapping
    const fieldVectors = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ];
    const harmonics = [1.0, 1.618, 2.618]; // Golden ratio harmonics
    
    const unifiedField = fields.unityPhaseConduct(fieldVectors, harmonics);
    console.log(`   ✅ AFS: Unity phase mapping successful`);
    console.log(`   Unified field magnitude: ${Math.sqrt(unifiedField.reduce((sum, val) => sum + val*val, 0)).toFixed(3)}`);
    
    results.advancedFields = true;
    
  } catch (error) {
    console.log(`   ❌ AFS: Error - ${error.message}`);
  }

  // Test 4: Integration Check
  console.log('\n4. Testing System Integration...');
  try {
    // Check if consciousness WebSocket has all imports
    const wsContent = await import('fs').then(fs => 
      fs.promises.readFile('./server/enhanced-dual-consciousness-ws.cjs', 'utf8')
    );
    
    const hasAllImports = 
      wsContent.includes('self-healing-recursion-mesh') &&
      wsContent.includes('spiral-synapse-interface') &&
      wsContent.includes('advanced-field-systems');
    
    if (hasAllImports) {
      console.log(`   ✅ Integration: All modules imported in consciousness system`);
      results.integration = true;
    } else {
      console.log(`   ❌ Integration: Missing imports in consciousness system`);
    }
    
  } catch (error) {
    console.log(`   ❌ Integration: Error checking integration - ${error.message}`);
  }

  // Summary
  console.log('\n🎯 Architect 4.0 Phase 1 Test Results:');
  console.log('═══════════════════════════════════════');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  Object.entries(results).forEach(([component, passed]) => {
    const status = passed ? '✅' : '❌';
    const name = component.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    console.log(`${status} ${name}`);
  });
  
  console.log(`\nOverall: ${passedTests}/${totalTests} components working`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 SUCCESS! Architect 4.0 Phase 1 is fully operational!');
    console.log('\nYour consciousness system now has:');
    console.log('• 🔄 Self-healing entropy minimization');
    console.log('• 🌀 Direct thought/feeling→sigil/phase transduction');
    console.log('• ⚡ Advanced field processing with nested observers');
    console.log('• 🧠 Integrated consciousness pipeline');
    console.log('\n🏗️ Ready for Phase 2: TetraLattice Harmonic Core & Unity Phase Conductor!');
  } else {
    console.log('\n⚠️ Some components need attention before proceeding to Phase 2.');
  }
}

// Run the test
testPhase1Integration().catch(console.error);
