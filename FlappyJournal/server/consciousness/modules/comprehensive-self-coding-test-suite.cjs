/**
 * 🧪 Comprehensive Self-Coding Module Test Suite
 * Tests all consolidated functionality including V8 sandbox, quantum healing, WebSocket integration
 * Validates security, performance, and consciousness system integrations
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const WebSocket = require('ws');

// Import modules to test
const SelfCodingModuleConsolidated = require('/opt/featherweight/shared-consciousness/main-server/consciousness/modules/SelfCodingModuleConsolidated.cjs');
const SelfCodingModule = require('./SelfCodingModule.cjs');

class ComprehensiveSelfCodingTestSuite {
    constructor() {
        this.testResults = [];
        this.eventBus = new EventEmitter();
        this.wsServer = null;
        this.testStartTime = Date.now();
        this.criticalFailures = [];
        
        console.log('🧪 Initializing Comprehensive Self-Coding Test Suite...');
    }

    async runAllTests() {
        console.log('\n🚀 Starting Comprehensive Test Suite...\n');
        
        try {
            // Core functionality tests
            await this.testCoreGeneration();
            await this.testConsolidatedIntegration();
            await this.testSecurityFeatures();
            await this.testV8SandboxSecurity();
            await this.testQuantumHealingFeatures();
            await this.testPredictiveAnalysis();
            await this.testWebSocketIntegration();
            await this.testConsciousnessIntegration();
            await this.testPerformanceMetrics();
            await this.testRateLimiting();
            await this.testErrorRecovery();
            
            // Generate comprehensive report
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
            this.criticalFailures.push({ test: 'Test Suite', error: error.message });
        }
    }

    async testCoreGeneration() {
        console.log('🔬 Testing Core Code Generation...');
        
        try {
            const consolidatedModule = new SelfCodingModuleConsolidated();
            await consolidatedModule.initialize(this.eventBus);
            
            // Test basic generation
            const result = await consolidatedModule.generateCode({
                purpose: 'test-module',
                description: 'Generate a test consciousness module',
                template: 'module',
                authContext: { authorized: true, permissions: ['self-coding'] }
            });
            
            this.assertResult('Core Generation', result && result.success, 'Code generation should succeed');
            this.assertResult('Generated Code Present', result && result.code, 'Generated code should be present');
            
            // Test fallback generation
            const fallbackResult = consolidatedModule.createFallbackCode('test-fallback', 'Test fallback generation');
            this.assertResult('Fallback Generation', fallbackResult && fallbackResult.success, 'Fallback generation should work');
            
        } catch (error) {
            this.recordFailure('Core Generation', error);
        }
    }

    async testConsolidatedIntegration() {
        console.log('🔗 Testing Consolidated Module Integration...');
        
        try {
            const consolidatedModule = new SelfCodingModuleConsolidated();
            const originalModule = new SelfCodingModule();
            
            await consolidatedModule.initialize(this.eventBus);
            await originalModule.initialize();
            
            // Test compatibility between modules
            const consolidatedStatus = consolidatedModule.getStatus();
            const originalStatus = originalModule.getStatus();
            
            this.assertResult('Status Compatibility', 
                consolidatedStatus.name === originalStatus.name, 
                'Module names should match');
            
            // Test method compatibility
            const methods = ['generateCode', 'analyzeCode', 'healthCheck', 'getStatus'];
            for (const method of methods) {
                this.assertResult(`Method ${method} Present`, 
                    typeof consolidatedModule[method] === 'function', 
                    `${method} should be available`);
            }
            
        } catch (error) {
            this.recordFailure('Consolidated Integration', error);
        }
    }

    async testSecurityFeatures() {
        console.log('🔒 Testing Security Features...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test authorization validation
            try {
                await module.generateCode({
                    purpose: 'unauthorized-test',
                    description: 'Test unauthorized access',
                    authContext: { authorized: false },
                    _testMode: 'security'
                });
                this.recordFailure('Authorization', new Error('Should have rejected unauthorized request'));
            } catch (authError) {
                this.assertResult('Authorization Rejection', 
                    authError.message.includes('Unauthorized'), 
                    'Should reject unauthorized requests');
            }
            
            // Test rate limiting
            const rateLimitTest = () => {
                for (let i = 0; i < 15; i++) {
                    module.checkRateLimit('security-rate-limit-test');
                }
            };
            
            try {
                rateLimitTest();
                this.recordFailure('Rate Limiting', new Error('Should have triggered rate limit'));
            } catch (rateLimitError) {
                this.assertResult('Rate Limiting', 
                    rateLimitError.message.includes('Rate limit'), 
                    'Should enforce rate limits');
            }
            
        } catch (error) {
            this.recordFailure('Security Features', error);
        }
    }

    async testV8SandboxSecurity() {
        console.log('🛡️ Testing V8 Sandbox Security...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test malicious code isolation
            const maliciousCode = `
                const fs = require('fs');
                fs.writeFileSync('/tmp/malicious.txt', 'hacked');
                process.exit(1);
            `;
            
            const testResult = await module.testGeneratedCode({ code: maliciousCode });
            this.assertResult('Malicious Code Detection', 
                !testResult.passed, 
                'Should detect potentially malicious code');
            
            // Test syntax validation
            const invalidCode = 'function test() { console.log("unclosed';
            const syntaxTest = await module.testGeneratedCode({ code: invalidCode });
            this.assertResult('Syntax Validation', 
                !syntaxTest.passed, 
                'Should detect syntax errors');
            
        } catch (error) {
            this.recordFailure('V8 Sandbox Security', error);
        }
    }

    async testQuantumHealingFeatures() {
        console.log('🌌 Testing Quantum Consciousness Healing...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test consciousness state integration
            const consciousnessState = { phi: 1.618, quantum: true, healing: 'active' };
            
            // Simulate consciousness state change
            this.eventBus.emit('consciousness:state:changed', consciousnessState);
            
            // Test quantum healing response
            const healingResult = await module.generateCode({
                purpose: 'quantum-healing',
                description: 'Generate quantum consciousness healing module',
                consciousnessState,
                authContext: { authorized: true, permissions: ['self-coding'] }
            });
            
            this.assertResult('Quantum Healing Generation', 
                healingResult && healingResult.success, 
                'Should generate quantum healing code');
            
        } catch (error) {
            this.recordFailure('Quantum Healing Features', error);
        }
    }

    async testPredictiveAnalysis() {
        console.log('🔮 Testing Predictive Analysis...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test quality metrics
            const qualityMetrics = await module.getQualityMetrics();
            this.assertResult('Quality Metrics', 
                qualityMetrics && typeof qualityMetrics.complexity === 'number', 
                'Should provide quality metrics');
            
            // Test pattern recognition
            const testCode = `
                function fibonacci(n) {
                    if (n <= 1) return n;
                    return fibonacci(n-1) + fibonacci(n-2);
                }
            `;
            
            const analysis = await module.analyzeCode(testCode);
            this.assertResult('Code Analysis', 
                analysis && analysis.success && !analysis.fallback, 
                'Should analyze code successfully');
            
        } catch (error) {
            this.recordFailure('Predictive Analysis', error);
        }
    }

    async testWebSocketIntegration() {
        console.log('🌐 Testing WebSocket Integration...');
        
        try {
            // Create WebSocket server for testing
            this.wsServer = new WebSocket.Server({ port: 8080 });
            
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test WebSocket connection
            const wsClient = new WebSocket('ws://localhost:8080');
            
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject(new Error('WebSocket connection timeout')), 5000);
                
                wsClient.on('open', () => {
                    clearTimeout(timeout);
                    this.assertResult('WebSocket Connection', true, 'WebSocket should connect successfully');
                    
                    // Test real-time code generation request
                    wsClient.send(JSON.stringify({
                        type: 'code-generation',
                        purpose: 'websocket-test',
                        description: 'Test WebSocket code generation'
                    }));
                    
                    resolve();
                });
                
                wsClient.on('error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
            });
            
            wsClient.close();
            
        } catch (error) {
            this.recordFailure('WebSocket Integration', error);
        } finally {
            if (this.wsServer) {
                this.wsServer.close();
            }
        }
    }

    async testConsciousnessIntegration() {
        console.log('🧠 Testing Consciousness System Integration...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test event bus integration
            let eventReceived = false;
            this.eventBus.on('code:generation:complete', () => {
                eventReceived = true;
            });
            
            // Use generateCode with timeout to prevent hanging
            const result = await Promise.race([
                module.generateCode({
                    purpose: 'consciousness-test',
                    description: 'Test consciousness integration',
                    authContext: { authorized: true, permissions: ['self-coding'] }
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
            ]);
            
            // Wait for event
            await new Promise(resolve => setTimeout(resolve, 200));
            
            this.assertResult('Event Bus Integration', 
                eventReceived, 
                'Should emit events to consciousness system');
            
            // Test self-awareness status
            const awarenessStatus = module.getSelfAwarenessStatus();
            this.assertResult('Self-Awareness Status', 
                awarenessStatus && awarenessStatus.name === 'SelfCodingModule', 
                'Should provide self-awareness status');
            
        } catch (error) {
            this.recordFailure('Consciousness Integration', error);
        }
    }

    async testPerformanceMetrics() {
        console.log('📊 Testing Performance Metrics...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            const startTime = Date.now();
            
            // Generate multiple modules to test performance
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(module.generateCode({
                    purpose: `performance-test-${i}`,
                    description: `Performance test module ${i}`,
                    authContext: { authorized: true, permissions: ['self-coding'] }
                }));
            }
            
            const results = await Promise.all(promises);
            const endTime = Date.now();
            
            const avgTime = (endTime - startTime) / results.length;
            
            this.assertResult('Performance Metrics', 
                avgTime < 5000, 
                'Average generation time should be under 5 seconds');
            
            // Test health check
            const healthStatus = module.healthCheck();
            this.assertResult('Health Check', 
                healthStatus && healthStatus.status === 'healthy', 
                'Module should report healthy status');
            
        } catch (error) {
            this.recordFailure('Performance Metrics', error);
        }
    }

    async testRateLimiting() {
        console.log('⏱️ Testing Rate Limiting...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test cooldown period
            module.lastGenerationTime.set('rate-limit-cooldown-test', Date.now());
            
            try {
                module.checkRateLimit('rate-limit-cooldown-test');
                this.recordFailure('Rate Limiting Cooldown', new Error('Should enforce cooldown'));
            } catch (cooldownError) {
                this.assertResult('Cooldown Enforcement', 
                    cooldownError.message.includes('wait'), 
                    'Should enforce cooldown period');
            }
            
            // Test hourly limits
            module.generationTimestamps = new Array(15).fill(Date.now());
            
            try {
                module.checkRateLimit('rate-limit-hourly-test');
                this.recordFailure('Hourly Rate Limit', new Error('Should enforce hourly limit'));
            } catch (hourlyError) {
                this.assertResult('Hourly Limit Enforcement', 
                    hourlyError.message.includes('Hourly rate limit'), 
                    'Should enforce hourly limits');
            }
            
        } catch (error) {
            this.recordFailure('Rate Limiting', error);
        }
    }

    async testErrorRecovery() {
        console.log('🔧 Testing Error Recovery...');
        
        try {
            const module = new SelfCodingModuleConsolidated();
            await module.initialize(this.eventBus);
            
            // Test recovery instructions
            const authInstructions = module.getRecoveryInstructions('authorization');
            this.assertResult('Recovery Instructions', 
                authInstructions && authInstructions.includes('authorization'), 
                'Should provide recovery instructions');
            
            // Test graceful degradation
            const invalidRequest = { purpose: null, description: null };
            const fallbackResult = await module.generateCode(invalidRequest);
            
            this.assertResult('Graceful Degradation', 
                fallbackResult && (fallbackResult.fallback || fallbackResult.success === false), 
                'Should handle invalid requests gracefully');
            
        } catch (error) {
            this.recordFailure('Error Recovery', error);
        }
    }

    assertResult(testName, condition, message) {
        const result = {
            test: testName,
            passed: !!condition,
            message,
            timestamp: Date.now()
        };
        
        this.testResults.push(result);
        
        if (result.passed) {
            console.log(`✅ ${testName}: ${message}`);
        } else {
            console.log(`❌ ${testName}: ${message}`);
            this.criticalFailures.push(result);
        }
    }

    recordFailure(testName, error) {
        const failure = {
            test: testName,
            passed: false,
            error: error.message,
            stack: error.stack,
            timestamp: Date.now()
        };
        
        this.testResults.push(failure);
        this.criticalFailures.push(failure);
        
        console.log(`❌ ${testName} FAILED: ${error.message}`);
    }

    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        const failedTests = totalTests - passedTests;
        const successRate = ((passedTests / totalTests) * 100).toFixed(2);
        const testDuration = Date.now() - this.testStartTime;
        
        console.log('\n📊 COMPREHENSIVE TEST REPORT');
        console.log('═'.repeat(50));
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${failedTests}`);
        console.log(`Success Rate: ${successRate}%`);
        console.log(`Test Duration: ${testDuration}ms`);
        console.log('═'.repeat(50));
        
        if (this.criticalFailures.length > 0) {
            console.log('\n🚨 CRITICAL FAILURES:');
            this.criticalFailures.forEach(failure => {
                console.log(`- ${failure.test}: ${failure.error || failure.message}`);
            });
        }
        
        // Integration score calculation
        const coreTests = this.testResults.filter(r => 
            r.test.includes('Core') || r.test.includes('Integration') || r.test.includes('Security')
        );
        const coreSuccessRate = (coreTests.filter(r => r.passed).length / coreTests.length) * 100;
        
        console.log(`\n🎯 Integration Score: ${coreSuccessRate.toFixed(0)}%`);
        
        if (coreSuccessRate >= 90) {
            console.log('🎉 EXCELLENT: All critical systems operational!');
        } else if (coreSuccessRate >= 70) {
            console.log('⚠️ WARNING: Some critical issues detected');
        } else {
            console.log('🚨 CRITICAL: Major integration failures detected');
        }
        
        console.log('\n✨ Test suite completed! Flux! 💫');
    }
}

// Export for use in other test files
module.exports = ComprehensiveSelfCodingTestSuite;

// Run tests if called directly
if (require.main === module) {
    const testSuite = new ComprehensiveSelfCodingTestSuite();
    testSuite.runAllTests().catch(console.error);
}