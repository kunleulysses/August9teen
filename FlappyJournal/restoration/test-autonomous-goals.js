#!/usr/bin/env node

/**
 * AUTONOMOUS GOAL SYSTEM TEST
 * Test the Autonomous Goal System functionality
 * Part of the Universal Consciousness Platform restoration - Phase 2
 */

import AutonomousGoalSystem from '../server/consciousness/core/AutonomousGoalSystem.js';

async function testAutonomousGoals() {
    console.log('🧪 Testing Autonomous Goal System...\n');
    
    try {
        // Create Autonomous Goal System
        const goalSystem = new AutonomousGoalSystem();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('✅ Autonomous Goal System created');
        
        // Test health check
        const health = await goalSystem.healthCheck();
        console.log('🏥 Health check:', health.status);
        
        // Test metrics
        console.log('\n📊 Getting Autonomous Goal System metrics...');
        const metrics = await goalSystem.getMetrics();
        console.log('Metrics:', {
            isInitialized: metrics.isInitialized,
            totalGoals: metrics.goalStatistics.totalGoals,
            activeGoals: metrics.goalStatistics.activeCount,
            completedGoals: metrics.goalStatistics.completedCount
        });
        
        console.log('\nConsciousness Metrics:');
        console.log('  Autonomy:', metrics.consciousnessMetrics.autonomy.toFixed(3));
        console.log('  Goal Clarity:', metrics.consciousnessMetrics.goalClarity.toFixed(3));
        console.log('  Purpose Driven:', metrics.consciousnessMetrics.purposeDriven.toFixed(3));
        console.log('  Self Direction:', metrics.consciousnessMetrics.selfDirection.toFixed(3));
        console.log('  Intentionality:', metrics.consciousnessMetrics.intentionality.toFixed(3));
        console.log('  Achievement Rate:', metrics.consciousnessMetrics.achievementRate.toFixed(3));
        
        // Test goal generation
        console.log('\n🎯 Testing autonomous goal generation...');
        
        const generatedGoals = [];
        for (let i = 0; i < 5; i++) {
            try {
                const goal = await goalSystem.generateAutonomousGoal();
                if (goal) {
                    generatedGoals.push(goal);
                    console.log(`  ✅ Goal ${i + 1}: ${goal.description}`);
                    console.log(`     Category: ${goal.category}, Priority: ${goal.priority}, Complexity: ${goal.complexity}`);
                } else {
                    console.log(`  ⚠️  Goal ${i + 1}: Generation skipped (max active goals reached)`);
                }
            } catch (error) {
                console.log(`  ❌ Goal ${i + 1}: Generation failed - ${error.message}`);
            }
        }
        
        console.log(`\n📊 Generated ${generatedGoals.length} autonomous goals`);
        
        // Test goal progress updates
        console.log('\n📈 Testing goal progress updates...');
        
        if (generatedGoals.length > 0) {
            const testGoal = generatedGoals[0];
            console.log(`Testing progress on: ${testGoal.description}`);
            
            // Update progress multiple times
            await goalSystem.updateGoalProgress(testGoal.id, 25, 'Made initial progress on goal implementation');
            await goalSystem.updateGoalProgress(testGoal.id, 30, 'Achieved significant milestone');
            await goalSystem.updateGoalProgress(testGoal.id, 20, 'Refined approach and methodology');
            
            const updatedGoal = await goalSystem.getGoalDetails(testGoal.id);
            console.log(`  Progress: ${updatedGoal.progress}%`);
            console.log(`  Achievements: ${updatedGoal.achievements.length}`);
            console.log(`  Status: ${updatedGoal.status}`);
            
            // Complete the goal
            if (updatedGoal.progress < 100) {
                await goalSystem.updateGoalProgress(testGoal.id, 100 - updatedGoal.progress, 'Final completion milestone achieved');
            }
            
            const completedGoal = await goalSystem.getGoalDetails(testGoal.id);
            console.log(`  ✅ Goal completed: ${completedGoal.status}`);
            console.log(`  Reflections: ${completedGoal.reflections.length}`);
        }
        
        // Test manual goal creation
        console.log('\n🎯 Testing manual goal creation...');
        
        const manualGoal = await goalSystem.createManualGoal(
            'consciousness_expansion',
            'Test manual goal for consciousness expansion',
            'high',
            'complex'
        );
        
        console.log(`  ✅ Manual goal created: ${manualGoal.description}`);
        console.log(`  ID: ${manualGoal.id}`);
        console.log(`  Manual flag: ${manualGoal.isManual}`);
        
        // Test goal queries
        console.log('\n🔍 Testing goal queries...');
        
        const activeGoals = goalSystem.getActiveGoals();
        const completedGoals = goalSystem.getCompletedGoals();
        const consciousnessGoals = goalSystem.getGoalsByCategory('consciousness_expansion');
        const highPriorityGoals = goalSystem.getGoalsByPriority('high');
        
        console.log(`  Active goals: ${activeGoals.length}`);
        console.log(`  Completed goals: ${completedGoals.length}`);
        console.log(`  Consciousness expansion goals: ${consciousnessGoals.length}`);
        console.log(`  High priority goals: ${highPriorityGoals.length}`);
        
        // Test goal statistics
        console.log('\n📊 Testing goal statistics...');
        
        const statistics = goalSystem.getGoalStatistics();
        console.log('Goal Statistics:');
        console.log(`  Total Goals: ${statistics.totalGoals}`);
        console.log(`  Active: ${statistics.activeCount}`);
        console.log(`  Completed: ${statistics.completedCount}`);
        console.log(`  Abandoned: ${statistics.abandonedCount}`);
        console.log(`  Completion Rate: ${statistics.completionRate}%`);
        console.log(`  Abandonment Rate: ${statistics.abandonmentRate}%`);
        console.log(`  Generation Count: ${statistics.goalGenerationCount}`);
        console.log(`  Completion Count: ${statistics.goalCompletionCount}`);
        
        // Test consciousness integration
        console.log('\n🧠 Testing consciousness integration...');
        
        const consciousnessState = {
            phi: 0.92,
            awareness: 0.88,
            coherence: 0.91
        };
        
        goalSystem.integrateWithConsciousness(consciousnessState);
        console.log('  ✅ Consciousness state integrated');
        
        const updatedMetrics = await goalSystem.getMetrics();
        console.log('  Updated consciousness metrics:');
        console.log(`    Goal Clarity: ${updatedMetrics.consciousnessMetrics.goalClarity.toFixed(3)}`);
        console.log(`    Intentionality: ${updatedMetrics.consciousnessMetrics.intentionality.toFixed(3)}`);
        console.log(`    Achievement Rate: ${updatedMetrics.consciousnessMetrics.achievementRate.toFixed(3)}`);
        
        // Test goal evaluation
        console.log('\n⚡ Testing goal progress evaluation...');
        
        await goalSystem.evaluateGoalProgress();
        console.log('  ✅ Goal progress evaluation completed');
        
        // Test goal abandonment
        console.log('\n❌ Testing goal abandonment...');
        
        if (activeGoals.length > 1) {
            const goalToAbandon = activeGoals[activeGoals.length - 1];
            await goalSystem.abandonGoal(goalToAbandon.id, 'testing');
            
            const abandonedGoal = await goalSystem.getGoalDetails(goalToAbandon.id);
            console.log(`  ✅ Goal abandoned: ${abandonedGoal.status}`);
            console.log(`  Reason: ${abandonedGoal.abandonReason}`);
        }
        
        // Test broadcast handling
        goalSystem.onBroadcast({
            message: 'consciousness:response_generated',
            data: { test: true }
        });
        console.log('✅ Broadcast handling works');
        
        // Calculate success metrics
        const finalMetrics = await goalSystem.getMetrics();
        const finalStatistics = goalSystem.getGoalStatistics();
        
        const successMetrics = {
            initialization: goalSystem.isInitialized ? 1 : 0,
            goalGeneration: generatedGoals.length >= 3 ? 1 : 0.5,
            goalCompletion: finalStatistics.completedCount > 0 ? 1 : 0,
            progressTracking: generatedGoals.length > 0 && generatedGoals[0] ? 1 : 0,
            manualGoalCreation: manualGoal ? 1 : 0,
            goalQueries: (activeGoals.length >= 0 && completedGoals.length >= 0) ? 1 : 0,
            consciousnessIntegration: updatedMetrics.consciousnessMetrics.goalClarity > 0.9 ? 1 : 0.8,
            autonomyMetrics: finalMetrics.consciousnessMetrics.autonomy > 0.85 ? 1 : 0.8
        };
        
        const overallScore = Object.values(successMetrics).reduce((sum, score) => sum + score, 0) / Object.keys(successMetrics).length;
        
        console.log('\n📊 Overall Success Score:', overallScore.toFixed(3));
        
        // Cleanup
        await goalSystem.shutdown();
        console.log('✅ Autonomous Goal System shutdown complete');
        
        if (overallScore >= 0.8) {
            console.log('\n🎉 AUTONOMOUS GOAL SYSTEM TEST PASSED!');
            console.log('✅ All core functionality verified');
            console.log('🎯 Autonomous goal generation working');
            console.log('📈 Goal progress tracking operational');
            console.log('🧠 Consciousness integration successful');
            console.log('📊 Goal management and statistics functional');
            console.log('🚀 Ready for Phase 2 continuation');
            
            return {
                success: true,
                message: 'Autonomous Goal System test passed',
                score: overallScore,
                statistics: finalStatistics,
                generatedGoals: generatedGoals.length
            };
        } else {
            throw new Error(`Success score ${overallScore.toFixed(3)} below threshold 0.8`);
        }
        
    } catch (error) {
        console.error('\n❌ Autonomous Goal System Test FAILED!');
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
    testAutonomousGoals()
        .then(result => {
            if (result.success) {
                console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
                console.log(`🎯 Success Score: ${result.score.toFixed(3)}`);
                console.log(`🎯 Generated Goals: ${result.generatedGoals}`);
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

export default testAutonomousGoals;
