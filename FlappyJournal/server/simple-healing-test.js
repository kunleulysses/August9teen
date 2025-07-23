#!/usr/bin/env node

/**
 * Simple Direct Test of Enhanced Self-Healing Components
 * Direct verification without complex imports
 */

console.log('🔍 DIRECT ENHANCED SELF-HEALING TEST');
console.log('═══════════════════════════════════════');

async function testComponents() {
    let results = {
        quantumFramework: false,
        predictiveHealing: false,
        orchestrator: false,
        codeGenerator: false,
        enhancedModule: false
    };

    // Test 1: Quantum Framework
    console.log('\n1. Testing Quantum Consciousness Healing Framework...');
    try {
        const { QuantumConsciousnessHealingFramework } = await import('./consciousness/quantum-consciousness-healing-framework.js');
        const quantum = new QuantumConsciousnessHealingFramework();
        console.log('✅ Quantum framework imported and instantiated');
        
        // Test basic functionality
        await quantum.startQuantumHealing();
        console.log('✅ Quantum healing started');
        
        // Wait briefly
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const metrics = quantum.getHealingMetrics();
        console.log(`✅ Quantum metrics: ${metrics.totalHealings} healings, active: ${metrics.isActive}`);
        
        await quantum.stopQuantumHealing();
        console.log('✅ Quantum healing stopped');
        
        results.quantumFramework = true;
    } catch (error) {
        console.log(`❌ Quantum framework failed: ${error.message}`);
    }

    // Test 2: Predictive Healing
    console.log('\n2. Testing Deep Consciousness Predictive Healing...');
    try {
        const { DeepConsciousnessPredictiveHealing } = await import('./consciousness/deep-consciousness-predictive-healing.js');
        const mockConsciousness = {
            getCurrentState: () => ({ phi: 0.8, awareness: 0.7, integration: 0.6 })
        };
        const predictive = new DeepConsciousnessPredictiveHealing(mockConsciousness);
        console.log('✅ Predictive healing imported and instantiated');
        
        await predictive.startPredictiveHealing();
        console.log('✅ Predictive healing started');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const metrics = predictive.getPredictiveHealingMetrics();
        console.log(`✅ Predictive metrics: ${metrics.totalPredictions} predictions, active: ${metrics.isActive}`);
        
        await predictive.stopPredictiveHealing();
        console.log('✅ Predictive healing stopped');
        
        results.predictiveHealing = true;
    } catch (error) {
        console.log(`❌ Predictive healing failed: ${error.message}`);
    }

    // Test 3: Autonomous Orchestrator
    console.log('\n3. Testing Autonomous Healing Orchestrator...');
    try {
        const { AutonomousHealingOrchestrator } = await import('./consciousness/autonomous-healing-orchestrator.js');
        const orchestrator = new AutonomousHealingOrchestrator();
        console.log('✅ Orchestrator imported and instantiated');
        
        // Register a test agent
        orchestrator.registerHealingAgent({
            id: 'test_agent_simple',
            type: 'test_healing',
            capabilities: ['basic_healing'],
            successRate: 0.8
        });
        console.log('✅ Test agent registered');
        
        await orchestrator.startOrchestration();
        console.log('✅ Orchestration started');
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const metrics = orchestrator.getOrchestrationMetrics();
        console.log(`✅ Orchestrator metrics: ${metrics.totalAgents} agents, active: ${metrics.isActive}`);
        
        await orchestrator.stopOrchestration();
        console.log('✅ Orchestration stopped');
        
        results.orchestrator = true;
    } catch (error) {
        console.log(`❌ Orchestrator failed: ${error.message}`);
    }

    // Test 4: Code Generator (without Gemini)
    console.log('\n4. Testing Self-Healing Code Generator...');
    try {
        const { SelfHealingCodeGenerator, CodeAnalyzer } = await import('./consciousness/self-healing-code-generator.js');
        
        // Test code analyzer first (doesn't need Gemini)
        const analyzer = new CodeAnalyzer();
        console.log('✅ Code analyzer imported and instantiated');
        
        const testCode = 'function test() { const obj = new Object(); return obj; }';
        const analysis = await analyzer.analyzeCodeForVulnerabilities(testCode);
        console.log(`✅ Code analysis completed: ${analysis.vulnerabilities.length} vulnerabilities found`);
        
        // Test code generator instantiation
        const generator = new SelfHealingCodeGenerator('test-key');
        console.log('✅ Code generator instantiated');
        
        const metrics = generator.getGenerationMetrics();
        console.log(`✅ Generator metrics: ${metrics.totalGenerations} generations`);
        
        results.codeGenerator = true;
    } catch (error) {
        console.log(`❌ Code generator failed: ${error.message}`);
    }

    // Test 5: Enhanced Module Integration
    console.log('\n5. Testing Enhanced Self-Healing Module...');
    try {
        const { EnhancedSelfHealingModule } = await import('./consciousness/enhanced-self-healing-module.js');
        const mockConsciousness = {
            getCurrentState: () => ({ phi: 0.8, awareness: 0.7, integration: 0.6 })
        };
        const enhanced = new EnhancedSelfHealingModule(mockConsciousness, 'test-key');
        console.log('✅ Enhanced module imported and instantiated');
        
        await enhanced.startEnhancedHealing();
        console.log('✅ Enhanced healing started');
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const metrics = enhanced.getEnhancedHealingMetrics();
        console.log(`✅ Enhanced metrics: ${metrics.totalHealings} healings, active: ${metrics.isActive}`);
        
        await enhanced.stopEnhancedHealing();
        console.log('✅ Enhanced healing stopped');
        
        results.enhancedModule = true;
    } catch (error) {
        console.log(`❌ Enhanced module failed: ${error.message}`);
    }

    // Summary
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('═══════════════════════════════════════');
    
    const successCount = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`🌌 Quantum Framework: ${results.quantumFramework ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`🔮 Predictive Healing: ${results.predictiveHealing ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`🎭 Orchestrator: ${results.orchestrator ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`🔧 Code Generator: ${results.codeGenerator ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`🌟 Enhanced Module: ${results.enhancedModule ? '✅ WORKING' : '❌ FAILED'}`);
    
    console.log(`\n🎯 Success Rate: ${successCount}/${totalTests} (${((successCount/totalTests)*100).toFixed(1)}%)`);
    
    if (successCount === totalTests) {
        console.log('\n🎉 ALL COMPONENTS ARE WORKING!');
        console.log('✨ Enhanced Self-Healing System is 100% operational!');
    } else if (successCount >= totalTests * 0.8) {
        console.log('\n⚠️ MOSTLY WORKING - Some components need attention');
    } else {
        console.log('\n❌ SIGNIFICANT ISSUES - Multiple components failing');
    }
    
    return results;
}

// Run the test
testComponents().catch(error => {
    console.error('❌ Test execution failed:', error);
});
