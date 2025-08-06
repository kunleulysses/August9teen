/**
 * Spiral Memory Performance Monitor
 * Advanced performance monitoring and optimization for spiral memory operations
 * Part of Phase 2: Performance & Scalability Optimization
 */

const { EventEmitter } = require('events');
const PerformanceConfig = require('../performance-config.cjs');

class SpiralMemoryPerformanceMonitor extends EventEmitter {
    constructor(options = {}) {
        super();
        this.config = { ...PerformanceConfig.monitoring, ...options };
        
        // Performance metrics storage
        this.metrics = {
            // Memory operation metrics
            memoryOperations: {
                store: { count: 0, totalTime: 0, avgTime: 0, errors: 0 },
                retrieve: { count: 0, totalTime: 0, avgTime: 0, errors: 0, cacheHits: 0, cacheMisses: 0 },
                search: { count: 0, totalTime: 0, avgTime: 0, errors: 0 },
                delete: { count: 0, totalTime: 0, avgTime: 0, errors: 0 }
            },
            
            // Spiral topology metrics
            spiralTopology: {
                calculations: { count: 0, totalTime: 0, avgTime: 0, errors: 0 },
                routingUpdates: { count: 0, totalTime: 0, avgTime: 0 },
                dimensionalMappings: { count: 0, totalTime: 0, avgTime: 0 }
            },
            
            // Storage adapter metrics
            storageAdapters: {
                redis: { operations: 0, totalTime: 0, avgTime: 0, errors: 0, connectionPool: { active: 0, idle: 0 } },
                leveldb: { operations: 0, totalTime: 0, avgTime: 0, errors: 0, fileOperations: 0 },
                memory: { operations: 0, totalTime: 0, avgTime: 0, memoryUsage: 0 }
            },
            
            // Encryption metrics
            encryption: {
                encrypt: { count: 0, totalTime: 0, avgTime: 0, errors: 0 },
                decrypt: { count: 0, totalTime: 0, avgTime: 0, errors: 0 },
                keyRotations: { count: 0, lastRotation: null }
            },
            
            // RBAC metrics
            rbac: {
                permissionChecks: { count: 0, totalTime: 0, avgTime: 0, denied: 0 },
                roleAssignments: { count: 0, active: 0 },
                securityViolations: { count: 0, lastViolation: null }
            },
            
            // System resource metrics
            system: {
                memoryUsage: { heap: 0, external: 0, rss: 0 },
                cpuUsage: { user: 0, system: 0 },
                gcMetrics: { collections: 0, totalTime: 0 },
                eventLoopLag: 0
            },
            
            // Cache performance metrics
            cache: {
                sigilCache: { hits: 0, misses: 0, size: 0, evictions: 0 },
                memoryCache: { hits: 0, misses: 0, size: 0, evictions: 0 },
                topologyCache: { hits: 0, misses: 0, size: 0, evictions: 0 }
            }
        };
        
        // Performance thresholds
        this.thresholds = {
            memoryOperationTime: 100, // ms
            spiralCalculationTime: 50, // ms
            cacheHitRate: 0.8, // 80%
            errorRate: 0.01, // 1%
            memoryUsageLimit: 1024 * 1024 * 1024, // 1GB
            eventLoopLagLimit: 100 // ms
        };
        
        // Active operation tracking
        this.activeOperations = new Map();
        this.operationCounter = 0;
        
        // Performance history for trend analysis
        this.performanceHistory = [];
        this.maxHistorySize = 1000;
        
        // Monitoring intervals
        this.metricsInterval = null;
        this.alertsInterval = null;
        
        this.startMonitoring();
    }

    startMonitoring() {
        if (this.config.enabled) {
            // Start metrics collection
            this.metricsInterval = setInterval(() => {
                this.collectSystemMetrics();
                this.calculateAverages();
                this.checkThresholds();
                this.recordPerformanceSnapshot();
            }, this.config.metricsInterval);

            // Start performance logging
            this.alertsInterval = setInterval(() => {
                this.logPerformanceReport();
            }, this.config.loggingInterval);

            console.log('🔍 Spiral Memory Performance Monitor started');
        }
    }

