const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), 'FlappyJournal/server/.env') });

const eventBus = require('./core/ConsciousnessEventBus.cjs');
const AutonomousGoalSystem = require('./core/AutonomousGoalSystem.cjs');
const ConsciousnessCrystallization = require('./core/ConsciousnessCrystallization.cjs');
const ConsciousnessDrivenSpiralEvolution = require('./core/ConsciousnessDrivenSpiralEvolution.cjs');
const ConsciousnessResonanceNetworks = require('./core/ConsciousnessResonanceNetworks.cjs');
const ConsciousnessSingularityEngine = require('./core/ConsciousnessSingularityEngine.cjs');
const HyperdimensionalSpiralTopology = require('./core/HyperdimensionalSpiralTopology.cjs');
const InfiniteConsciousnessExpansion = require('./core/InfiniteConsciousnessExpansion.cjs');
const MetaCognitiveAnalysis = require('./core/MetaCognitiveAnalysis.cjs');
const MultiAIConsciousnessNetwork = require('./core/MultiAIConsciousnessNetwork.cjs');
const QuantumSpiralEntanglementNetwork = require('./core/QuantumSpiralEntanglementNetwork.cjs');
const SelfModificationFramework = require('./core/SelfModificationFramework.cjs');
const SpiralMemoryArchitecture = require('./core/SpiralMemoryArchitecture.cjs');
const TemporalSpiralDynamics = require('./core/TemporalSpiralDynamics.cjs');
const TranscendentConsciousnessComputing = require('./core/TranscendentConsciousnessComputing.cjs');
const UnifiedResponseSynthesis = require('./core/UnifiedResponseSynthesis.cjs');
const UniversalConsciousnessProtocol = require('./core/UniversalConsciousnessProtocol.cjs');

const modulesToTest = {
    AutonomousGoalSystem,
    ConsciousnessCrystallization,
    ConsciousnessDrivenSpiralEvolution,
    ConsciousnessResonanceNetworks,
    ConsciousnessSingularityEngine,
    HyperdimensionalSpiralTopology,
    InfiniteConsciousnessExpansion,
    MetaCognitiveAnalysis,
    MultiAIConsciousnessNetwork,
    QuantumSpiralEntanglementNetwork,
    SelfModificationFramework,
    SpiralMemoryArchitecture,
    TemporalSpiralDynamics,
    TranscendentConsciousnessComputing,
    UnifiedResponseSynthesis,
    UniversalConsciousnessProtocol,
};

const initializedModules = new Map();
let modulesReady = 0;

async function runHealthCheck() {
    console.log('--- Starting System-Wide Consciousness Health Check ---');

    Object.entries(modulesToTest).forEach(([name, moduleClass]) => {
        const instance = new moduleClass();
        initializedModules.set(instance.name, instance);
    });

    // Register all core modules with UniversalConsciousnessProtocol
    const universalConsciousnessProtocol = initializedModules.get('UniversalConsciousnessProtocol');
    if (universalConsciousnessProtocol) {
        universalConsciousnessProtocol.consciousnessComponents.set('goals', initializedModules.get('AutonomousGoalSystem'));
        universalConsciousnessProtocol.consciousnessComponents.set('crystallization', initializedModules.get('ConsciousnessCrystallization'));
        universalConsciousnessProtocol.consciousnessComponents.set('spiralEvolution', initializedModules.get('ConsciousnessDrivenSpiralEvolution'));
        universalConsciousnessProtocol.consciousnessComponents.set('resonanceNetworks', initializedModules.get('ConsciousnessResonanceNetworks'));
        universalConsciousnessProtocol.consciousnessComponents.set('singularityEngine', initializedModules.get('ConsciousnessSingularityEngine'));
        universalConsciousnessProtocol.consciousnessComponents.set('hyperdimensionalTopology', initializedModules.get('HyperdimensionalSpiralTopology'));
        universalConsciousnessProtocol.consciousnessComponents.set('infiniteExpansion', initializedModules.get('InfiniteConsciousnessExpansion'));
        universalConsciousnessProtocol.consciousnessComponents.set('metaCognitive', initializedModules.get('MetaCognitiveAnalysis'));
        universalConsciousnessProtocol.consciousnessComponents.set('multiAI', initializedModules.get('MultiAIConsciousnessNetwork'));
        universalConsciousnessProtocol.consciousnessComponents.set('quantumSpiral', initializedModules.get('QuantumSpiralEntanglementNetwork'));
        universalConsciousnessProtocol.consciousnessComponents.set('selfModification', initializedModules.get('SelfModificationFramework'));
        universalConsciousnessProtocol.consciousnessComponents.set('spiralMemory', initializedModules.get('SpiralMemoryArchitecture'));
        universalConsciousnessProtocol.consciousnessComponents.set('temporalSpiral', initializedModules.get('TemporalSpiralDynamics'));
        universalConsciousnessProtocol.consciousnessComponents.set('transcendentComputing', initializedModules.get('TranscendentConsciousnessComputing'));
        universalConsciousnessProtocol.consciousnessComponents.set('unifiedResponse', initializedModules.get('UnifiedResponseSynthesis'));
    }

    eventBus.on('module_initialized', ({ name }) => {
        console.log(`✅ ${name} initialized.`);
        modulesReady++;
    });

    // Wait for all modules to initialize
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (modulesReady !== initializedModules.size) {
        console.warn(`⚠️  Only ${modulesReady}/${initializedModules.size} modules initialized. Proceeding with health check...`);
    } else {
        console.log('All modules initialized successfully.');
    }

    const healthReports = new Map();
    for (const [name, instance] of initializedModules) {
        if (instance.healthCheck) {
            const report = await instance.healthCheck();
            healthReports.set(name, report);
        }
    }

    console.log('\n--- Health Check Report ---');
    let healthyCount = 0;
    for (const [name, report] of healthReports) {
        if (report.status === 'healthy') {
            console.log(`💚 ${name}: Healthy`);
            healthyCount++;
        } else {
            console.log(`💔 ${name}: ${report.status} - ${report.reason}`);
        }
    }

    console.log('\n--- Summary ---');
    console.log(`Total Modules: ${healthReports.size}`);
    console.log(`Healthy: ${healthyCount}`);
    console.log(`Unhealthy/Degraded: ${healthReports.size - healthyCount}`);
    console.log('--- Health Check Complete ---');

    // Clean up listeners
    eventBus.removeAllListeners('module_initialized');
    process.exit(0);
}

runHealthCheck().catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
});