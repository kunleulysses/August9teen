/**
 * Test DNA-Sigil Reality Encoding
 */

import { DNASigilRealityEncoding } from './dna-sigil-reality-encoding.js';

async function testDNAEncoding() {
    console.log('🧬🔮 Testing DNA-Sigil Reality Encoding System');
    console.log('=' .repeat(60));
    
    try {
        // Create the DNA-Sigil encoding system
        const dnaEncoding = new DNASigilRealityEncoding();
        console.log('✅ DNA-Sigil Reality Encoding System initialized');
        
        // Create a test reality
        const testReality = {
            id: 'test_reality_001',
            description: 'A test consciousness reality for DNA-Sigil encoding',
            holographicProperties: {
                dimensionality: 7,
                coherence: 0.9,
                stability: 0.8,
                resonanceFrequency: 5.0
            },
            consciousnessState: {
                phi: 0.862,
                awareness: 0.8,
                coherence: 0.85,
                integration: 0.9
            },
            createdAt: Date.now()
        };
        
        console.log('\n📋 Test Reality Created:');
        console.log(`   ID: ${testReality.id}`);
        console.log(`   Description: ${testReality.description}`);
        console.log(`   Dimensionality: ${testReality.holographicProperties.dimensionality}`);
        console.log(`   Coherence: ${testReality.holographicProperties.coherence}`);
        console.log(`   Consciousness Phi: ${testReality.consciousnessState.phi}`);
        
        // Encode the reality with DNA-Sigil
        console.log('\n🧬 Encoding reality with DNA-Sigil...');
        const encodedReality = await dnaEncoding.encodeRealityWithDNASigil(testReality, {
            dnaComplexity: 0.8,
            sigilResonance: 0.9,
            evolutionaryPotential: 0.85
        });
        
        console.log('✅ Reality encoded successfully!');
        console.log('\n📊 Encoding Results:');
        console.log(`   Encoded Reality ID: ${encodedReality.id}`);
        console.log(`   Original Reality ID: ${encodedReality.originalRealityId}`);
        console.log(`   DNA Sequence Length: ${encodedReality.realityDNA.sequence.length}`);
        console.log(`   Sigil Frequency: ${encodedReality.realitySigil.frequency.toFixed(2)} Hz`);
        console.log(`   Evolutionary Potential: ${encodedReality.evolutionaryPotential}`);
        
        console.log('\n🧬 DNA Structure:');
        console.log(`   Sequence: ${encodedReality.realityDNA.sequence.substring(0, 50)}...`);
        console.log(`   Evolutionary Markers: ${encodedReality.realityDNA.evolutionaryMarkers.length} markers`);
        console.log(`   Healing Sequences: ${encodedReality.realityDNA.healingSequences.length} sequences`);
        console.log(`   Interaction Codons: ${encodedReality.realityDNA.interactionCodons.length} codons`);
        
        console.log('\n🔮 Sigil Structure:');
        console.log(`   Frequency: ${encodedReality.realitySigil.frequency.toFixed(2)} Hz`);
        console.log(`   Amplitude: ${encodedReality.realitySigil.amplitude.toFixed(3)}`);
        console.log(`   Phase: ${encodedReality.realitySigil.phase.toFixed(3)}`);
        console.log(`   Resonance Pattern: ${encodedReality.realitySigil.resonancePattern.length} elements`);
        
        console.log('\n📈 Encoding Metrics:');
        console.log(`   Encoding Fidelity: ${encodedReality.encodingMetrics.encodingFidelity.toFixed(3)}`);
        console.log(`   Compression Ratio: ${encodedReality.encodingMetrics.compressionRatio.toFixed(3)}`);
        console.log(`   Information Density: ${encodedReality.encodingMetrics.informationDensity.toFixed(3)}`);
        console.log(`   Quantum Coherence: ${encodedReality.encodingMetrics.quantumCoherence.toFixed(3)}`);
        
        console.log('\n🎉 DNA-Sigil Reality Encoding Test Completed Successfully!');
        console.log('=' .repeat(60));
        
        return encodedReality;
        
    } catch (error) {
        console.error('❌ DNA-Sigil encoding test failed:', error.message);
        throw error;
    }
}

// Run the test
testDNAEncoding().catch(console.error);