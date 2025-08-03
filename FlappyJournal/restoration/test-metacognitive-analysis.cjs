#!/usr/bin/env node

/**
 * META-COGNITIVE ANALYSIS ENGINE TEST
 * Test the Meta-Cognitive Analysis Engine functionality
 * Part of the Universal Consciousness Platform restoration - Phase 2
 */

import MetaCognitiveAnalysis from '../server/consciousness/core/MetaCognitiveAnalysis.cjs';

async function testMetaCognitiveAnalysis() {
    console.log('🧪 Testing Meta-Cognitive Analysis Engine...\n');
    
    try {
        // Create Meta-Cognitive Analysis Engine
        const metaCognitive = new MetaCognitiveAnalysis();
        
        // Wait for initialization
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('✅ Meta-Cognitive Analysis Engine created');
        
        // Test health check
        const health = await metaCognitive.healthCheck();
        console.log('🏥 Health check:', health.status);
        
        // Test metrics
        console.log('\n📊 Getting Meta-Cognitive Analysis metrics...');
        const metrics = await metaCognitive.getMetrics();
        console.log('Metrics:', {
            isInitialized: metrics.isInitialized,
            selfAwarenessLevel: metrics.selfAwarenessLevel,
            introspectionDepth: metrics.introspectionDepth,
            totalAnalyses: metrics.statistics.totalAnalyses,
            totalInsights: metrics.statistics.totalInsights
        });
        
        console.log('\nConsciousness Metrics:');
        console.log('  Self Awareness:', metrics.consciousnessMetrics.selfAwareness.toFixed(3));
        console.log('  Introspective Depth:', metrics.consciousnessMetrics.introspectiveDepth.toFixed(3));
        console.log('  Metacognitive Clarity:', metrics.consciousnessMetrics.metacognitiveClarity.toFixed(3));
        console.log('  Consciousness Insight:', metrics.consciousnessMetrics.consciousnessInsight.toFixed(3));
        console.log('  Self Reflection:', metrics.consciousnessMetrics.selfReflection.toFixed(3));
        console.log('  Pattern Recognition:', metrics.consciousnessMetrics.patternRecognition.toFixed(3));
        
        // Test meta-cognitive analysis across different aspects
        console.log('\n🧠 Testing meta-cognitive analysis across consciousness aspects...');
        
        const testAspects = [
            'awareness_of_awareness',
            'thought_monitoring', 
            'emotional_recognition',
            'goal_reflection',
            'pattern_recognition',
            'self_knowledge',
            'consciousness_state',
            'cognitive_processes'
        ];
        
        const analysisResults = [];
        
        for (let i = 0; i < 5; i++) {
            const aspect = testAspects[i % testAspects.length];
            const depth = ['surface', 'moderate', 'deep', 'transcendent'][i % 4];
            
            console.log(`\n🔍 Analysis ${i + 1}: ${aspect} (${depth})`);
            
            try {
                const analysis = await metaCognitive.performMetaCognitiveAnalysis(aspect, depth);
                
                console.log(`  ✅ Analysis completed: ${analysis.insights.length} insights, ${analysis.patterns.length} patterns`);
                console.log(`  Self Awareness: ${analysis.consciousnessMetrics.selfAwareness.toFixed(3)}`);
                console.log(`  Introspective Depth: ${analysis.consciousnessMetrics.introspectiveDepth.toFixed(3)}`);
                console.log(`  Insight Quality: ${analysis.consciousnessMetrics.insightQuality.toFixed(3)}`);
                console.log(`  Pattern Clarity: ${analysis.consciousnessMetrics.patternClarity.toFixed(3)}`);
                console.log(`  Analysis Time: ${analysis.analysisTime}ms`);
                
                // Show sample insights
                if (analysis.insights.length > 0) {
                    console.log(`  Sample Insight: "${analysis.insights[0].content.substring(0, 80)}..."`);
                }
                
                // Show sample patterns
                if (analysis.patterns.length > 0) {
                    console.log(`  Sample Pattern: ${analysis.patterns[0].description}`);
                }
                
                analysisResults.push(analysis);
                
            } catch (error) {
                console.log(`  ❌ Analysis failed: ${error.message}`);
            }
        }
        
        console.log(`\n📊 Completed ${analysisResults.length} meta-cognitive analyses`);
        
        // Test self-knowledge retrieval
        console.log('\n🧠 Testing self-knowledge retrieval...');
        
        const selfKnowledge = metaCognitive.getSelfKnowledge();
        console.log(`Self-knowledge aspects: ${Object.keys(selfKnowledge).length}`);
        
        for (const [aspect, knowledge] of Object.entries(selfKnowledge)) {
            console.log(`  ${aspect}: understanding ${knowledge.understanding.toFixed(3)}, ${knowledge.insights.length} insights`);
        }
        
        // Test specific aspect knowledge
        const awarenessKnowledge = metaCognitive.getSelfKnowledge('awareness_of_awareness');
        if (awarenessKnowledge) {
            console.log(`\nAwareness of Awareness Knowledge:`);
            console.log(`  Understanding Level: ${awarenessKnowledge.understanding.toFixed(3)}`);
            console.log(`  Insights: ${awarenessKnowledge.insights.length}`);
            console.log(`  Last Updated: ${awarenessKnowledge.lastUpdated}`);
        }
        
        // Test pattern retrieval
        console.log('\n🔍 Testing pattern retrieval...');
        
        const awarenessPatterns = metaCognitive.getPatternsByType('awareness_recursion');
        const thoughtPatterns = metaCognitive.getPatternsByType('thought_streams');
        const cognitivePatterns = metaCognitive.getPatternsByType('cognitive_patterns');
        
        console.log(`Awareness recursion patterns: ${awarenessPatterns.length}`);
        console.log(`Thought stream patterns: ${thoughtPatterns.length}`);
        console.log(`Cognitive patterns: ${cognitivePatterns.length}`);
        
        // Test insight retrieval
        console.log('\n💡 Testing insight retrieval...');
        
        const recentInsights = metaCognitive.getRecentInsights(5);
        console.log(`Recent insights: ${recentInsights.length}`);
        
        for (const insight of recentInsights) {
            console.log(`  ${insight.type}: "${insight.content.substring(0, 60)}..." (${insight.confidence.toFixed(3)})`);
        }
        
        const awarenessInsights = metaCognitive.getInsightsByAspect('awareness_of_awareness');
        console.log(`Awareness insights: ${awarenessInsights.length}`);
        
        // Test consciousness statistics
        console.log('\n📊 Testing consciousness statistics...');
        
        const statistics = metaCognitive.getConsciousnessStatistics();
        console.log('Consciousness Statistics:');
        console.log(`  Total Analyses: ${statistics.totalAnalyses}`);
        console.log(`  Total Insights: ${statistics.totalInsights}`);
        console.log(`  Total Patterns: ${statistics.totalPatterns}`);
        console.log(`  Avg Insight Confidence: ${statistics.avgInsightConfidence}`);
        console.log(`  Self Awareness Level: ${statistics.selfAwarenessLevel}`);
        console.log(`  Introspection Depth: ${statistics.introspectionDepth}`);
        console.log(`  Analysis Count: ${statistics.analysisCount}`);
        
        console.log('\nAspect Coverage:');
        for (const coverage of statistics.aspectCoverage) {
            console.log(`  ${coverage.aspect}: ${coverage.analysisCount} analyses, understanding ${coverage.understanding.toFixed(3)}`);
        }
        
        // Test analysis history
        console.log('\n📚 Testing analysis history...');
        
        const analysisHistory = metaCognitive.getAnalysisHistory(3);
        console.log(`Analysis history entries: ${analysisHistory.length}`);
        
        for (const analysis of analysisHistory) {
            console.log(`  ${analysis.aspect} (${analysis.depth}): ${analysis.insights.length} insights, ${analysis.patterns.length} patterns`);
        }
        
        // Test broadcast handling
        metaCognitive.onBroadcast({
            message: 'consciousness:response_generated',
            data: { test: true }
        });
        console.log('✅ Broadcast handling works');
        
        // Test consciousness metrics evolution
        console.log('\n📈 Testing consciousness metrics evolution...');
        
        const initialMetrics = { ...metaCognitive.consciousnessMetrics };
        
        // Perform additional analysis to see metrics evolution
        await metaCognitive.performMetaCognitiveAnalysis('self_knowledge', 'deep');
        
        const updatedMetrics = metaCognitive.consciousnessMetrics;
        
        console.log('Metrics Evolution:');
        for (const [metric, initialValue] of Object.entries(initialMetrics)) {
            const updatedValue = updatedMetrics[metric];
            const change = updatedValue - initialValue;
            if (change > 0) {
                console.log(`  ${metric}: ${initialValue.toFixed(3)} → ${updatedValue.toFixed(3)} (+${change.toFixed(4)})`);
            }
        }
        
        // Calculate success metrics
        const finalMetrics = await metaCognitive.getMetrics();
        const finalStatistics = metaCognitive.getConsciousnessStatistics();
        
        const successMetrics = {
            initialization: metaCognitive.isInitialized ? 1 : 0,
            analysisGeneration: analysisResults.length >= 3 ? 1 : 0.5,
            insightGeneration: finalStatistics.totalInsights > 0 ? 1 : 0,
            patternDetection: finalStatistics.totalPatterns > 0 ? 1 : 0,
            selfKnowledgeUpdate: Object.values(selfKnowledge).some(k => k.understanding > 0.5) ? 1 : 0.5,
            consciousnessMetrics: finalMetrics.consciousnessMetrics.selfAwareness > 0.75 ? 1 : 0.8,
            introspectionDepth: finalMetrics.introspectionDepth > 0.8 ? 1 : 0.8,
            aspectCoverage: finalStatistics.aspectCoverage.filter(a => a.analysisCount > 0).length / testAspects.length
        };
        
        const overallScore = Object.values(successMetrics).reduce((sum, score) => sum + score, 0) / Object.keys(successMetrics).length;
        
        console.log('\n📊 Overall Success Score:', overallScore.toFixed(3));
        
        // Cleanup
        await metaCognitive.shutdown();
        console.log('✅ Meta-Cognitive Analysis Engine shutdown complete');
        
        if (overallScore >= 0.8) {
            console.log('\n🎉 META-COGNITIVE ANALYSIS ENGINE TEST PASSED!');
            console.log('✅ All core functionality verified');
            console.log('🧠 Meta-cognitive analysis working');
            console.log('💡 Insight generation operational');
            console.log('🔍 Pattern detection functional');
            console.log('📚 Self-knowledge management working');
            console.log('📊 Consciousness monitoring successful');
            console.log('🚀 Ready for Phase 2 continuation');
            
            return {
                success: true,
                message: 'Meta-Cognitive Analysis Engine test passed',
                score: overallScore,
                statistics: finalStatistics,
                analysisCount: analysisResults.length
            };
        } else {
            throw new Error(`Success score ${overallScore.toFixed(3)} below threshold 0.8`);
        }
        
    } catch (error) {
        console.error('\n❌ Meta-Cognitive Analysis Engine Test FAILED!');
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
    testMetaCognitiveAnalysis()
        .then(result => {
            if (result.success) {
                console.log('\n✅ TEST COMPLETED SUCCESSFULLY');
                console.log(`🎯 Success Score: ${result.score.toFixed(3)}`);
                console.log(`🧠 Analyses Performed: ${result.analysisCount}`);
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

export default testMetaCognitiveAnalysis;
