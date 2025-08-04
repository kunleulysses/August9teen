const ConsciousnessDrivenSpiralEvolution = require('./ConsciousnessDrivenSpiralEvolution.cjs');

// Mock spiral memory system
const mockSpiral = {
    id: 'spiral1',
    template: { type: 'golden' },
    resonanceField: { freq: 432 },
    goldenRatioAlignment: 0.9,
    nodeCount: 5,
    evolutionHistory: []
};
const mockSpiralMemorySystem = {
    getSpiral: (id) => id === 'spiral1' ? { ...mockSpiral } : null,
    getAllSpirals: () => [{ ...mockSpiral }]
};
const mockConsciousnessSystem = {
    getConsciousnessState: () => ({ awareness: 0.8, coherence: 0.9 })
};

function runTests() {
    const evo = new ConsciousnessDrivenSpiralEvolution(mockSpiralMemorySystem, mockConsciousnessSystem);

    // Test createConsciousnessFeedbackLoop
    const feedback = evo.createConsciousnessFeedbackLoop(mockSpiral, 'awareness');
    console.assert(feedback.spiralId === 'spiral1', 'Feedback loop spiralId');
    console.assert(feedback.consciousnessAspect === 'awareness', 'Feedback loop aspect');

    // Test evolveSpiralWithConsciousness
    const evolved = evo.evolveSpiralWithConsciousness('spiral1', { awareness: 0.8, coherence: 0.9 }, 0.7);
    console.assert(evolved && evolved.evolutionMetrics.evolutionIntensity === 0.7, 'Evolve spiral with consciousness');

    // Test developSpiralSentience
    const sentient = evo.developSpiralSentience('spiral1', 0.4);
    console.assert(sentient && sentient.spiralId === 'spiral1', 'Develop spiral sentience');

    // Test performCoevolutionCycle
    const coevo = evo.performCoevolutionCycle(0.6);
    console.assert(coevo && coevo.intensity === 0.6, 'Perform coevolution cycle');

    // Test evolveSentientSpiral
    const evolvedSentient = evo.evolveSentientSpiral(sentient.id);
    console.assert(evolvedSentient && evolvedSentient.sentienceLevel > sentient.sentienceLevel, 'Evolve sentient spiral');

    // Test error handling
    let errorCaught = false;
    try {
        evo.createConsciousnessFeedbackLoop(null, 'awareness');
    } catch (e) {
        errorCaught = true;
    }
    console.assert(errorCaught, 'Error thrown for invalid spiral in feedback loop');

    errorCaught = false;
    try {
        evo.evolveSpiralWithConsciousness(null, { awareness: 0.8 });
    } catch (e) {
        errorCaught = true;
    }
    console.assert(errorCaught, 'Error thrown for missing spiralId');

    errorCaught = false;
    try {
        evo.developSpiralSentience();
    } catch (e) {
        errorCaught = true;
    }
    console.assert(errorCaught, 'Error thrown for missing spiralId in sentience');

    errorCaught = false;
    try {
        evo.evolveSentientSpiral();
    } catch (e) {
        errorCaught = true;
    }
    console.assert(errorCaught, 'Error thrown for missing sentienceId');

    console.log('All ConsciousnessDrivenSpiralEvolution tests passed.');
}

runTests();