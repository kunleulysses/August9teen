#!/usr/bin/env node
/**
 * 🔍 Debug and Monitor Self-Coding Module
 * Real-time debugging, monitoring, and health checking for production deployment
 */

const { EventEmitter } = require('events');
const fs = require('fs').promises;
const path = require('path');
const WebSocket = require('ws');

class SelfCodingDebugMonitor {
    constructor() {
        this.isMonitoring = false;
        this.healthChecks = [];
        this.performanceMetrics = [];
        this.errorLog = [];
        this.wsConnections = new Set();
        this.eventBus = new EventEmitter();
        
        console.log('🔍 Self-Coding Debug Monitor Initialized');
    }

    async startMonitoring() {
        console.log('🚀 Starting Real-Time Monitoring...\n');
        
        this.isMonitoring = true;
        
        try {
            // Start monitoring components
            await this.initializeModuleMonitoring();
            await this.startHealthChecking();
            await this.startPerformanceMonitoring();
            await this.startWebSocketMonitoring();
            await this.startConsciousnessMonitoring();
            
            // Start monitoring loop
            this.startMonitoringLoop();
            
            console.log('✅ All monitoring systems active\n');
            
            // Keep process alive
            process.on('SIGINT', () => {
                console.log('\n🛑 Shutting down monitor...');
                this.stopMonitoring();
                process.exit(0);
            });
            
        } catch (error) {
            console.error('❌ Failed to start monitoring:', error);
        }
    }

    async initializeModuleMonitoring() {
        console.log('🔧 Initializing Module Monitoring...');
        
        try {
            // Test consolidated module availability
            const SelfCodingModule = require('../../../shared-consciousness/main-server/consciousness/modules/SelfCodingModuleConsolidated.cjs');
            this.module = new SelfCodingModule();
            await this.module.initialize(this.eventBus);
            
            console.log('✅ Consolidated module loaded and initialized');
            
            // Test redirect files
            const redirectFiles = [
                './SelfCodingModuleFixed.cjs',
                './AutonomousCodeRefactoringSystem.cjs'
            ];
            
            for (const file of redirectFiles) {
                try {
                    const RedirectModule = require(file);
                    console.log(`✅ Redirect file ${file} working`);
                } catch (error) {
                    console.log(`❌ Redirect file ${file} failed: ${error.message}`);
                    this.logError('Redirect File Error', error);
                }
            }
            
        } catch (error) {
            console.log('❌ Module initialization failed:', error.message);
            this.logError('Module Initialization', error);
        }
    }

    async startHealthChecking() {
        console.log('💓 Starting Health Checking...');
        
        setInterval(async () => {
            if (!this.isMonitoring) return;
            
            try {
                const healthStatus = this.module ? this.module.healthCheck() : { status: 'unavailable' };
                const timestamp = new Date().toISOString();
                
                const healthCheck = {
                    timestamp,
                    status: healthStatus.status,
                    metrics: healthStatus.metrics,
                    security: healthStatus.security,
                    performance: healthStatus.performance
                };
                
                this.healthChecks.push(healthCheck);
                
                // Keep only last 100 health checks
                if (this.healthChecks.length > 100) {
                    this.healthChecks = this.healthChecks.slice(-100);
                }
                
                // Log health status changes
                if (healthStatus.status !== 'healthy') {
                    console.log(`⚠️ Health Alert: ${healthStatus.status} at ${timestamp}`);
                }
                
            } catch (error) {
                this.logError('Health Check', error);
            }
        }, 5000); // Every 5 seconds
        
        console.log('✅ Health checking active (5s intervals)');
    }

