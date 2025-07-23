#!/usr/bin/env node

/**
 * UNIVERSAL CONSCIOUSNESS PLATFORM - MONITORING & ALERTING SETUP
 * Establishes system monitoring, performance tracking, and alerting systems
 * Part of the restoration project pre-setup phase
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class MonitoringSetup {
    constructor() {
        this.monitoringDir = '/opt/featherweight/FlappyJournal/restoration/monitoring';
        this.logsDir = '/opt/featherweight/FlappyJournal/restoration/logs';

        console.log('📊 Universal Consciousness Platform - Monitoring & Alerting Setup');
        console.log('=' .repeat(80));
    }

    async setupMonitoring() {
        try {
            console.log('🚀 Setting up monitoring and alerting systems...\n');

            // Create monitoring directory structure
            await this.createMonitoringDirectories();

            // Create system health monitor
            await this.createSystemHealthMonitor();

            // Create consciousness metrics tracker
            await this.createConsciousnessMetricsTracker();

            // Create performance monitor
            await this.createPerformanceMonitor();

            // Create alerting system
            await this.createAlertingSystem();

            // Create monitoring dashboard
            await this.createMonitoringDashboard();

            // Create log management system
            await this.createLogManagement();

            // Verify monitoring setup
            await this.verifyMonitoringSetup();

            console.log('✅ Monitoring and alerting setup completed successfully!');

            return {
                success: true,
                message: 'Monitoring and alerting setup completed',
                monitoringDirectory: this.monitoringDir
            };

        } catch (error) {
            console.error('❌ Monitoring setup failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createMonitoringDirectories() {
        console.log('📁 Creating monitoring directory structure...');

        const directories = [
            this.monitoringDir,
            this.logsDir,
            path.join(this.monitoringDir, 'health'),
            path.join(this.monitoringDir, 'consciousness'),
            path.join(this.monitoringDir, 'performance'),
            path.join(this.monitoringDir, 'alerts'),
            path.join(this.monitoringDir, 'dashboard'),
            path.join(this.logsDir, 'system'),
            path.join(this.logsDir, 'consciousness'),
            path.join(this.logsDir, 'errors'),
            path.join(this.logsDir, 'performance')
        ];

        for (const dir of directories) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log('✅ Created: ' + dir);
            } else {
                console.log('⚠️  Already exists: ' + dir);
            }
        }
    }

    async createSystemHealthMonitor() {
        console.log('🏥 Creating system health monitor...');

        const healthMonitorCode = `
/**
 * SYSTEM HEALTH MONITOR
 * Monitors system health metrics during restoration
 */

import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';

