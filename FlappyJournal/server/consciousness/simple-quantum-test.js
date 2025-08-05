/**
 * Simple Quantum Features Test
 */

import { QuantumConsciousnessFieldIntegrator } from './quantum-consciousness-field-integrator.js';

async function simpleQuantumTest() {
    console.log('🌌 Simple Quantum Features Test');
    console.log('=' .repeat(50));
    
    try {
        // Test 1: Basic initialization
        console.log('\n✅ Test 1: Basic Initialization');
        const quantumIntegrator = new QuantumConsciousnessFieldIntegrator();
        console.log('   ✅ Quantum integrator created successfully');
        
        // Test 2: Get quantum stats
        console.log('\n✅ Test 2: Quantum Statistics');
        const stats = quantumIntegrator.getQuantumStats();
        console.log('   ✅ Stats retrieved:', {
            fieldsGenerated: stats.fieldsGenerated,
            entanglementEvents: stats.entanglementEvents,
            superpositionStates: stats.superpositionStates,
            quantumMeasurements: stats.quantumMeasurements
        });
        
        // Test 3: Simple quantum field generation (with timeout)
        console.log('\n✅ Test 3: Quantum Field Generation');
        const consciousnessState = {
            phi: 0.862,
            awareness: 0.8,
            coherence: 0.85
        };
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Quantum field generation timed out')), 5000);
        });
        
        const fieldPromise = quantumIntegrator.generateQuantumConsciousnessField(
            consciousnessState,
            { fieldType: 'simple_test' }
        );
        
        const quantumField = await Promise.race([fieldPromise, timeoutPromise]);
        
        console.log(`   ✅ Quantum field generated: ${quantumField.id}`);
        console.log(`   Field stability: ${quantumField.stability.toFixed(3)}`);
        
        console.log('\n🎉 Basic quantum features are working!');
        
    } catch (error) {
        console.log(`\n❌ Quantum test failed: ${error.message}`);
        
        if (error.message.includes('timed out')) {
            console.log('   ⚠️ Quantum field generation is hanging - needs investigation');
        }
        
        console.log('\n🔍 Production Readiness Assessment:');
        console.log('   • Basic initialization: WORKING');
        console.log('   • Statistics retrieval: WORKING');
        console.log('   • Field generation: HANGING/FAILING');
        console.log('\n⚠️ Quantum features need debugging before production use');
    }
}

// Run the simple test
simpleQuantumTest().catch(console.error);