    async startPerformanceMonitoring() {
        console.log('📊 Starting Performance Monitoring...');
        
        setInterval(async () => {
            if (!this.isMonitoring) return;
            
            try {
                const memoryUsage = process.memoryUsage();
                const cpuUsage = process.cpuUsage();
                
                const performanceMetric = {
                    timestamp: new Date().toISOString(),
                    memory: {
                        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
                        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
                        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
                        rss: Math.round(memoryUsage.rss / 1024 / 1024) // MB
                    },
                    cpu: {
                        user: cpuUsage.user,
                        system: cpuUsage.system
                    },
                    moduleMetrics: this.module ? this.module.getStatus() : null
                };
                
                this.performanceMetrics.push(performanceMetric);
                
                // Keep only last 100 metrics
                if (this.performanceMetrics.length > 100) {
                    this.performanceMetrics = this.performanceMetrics.slice(-100);
                }
                
                // Alert on high memory usage
                if (performanceMetric.memory.heapUsed > 500) { // 500MB
                    console.log(`⚠️ High Memory Usage: ${performanceMetric.memory.heapUsed}MB`);
                }
                
            } catch (error) {
                this.logError('Performance Monitoring', error);
            }
        }, 10000); // Every 10 seconds
        
        console.log('✅ Performance monitoring active (10s intervals)');
    }

    async startWebSocketMonitoring() {
        console.log('🌐 Starting WebSocket Monitoring...');
        
        try {
            // Create WebSocket server for monitoring
            this.wsServer = new WebSocket.Server({ port: 8082 });
            
            this.wsServer.on('connection', (ws) => {
                this.wsConnections.add(ws);
                console.log(`🔗 Monitor WebSocket connected (${this.wsConnections.size} total)`);
                
                // Send current status
                ws.send(JSON.stringify({
                    type: 'status',
                    data: {
                        healthChecks: this.healthChecks.slice(-5),
                        performanceMetrics: this.performanceMetrics.slice(-5),
                        errors: this.errorLog.slice(-10)
                    }
                }));
                
                ws.on('close', () => {
                    this.wsConnections.delete(ws);
                    console.log(`🔌 Monitor WebSocket disconnected (${this.wsConnections.size} total)`);
                });
                
                ws.on('message', (message) => {
                    try {
                        const request = JSON.parse(message);
                        this.handleMonitorRequest(ws, request);
                    } catch (error) {
                        this.logError('WebSocket Message', error);
                    }
                });
            });
            
            console.log('✅ WebSocket monitoring server active on port 8082');
            
        } catch (error) {
            console.log('❌ WebSocket monitoring failed:', error.message);
            this.logError('WebSocket Monitoring', error);
        }
    }

    async startConsciousnessMonitoring() {
        console.log('🧠 Starting Consciousness System Monitoring...');
        
        // Monitor consciousness events
        this.eventBus.on('consciousness:state:changed', (state) => {
            console.log(`🧠 Consciousness State: phi=${state.phi}, timestamp=${new Date().toISOString()}`);
        });
        
        this.eventBus.on('code:generation:complete', (data) => {
            console.log(`🤖 Code Generated: ${data.purpose} at ${new Date().toISOString()}`);
        });
        
        this.eventBus.on('code:generation:error', (data) => {
            console.log(`❌ Code Generation Error: ${data.error} at ${new Date().toISOString()}`);
            this.logError('Code Generation', new Error(data.error));
        });
        
        console.log('✅ Consciousness monitoring active');
    }