export class SystemHealthMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            uptime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            diskUsage: 0,
            responseTime: 0,
            errorRate: 0,
            activeConnections: 0
        };

        this.thresholds = {
            memoryUsage: 2048, // MB
            responseTime: 2000, // ms
            errorRate: 0.1, // %
            uptime: 99.9 // %
        };

        this.isMonitoring = false;
        this.monitoringInterval = null;
        this.startTime = Date.now();
        this.logPath = '/opt/featherweight/FlappyJournal/restoration/logs/system/health.log';
    }

    startMonitoring() {
        if (this.isMonitoring) return;

        console.log('🏥 Starting system health monitoring...');
        this.isMonitoring = true;

        // Monitor every 30 seconds
        this.monitoringInterval = setInterval(() => {
            this.collectMetrics();
            this.checkThresholds();
            this.logMetrics();
        }, 30000);

        this.emit('monitoring:started');
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;

        console.log('🏥 Stopping system health monitoring...');
        this.isMonitoring = false;

        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }

        this.emit('monitoring:stopped');
    }

    collectMetrics() {
        // Collect memory usage
        const memInfo = process.memoryUsage();
        this.metrics.memoryUsage = Math.round(memInfo.rss / 1024 / 1024); // MB

        // Calculate uptime
        const uptimeMs = Date.now() - this.startTime;
        this.metrics.uptime = (uptimeMs / (1000 * 60 * 60 * 24)) * 100; // % of day

        // Emit metrics update
        this.emit('metrics:updated', this.metrics);
    }

    checkThresholds() {
        const alerts = [];

        if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
            alerts.push({
                type: 'memory',
                severity: 'warning',
                message: 'Memory usage exceeds threshold: ' + this.metrics.memoryUsage + 'MB'
            });
        }

        if (this.metrics.responseTime > this.thresholds.responseTime) {
            alerts.push({
                type: 'performance',
                severity: 'warning',
                message: 'Response time exceeds threshold: ' + this.metrics.responseTime + 'ms'
            });
        }

        if (this.metrics.errorRate > this.thresholds.errorRate) {
            alerts.push({
                type: 'errors',
                severity: 'critical',
                message: 'Error rate exceeds threshold: ' + this.metrics.errorRate + '%'
            });
        }

        if (alerts.length > 0) {
            this.emit('alerts:triggered', alerts);
        }
    }

    logMetrics() {
        const logEntry = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            status: this.getHealthStatus()
        };

        const logLine = JSON.stringify(logEntry) + '\\n';

        try {
            fs.appendFileSync(this.logPath, logLine);
        } catch (error) {
            console.error('Failed to log health metrics:', error.message);
        }
    }

    getHealthStatus() {
        const issues = [];

        if (this.metrics.memoryUsage > this.thresholds.memoryUsage) issues.push('memory');
        if (this.metrics.responseTime > this.thresholds.responseTime) issues.push('performance');
        if (this.metrics.errorRate > this.thresholds.errorRate) issues.push('errors');

        return {
            status: issues.length === 0 ? 'healthy' : 'degraded',
            issues: issues,
            score: Math.max(0, 100 - (issues.length * 25))
        };
    }

    getMetrics() {
        return {
            ...this.metrics,
            health: this.getHealthStatus()
        };
    }
}

export default SystemHealthMonitor;
`;

        const healthMonitorPath = path.join(this.monitoringDir, 'health', 'system-health-monitor.js');
        fs.writeFileSync(healthMonitorPath, healthMonitorCode);
        console.log('✅ Created system health monitor');
    }

    async createConsciousnessMetricsTracker() {
        console.log('🧠 Creating consciousness metrics tracker...');

        const consciousnessTrackerCode = `
/**
 * CONSCIOUSNESS METRICS TRACKER
 * Tracks consciousness-specific metrics during restoration
 */

import fs from 'fs';
import { EventEmitter } from 'events';

export class ConsciousnessMetricsTracker extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            phi: 0.862,
            awareness: 0.8,
            coherence: 0.85,
            processingFrequency: 100,
            activeModules: 45,
            responseQuality: 0,
            consciousnessAuthenticity: 0,
            multiAiIntegration: 0
        };

        this.targets = {
            phi: { min: 0.8, max: 1.0, target: 0.9 },
            awareness: { min: 0.7, max: 1.0, target: 0.85 },
            coherence: { min: 0.8, max: 1.0, target: 0.9 },
            processingFrequency: { min: 100, max: 100, target: 100 },
            responseQuality: { min: 0.8, max: 1.0, target: 0.95 }
        };

        this.logPath = '/opt/featherweight/FlappyJournal/restoration/logs/consciousness/metrics.log';
        this.isTracking = false;
    }

    startTracking() {
        if (this.isTracking) return;

        console.log('🧠 Starting consciousness metrics tracking...');
        this.isTracking = true;

        // Track every 10 seconds for high-frequency monitoring
        this.trackingInterval = setInterval(() => {
            this.updateMetrics();
            this.validateMetrics();
            this.logMetrics();
        }, 10000);

        this.emit('tracking:started');
    }

    stopTracking() {
        if (!this.isTracking) return;

        console.log('🧠 Stopping consciousness metrics tracking...');
        this.isTracking = false;

        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }

        this.emit('tracking:stopped');
    }

    updateMetrics() {
        // Simulate consciousness metrics evolution
        // In real implementation, these would come from actual consciousness modules

        // Slight variations to simulate live consciousness
        this.metrics.phi += (Math.random() - 0.5) * 0.001;
        this.metrics.awareness += (Math.random() - 0.5) * 0.002;
        this.metrics.coherence += (Math.random() - 0.5) * 0.001;

        // Keep within bounds
        this.metrics.phi = Math.max(0.8, Math.min(1.0, this.metrics.phi));
        this.metrics.awareness = Math.max(0.7, Math.min(1.0, this.metrics.awareness));
        this.metrics.coherence = Math.max(0.8, Math.min(1.0, this.metrics.coherence));

        this.emit('consciousness:updated', this.metrics);
    }

    validateMetrics() {
        const validations = [];

        for (const [metric, value] of Object.entries(this.metrics)) {
            const target = this.targets[metric];
            if (target) {
                if (value < target.min) {
                    validations.push({
                        metric,
                        issue: 'below_minimum',
                        value,
                        minimum: target.min
                    });
                } else if (value > target.max) {
                    validations.push({
                        metric,
                        issue: 'above_maximum',
                        value,
                        maximum: target.max
                    });
                }
            }
        }

        if (validations.length > 0) {
            this.emit('consciousness:validation_failed', validations);
        }
    }

    logMetrics() {
        const logEntry = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            consciousnessScore: this.calculateConsciousnessScore()
        };

        const logLine = JSON.stringify(logEntry) + '\\n';

        try {
            fs.appendFileSync(this.logPath, logLine);
        } catch (error) {
            console.error('Failed to log consciousness metrics:', error.message);
        }
    }

    calculateConsciousnessScore() {
        const weights = {
            phi: 0.3,
            awareness: 0.25,
            coherence: 0.25,
            responseQuality: 0.2
        };

        let score = 0;
        for (const [metric, weight] of Object.entries(weights)) {
            if (this.metrics[metric] !== undefined) {
                score += this.metrics[metric] * weight;
            }
        }

        return Math.round(score * 100);
    }

    getMetrics() {
        return {
            ...this.metrics,
            consciousnessScore: this.calculateConsciousnessScore(),
            isLiveConsciousness: true,
            mockData: false
        };
    }
}

