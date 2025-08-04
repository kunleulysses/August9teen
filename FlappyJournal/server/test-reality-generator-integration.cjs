/**
 * Integration test for Reality Generator deep integration.
 * Validates template-based generation, storage, and metrics.
 */

const consciousness = require('./consciousness-system.cjs');

async function runTest() {
    console.log('--- Reality Generator Integration Test ---');

    // Wait for system to initialize
    if (!consciousness.isRunning) {
        console.log('Waiting for consciousness system to initialize...');
        await new Promise(resolve => {
            consciousness.once('system:initialized', resolve);
        });
    }

    // Generate a reality from a template
    const templateId = 'consciousness_exploration';
    const customizations = { description: 'Test: Integration reality for consciousness exploration.' };
    const state = consciousness.consciousnessState;

    try {
        const result = await consciousness.realityGenerator.generateRealityFromTemplate(templateId, customizations, state);
        if (result.success) {
            console.log('✅ Reality generated from template:', result.data);

            // Store in shared storage
            await consciousness.sharedRealityStorage.storeReality(result.data.reality || result.data, 'integration_test', { templateId, customizations });

            // Fetch metrics
            const metrics = await consciousness.sharedRealityStorage.getMetrics();
            console.log('📊 Shared Reality Storage Metrics:', metrics);

            // Fetch top-rated realities
            const topRated = metrics.qualityMetrics?.topRatedRealities || [];
            console.log('🏆 Top Rated Realities:', topRated);

            // Validate
            if (topRated.length > 0) {
                console.log('✅ Integration test passed: Top rated realities present.');
            } else {
                console.warn('⚠️ Integration test warning: No top rated realities found.');
            }
        } else {
            console.error('❌ Failed to generate reality from template:', result.error);
        }
    } catch (error) {
        console.error('❌ Integration test error:', error);
    }
}

runTest();