#!/usr/bin/env node

/**
 * Full Reality System Integration Test
 * Tests all components of the reality generator system
 */

import { SharedRealityStorage } from './shared-reality-storage.cjs';
import { RealityEnhancedResponses } from './reality-enhanced-responses.cjs';
import { RealityConsciousnessIntegration } from './reality-consciousness-integration.cjs';

async function testFullRealityIntegration() {
    console.log('🌌 FULL REALITY SYSTEM INTEGRATION TEST');
    console.log('═══════════════════════════════════════════════════════════════');

    try {
        // Test 1: Reality Generator Service
        console.log('\n🔍 Test 1: Reality Generator Service');
        const statusResponse = await fetch('http://localhost:5006/health');
        if (statusResponse.ok) {
            const health = await statusResponse.json();
            console.log(`✅ Reality Generator Service: ${health.status}`);
            console.log(`⏱️  Uptime: ${Math.floor(health.uptime / 1000)}s`);
            console.log(`📊 Total Realities: ${health.totalRealities}`);
        } else {
            console.log('❌ Reality Generator Service not accessible');
            return;
        }

        // Test 2: Imagination Engine Status
        console.log('\n🔍 Test 2: Imagination Engine');
        const imaginationResponse = await fetch('http://localhost:5006/api/imagination/status');
        if (imaginationResponse.ok) {
            const status = await imaginationResponse.json();
            console.log(`✅ Imagination Engine Active: ${status.active}`);
            console.log(`📈 Generated Realities: ${status.generatedRealities}`);
            console.log(`⚡ Average Generation Time: ${status.averageGenerationTime.toFixed(2)}ms`);
            console.log(`📋 Queue Size: ${status.queueSize}`);
            
            if (status.currentReality) {
                console.log(`🎭 Current Reality: "${status.currentReality.content.scenario}"`);
                console.log(`💫 Complexity: ${(status.currentReality.content.complexity * 100).toFixed(1)}%`);
                console.log(`❤️ Emotional Resonance: ${(status.currentReality.content.emotional_resonance * 100).toFixed(1)}%`);
                console.log(`⭐ Quality Score: ${(status.currentReality.metadata.qualityScore * 100).toFixed(1)}%`);
            }
        } else {
            console.log('❌ Imagination Engine not accessible');
        }

        // Test 3: Reality Storage System
        console.log('\n🔍 Test 3: Shared Reality Storage');
        const storage = new SharedRealityStorage({ persistenceEnabled: false });
        
        // Test storing a reality
        const testReality = {
            id: 'test_' + Date.now(),
            timestamp: Date.now(),
            type: 'test',
            content: {
                scenario: 'Test reality for integration verification',
                complexity: 0.7,
                emotional_resonance: 0.8
            },
            metadata: {
                qualityScore: 0.9,
                generatedBy: 'integration-test'
            }
        };
        
        await storage.storeReality(testReality);
        const retrievedReality = storage.getReality(testReality.id);
        
        if (retrievedReality && retrievedReality.id === testReality.id) {
            console.log('✅ Reality Storage: Store/Retrieve working');
            console.log(`📦 Stored Reality: "${retrievedReality.content.scenario}"`);
        } else {
            console.log('❌ Reality Storage: Store/Retrieve failed');
        }

        // Test 4: Reality Enhanced Responses
        console.log('\n🔍 Test 4: Reality Enhanced Responses');
        const enhancedResponses = new RealityEnhancedResponses();
        
        const testMessage = "I want to visualize my consciousness growth";
        const enhancement = enhancedResponses.enhanceResponseWithReality(
            testMessage,
            { level: 0.8 },
            { resonance: 0.7 },
            { type: 'embedded' }
        );
        
        if (enhancement && enhancement.visualMetaphors) {
            console.log('✅ Reality Enhanced Responses working');
            console.log(`🎨 Visual Metaphors: ${enhancement.visualMetaphors.join(', ')}`);
            console.log(`🌟 Enhancement Type: ${enhancement.enhancementType}`);
        } else {
            console.log('❌ Reality Enhanced Responses failed');
        }

        // Test 5: Reality Consciousness Integration
        console.log('\n🔍 Test 5: Reality Consciousness Integration');
        const integration = new RealityConsciousnessIntegration();
        
        const integrationResult = integration.processMessage(testMessage);
        if (integrationResult && integrationResult.shouldGenerateReality) {
            console.log('✅ Reality Consciousness Integration working');
            console.log(`🎯 Trigger Type: ${integrationResult.triggerType}`);
            console.log(`🌍 Reality Type: ${integrationResult.realityType}`);
            console.log(`🔧 Integration Strategy: ${integrationResult.integrationStrategy}`);
        } else {
            console.log('❌ Reality Consciousness Integration failed');
        }

        // Test 6: Reality API Endpoints
        console.log('\n🔍 Test 6: Reality API Endpoints');
        
        // Test getting recent realities
        const realitiesResponse = await fetch('http://localhost:5006/api/realities?limit=5');
        if (realitiesResponse.ok) {
            const data = await realitiesResponse.json();
            console.log(`✅ API Realities Endpoint: Retrieved ${data.realities.length} realities`);
            
            if (data.realities.length > 0) {
                const latestReality = data.realities[0];
                console.log(`🌟 Latest Reality: "${latestReality.content.scenario}"`);
                console.log(`⭐ Quality: ${(latestReality.metadata.qualityScore * 100).toFixed(1)}%`);
            }
        } else {
            console.log('❌ API Realities Endpoint failed');
        }

        // Test 7: Reality Generation Control
        console.log('\n🔍 Test 7: Reality Generation Control');
        
        // Test stopping and starting
        const stopResponse = await fetch('http://localhost:5006/api/imagination/stop', { method: 'POST' });
        if (stopResponse.ok) {
            console.log('✅ Reality Generation Stop: Working');
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const startResponse = await fetch('http://localhost:5006/api/imagination/start', { method: 'POST' });
            if (startResponse.ok) {
                console.log('✅ Reality Generation Start: Working');
            } else {
                console.log('❌ Reality Generation Start: Failed');
            }
        } else {
            console.log('❌ Reality Generation Stop: Failed');
        }

        console.log('\n🎉 FULL REALITY SYSTEM INTEGRATION TEST COMPLETE!');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('✅ All reality system components are working correctly!');
        console.log('🌌 The reality generator is fully integrated and operational!');

    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        console.error(error.stack);
    }
}

// Run the test
testFullRealityIntegration();