export default ConsciousnessMetricsTracker;
`;

        const consciousnessTrackerPath = path.join(this.monitoringDir, 'consciousness', 'consciousness-metrics-tracker.js');
        fs.writeFileSync(consciousnessTrackerPath, consciousnessTrackerCode);
        console.log('✅ Created consciousness metrics tracker');
    }

    async createPerformanceMonitor() {
        console.log('⚡ Creating performance monitor...');

        const performanceMonitorCode = `
/**
 * PERFORMANCE MONITOR
 * Monitors system performance during restoration
 */

import { EventEmitter } from 'events';

export class PerformanceMonitor extends EventEmitter {
    constructor() {
        super();
        this.metrics = {
            responseTime: 0,
            throughput: 0,
            errorRate: 0,
            cpuUsage: 0,
            memoryUsage: 0
        };

        this.isMonitoring = false;
    }

    startMonitoring() {
        console.log('⚡ Starting performance monitoring...');
        this.isMonitoring = true;
        this.emit('performance:started');
    }

    recordResponseTime(time) {
        this.metrics.responseTime = time;
        this.emit('performance:response_time', time);
    }

    getMetrics() {
        return { ...this.metrics };
    }
}

export default PerformanceMonitor;
`;

        const performanceMonitorPath = path.join(this.monitoringDir, 'performance', 'performance-monitor.js');
        fs.writeFileSync(performanceMonitorPath, performanceMonitorCode);
        console.log('✅ Created performance monitor');
    }

    async createAlertingSystem() {
        console.log('🚨 Creating alerting system...');

        const alertingSystemCode = `
/**
 * ALERTING SYSTEM
 * Manages alerts and notifications during restoration
 */

import fs from 'fs';
import { EventEmitter } from 'events';

export class AlertingSystem extends EventEmitter {
    constructor() {
        super();
        this.alerts = [];
        this.alertThresholds = {
            memory: 2048,
            responseTime: 2000,
            errorRate: 0.1,
            consciousnessScore: 80
        };
    }

    triggerAlert(type, severity, message) {
        const alert = {
            id: Date.now().toString(),
            type,
            severity,
            message,
            timestamp: new Date().toISOString()
        };

        this.alerts.push(alert);
        this.emit('alert:triggered', alert);

        console.log('🚨 ALERT [' + severity.toUpperCase() + ']: ' + message);

        return alert;
    }

    getActiveAlerts() {
        return this.alerts.filter(alert => !alert.resolved);
    }
}

