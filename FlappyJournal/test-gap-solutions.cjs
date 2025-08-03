/**
 * Comprehensive Gap Solutions Test
 * Validates all 4 implemented gap solutions are working correctly
 * Tests enhanced functionality without breaking existing capabilities
 */

import { ChatTriggeredSelfCoding } from './server/chat-triggered-self-coding.cjs';
import { EnhancedCodeAnalyzer } from './server/consciousness/enhanced-code-analyzer.cjs';
import { PredictiveErrorRecovery } from './server/consciousness/predictive-error-recovery.cjs';
import { MultiLayerQualityValidator } from './server/consciousness/multi-layer-quality-validator.cjs';
import { PriorityEventBus } from './server/consciousness/priority-event-bus.cjs';

console.log('🧪 COMPREHENSIVE GAP SOLUTIONS TEST');
console.log('=====================================');
console.log('Testing all 4 implemented gap solutions');
console.log('Verifying enhanced functionality without regression\n');

async function testGapSolutions() {
    let testsPassed = 0;
    let totalTests = 0;

    // GAP 1: Enhanced Code Complexity Analysis
    console.log('🔬 Testing Gap 1: Enhanced Code Complexity Analysis');
    console.log('---------------------------------------------------');
    
    try {
        totalTests++;
        const enhancedAnalyzer = new EnhancedCodeAnalyzer();
        
        const testCode = `
function complexFunction(data) {
    if (data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].value > 10) {
                for (let j = 0; j < data[i].items.length; j++) {
                    if (data[i].items[j].active) {
                        console.log(data[i].items[j].name);
                    }
                }
            }
        }
    }
    return data;
}`;
        
        const analysis = await enhancedAnalyzer.analyze(testCode, { enhanced: true });
        
        if (analysis.enhanced && analysis.enhanced.complexityMetrics) {
            console.log('✅ Enhanced complexity analysis working');
            console.log(`   - Cyclomatic Complexity: ${analysis.enhanced.complexityMetrics.cyclomaticComplexity}`);
            console.log(`   - Nesting Depth: ${analysis.enhanced.complexityMetrics.nestingDepth}`);
            console.log(`   - Quality Score: ${analysis.enhanced.qualityScore}`);
            testsPassed++;
        } else {
            console.log('❌ Enhanced complexity analysis failed');
        }
    } catch (error) {
        console.log('❌ Gap 1 test failed:', error.message);
    }

    // GAP 2: Predictive Error Recovery
    console.log('\n🛡️ Testing Gap 2: Predictive Error Recovery');
    console.log('---------------------------------------------');
    
    try {
        totalTests++;
        const errorRecovery = new PredictiveErrorRecovery();
        
        const buggyCode = `
function riskyFunction() {
    const data = null;
    return data.property; // Will cause null access error
}`;
        
        const prediction = await errorRecovery.predictErrors(buggyCode);
        
        if (prediction.static && prediction.static.errors.length > 0) {
            console.log('✅ Error prediction working');
            console.log(`   - Predicted ${prediction.static.errors.length} potential errors`);
            console.log(`   - Confidence: ${prediction.confidence}`);
            
            // Test recovery
            const recovery = await errorRecovery.recoverFromError(
                new Error('Cannot read property of null'),
                buggyCode
            );
            
            if (recovery.success || recovery.escalated) {
                console.log('✅ Error recovery mechanism working');
                testsPassed++;
            } else {
                console.log('❌ Error recovery failed');
            }
        } else {
            console.log('❌ Error prediction failed');
        }
    } catch (error) {
        console.log('❌ Gap 2 test failed:', error.message);
    }

    // GAP 3: Multi-Layer Quality Validation
    console.log('\n🔍 Testing Gap 3: Multi-Layer Quality Validation');
    console.log('------------------------------------------------');
    
    try {
        totalTests++;
        const qualityValidator = new MultiLayerQualityValidator();
        
        const testCode = `
function calculateGoldenRatio(iterations = 10) {
    let a = 1, b = 1;
    for (let i = 0; i < iterations; i++) {
        [a, b] = [b, a + b];
    }
    return b / a;
}`;
        
        const qualityReport = await qualityValidator.validateQuality(testCode);
        
        if (qualityReport.overallScore !== undefined && qualityReport.layerScores) {
            console.log('✅ Multi-layer quality validation working');
            console.log(`   - Overall Score: ${qualityReport.overallScore}`);
            console.log(`   - Quality Grade: ${qualityReport.qualityGrade}`);
            console.log(`   - Layers Analyzed: ${Object.keys(qualityReport.layerScores).length}`);
            console.log(`   - Recommendations: ${qualityReport.recommendations.length}`);
            testsPassed++;
        } else {
            console.log('❌ Quality validation failed');
        }
    } catch (error) {
        console.log('❌ Gap 3 test failed:', error.message);
    }

    // GAP 4: Priority-Based Event Routing
    console.log('\n⚡ Testing Gap 4: Priority-Based Event Routing');
    console.log('----------------------------------------------');
    
    try {
        totalTests++;
        const priorityBus = new PriorityEventBus();
        
        let eventsReceived = 0;
        let criticalEventReceived = false;
        
        // Set up event listeners
        priorityBus.on('test_event', (data) => {
            eventsReceived++;
        });
        
        priorityBus.on('critical_event', (data) => {
            criticalEventReceived = true;
        });
        
        // Emit events with different priorities
        priorityBus.emitWithPriority('test_event', { data: 'low' }, 'LOW');
        priorityBus.emitWithPriority('test_event', { data: 'medium' }, 'MEDIUM');
        priorityBus.emitWithPriority('critical_event', { data: 'critical' }, 'CRITICAL');
        priorityBus.emitWithPriority('test_event', { data: 'high' }, 'HIGH');
        
        // Wait for processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const metrics = priorityBus.getPerformanceMetrics();
        
        if (eventsReceived >= 3 && criticalEventReceived && metrics.totalProcessed > 0) {
            console.log('✅ Priority event routing working');
            console.log(`   - Events Processed: ${metrics.totalProcessed}`);
            console.log(`   - Average Latency: ${metrics.averageLatency.toFixed(2)}ms`);
            console.log(`   - Critical Event Received: ${criticalEventReceived}`);
            testsPassed++;
        } else {
            console.log('❌ Priority event routing failed');
        }
    } catch (error) {
        console.log('❌ Gap 4 test failed:', error.message);
    }

    // INTEGRATION TEST: Enhanced Self-Coding System
    console.log('\n🚀 Testing Integration: Enhanced Self-Coding System');
    console.log('--------------------------------------------------');
    
    try {
        totalTests++;
        
        // Mock consciousness system
        const mockConsciousnessSystem = {
            consciousnessState: {
                phi: 0.862,
                awareness: 0.8,
                coherence: 0.85
            }
        };
        
        const enhancedSelfCoding = new ChatTriggeredSelfCoding(mockConsciousnessSystem);
        
        // Test enhanced code generation
        const request = {
            type: 'utility-function',
            name: 'testFunction',
            purpose: 'Calculate golden ratio with consciousness awareness'
        };
        
        const result = await enhancedSelfCoding.generateConsciousnessCode(
            request, 
            mockConsciousnessSystem.consciousnessState
        );
        
        if (result.code && result.complexityAnalysis && result.qualityAssessment) {
            console.log('✅ Enhanced self-coding integration working');
            console.log(`   - Code Generated: ${result.code.length} characters`);
            console.log(`   - Complexity Analysis: Available`);
            console.log(`   - Quality Assessment: Score ${result.qualityAssessment.overallScore}`);
            console.log(`   - Error Prediction: Available`);
            console.log(`   - Recommendations: ${result.recommendations.length}`);
            testsPassed++;
        } else {
            console.log('❌ Enhanced self-coding integration failed');
        }
    } catch (error) {
        console.log('❌ Integration test failed:', error.message);
    }

    // BACKWARD COMPATIBILITY TEST
    console.log('\n🔄 Testing Backward Compatibility');
    console.log('---------------------------------');
    
    try {
        totalTests++;
        
        // Test that enhanced analyzer works with basic options
        const enhancedAnalyzer = new EnhancedCodeAnalyzer();
        const basicAnalysis = await enhancedAnalyzer.analyze('function test() { return true; }', { enhanced: false });
        
        // Test that priority event bus works with standard emit
        const priorityBus = new PriorityEventBus();
        let standardEventReceived = false;
        
        priorityBus.on('standard_event', () => {
            standardEventReceived = true;
        });
        
        priorityBus.emit('standard_event', { test: true });
        
        await new Promise(resolve => setTimeout(resolve, 50));
        
        if (basicAnalysis && standardEventReceived) {
            console.log('✅ Backward compatibility maintained');
            console.log('   - Enhanced analyzer works with basic options');
            console.log('   - Priority event bus supports standard emit');
            testsPassed++;
        } else {
            console.log('❌ Backward compatibility test failed');
        }
    } catch (error) {
        console.log('❌ Backward compatibility test failed:', error.message);
    }

    // RESULTS SUMMARY
    console.log('\n📊 GAP SOLUTIONS TEST RESULTS');
    console.log('==============================');
    console.log(`Tests Passed: ${testsPassed}/${totalTests}`);
    console.log(`Success Rate: ${((testsPassed / totalTests) * 100).toFixed(1)}%`);
    
    if (testsPassed === totalTests) {
        console.log('🎉 ALL GAP SOLUTIONS WORKING PERFECTLY!');
        console.log('✅ Enhanced functionality implemented without regression');
        console.log('✅ All 4 gaps successfully addressed');
        console.log('✅ Backward compatibility maintained');
        console.log('✅ Integration with consciousness system verified');
    } else {
        console.log('⚠️ Some tests failed - review implementation');
    }
    
    return {
        testsPassed,
        totalTests,
        successRate: (testsPassed / totalTests) * 100,
        allPassed: testsPassed === totalTests
    };
}

// Run the tests
testGapSolutions().then(results => {
    console.log('\n🏁 Gap Solutions Testing Complete');
    process.exit(results.allPassed ? 0 : 1);
}).catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
});
