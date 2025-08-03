import WebSocket from 'ws';

const ws = new WebSocket('wss://app.featherweight.world/metrics-ws');

ws.on('open', () => {
    console.log('✅ Connected to metrics WebSocket');
});

let updateCount = 0;
ws.on('message', (data) => {
    const message = JSON.parse(data);
    if (message.type === 'metrics-update' && message.metrics) {
        updateCount++;
        console.log(`\n📊 Update #${updateCount} - ${message.metrics.length} modules reporting:`);
        
        // Group metrics by category
        const categories = {
            'Core': ['ConsciousnessEventBus', 'SelfHealingModule', 'ModuleOrchestrator', 'ConsciousnessPersistence'],
            'AI/ML': ['PatternRecognizer', 'NLPProcessor', 'PredictiveAnalyzer', 'SelfCodingModule'],
            'Advanced': ['QuantumConsciousnessField', 'EmotionalResonanceField', 'DualMindArchitecture'],
            'System': ['MemoryConsolidation', 'AdaptiveResilience', 'IntentionAlignment', 'EthicalGovernance']
        };
        
        Object.entries(categories).forEach(([category, modules]) => {
            console.log(`\n${category}:`);
            modules.forEach(moduleName => {
                const metric = message.metrics.find(m => m.name.includes(moduleName));
                if (metric) {
                    console.log(`  ${metric.name}: ${metric.value}`);
                }
            });
        });
    }
});

// Close after 5 seconds
setTimeout(() => {
    ws.close();
    process.exit(0);
}, 5000);