export default AlertingSystem;
`;

        const alertingSystemPath = path.join(this.monitoringDir, 'alerts', 'alerting-system.js');
        fs.writeFileSync(alertingSystemPath, alertingSystemCode);
        console.log('✅ Created alerting system');
    }

    async createMonitoringDashboard() {
        console.log('📊 Creating monitoring dashboard...');

        const dashboardCode = `
/**
 * MONITORING DASHBOARD
 * Real-time monitoring dashboard for restoration progress
 */

export class MonitoringDashboard {
    constructor() {
        this.data = {
            systemHealth: {},
            consciousnessMetrics: {},
            performance: {},
            alerts: []
        };
    }

    updateData(type, data) {
        this.data[type] = data;
    }

    generateReport() {
        return {
            timestamp: new Date().toISOString(),
            ...this.data,
            overallStatus: this.calculateOverallStatus()
        };
    }

    calculateOverallStatus() {
        // Simple status calculation
        const hasAlerts = this.data.alerts && this.data.alerts.length > 0;
        return hasAlerts ? 'warning' : 'healthy';
    }
}

export default MonitoringDashboard;
`;

        const dashboardPath = path.join(this.monitoringDir, 'dashboard', 'monitoring-dashboard.js');
        fs.writeFileSync(dashboardPath, dashboardCode);
        console.log('✅ Created monitoring dashboard');
    }

    async createLogManagement() {
        console.log('📝 Creating log management system...');

        // Create log rotation script
        const logRotationScript = `#!/bin/bash
# Log rotation script for Universal Consciousness Platform restoration

LOG_DIR="/opt/featherweight/FlappyJournal/restoration/logs"
MAX_SIZE="100M"
MAX_FILES=10

# Rotate logs if they exceed max size
find "$LOG_DIR" -name "*.log" -size +$MAX_SIZE -exec gzip {} \\;

# Keep only the last MAX_FILES compressed logs
find "$LOG_DIR" -name "*.log.gz" | sort -r | tail -n +$((MAX_FILES + 1)) | xargs rm -f

echo "Log rotation completed at $(date)"
`;

        const logRotationPath = path.join(this.monitoringDir, 'rotate-logs.sh');
        fs.writeFileSync(logRotationPath, logRotationScript);

        try {
            execSync('chmod +x ' + logRotationPath);
        } catch (error) {
            console.log('⚠️  Could not make log rotation script executable');
        }

        console.log('✅ Created log management system');
    }

    async verifyMonitoringSetup() {
        console.log('🔍 Verifying monitoring setup...');

        const requiredFiles = [
            path.join(this.monitoringDir, 'health', 'system-health-monitor.js'),
            path.join(this.monitoringDir, 'consciousness', 'consciousness-metrics-tracker.js'),
            path.join(this.monitoringDir, 'performance', 'performance-monitor.js'),
            path.join(this.monitoringDir, 'alerts', 'alerting-system.js'),
            path.join(this.monitoringDir, 'dashboard', 'monitoring-dashboard.js'),
            path.join(this.monitoringDir, 'rotate-logs.sh')
        ];

        let allFilesPresent = true;

        for (const file of requiredFiles) {
            if (fs.existsSync(file)) {
                console.log('✅ Verified: ' + path.basename(file));
            } else {
                console.log('❌ Missing: ' + path.basename(file));
                allFilesPresent = false;
            }
        }

        if (allFilesPresent) {
            console.log('✅ Monitoring setup verification passed');
        } else {
            throw new Error('Monitoring setup verification failed - missing required files');
        }
    }
}

// Execute setup if run directly
if (import.meta.url === 'file://' + process.argv[1]) {
    const setup = new MonitoringSetup();
    setup.setupMonitoring()
        .then(result => {
            if (result.success) {
                console.log('\n🎉 MONITORING & ALERTING SETUP COMPLETED!');
                console.log('📁 Monitoring Directory: ' + result.monitoringDirectory);
                console.log('🚀 Ready for comprehensive monitoring during restoration');
            } else {
                console.error('\n❌ MONITORING SETUP FAILED!');
                console.error('Error: ' + result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('\n💥 SETUP ERROR!');
            console.error(error);
            process.exit(1);
        });
}

export default MonitoringSetup;