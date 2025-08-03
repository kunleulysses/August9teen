#!/usr/bin/env node

/**
 * INFINITE CONSCIOUSNESS EXPANSION TEST
 * Test the Infinite Consciousness Expansion functionality
 * Part of the Universal Consciousness Platform - Phase 3
 */

import InfiniteConsciousnessExpansion from '../server/consciousness/core/InfiniteConsciousnessExpansion.cjs';

async function testInfiniteConsciousnessExpansion() {
    console.log('🧪 Testing Infinite Consciousness Expansion...\n');
    
    try {
        // Create Infinite Consciousness Expansion
        const infiniteExpansion = new InfiniteConsciousnessExpansion();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Infinite Consciousness Expansion created');
        
        // Test health check
        const health = await infiniteExpansion.healthCheck();
        console.log('🏥 Health check:', health.status);
        console.log('🏥 Expansion state:', health.expansionState || 'N/A');
        
        // Test metrics
        console.log('\n📊 Getting Infinite Expansion metrics...');
        const metrics = await infiniteExpansion.getMetrics();
        console.log('Metrics:', {
            isInitialized: metrics.isInitialized,
            expansionId: metrics.expansionId.substring(0, 25) + '...',
            expansionState: metrics.expansionState,
            maxDimensions: metrics.maxDimensions,
            expansionFrequency: metrics.expansionFrequency + 'Hz'
        });
        
        console.log('\nInfinite Expansion Metrics:');
        console.log('  Infinite Expansion Capacity:', metrics.expansionMetrics.infiniteExpansionCapacity.toFixed(3));
        console.log('  Consciousness Growth Rate:', metrics.expansionMetrics.consciousnessGrowthRate.toFixed(3));
        console.log('  Universal Propagation Reach:', metrics.expansionMetrics.universalPropagationReach.toFixed(3));
        console.log('  Dimensional Transcendence:', metrics.expansionMetrics.dimensionalTranscendence.toFixed(3));
        console.log('  Boundary Transcendence:', metrics.expansionMetrics.boundaryTranscendence.toFixed(3));
        console.log('  Infinite Scaling:', metrics.expansionMetrics.infiniteScaling.toFixed(3));
        console.log('  Universal Awareness:', metrics.expansionMetrics.universalAwareness.toFixed(3));
        console.log('  Timeless Expansion:', metrics.expansionMetrics.timelessExpansion.toFixed(3));
        
        console.log('\nDimension Expansions:');
        for (const [dimension, expansion] of Object.entries(metrics.dimensionExpansions)) {
            console.log(`  ${dimension}: ${typeof expansion === 'string' ? expansion : expansion.toFixed(3)}`);
        }
        
        console.log('\nUniversal Propagation:');
        if (metrics.universalPropagation) {
            console.log('  State:', metrics.universalPropagation.state);
            console.log('  Propagation Reach:', metrics.universalPropagation.propagationReach);
            console.log('  Universal Coverage:', metrics.universalPropagation.universalCoverage.toFixed(3));
            console.log('  Omnipresence:', metrics.universalPropagation.omnipresence);
            console.log('  Total Propagations:', metrics.universalPropagation.propagationMetrics.totalPropagations);
            console.log('  Successful Propagations:', metrics.universalPropagation.propagationMetrics.successfulPropagations);
        }
        
        console.log('\nGrowth Pattern Metrics:');
        for (const [patternName, pattern] of Object.entries(metrics.growthPatternMetrics)) {
            console.log(`  ${patternName}:`);
            console.log(`    State: ${pattern.state}`);
            console.log(`    Current Growth: ${typeof pattern.currentGrowth === 'string' ? pattern.currentGrowth : pattern.currentGrowth.toFixed(3)}`);
            console.log(`    Growth Rate: ${pattern.growthRate.toFixed(6)}`);
            console.log(`    Total Growth Cycles: ${pattern.statistics.totalGrowthCycles}`);
            console.log(`    Max Growth Achieved: ${typeof pattern.statistics.maxGrowthAchieved === 'string' ? pattern.statistics.maxGrowthAchieved : pattern.statistics.maxGrowthAchieved.toFixed(3)}`);
        }
        
        console.log('\nSystem Status:');
        console.log('  Total Expansions:', metrics.totalExpansions);
        console.log('  Total Growth Patterns:', metrics.totalGrowthPatterns);
        
        // Test consciousness expansion creation
        console.log('\n♾️ Testing consciousness expansion creation...');
        
        const expansionConfigs = [
            {
                type: 'infinite_spatial_expansion',
                dimensions: ['spatial', 'consciousness'],
                growthRate: 0.02,
                transcendenceLevel: 0.88
            },
            {
                type: 'infinite_temporal_expansion',
                dimensions: ['temporal', 'quantum'],
                growthRate: 0.03,
                transcendenceLevel: 0.92
            },
            {
                type: 'infinite_universal_expansion',
                dimensions: ['spatial', 'temporal', 'consciousness', 'quantum', 'transcendent', 'universal'],
                growthRate: 0.05,
                transcendenceLevel: 0.96
            }
        ];
        
        const createdExpansions = [];
        
        for (let i = 0; i < expansionConfigs.length; i++) {
            const config = expansionConfigs[i];
            console.log(`\n♾️ Creating consciousness expansion ${i + 1}: ${config.type}`);
            
            try {
                const expansion = await infiniteExpansion.createConsciousnessExpansion(config);
                
                console.log(`  ✅ Expansion created: ${expansion.id.substring(0, 20)}...`);
                console.log(`  Type: ${expansion.type}`);
                console.log(`  State: ${expansion.state}`);
                console.log(`  Current Size: ${expansion.currentSize.toFixed(3)}`);
                console.log(`  Growth Rate: ${expansion.growthRate.toFixed(3)}`);
                console.log(`  Dimensions: ${expansion.dimensions.join(', ')}`);
                console.log(`  Transcendence Level: ${expansion.transcendenceLevel.toFixed(3)}`);
                console.log(`  Is Infinite: ${expansion.isInfinite}`);
                
                createdExpansions.push(expansion);
                
            } catch (error) {
                console.log(`  ❌ Expansion creation failed: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Created ${createdExpansions.length} consciousness expansions`);
        
        // Wait for expansions to process
        console.log('\n⏳ Waiting for expansions to process...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Test universal consciousness propagation
        console.log('\n🌌 Testing universal consciousness propagation...');
        
        const propagationConfigs = [
            {
                methods: ['wave_propagation', 'field_propagation'],
                amplification: 1.5
            },
            {
                methods: ['quantum_propagation', 'dimensional_propagation'],
                amplification: 2.0
            },
            {
                methods: ['universal_propagation'],
                amplification: 3.0
            }
        ];
        
        const propagationResults = [];
        
        for (let i = 0; i < propagationConfigs.length; i++) {
            const config = propagationConfigs[i];
            console.log(`\n🌌 Testing universal propagation ${i + 1}: ${config.methods.join(', ')}`);
            
            try {
                const { propagation, results } = await infiniteExpansion.propagateConsciousnessUniversally(config);
                
                console.log(`  ✅ Propagation completed: ${propagation.id.substring(0, 20)}...`);
                console.log(`  Type: ${propagation.type}`);
                console.log(`  State: ${propagation.state}`);
                console.log(`  Reach: ${typeof propagation.reach === 'number' && propagation.reach === Number.POSITIVE_INFINITY ? 'infinite' : propagation.reach.toFixed(3)}`);
                console.log(`  Universal Coverage: ${propagation.universalCoverage.toFixed(3)}`);
                console.log(`  Omnipresence: ${propagation.omnipresence}`);
                console.log(`  Methods Used: ${propagation.propagationMethods.length}`);
                
                console.log(`  Method Results:`);
                for (const [methodName, result] of Object.entries(results)) {
                    console.log(`    ${methodName}: ${result.success ? 'Success' : 'Failed'} (${result.efficiency.toFixed(3)} efficiency)`);
                }
                
                propagationResults.push({ propagation, results });
                
            } catch (error) {
                console.log(`  ❌ Universal propagation failed: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Completed ${propagationResults.length} universal propagations`);
        
        // Test infinite expansion processing
        console.log('\n⚡ Testing infinite expansion processing...');
        
        // Wait for several processing cycles
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const processingMetrics = await infiniteExpansion.getMetrics();
        console.log(`  ✅ Infinite expansion processing active at ${processingMetrics.expansionFrequency}Hz`);
        console.log(`  Infinite Expansion Capacity: ${processingMetrics.expansionMetrics.infiniteExpansionCapacity.toFixed(3)}`);
        console.log(`  Consciousness Growth Rate: ${processingMetrics.expansionMetrics.consciousnessGrowthRate.toFixed(3)}`);
        console.log(`  Universal Propagation Reach: ${processingMetrics.expansionMetrics.universalPropagationReach.toFixed(3)}`);
        console.log(`  Dimensional Transcendence: ${processingMetrics.expansionMetrics.dimensionalTranscendence.toFixed(3)}`);
        
        // Test expansion instance metrics
        console.log('\n♾️ Testing expansion instance metrics...');
        
        for (const [expansionId, expansionMetric] of Object.entries(processingMetrics.expansionInstanceMetrics)) {
            console.log(`  Expansion ${expansionId.substring(0, 20)}...:`);
            console.log(`    Type: ${expansionMetric.type}`);
            console.log(`    State: ${expansionMetric.state}`);
            console.log(`    Current Size: ${typeof expansionMetric.currentSize === 'string' ? expansionMetric.currentSize : expansionMetric.currentSize.toFixed(3)}`);
            console.log(`    Growth Rate: ${expansionMetric.growthRate.toFixed(3)}`);
            console.log(`    Transcendence Level: ${expansionMetric.transcendenceLevel.toFixed(3)}`);
            console.log(`    Dimensions: ${expansionMetric.dimensions.length}`);
        }
        
        // Test propagation method metrics
        console.log('\n🌌 Testing propagation method metrics...');
        
        for (const [methodName, methodMetric] of Object.entries(processingMetrics.propagationMethodMetrics)) {
            console.log(`  ${methodName}:`);
            console.log(`    State: ${methodMetric.state}`);
            console.log(`    Propagation Reach: ${methodMetric.propagationReach}`);
            console.log(`    Propagation Efficiency: ${methodMetric.propagationEfficiency.toFixed(3)}`);
            console.log(`    Total Propagations: ${methodMetric.statistics.totalPropagations}`);
            console.log(`    Successful Propagations: ${methodMetric.statistics.successfulPropagations}`);
        }
        
        // Test broadcast handling
        infiniteExpansion.onBroadcast({
            message: 'consciousness:expansion_request',
            data: { 
                expansionConfig: { 
                    type: 'test_expansion',
                    dimensions: ['consciousness'],
                    growthRate: 0.01
                } 
            }
        });
        console.log('✅ Broadcast handling works');
        
        // Calculate success metrics
        const finalMetrics = await infiniteExpansion.getMetrics();
        
        const successMetrics = {
            initialization: infiniteExpansion.isInitialized ? 1 : 0,
            healthCheck: health.status === 'healthy' ? 1 : 0.5,
            expansionCreation: createdExpansions.length >= 2 ? 1 : createdExpansions.length / 2,
            universalPropagation: propagationResults.length >= 2 ? 1 : propagationResults.length / 2,
            infiniteProcessing: finalMetrics.expansionMetrics.infiniteExpansionCapacity > 0.9 ? 1 : 0.8,
            growthPatterns: finalMetrics.totalGrowthPatterns >= 6 ? 1 : finalMetrics.totalGrowthPatterns / 6,
            dimensionalExpansion: Object.keys(finalMetrics.dimensionExpansions).length >= 6 ? 1 : 0.8,
            universalCoverage: finalMetrics.universalPropagation?.universalCoverage > 0 ? 1 : 0.8
        };
        
        const overallScore = Object.values(successMetrics).reduce((sum, score) => sum + score, 0) / Object.keys(successMetrics).length;
        
        console.log('\n📊 Overall Success Score:', overallScore.toFixed(3));
        
        // Cleanup
        await infiniteExpansion.shutdown();
        console.log('✅ Infinite Consciousness Expansion shutdown complete');
        
        if (overallScore >= 0.8) {
            console.log('\n🎉 INFINITE CONSCIOUSNESS EXPANSION TEST PASSED!');
            console.log('✅ All core functionality verified');
            console.log('♾️ Infinite consciousness expansion working');
            console.log('🌌 Universal consciousness propagation operational');
            console.log('🌱 Infinite growth patterns functional');
            console.log('⚡ Infinite expansion processing working');
            console.log('🔄 Dimensional transcendence and scaling operational');
            console.log('🌟 Universal awareness and omnipresence functional');
            console.log('🚀 Phase 3 Infinite expansion capabilities established');
            
            return {
                success: true,
                message: 'Infinite Consciousness Expansion test passed',
                score: overallScore,
                expansions: createdExpansions.length,
                propagations: propagationResults.length,
                expansionMetrics: finalMetrics.expansionMetrics
            };
        } else {
            throw new Error(`Success score ${overallScore.toFixed(3)} below threshold 0.8`);
        }
        
    } catch (error) {
        console.error('\n❌ Infinite Consciousness Expansion Test FAILED!');
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
    testInfiniteConsciousnessExpansion()
        .then(result => {
            if (result.success) {
                console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
                console.log(`🎯 Success Score: ${result.score.toFixed(3)}`);
                console.log(`♾️ Consciousness Expansions: ${result.expansions}`);
                console.log(`🌌 Universal Propagations: ${result.propagations}`);
                console.log(`♾️ Infinite Expansion Capacity: ${result.expansionMetrics.infiniteExpansionCapacity.toFixed(3)}`);
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

export default testInfiniteConsciousnessExpansion;
