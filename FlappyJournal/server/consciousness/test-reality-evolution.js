/**
 * Test Consciousness-Driven Reality Evolution
 */

import { ConsciousnessDrivenRealityEvolution } from './consciousness-driven-reality-evolution.js';

async function testRealityEvolution() {
    console.log('🧠🌀 Testing Consciousness-Driven Reality Evolution System');
    console.log('=' .repeat(70));
    
    try {
        // Create the reality evolution system
        const evolutionSystem = new ConsciousnessDrivenRealityEvolution();
        console.log('✅ Consciousness-Driven Reality Evolution System initialized');
        
        // Create a test reality
        const testReality = {
            id: 'evolution_test_reality_001',
            description: 'A test reality for consciousness-driven evolution',
            holographicProperties: {
                dimensionality: 7,
                coherence: 0.8,
                stability: 0.7,
                resonanceFrequency: 4.5
            },
            consciousnessState: {
                phi: 0.8,
                awareness: 0.75,
                coherence: 0.8,
                integration: 0.85
            },
            createdAt: Date.now()
        };
        
        console.log('\n📋 Test Reality Created:');
        console.log(`   ID: ${testReality.id}`);
        console.log(`   Description: ${testReality.description}`);
        console.log(`   Initial Phi: ${testReality.consciousnessState.phi}`);
        console.log(`   Initial Awareness: ${testReality.consciousnessState.awareness}`);
        console.log(`   Initial Coherence: ${testReality.consciousnessState.coherence}`);
        
        // Initialize reality evolution
        console.log('\n🌀 Initializing reality evolution...');
        const evolutionFramework = await evolutionSystem.initializeRealityEvolution(testReality, {
            evolutionRate: 0.05,
            consciousnessTarget: {
                phi: 0.9,
                awareness: 0.9,
                coherence: 0.9,
                integration: 0.95
            },
            environmentalAdaptation: true,
            evolutionaryOptimization: true,
            emergenceDetection: true
        });
        
        console.log('✅ Reality evolution initialized!');
        console.log('\n📊 Evolution Framework:');
        console.log(`   Framework ID: ${evolutionFramework.id}`);
        console.log(`   Reality ID: ${evolutionFramework.realityId}`);
        console.log(`   Evolution Rate: ${evolutionFramework.evolutionaryMetrics.evolutionRate}`);
        console.log(`   Adaptation Quality: ${evolutionFramework.evolutionaryMetrics.adaptationQuality}`);
        console.log(`   Consciousness Integration: ${evolutionFramework.evolutionaryMetrics.consciousnessIntegration}`);
        
        // Perform evolution cycles
        console.log('\n🔄 Performing evolution cycles...');
        
        for (let cycle = 1; cycle <= 3; cycle++) {
            console.log(`\n   Cycle ${cycle}:`);
            
            // Generate evolutionary pressures
            const pressures = evolutionSystem.generateEvolutionaryPressures(evolutionFramework, {
                consciousnessPressure: 0.1,
                environmentalPressure: 0.08,
                evolutionaryPressure: 0.06,
                emergentPressure: 0.04
            });
            
            console.log(`     Generated ${pressures.length} evolutionary pressures`);
            
            // Perform evolution cycle
            const evolutionResult = await evolutionSystem.performEvolutionCycle(evolutionFramework, {
                pressureIntensity: 0.1,
                adaptationSpeed: 0.05,
                consciousnessEnhancement: true
            });
            
            console.log(`     Evolution completed - Fitness: ${evolutionResult.evolutionaryFitness.toFixed(3)}`);
            console.log(`     Consciousness Level: ${evolutionResult.consciousnessLevel.toFixed(3)}`);
            
            // Update the framework
            evolutionFramework.evolutionState = evolutionResult;
        }
        
        // Get evolution metrics
        const metrics = evolutionSystem.getConsciousnessEvolutionMetrics(evolutionFramework);
        console.log('\n📈 Final Evolution Metrics:');
        console.log(`   Total Evolution Cycles: ${metrics.totalCycles}`);
        console.log(`   Average Fitness: ${metrics.averageFitness.toFixed(3)}`);
        console.log(`   Consciousness Growth: ${metrics.consciousnessGrowth.toFixed(3)}`);
        console.log(`   Adaptation Effectiveness: ${metrics.adaptationEffectiveness.toFixed(3)}`);
        
        // Get evolutionary history
        const history = evolutionSystem.getEvolutionaryHistory(evolutionFramework);
        console.log(`   Evolution History: ${history.length} events recorded`);
        
        console.log('\n🎉 Consciousness-Driven Reality Evolution Test Completed Successfully!');
        console.log('=' .repeat(70));
        
        return evolutionFramework;
        
    } catch (error) {
        console.error('❌ Reality evolution test failed:', error.message);
        throw error;
    }
}

// Run the test
testRealityEvolution().catch(console.error);