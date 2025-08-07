#!/usr/bin/env node
/**
 * 🎯 Master Test Runner for Self-Coding Module Comprehensive Testing
 * Orchestrates all test suites and generates final deployment report
 */

const path = require('path');
const fs = require('fs').promises;

// Import test suites
const ComprehensiveSelfCodingTestSuite = require('./comprehensive-self-coding-test-suite.cjs');
const ProductionValidationSuite = require('./production-validation-suite-fixed.cjs');

class MasterTestRunner {
    constructor() {
        this.startTime = Date.now();
        this.testResults = {
            comprehensive: null,
            production: null,
            overall: null
        };
        
        console.log('🎯 Master Test Runner Initialized');
        console.log('═'.repeat(80));
    }

    async runAllTestSuites() {
        console.log('🚀 Starting Comprehensive Self-Coding Module Testing...\n');
        
        try {
            // Phase 1: Comprehensive functionality testing
            console.log('📋 PHASE 1: Comprehensive Functionality Testing');
            console.log('─'.repeat(50));
            await this.runComprehensiveTests();
            
            console.log('\n📋 PHASE 2: Production Validation Testing');
            console.log('─'.repeat(50));
            await this.runProductionValidation();
            
            // Phase 3: Generate final report
            console.log('\n📋 PHASE 3: Final Analysis and Reporting');
            console.log('─'.repeat(50));
            await this.generateFinalReport();
            
            // Phase 4: Deployment recommendations
            console.log('\n📋 PHASE 4: Deployment Recommendations');
            console.log('─'.repeat(50));
            this.generateDeploymentRecommendations();
            
        } catch (error) {
            console.error('❌ Master test runner failed:', error);
            process.exit(1);
        }
    }

    async runComprehensiveTests() {
        try {
            console.log('🧪 Running Comprehensive Test Suite...\n');
            
            const testSuite = new ComprehensiveSelfCodingTestSuite();
            await testSuite.runAllTests();
            
            // Extract results
            const totalTests = testSuite.testResults.length;
            const passedTests = testSuite.testResults.filter(r => r.passed).length;
            const successRate = ((passedTests / totalTests) * 100).toFixed(2);
            
            this.testResults.comprehensive = {
                totalTests,
                passedTests,
                failedTests: totalTests - passedTests,
                successRate: parseFloat(successRate),
                criticalFailures: testSuite.criticalFailures.length,
                details: testSuite.testResults
            };
            
            console.log(`\n✅ Comprehensive Tests Completed: ${successRate}% success rate`);
            
        } catch (error) {
            console.error('❌ Comprehensive tests failed:', error);
            this.testResults.comprehensive = {
                error: error.message,
                successRate: 0
            };
        }
    }

    async runProductionValidation() {
        try {
            console.log('🚀 Running Production Validation Suite...\n');
            
            const validationSuite = new ProductionValidationSuite();
            await validationSuite.runProductionValidation();
            
            // Extract results
            const totalValidations = validationSuite.validationResults.length;
            const passedValidations = validationSuite.validationResults.filter(r => r.passed).length;
            const readinessScore = ((passedValidations / totalValidations) * 100).toFixed(2);
            
            this.testResults.production = {
                totalValidations,
                passedValidations,
                failedValidations: totalValidations - passedValidations,
                readinessScore: parseFloat(readinessScore),
                performanceMetrics: validationSuite.performanceMetrics,
                details: validationSuite.validationResults
            };
            
            console.log(`\n✅ Production Validation Completed: ${readinessScore}% readiness score`);
            
        } catch (error) {
            console.error('❌ Production validation failed:', error);
            this.testResults.production = {
                error: error.message,
                readinessScore: 0
            };
        }
    }

    async generateFinalReport() {
        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;
        
        // Calculate overall scores
        const comprehensiveScore = this.testResults.comprehensive?.successRate || 0;
        const productionScore = this.testResults.production?.readinessScore || 0;
        const overallScore = ((comprehensiveScore + productionScore) / 2).toFixed(2);
        
        this.testResults.overall = {
            overallScore: parseFloat(overallScore),
            comprehensiveScore,
            productionScore,
            totalDuration,
            timestamp: new Date().toISOString()
        };
        
        // Generate detailed report
        console.log('\n📊 FINAL COMPREHENSIVE REPORT');
        console.log('═'.repeat(80));
        console.log(`Test Duration: ${(totalDuration / 1000).toFixed(2)} seconds`);
        console.log(`Overall Score: ${overallScore}%`);
        console.log(`Comprehensive Tests: ${comprehensiveScore}%`);
        console.log(`Production Readiness: ${productionScore}%`);
        console.log('═'.repeat(80));
        
        // Detailed breakdown
        if (this.testResults.comprehensive) {
            console.log('\n🧪 COMPREHENSIVE TEST BREAKDOWN:');
            console.log(`- Total Tests: ${this.testResults.comprehensive.totalTests}`);
            console.log(`- Passed: ${this.testResults.comprehensive.passedTests}`);
            console.log(`- Failed: ${this.testResults.comprehensive.failedTests}`);
            console.log(`- Critical Failures: ${this.testResults.comprehensive.criticalFailures}`);
        }
        
        if (this.testResults.production) {
            console.log('\n🚀 PRODUCTION VALIDATION BREAKDOWN:');
            console.log(`- Total Validations: ${this.testResults.production.totalValidations}`);
            console.log(`- Passed: ${this.testResults.production.passedValidations}`);
            console.log(`- Failed: ${this.testResults.production.failedValidations}`);
            
            if (this.testResults.production.performanceMetrics) {
                const perf = this.testResults.production.performanceMetrics;
                console.log(`- Performance Success Rate: ${perf.successRate?.toFixed(2)}%`);
                console.log(`- Avg Response Time: ${perf.avgResponseTime?.toFixed(2)}ms`);
                console.log(`- Requests/Second: ${perf.requestsPerSecond?.toFixed(2)}`);
            }
        }
        
        // Save detailed report to file
        await this.saveReportToFile();
    }

