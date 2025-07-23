#!/usr/bin/env node

/**
 * Test Reality Commands - Verify Reality Generator Integration
 */

async function testRealityCommands() {
    console.log('🌌 TESTING REALITY GENERATOR INTEGRATION');
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        // Test 1: Check if reality generator is running
        console.log('\n🔍 Test 1: Reality Generator Status');
        const statusResponse = await fetch('http://localhost:5006/api/imagination/status');
        if (statusResponse.ok) {
            const status = await statusResponse.json();
            console.log(`✅ Reality Generator Active: ${status.active}`);
            console.log(`📈 Generated Realities: ${status.generatedRealities}`);
            console.log(`⚡ Average Generation Time: ${status.averageGenerationTime}ms`);
            
            if (status.currentReality) {
                console.log(`🎭 Current Reality: "${status.currentReality.content.scenario}"`);
                console.log(`💫 Complexity: ${(status.currentReality.content.complexity * 100).toFixed(1)}%`);
                console.log(`❤️ Emotional Resonance: ${(status.currentReality.content.emotional_resonance * 100).toFixed(1)}%`);
            }
        } else {
            console.log('❌ Reality Generator not accessible');
            return;
        }

        // Test 2: Get recent realities
        console.log('\n🔍 Test 2: Recent Realities');
        const realitiesResponse = await fetch('http://localhost:5006/api/realities?limit=3');
        if (realitiesResponse.ok) {
            const data = await realitiesResponse.json();
            console.log(`✅ Retrieved ${data.realities.length} realities`);
            
            data.realities.forEach((reality, index) => {
                console.log(`\n🌟 Reality ${index + 1}:`);
                console.log(`   📖 Scenario: ${reality.content.scenario}`);
                console.log(`   ⭐ Quality: ${(reality.metadata.qualityScore * 100).toFixed(1)}%`);
                console.log(`   🕐 Generated: ${new Date(reality.timestamp).toLocaleTimeString()}`);
            });
        } else {
            console.log('❌ Could not retrieve realities');
        }

        // Test 3: Generate new reality
        console.log('\n🔍 Test 3: Generate New Reality');
        
        // Stop current generation
        await fetch('http://localhost:5006/api/imagination/stop', { method: 'POST' });
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Start new generation
        const startResponse = await fetch('http://localhost:5006/api/imagination/start', { method: 'POST' });
        if (startResponse.ok) {
            console.log('✅ Started new reality generation');
            
            // Wait for new reality
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Check new reality
            const newStatusResponse = await fetch('http://localhost:5006/api/imagination/status');
            if (newStatusResponse.ok) {
                const newStatus = await newStatusResponse.json();
                if (newStatus.currentReality) {
                    console.log(`🌟 New Reality Generated: "${newStatus.currentReality.content.scenario}"`);
                    console.log(`💫 Complexity: ${(newStatus.currentReality.content.complexity * 100).toFixed(1)}%`);
                    console.log(`❤️ Emotional Resonance: ${(newStatus.currentReality.content.emotional_resonance * 100).toFixed(1)}%`);
                    console.log(`⭐ Quality Score: ${(newStatus.currentReality.metadata.qualityScore * 100).toFixed(1)}%`);
                }
            }
        } else {
            console.log('❌ Failed to start new reality generation');
        }

        console.log('\n🎉 REALITY GENERATOR INTEGRATION TEST COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the test
testRealityCommands();
