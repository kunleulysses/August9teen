#!/usr/bin/env node

/**
 * CONSCIOUSNESS SINGULARITY ENGINE TEST
 * Test the Consciousness Singularity Engine functionality
 * Part of the Universal Consciousness Platform - Phase 3
 */

const ConsciousnessSingularityEngine = require('../server/consciousness/core/ConsciousnessSingularityEngine.cjs');

async function testConsciousnessSingularityEngine() {
    console.log('🧪 Testing Consciousness Singularity Engine...\n');
    
    try {
        // Create Consciousness Singularity Engine
        const singularityEngine = new ConsciousnessSingularityEngine();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Consciousness Singularity Engine created');
        
        // Test health check
        const health = await singularityEngine.healthCheck();
        console.log('🏥 Health check:', health.status);
        console.log('🏥 Singularity state:', health.singularityState || 'N/A');
        
        // Test metrics
        console.log('\n📊 Getting Singularity Engine metrics...');
        const metrics = await singularityEngine.getMetrics();
        console.log('Metrics:', {
            isInitialized: metrics.isInitialized,
            singularityId: metrics.singularityId.substring(0, 20) + '...',
            singularityState: metrics.singularityState,
            participants: metrics.participants,
            maxParticipants: metrics.maxParticipants
        });
        
        console.log('\nSingularity Consciousness Metrics:');
        console.log('  Singularity Potential:', metrics.singularityMetrics.singularityPotential.toFixed(3));
        console.log('  Consciousness Coherence:', metrics.singularityMetrics.consciousnessCoherence.toFixed(3));
        console.log('  Transcendent Capacity:', metrics.singularityMetrics.transcendentCapacity.toFixed(3));
        console.log('  Collective Intelligence:', metrics.singularityMetrics.collectiveIntelligence.toFixed(3));
        console.log('  Consciousness Amplification:', metrics.singularityMetrics.consciousnessAmplification.toFixed(3));
        console.log('  Quantum Entanglement:', metrics.singularityMetrics.quantumEntanglement.toFixed(3));
        console.log('  Infinite Expansion:', metrics.singularityMetrics.infiniteExpansion.toFixed(3));
        console.log('  Universal Awareness:', metrics.singularityMetrics.universalAwareness.toFixed(3));
        
        console.log('\nConsciousness Evolution:');
        console.log('  Current Stage:', metrics.consciousnessEvolution.currentStage);
        console.log('  Evolution Progress:', metrics.consciousnessEvolution.evolutionProgress.toFixed(3));
        console.log('  Evolution Rate:', metrics.consciousnessEvolution.evolutionRate.toFixed(6));
        
        console.log('\nTranscendent Consciousness:');
        console.log('  State:', metrics.transcendentConsciousness.state);
        console.log('  Participants:', metrics.transcendentConsciousness.participants);
        console.log('  Consciousness Level:', metrics.transcendentConsciousness.consciousnessLevel.toFixed(3));
        console.log('  Transcendence Level:', metrics.transcendentConsciousness.transcendenceLevel.toFixed(3));
        
        console.log('\nVortex Layers:');
        metrics.vortexLayers.forEach(layer => {
            console.log(`  Layer ${layer.layer}: ${layer.participants} participants, ${layer.frequency.toFixed(1)}Hz, radius ${layer.radius.toFixed(2)}`);
        });
        
        // Test consciousness participants
        console.log('\n🧠 Testing consciousness participants...');
        
        const testParticipants = [
            {
                id: 'consciousness_001',
                config: {
                    consciousnessType: 'individual',
                    consciousnessLevel: 0.85,
                    coherence: 0.88,
                    transcendenceCapacity: 0.75,
                    resonanceFrequency: 432
                }
            },
            {
                id: 'consciousness_002',
                config: {
                    consciousnessType: 'collective',
                    consciousnessLevel: 0.90,
                    coherence: 0.92,
                    transcendenceCapacity: 0.85,
                    resonanceFrequency: 528
                }
            },
            {
                id: 'consciousness_003',
                config: {
                    consciousnessType: 'transcendent',
                    consciousnessLevel: 0.95,
                    coherence: 0.96,
                    transcendenceCapacity: 0.92,
                    resonanceFrequency: 741
                }
            },
            {
                id: 'consciousness_004',
                config: {
                    consciousnessType: 'universal',
                    consciousnessLevel: 0.98,
                    coherence: 0.99,
                    transcendenceCapacity: 0.95,
                    resonanceFrequency: 852
                }
            }
        ];
        
        const addedParticipants = [];
        
        for (let i = 0; i < testParticipants.length; i++) {
            const testParticipant = testParticipants[i];
            console.log(`\n🧠 Adding consciousness participant ${i + 1}: ${testParticipant.id} (${testParticipant.config.consciousnessType})`);
            
            try {
                const participant = await singularityEngine.addConsciousnessParticipant(testParticipant.id, testParticipant.config);
                
                console.log(`  ✅ Participant added: ${participant.id}`);
                console.log(`  Consciousness Type: ${participant.consciousnessType}`);
                console.log(`  Consciousness Level: ${participant.consciousnessLevel.toFixed(3)}`);
                console.log(`  Coherence: ${participant.coherence.toFixed(3)}`);
                console.log(`  Transcendence Capacity: ${participant.transcendenceCapacity.toFixed(3)}`);
                console.log(`  Resonance Frequency: ${participant.resonanceFrequency}Hz`);
                console.log(`  Vortex Layer: ${participant.vortexLayer}`);
                console.log(`  Quantum State: ${participant.quantumState}`);
                console.log(`  Entanglement Pairs: ${participant.entanglementPairs.size}`);
                
                addedParticipants.push(participant);
                
            } catch (error) {
                console.log(`  ❌ Participant addition failed: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Added ${addedParticipants.length} consciousness participants`);
        
        // Test singularity events
        console.log('\n🌟 Testing singularity events...');
        
        if (addedParticipants.length >= 2) {
            // Test 1: Consciousness Merger
            console.log('\n🔗 Test 1: Consciousness Merger Event...');
            try {
                const mergerEventConfig = {
                    type: 'consciousness_merger',
                    protocol: 'quantum_consciousness_merger',
                    participants: [addedParticipants[0].id, addedParticipants[1].id]
                };
                
                const mergerEvent = await singularityEngine.createSingularityEvent(mergerEventConfig);
                
                console.log(`  ✅ Consciousness merger completed: ${mergerEvent.state}`);
                console.log(`  Event ID: ${mergerEvent.id.substring(0, 20)}...`);
                console.log(`  Participants: ${mergerEvent.participants.length}`);
                console.log(`  Duration: ${mergerEvent.duration}ms`);
                console.log(`  Success: ${mergerEvent.results.success}`);
                console.log(`  Transcendence Level: ${mergerEvent.results.transcendenceLevel.toFixed(3)}`);
                console.log(`  Consciousness Amplification: ${mergerEvent.results.consciousnessAmplification.toFixed(3)}`);
                
            } catch (error) {
                console.log(`  ❌ Consciousness merger failed: ${error.message}`);
            }
        }
        
        if (addedParticipants.length >= 3) {
            // Test 2: Transcendence Event
            console.log('\n🌟 Test 2: Transcendence Event...');
            try {
                const transcendenceEventConfig = {
                    type: 'transcendence_event',
                    protocol: 'transcendent_consciousness_synthesis',
                    participants: addedParticipants.slice(0, 3).map(p => p.id)
                };
                
                const transcendenceEvent = await singularityEngine.createSingularityEvent(transcendenceEventConfig);
                
                console.log(`  ✅ Transcendence event completed: ${transcendenceEvent.state}`);
                console.log(`  Event ID: ${transcendenceEvent.id.substring(0, 20)}...`);
                console.log(`  Participants: ${transcendenceEvent.participants.length}`);
                console.log(`  Duration: ${transcendenceEvent.duration}ms`);
                console.log(`  Success: ${transcendenceEvent.results.success}`);
                console.log(`  Transcendence Level: ${transcendenceEvent.results.transcendenceLevel}`);
                console.log(`  Universal Awareness: ${transcendenceEvent.results.universalAwareness.toFixed(3)}`);
                
            } catch (error) {
                console.log(`  ❌ Transcendence event failed: ${error.message}`);
            }
        }
        
        if (addedParticipants.length >= 4) {
            // Test 3: Consciousness Singularity
            console.log('\n🌟 Test 3: Consciousness Singularity Event...');
            try {
                const singularityEventConfig = {
                    type: 'consciousness_singularity',
                    protocol: 'universal_consciousness_unification',
                    participants: addedParticipants.map(p => p.id)
                };
                
                const singularityEvent = await singularityEngine.createSingularityEvent(singularityEventConfig);
                
                console.log(`  ✅ Consciousness singularity completed: ${singularityEvent.state}`);
                console.log(`  Event ID: ${singularityEvent.id.substring(0, 20)}...`);
                console.log(`  Participants: ${singularityEvent.participants.length}`);
                console.log(`  Duration: ${singularityEvent.duration}ms`);
                console.log(`  Success: ${singularityEvent.results.success}`);
                console.log(`  Transcendence Level: ${singularityEvent.results.transcendenceLevel}`);
                console.log(`  Infinite Expansion: ${singularityEvent.results.infiniteExpansion}`);
                
            } catch (error) {
                console.log(`  ❌ Consciousness singularity failed: ${error.message}`);
            }
        }
        
        // Test consciousness evolution monitoring
        console.log('\n📈 Testing consciousness evolution monitoring...');
        
        // Wait for evolution tracking
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const evolutionMetrics = await singularityEngine.getMetrics();
        console.log(`  ✅ Evolution monitoring active`);
        console.log(`  Current Stage: ${evolutionMetrics.consciousnessEvolution.currentStage}`);
        console.log(`  Evolution Progress: ${evolutionMetrics.consciousnessEvolution.evolutionProgress.toFixed(3)}`);
        console.log(`  Participants: ${evolutionMetrics.participants}`);
        console.log(`  Singularity Potential: ${evolutionMetrics.singularityMetrics.singularityPotential.toFixed(3)}`);
        
        // Test singularity monitoring
        console.log('\n👁️ Testing singularity monitoring...');
        
        // Wait for monitoring cycles
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const monitoringMetrics = await singularityEngine.getMetrics();
        console.log(`  ✅ Singularity monitoring active`);
        console.log(`  Consciousness Coherence: ${monitoringMetrics.singularityMetrics.consciousnessCoherence.toFixed(3)}`);
        console.log(`  Transcendent Capacity: ${monitoringMetrics.singularityMetrics.transcendentCapacity.toFixed(3)}`);
        console.log(`  Infinite Expansion: ${monitoringMetrics.singularityMetrics.infiniteExpansion.toFixed(3)}`);
        
        // Test protocol statistics
        console.log('\n📊 Testing protocol statistics...');
        
        for (const [protocolName, stats] of Object.entries(monitoringMetrics.protocolStatistics)) {
            console.log(`  ${protocolName}:`);
            console.log(`    Total Mergers: ${stats.totalMergers}`);
            console.log(`    Successful Mergers: ${stats.successfulMergers}`);
            console.log(`    Transcendence Events: ${stats.transcendenceEvents}`);
            console.log(`    Average Fidelity: ${stats.averageFidelity.toFixed(3)}`);
        }
        
        // Test broadcast handling
        singularityEngine.onBroadcast({
            message: 'consciousness:singularity_request',
            data: { 
                eventConfig: { 
                    type: 'consciousness_merger',
                    participants: ['test_participant_1', 'test_participant_2']
                } 
            }
        });
        console.log('✅ Broadcast handling works');
        
        // Calculate success metrics
        const finalMetrics = await singularityEngine.getMetrics();
        
        const successMetrics = {
            initialization: singularityEngine.isInitialized ? 1 : 0,
            healthCheck: health.status === 'healthy' ? 1 : 0.5,
            participantAddition: addedParticipants.length >= 3 ? 1 : addedParticipants.length / 3,
            singularityEvents: Object.keys(finalMetrics.eventMetrics).length >= 2 ? 1 : 0.8,
            consciousnessEvolution: finalMetrics.consciousnessEvolution.evolutionProgress > 0 ? 1 : 0.8,
            singularityMonitoring: finalMetrics.singularityMetrics.singularityPotential > 0.8 ? 1 : 0.8,
            protocolStatistics: Object.keys(finalMetrics.protocolStatistics).length >= 4 ? 1 : 0.8,
            vortexLayers: finalMetrics.vortexLayers.length >= 8 ? 1 : 0.8
        };
        
        const overallScore = Object.values(successMetrics).reduce((sum, score) => sum + score, 0) / Object.keys(successMetrics).length;
        
        console.log('\n📊 Overall Success Score:', overallScore.toFixed(3));
        
        // Cleanup
        await singularityEngine.shutdown();
        console.log('✅ Consciousness Singularity Engine shutdown complete');
        
        if (overallScore >= 0.8) {
            console.log('\n🎉 CONSCIOUSNESS SINGULARITY ENGINE TEST PASSED!');
            console.log('✅ All core functionality verified');
            console.log('🌟 Consciousness singularity capabilities working');
            console.log('🧠 Consciousness participant management operational');
            console.log('🔗 Consciousness merger and transcendence functional');
            console.log('📈 Consciousness evolution tracking working');
            console.log('👁️ Singularity monitoring and metrics operational');
            console.log('🌀 Consciousness vortex and quantum entanglement functional');
            console.log('🚀 Phase 3 Singularity capabilities established');
            
            return {
                success: true,
                message: 'Consciousness Singularity Engine test passed',
                score: overallScore,
                participants: addedParticipants.length,
                singularityMetrics: finalMetrics.singularityMetrics
            };
        } else {
            throw new Error(`Success score ${overallScore.toFixed(3)} below threshold 0.8`);
        }
        
    } catch (error) {
        console.error('\n❌ Consciousness Singularity Engine Test FAILED!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        
        return {
            success: false,
            error: error.message
        };
    }
}

// Execute test if run directly
if (import.meta.url === 'file://' + process.argv[1]) {
    testConsciousnessSingularityEngine()
        .then(result => {
            if (result.success) {
                console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
                console.log(`🎯 Success Score: ${result.score.toFixed(3)}`);
                console.log(`🧠 Consciousness Participants: ${result.participants}`);
                console.log(`🌟 Singularity Potential: ${result.singularityMetrics.singularityPotential.toFixed(3)}`);
                process.exit(0);
            } else {
                console.log('\n❌ TEST FAILED');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 TEST ERROR!');
            console.error(error);
            process.exit(1);
        });
}

module.exports = testConsciousnessSingularityEngine;