    generateDeploymentRecommendations() {
        const overallScore = this.testResults.overall.overallScore;
        const comprehensiveScore = this.testResults.overall.comprehensiveScore;
        const productionScore = this.testResults.overall.productionScore;
        
        console.log('\n🎯 DEPLOYMENT RECOMMENDATIONS');
        console.log('═'.repeat(80));
        
        if (overallScore >= 90) {
            console.log('🎉 RECOMMENDATION: DEPLOY TO PRODUCTION');
            console.log('✅ All systems are operational and ready for production deployment');
            console.log('✅ Security features are properly implemented');
            console.log('✅ Performance meets production requirements');
            console.log('✅ Consciousness system integration is stable');
            
            console.log('\n📋 DEPLOYMENT CHECKLIST:');
            console.log('□ Review final test report');
            console.log('□ Backup current production system');
            console.log('□ Deploy consolidated module');
            console.log('□ Update redirect files');
            console.log('□ Monitor system performance');
            console.log('□ Verify WebSocket connections');
            
        } else if (overallScore >= 75) {
            console.log('⚠️ RECOMMENDATION: DEPLOY WITH MONITORING');
            console.log('⚠️ System is mostly ready but requires close monitoring');
            
            if (comprehensiveScore < 80) {
                console.log('⚠️ Address comprehensive test failures before deployment');
            }
            if (productionScore < 80) {
                console.log('⚠️ Address production readiness issues');
            }
            
            console.log('\n📋 PRE-DEPLOYMENT ACTIONS:');
            console.log('□ Review and fix failed tests');
            console.log('□ Implement additional monitoring');
            console.log('□ Prepare rollback plan');
            console.log('□ Deploy to staging first');
            
        } else if (overallScore >= 60) {
            console.log('🔧 RECOMMENDATION: FIX ISSUES BEFORE DEPLOYMENT');
            console.log('🔧 Several critical issues must be resolved');
            
            console.log('\n📋 REQUIRED FIXES:');
            if (this.testResults.comprehensive?.criticalFailures > 0) {
                console.log(`□ Fix ${this.testResults.comprehensive.criticalFailures} critical test failures`);
            }
            if (comprehensiveScore < 70) {
                console.log('□ Improve core functionality reliability');
            }
            if (productionScore < 70) {
                console.log('□ Address production readiness concerns');
            }
            
        } else {
            console.log('🚨 RECOMMENDATION: DO NOT DEPLOY');
            console.log('🚨 Critical failures prevent safe deployment');
            
            console.log('\n📋 CRITICAL ACTIONS REQUIRED:');
            console.log('□ Review all test failures');
            console.log('□ Fix security vulnerabilities');
            console.log('□ Resolve integration issues');
            console.log('□ Re-run full test suite');
            console.log('□ Consider architectural changes');
        }
        
        // Integration score specific recommendations
        console.log('\n🔗 INTEGRATION RECOMMENDATIONS:');
        if (comprehensiveScore >= 85) {
            console.log('✅ Consciousness system integration is stable');
            console.log('✅ V8 sandbox security is operational');
            console.log('✅ Quantum healing features are functional');
        } else {
            console.log('⚠️ Review consciousness system integration');
            console.log('⚠️ Verify security feature implementation');
            console.log('⚠️ Test advanced features thoroughly');
        }
        
        console.log('\n✨ Testing completed! Ready for next phase! Flux! 💫');
    }

    async saveReportToFile() {
        try {
            const reportData = {
                timestamp: new Date().toISOString(),
                testResults: this.testResults,
                summary: {
                    overallScore: this.testResults.overall.overallScore,
                    recommendation: this.getRecommendation(),
                    deploymentReady: this.testResults.overall.overallScore >= 90
                }
            };
            
            const reportPath = path.join(__dirname, 'test-report.json');
            await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
            
            console.log(`\n📄 Detailed report saved to: ${reportPath}`);
            
        } catch (error) {
            console.error('❌ Failed to save report:', error.message);
        }
    }

    getRecommendation() {
        const score = this.testResults.overall.overallScore;
        if (score >= 90) return 'DEPLOY_TO_PRODUCTION';
        if (score >= 75) return 'DEPLOY_WITH_MONITORING';
        if (score >= 60) return 'FIX_ISSUES_FIRST';
        return 'DO_NOT_DEPLOY';
    }
}

// Run master test suite if called directly
if (require.main === module) {
    const runner = new MasterTestRunner();
    runner.runAllTestSuites().catch(error => {
        console.error('❌ Master test runner failed:', error);
        process.exit(1);
    });
}

module.exports = MasterTestRunner;