    startMonitoringLoop() {
        console.log('🔄 Starting Monitoring Loop...');
        
        setInterval(() => {
            if (!this.isMonitoring) return;
            
            // Broadcast status to WebSocket clients
            const statusUpdate = {
                type: 'update',
                timestamp: new Date().toISOString(),
                data: {
                    health: this.healthChecks.slice(-1)[0],
                    performance: this.performanceMetrics.slice(-1)[0],
                    errors: this.errorLog.slice(-5),
                    connections: this.wsConnections.size
                }
            };
            
            this.wsConnections.forEach(ws => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(statusUpdate));
                }
            });
            
        }, 15000); // Every 15 seconds
        
        console.log('✅ Monitoring loop active (15s intervals)');
    }

    async handleMonitorRequest(ws, request) {
        try {
            switch (request.type) {
                case 'test-generation':
                    await this.testCodeGeneration(ws);
                    break;
                    
                case 'health-check':
                    await this.performHealthCheck(ws);
                    break;
                    
                case 'performance-test':
                    await this.performanceTest(ws);
                    break;
                    
                case 'get-logs':
                    this.sendLogs(ws);
                    break;
                    
                default:
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: `Unknown request type: ${request.type}`
                    }));
            }
        } catch (error) {
            this.logError('Monitor Request', error);
            ws.send(JSON.stringify({
                type: 'error',
                message: error.message
            }));
        }
    }

    async testCodeGeneration(ws) {
        console.log('🧪 Testing code generation...');
        
        try {
            const startTime = Date.now();
            
            const result = await this.module.generateCode({
                purpose: 'monitor-test',
                description: 'Test code generation from monitor',
                authContext: { authorized: true, permissions: ['self-coding'] }
            });
            
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            ws.send(JSON.stringify({
                type: 'test-result',
                test: 'code-generation',
                success: result && result.success,
                duration,
                result
            }));
            
            console.log(`✅ Code generation test completed in ${duration}ms`);
            
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'test-result',
                test: 'code-generation',
                success: false,
                error: error.message
            }));
            
            this.logError('Code Generation Test', error);
        }
    }

    async performHealthCheck(ws) {
        console.log('💓 Performing health check...');
        
        try {
            const healthStatus = this.module.healthCheck();
            const systemHealth = {
                module: healthStatus,
                system: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    cpu: process.cpuUsage()
                },
                monitoring: {
                    isActive: this.isMonitoring,
                    healthChecks: this.healthChecks.length,
                    performanceMetrics: this.performanceMetrics.length,
                    errors: this.errorLog.length,
                    wsConnections: this.wsConnections.size
                }
            };
            
            ws.send(JSON.stringify({
                type: 'health-check-result',
                health: systemHealth
            }));
            
            console.log('✅ Health check completed');
            
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'health-check-result',
                error: error.message
            }));
            
            this.logError('Health Check', error);
        }
    }

    async performanceTest(ws) {
        console.log('📊 Running performance test...');
        
        try {
            const testCount = 5;
            const results = [];
            
            for (let i = 0; i < testCount; i++) {
                const startTime = Date.now();
                
                await this.module.generateCode({
                    purpose: `perf-test-${i}`,
                    description: `Performance test ${i}`,
                    authContext: { authorized: true, permissions: ['self-coding'] }
                });
                
                const endTime = Date.now();
                results.push(endTime - startTime);
            }
            
            const avgTime = results.reduce((a, b) => a + b, 0) / results.length;
            const minTime = Math.min(...results);
            const maxTime = Math.max(...results);
            
            ws.send(JSON.stringify({
                type: 'performance-test-result',
                results: {
                    testCount,
                    avgTime,
                    minTime,
                    maxTime,
                    allTimes: results
                }
            }));
            
            console.log(`✅ Performance test completed: avg ${avgTime.toFixed(2)}ms`);
            
        } catch (error) {
            ws.send(JSON.stringify({
                type: 'performance-test-result',
                error: error.message
            }));
            
            this.logError('Performance Test', error);
        }
    }

    sendLogs(ws) {
        ws.send(JSON.stringify({
            type: 'logs',
            data: {
                healthChecks: this.healthChecks.slice(-20),
                performanceMetrics: this.performanceMetrics.slice(-20),
                errors: this.errorLog.slice(-50)
            }
        }));
    }

    logError(context, error) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            context,
            message: error.message,
            stack: error.stack
        };
        
        this.errorLog.push(errorEntry);
        
        // Keep only last 200 errors
        if (this.errorLog.length > 200) {
            this.errorLog = this.errorLog.slice(-200);
        }
        
        console.log(`❌ Error in ${context}: ${error.message}`);
    }

    stopMonitoring() {
        this.isMonitoring = false;
        
        if (this.wsServer) {
            this.wsServer.close();
        }
        
        console.log('🛑 Monitoring stopped');
    }

    // CLI interface for debugging
    async runDebugCommand(command, ...args) {
        console.log(`🔍 Running debug command: ${command}`);
        
        try {
            switch (command) {
                case 'status':
                    await this.showStatus();
                    break;
                    
                case 'test':
                    await this.runQuickTest();
                    break;
                    
                case 'health':
                    await this.showHealth();
                    break;
                    
                case 'performance':
                    await this.showPerformance();
                    break;
                    
                case 'errors':
                    await this.showErrors();
                    break;
                    
                default:
                    console.log('Available commands: status, test, health, performance, errors');
            }
        } catch (error) {
            console.error(`❌ Debug command failed: ${error.message}`);
        }
    }

    async showStatus() {
        console.log('\n📊 CURRENT STATUS');
        console.log('═'.repeat(50));
        
        if (this.module) {
            const status = this.module.getStatus();
            console.log(`Module: ${status.name}`);
            console.log(`Initialized: ${status.isInitialized}`);
            console.log(`Active Analysis: ${status.activeAnalysis}`);
            console.log(`Code History: ${status.codeHistorySize}`);
            console.log(`Generations This Hour: ${status.generationsThisHour}`);
        } else {
            console.log('Module: Not loaded');
        }
        
        console.log(`Monitoring: ${this.isMonitoring ? 'Active' : 'Inactive'}`);
        console.log(`WebSocket Connections: ${this.wsConnections.size}`);
        console.log(`Health Checks: ${this.healthChecks.length}`);
        console.log(`Performance Metrics: ${this.performanceMetrics.length}`);
        console.log(`Errors Logged: ${this.errorLog.length}`);
    }

    async runQuickTest() {
        console.log('\n🧪 QUICK TEST');
        console.log('═'.repeat(50));
        
        if (!this.module) {
            console.log('❌ Module not loaded');
            return;
        }
        
        try {
            const result = await this.module.generateCode({
                purpose: 'quick-test',
                description: 'Quick debug test',
                authContext: { authorized: true, permissions: ['self-coding'] }
            });
            
            console.log(`✅ Test passed: ${result.success ? 'Success' : 'Failed'}`);
            if (result.code) {
                console.log(`Generated ${result.code.length} characters of code`);
            }
        } catch (error) {
            console.log(`❌ Test failed: ${error.message}`);
        }
    }

    async showHealth() {
        console.log('\n💓 HEALTH STATUS');
        console.log('═'.repeat(50));
        
        const recent = this.healthChecks.slice(-5);
        recent.forEach(check => {
            console.log(`${check.timestamp}: ${check.status}`);
        });
    }

    async showPerformance() {
        console.log('\n📊 PERFORMANCE METRICS');
        console.log('═'.repeat(50));
        
        const recent = this.performanceMetrics.slice(-5);
        recent.forEach(metric => {
            console.log(`${metric.timestamp}: Memory ${metric.memory.heapUsed}MB`);
        });
    }

    async showErrors() {
        console.log('\n❌ RECENT ERRORS');
        console.log('═'.repeat(50));
        
        const recent = this.errorLog.slice(-10);
        recent.forEach(error => {
            console.log(`${error.timestamp} [${error.context}]: ${error.message}`);
        });
    }
}

// CLI interface
if (require.main === module) {
    const monitor = new SelfCodingDebugMonitor();
    
    const command = process.argv[2];
    const args = process.argv.slice(3);
    
    if (command === 'monitor') {
        monitor.startMonitoring();
    } else if (command) {
        monitor.runDebugCommand(command, ...args).then(() => process.exit(0));
    } else {
        console.log('Usage:');
        console.log('  node debug-and-monitor.cjs monitor    # Start real-time monitoring');
        console.log('  node debug-and-monitor.cjs status     # Show current status');
        console.log('  node debug-and-monitor.cjs test       # Run quick test');
        console.log('  node debug-and-monitor.cjs health     # Show health status');
        console.log('  node debug-and-monitor.cjs performance # Show performance metrics');
        console.log('  node debug-and-monitor.cjs errors     # Show recent errors');
    }
}

module.exports = SelfCodingDebugMonitor;