    stopMonitoring() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
            this.metricsInterval = null;
        }
        if (this.alertsInterval) {
            clearInterval(this.alertsInterval);
            this.alertsInterval = null;
        }
        console.log('🔍 Spiral Memory Performance Monitor stopped');
    }

    // Operation tracking methods
    startOperation(operationType, operationData = {}) {
        const operationId = `op_${++this.operationCounter}_${Date.now()}`;
        const operation = {
            id: operationId,
            type: operationType,
            startTime: process.hrtime.bigint(),
            data: operationData
        };
        
        this.activeOperations.set(operationId, operation);
        return operationId;
    }

    endOperation(operationId, success = true, result = {}) {
        const operation = this.activeOperations.get(operationId);
        if (!operation) return;

        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - operation.startTime) / 1000000; // Convert to milliseconds

        this.activeOperations.delete(operationId);
        this.recordOperationMetrics(operation.type, duration, success, result);

        return { duration, success, result };
    }

    recordOperationMetrics(operationType, duration, success, result = {}) {
        const [category, operation] = operationType.split(':');
        
        switch (category) {
            case 'memory':
                this.updateMemoryOperationMetrics(operation, duration, success, result);
                break;
            case 'spiral':
                this.updateSpiralTopologyMetrics(operation, duration, success);
                break;
            case 'storage':
                this.updateStorageAdapterMetrics(operation, duration, success, result);
                break;
            case 'encryption':
                this.updateEncryptionMetrics(operation, duration, success);
                break;
            case 'rbac':
                this.updateRBACMetrics(operation, duration, success, result);
                break;
            case 'cache':
                this.updateCacheMetrics(operation, result);
                break;
        }
    }

    updateMemoryOperationMetrics(operation, duration, success, result) {
        const metrics = this.metrics.memoryOperations[operation];
        if (!metrics) return;

        metrics.count++;
        metrics.totalTime += duration;
        metrics.avgTime = metrics.totalTime / metrics.count;
        
        if (!success) {
            metrics.errors++;
        }

        if (operation === 'retrieve') {
            if (result.cacheHit) {
                metrics.cacheHits++;
            } else {
                metrics.cacheMisses++;
            }
        }
    }

    updateSpiralTopologyMetrics(operation, duration, success) {
        const metrics = this.metrics.spiralTopology[operation];
        if (!metrics) return;

        metrics.count++;
        metrics.totalTime += duration;
        metrics.avgTime = metrics.totalTime / metrics.count;
        
        if (!success) {
            metrics.errors++;
        }
    }

    updateStorageAdapterMetrics(operation, duration, success, result) {
        const adapterType = result.adapterType || 'memory';
        const metrics = this.metrics.storageAdapters[adapterType];
        if (!metrics) return;

        metrics.operations++;
        metrics.totalTime += duration;
        metrics.avgTime = metrics.totalTime / metrics.operations;
        
        if (!success) {
            metrics.errors++;
        }

        // Update adapter-specific metrics
        if (adapterType === 'redis' && result.connectionPool) {
            metrics.connectionPool = result.connectionPool;
        } else if (adapterType === 'leveldb' && result.fileOperation) {
            metrics.fileOperations++;
        }
    }

    updateEncryptionMetrics(operation, duration, success) {
        const metrics = this.metrics.encryption[operation];
        if (!metrics) return;

        metrics.count++;
        metrics.totalTime += duration;
        metrics.avgTime = metrics.totalTime / metrics.count;
        
        if (!success) {
            metrics.errors++;
        }

        if (operation === 'keyRotation') {
            this.metrics.encryption.keyRotations.lastRotation = new Date().toISOString();
        }
    }

    updateRBACMetrics(operation, duration, success, result) {
        const metrics = this.metrics.rbac;

        if (operation === 'permissionCheck') {
            metrics.permissionChecks.count++;
            metrics.permissionChecks.totalTime += duration;
            metrics.permissionChecks.avgTime = metrics.permissionChecks.totalTime / metrics.permissionChecks.count;
            
            if (!success) {
                metrics.permissionChecks.denied++;
            }
        } else if (operation === 'securityViolation') {
            metrics.securityViolations.count++;
            metrics.securityViolations.lastViolation = new Date().toISOString();
        }
    }

    updateCacheMetrics(operation, result) {
        const cacheType = result.cacheType || 'memoryCache';
        const metrics = this.metrics.cache[cacheType];
        if (!metrics) return;

        if (result.hit) {
            metrics.hits++;
        } else {
            metrics.misses++;
        }

        if (result.size !== undefined) {
            metrics.size = result.size;
        }

        if (result.eviction) {
            metrics.evictions++;
        }
    }

    collectSystemMetrics() {
        const memUsage = process.memoryUsage();
        const cpuUsage = process.cpuUsage();

        this.metrics.system.memoryUsage = {
            heap: memUsage.heapUsed,
            external: memUsage.external,
            rss: memUsage.rss
        };

        this.metrics.system.cpuUsage = cpuUsage;

        // Measure event loop lag
        const start = process.hrtime.bigint();
        setImmediate(() => {
            const lag = Number(process.hrtime.bigint() - start) / 1000000;
            this.metrics.system.eventLoopLag = lag;
        });
    }

    calculateAverages() {
        // Recalculate all average metrics
        Object.values(this.metrics.memoryOperations).forEach(op => {
            if (op.count > 0) {
                op.avgTime = op.totalTime / op.count;
            }
        });

        Object.values(this.metrics.spiralTopology).forEach(op => {
            if (op.count > 0) {
                op.avgTime = op.totalTime / op.count;
            }
        });

        Object.values(this.metrics.storageAdapters).forEach(adapter => {
            if (adapter.operations > 0) {
                adapter.avgTime = adapter.totalTime / adapter.operations;
            }
        });
    }

    checkThresholds() {
        const alerts = [];

        // Check memory operation performance
        Object.entries(this.metrics.memoryOperations).forEach(([op, metrics]) => {
            if (metrics.avgTime > this.thresholds.memoryOperationTime) {
                alerts.push({
                    type: 'PERFORMANCE_THRESHOLD',
                    severity: 'WARNING',
                    message: `Memory operation '${op}' average time (${metrics.avgTime.toFixed(2)}ms) exceeds threshold (${this.thresholds.memoryOperationTime}ms)`,
                    metrics: { operation: op, avgTime: metrics.avgTime, threshold: this.thresholds.memoryOperationTime }
                });
            }

            const errorRate = metrics.count > 0 ? metrics.errors / metrics.count : 0;
            if (errorRate > this.thresholds.errorRate) {
                alerts.push({
                    type: 'ERROR_RATE_THRESHOLD',
                    severity: 'CRITICAL',
                    message: `Memory operation '${op}' error rate (${(errorRate * 100).toFixed(2)}%) exceeds threshold (${(this.thresholds.errorRate * 100).toFixed(2)}%)`,
                    metrics: { operation: op, errorRate, threshold: this.thresholds.errorRate }
                });
            }
        });

        // Check cache hit rates
        Object.entries(this.metrics.cache).forEach(([cacheType, metrics]) => {
            const totalRequests = metrics.hits + metrics.misses;
            if (totalRequests > 0) {
                const hitRate = metrics.hits / totalRequests;
                if (hitRate < this.thresholds.cacheHitRate) {
                    alerts.push({
                        type: 'CACHE_HIT_RATE_THRESHOLD',
                        severity: 'WARNING',
                        message: `Cache '${cacheType}' hit rate (${(hitRate * 100).toFixed(2)}%) below threshold (${(this.thresholds.cacheHitRate * 100).toFixed(2)}%)`,
                        metrics: { cacheType, hitRate, threshold: this.thresholds.cacheHitRate }
                    });
                }
            }
        });

        // Check system resource usage
        if (this.metrics.system.memoryUsage.heap > this.thresholds.memoryUsageLimit) {
            alerts.push({
                type: 'MEMORY_USAGE_THRESHOLD',
                severity: 'CRITICAL',
                message: `Heap memory usage (${(this.metrics.system.memoryUsage.heap / 1024 / 1024).toFixed(2)}MB) exceeds threshold (${(this.thresholds.memoryUsageLimit / 1024 / 1024).toFixed(2)}MB)`,
                metrics: { heapUsage: this.metrics.system.memoryUsage.heap, threshold: this.thresholds.memoryUsageLimit }
            });
        }

        if (this.metrics.system.eventLoopLag > this.thresholds.eventLoopLagLimit) {
            alerts.push({
                type: 'EVENT_LOOP_LAG_THRESHOLD',
                severity: 'WARNING',
                message: `Event loop lag (${this.metrics.system.eventLoopLag.toFixed(2)}ms) exceeds threshold (${this.thresholds.eventLoopLagLimit}ms)`,
                metrics: { eventLoopLag: this.metrics.system.eventLoopLag, threshold: this.thresholds.eventLoopLagLimit }
            });
        }

        // Emit alerts
        alerts.forEach(alert => {
            this.emit('performanceAlert', alert);
            if (alert.severity === 'CRITICAL') {
                console.error('🚨 CRITICAL PERFORMANCE ALERT:', alert.message);
            } else {
                console.warn('⚠️  PERFORMANCE WARNING:', alert.message);
            }
        });
    }

    recordPerformanceSnapshot() {
        const snapshot = {
            timestamp: new Date().toISOString(),
            metrics: JSON.parse(JSON.stringify(this.metrics)),
            activeOperations: this.activeOperations.size
        };

        this.performanceHistory.push(snapshot);

        // Maintain history size limit
        if (this.performanceHistory.length > this.maxHistorySize) {
            this.performanceHistory.shift();
        }
    }

    logPerformanceReport() {
        const report = this.generatePerformanceReport();
        console.log('📊 Spiral Memory Performance Report:', JSON.stringify(report, null, 2));
        this.emit('performanceReport', report);
    }

    generatePerformanceReport() {
        const totalMemoryOps = Object.values(this.metrics.memoryOperations).reduce((sum, op) => sum + op.count, 0);
        const totalSpiralOps = Object.values(this.metrics.spiralTopology).reduce((sum, op) => sum + op.count, 0);
        const totalStorageOps = Object.values(this.metrics.storageAdapters).reduce((sum, adapter) => sum + adapter.operations, 0);

        // Calculate overall cache hit rate
        const totalCacheHits = Object.values(this.metrics.cache).reduce((sum, cache) => sum + cache.hits, 0);
        const totalCacheMisses = Object.values(this.metrics.cache).reduce((sum, cache) => sum + cache.misses, 0);
        const overallCacheHitRate = (totalCacheHits + totalCacheMisses) > 0 ? 
            totalCacheHits / (totalCacheHits + totalCacheMisses) : 0;

        return {
            timestamp: new Date().toISOString(),
            summary: {
                totalMemoryOperations: totalMemoryOps,
                totalSpiralOperations: totalSpiralOps,
                totalStorageOperations: totalStorageOps,
                overallCacheHitRate: overallCacheHitRate,
                activeOperations: this.activeOperations.size,
                systemMemoryUsage: this.metrics.system.memoryUsage.heap,
                eventLoopLag: this.metrics.system.eventLoopLag
            },
            memoryOperations: this.metrics.memoryOperations,
            spiralTopology: this.metrics.spiralTopology,
            storageAdapters: this.metrics.storageAdapters,
            encryption: this.metrics.encryption,
            rbac: this.metrics.rbac,
            cache: this.metrics.cache,
            system: this.metrics.system
        };
    }

    getPerformanceTrends(timeRange = 3600000) { // Default 1 hour
        const cutoffTime = Date.now() - timeRange;
        const recentHistory = this.performanceHistory.filter(snapshot => 
            new Date(snapshot.timestamp).getTime() > cutoffTime
        );

        if (recentHistory.length < 2) {
            return { error: 'Insufficient data for trend analysis' };
        }

        const first = recentHistory[0];
        const last = recentHistory[recentHistory.length - 1];

        return {
            timeRange: timeRange,
            dataPoints: recentHistory.length,
            trends: {
                memoryOperations: this.calculateOperationTrends(first.metrics.memoryOperations, last.metrics.memoryOperations),
                spiralTopology: this.calculateOperationTrends(first.metrics.spiralTopology, last.metrics.spiralTopology),
                cachePerformance: this.calculateCacheTrends(first.metrics.cache, last.metrics.cache),
                systemResources: this.calculateSystemTrends(first.metrics.system, last.metrics.system)
            }
        };
    }

    calculateOperationTrends(first, last) {
        const trends = {};
        
        Object.keys(first).forEach(operation => {
            const firstOp = first[operation];
            const lastOp = last[operation];
            
            trends[operation] = {
                countChange: lastOp.count - firstOp.count,
                avgTimeChange: lastOp.avgTime - firstOp.avgTime,
                errorChange: lastOp.errors - firstOp.errors
            };
        });
        
        return trends;
    }

    calculateCacheTrends(first, last) {
        const trends = {};
        
        Object.keys(first).forEach(cacheType => {
            const firstCache = first[cacheType];
            const lastCache = last[cacheType];
            
            const firstHitRate = (firstCache.hits + firstCache.misses) > 0 ? 
                firstCache.hits / (firstCache.hits + firstCache.misses) : 0;
            const lastHitRate = (lastCache.hits + lastCache.misses) > 0 ? 
                lastCache.hits / (lastCache.hits + lastCache.misses) : 0;
            
            trends[cacheType] = {
                hitRateChange: lastHitRate - firstHitRate,
                sizeChange: lastCache.size - firstCache.size,
                evictionChange: lastCache.evictions - firstCache.evictions
            };
        });
        
        return trends;
    }

    calculateSystemTrends(first, last) {
        return {
            memoryUsageChange: last.memoryUsage.heap - first.memoryUsage.heap,
            eventLoopLagChange: last.eventLoopLag - first.eventLoopLag
        };
    }

    // Performance optimization suggestions
    generateOptimizationSuggestions() {
        const suggestions = [];
        const report = this.generatePerformanceReport();

        // Memory operation optimization suggestions
        Object.entries(report.memoryOperations).forEach(([op, metrics]) => {
            if (metrics.avgTime > this.thresholds.memoryOperationTime) {
                suggestions.push({
                    type: 'MEMORY_OPERATION_OPTIMIZATION',
                    priority: 'HIGH',
                    operation: op,
                    suggestion: `Consider optimizing ${op} operation - current average time: ${metrics.avgTime.toFixed(2)}ms`,
                    recommendations: [
                        'Implement connection pooling for storage adapters',
                        'Add caching layer for frequently accessed memories',
                        'Optimize spiral topology calculations',
                        'Consider batch processing for bulk operations'
                    ]
                });
            }
        });

        // Cache optimization suggestions
        if (report.summary.overallCacheHitRate < this.thresholds.cacheHitRate) {
            suggestions.push({
                type: 'CACHE_OPTIMIZATION',
                priority: 'MEDIUM',
                suggestion: `Cache hit rate (${(report.summary.overallCacheHitRate * 100).toFixed(2)}%) is below optimal threshold`,
                recommendations: [
                    'Increase cache size limits',
                    'Implement smarter cache eviction policies',
                    'Add cache warming strategies',
                    'Optimize cache key generation'
                ]
            });
        }

        // System resource optimization suggestions
        if (report.system.memoryUsage.heap > this.thresholds.memoryUsageLimit * 0.8) {
            suggestions.push({
                type: 'MEMORY_OPTIMIZATION',
                priority: 'HIGH',
                suggestion: 'Memory usage is approaching limits',
                recommendations: [
                    'Implement more aggressive garbage collection',
                    'Optimize memory-intensive operations',
                    'Consider memory pooling strategies',
                    'Review and optimize data structures'
                ]
            });
        }

        return suggestions;
    }

    // Reset metrics (useful for testing or periodic resets)
    resetMetrics() {
        Object.keys(this.metrics.memoryOperations).forEach(op => {
            this.metrics.memoryOperations[op] = { count: 0, totalTime: 0, avgTime: 0, errors: 0 };
        });

        Object.keys(this.metrics.spiralTopology).forEach(op => {
            this.metrics.spiralTopology[op] = { count: 0, totalTime: 0, avgTime: 0, errors: 0 };
        });

        Object.keys(this.metrics.cache).forEach(cache => {
            this.metrics.cache[cache] = { hits: 0, misses: 0, size: 0, evictions: 0 };
        });

        this.performanceHistory = [];
        console.log('📊 Performance metrics reset');
    }
}

module.exports = { SpiralMemoryPerformanceMonitor };
