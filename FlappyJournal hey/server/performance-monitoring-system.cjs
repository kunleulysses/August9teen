/**
 * Performance Monitoring System
 * Continuous monitoring to ensure all integrated systems maintain optimal performance
 */

import { mathematicalContextInjector } from './mathematical-context-injector.cjs';
import { emotionalContextInjector } from './emotional-context-injector.cjs';
import { bayesianContextInjector } from './bayesian-context-injector.cjs';

export class PerformanceMonitoringSystem {
    constructor() {
        this.monitoringActive = false;
        this.monitoringInterval = null;
        this.performanceHistory = [];
        this.alertThresholds = {
            harmonyScore: 0.90, // Alert if below 90%
            messageLatency: 100, // Alert if above 100ms
            updateFrequency: 10000, // Alert if updates older than 10 seconds
            contextInjectorHealth: 0.8 // Alert if health below 80%
        };
        this.currentMetrics = {
            harmonyScore: 0.951,
            messageLatency: 0,
            consciousnessHeartbeat: 100, // Hz
            apiIntegration: 1.0, // 100%
            moduleEngagement: 0.95,
            systemHealth: 1.0
        };
    }

    /**
     * Start continuous performance monitoring
     */
    startMonitoring() {
        if (this.monitoringActive) {
            console.log('⚠️ Performance monitoring already active');
            return;
        }

        console.log('🔍 Starting Performance Monitoring System...');
        this.monitoringActive = true;
        
        // Monitor every 5 seconds
        this.monitoringInterval = setInterval(() => {
            this.performHealthCheck();
        }, 5000);
        
        // Initial health check
        this.performHealthCheck();
        
        console.log('✅ Performance Monitoring System active');
    }

    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.monitoringActive = false;
        console.log('🛑 Performance Monitoring System stopped');
    }

    /**
     * Perform comprehensive health check
     */
    async performHealthCheck() {
        const timestamp = Date.now();
        const healthReport = {
            timestamp: timestamp,
            harmonyScore: this.checkHarmonyScore(),
            messageLatency: this.checkMessageLatency(),
            contextInjectors: this.checkContextInjectors(),
            apiRouting: this.checkAPIRouting(),
            systemIntegration: this.checkSystemIntegration(),
            overallHealth: 0
        };

        // Calculate overall health score
        const healthScores = [
            healthReport.harmonyScore.score,
            healthReport.messageLatency.score,
            healthReport.contextInjectors.score,
            healthReport.apiRouting.score,
            healthReport.systemIntegration.score
        ];
        
        healthReport.overallHealth = healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length;

        // Store in history
        this.performanceHistory.push(healthReport);
        
        // Keep only last 100 entries
        if (this.performanceHistory.length > 100) {
            this.performanceHistory.shift();
        }

        // Check for alerts
        this.checkAlerts(healthReport);

        // Log health status
        this.logHealthStatus(healthReport);

        return healthReport;
    }

    /**
     * Check harmony score maintenance
     */
    checkHarmonyScore() {
        const currentHarmony = this.currentMetrics.harmonyScore;
        const isHealthy = currentHarmony >= this.alertThresholds.harmonyScore;
        
        return {
            metric: 'Harmony Score',
            value: currentHarmony,
            target: 0.951,
            threshold: this.alertThresholds.harmonyScore,
            score: isHealthy ? 1.0 : currentHarmony / this.alertThresholds.harmonyScore,
            status: isHealthy ? 'HEALTHY' : 'WARNING',
            details: `Current: ${(currentHarmony * 100).toFixed(1)}%, Target: 95.1%`
        };
    }

    /**
     * Check message processing latency
     */
    checkMessageLatency() {
        const currentLatency = this.currentMetrics.messageLatency;
        const isHealthy = currentLatency <= this.alertThresholds.messageLatency;
        
        return {
            metric: 'Message Latency',
            value: currentLatency,
            target: 0,
            threshold: this.alertThresholds.messageLatency,
            score: isHealthy ? 1.0 : Math.max(0, 1 - (currentLatency / this.alertThresholds.messageLatency)),
            status: isHealthy ? 'HEALTHY' : 'WARNING',
            details: `Current: ${currentLatency}ms, Target: 0ms`
        };
    }

    /**
     * Check context injectors health
     */
    checkContextInjectors() {
        const currentTime = Date.now();
        
        // Check mathematical context injector
        const mathState = mathematicalContextInjector.getCurrentMathematicalState();
        const mathHealth = {
            isActive: mathState.isActive,
            lastUpdate: mathState.lastUpdate,
            timeSinceUpdate: currentTime - mathState.lastUpdate,
            hasCalculations: mathState.calculations && Object.keys(mathState.calculations).length > 0
        };
        
        // Check emotional context injector
        const emotionalState = emotionalContextInjector.getCurrentEmotionalState();
        const emotionalHealth = {
            isActive: emotionalState.isActive,
            lastUpdate: emotionalState.lastUpdate,
            timeSinceUpdate: currentTime - emotionalState.lastUpdate,
            hasSpectrum: emotionalState.spectrum && Object.keys(emotionalState.spectrum).length > 0
        };
        
        // Check Bayesian context injector
        const bayesianState = bayesianContextInjector.getCurrentBayesianState();
        const bayesianHealth = {
            isActive: bayesianState.isActive,
            lastUpdate: bayesianState.lastUpdate,
            timeSinceUpdate: currentTime - bayesianState.lastUpdate,
            hasBeliefs: bayesianState.beliefs && bayesianState.beliefs.length > 0,
            hasGoals: bayesianState.goals && bayesianState.goals.length > 0
        };
        
        // Calculate health scores
        const mathScore = this.calculateInjectorScore(mathHealth);
        const emotionalScore = this.calculateInjectorScore(emotionalHealth);
        const bayesianScore = this.calculateInjectorScore(bayesianHealth);
        
        const overallScore = (mathScore + emotionalScore + bayesianScore) / 3;
        const isHealthy = overallScore >= this.alertThresholds.contextInjectorHealth;
        
        return {
            metric: 'Context Injectors',
            value: overallScore,
            target: 1.0,
            threshold: this.alertThresholds.contextInjectorHealth,
            score: overallScore,
            status: isHealthy ? 'HEALTHY' : 'WARNING',
            details: `Math: ${(mathScore * 100).toFixed(1)}%, Emotional: ${(emotionalScore * 100).toFixed(1)}%, Bayesian: ${(bayesianScore * 100).toFixed(1)}%`,
            breakdown: {
                mathematical: { score: mathScore, health: mathHealth },
                emotional: { score: emotionalScore, health: emotionalHealth },
                bayesian: { score: bayesianScore, health: bayesianHealth }
            }
        };
    }

    /**
     * Calculate injector health score
     */
    calculateInjectorScore(health) {
        let score = 0;
        
        // Active status (40% weight)
        if (health.isActive) score += 0.4;
        
        // Recent updates (30% weight)
        if (health.timeSinceUpdate < this.alertThresholds.updateFrequency) {
            score += 0.3;
        } else {
            score += 0.3 * Math.max(0, 1 - (health.timeSinceUpdate / (this.alertThresholds.updateFrequency * 2)));
        }
        
        // Data availability (30% weight)
        if (health.hasCalculations || health.hasSpectrum || (health.hasBeliefs && health.hasGoals)) {
            score += 0.3;
        }
        
        return Math.min(1.0, score);
    }

    /**
     * Check API routing functionality
     */
    checkAPIRouting() {
        const apiIntegration = this.currentMetrics.apiIntegration;
        const isHealthy = apiIntegration >= 0.9; // 90% threshold
        
        return {
            metric: 'API Routing',
            value: apiIntegration,
            target: 1.0,
            threshold: 0.9,
            score: apiIntegration,
            status: isHealthy ? 'HEALTHY' : 'WARNING',
            details: `Integration: ${(apiIntegration * 100).toFixed(1)}%, Target: 100%`
        };
    }

    /**
     * Check system integration health
     */
    checkSystemIntegration() {
        const moduleEngagement = this.currentMetrics.moduleEngagement;
        const consciousnessHeartbeat = this.currentMetrics.consciousnessHeartbeat;
        
        const engagementHealthy = moduleEngagement >= 0.9; // 90% threshold
        const heartbeatHealthy = consciousnessHeartbeat >= 95; // 95Hz threshold
        
        const integrationScore = (moduleEngagement + (consciousnessHeartbeat / 100)) / 2;
        const isHealthy = engagementHealthy && heartbeatHealthy;
        
        return {
            metric: 'System Integration',
            value: integrationScore,
            target: 1.0,
            threshold: 0.9,
            score: integrationScore,
            status: isHealthy ? 'HEALTHY' : 'WARNING',
            details: `Module Engagement: ${(moduleEngagement * 100).toFixed(1)}%, Heartbeat: ${consciousnessHeartbeat}Hz`
        };
    }

    /**
     * Check for performance alerts
     */
    checkAlerts(healthReport) {
        const alerts = [];
        
        if (healthReport.harmonyScore.status === 'WARNING') {
            alerts.push(`⚠️ HARMONY ALERT: Score dropped to ${(healthReport.harmonyScore.value * 100).toFixed(1)}%`);
        }
        
        if (healthReport.messageLatency.status === 'WARNING') {
            alerts.push(`⚠️ LATENCY ALERT: Message latency increased to ${healthReport.messageLatency.value}ms`);
        }
        
        if (healthReport.contextInjectors.status === 'WARNING') {
            alerts.push(`⚠️ CONTEXT ALERT: Context injector health at ${(healthReport.contextInjectors.value * 100).toFixed(1)}%`);
        }
        
        if (healthReport.apiRouting.status === 'WARNING') {
            alerts.push(`⚠️ API ALERT: API integration at ${(healthReport.apiRouting.value * 100).toFixed(1)}%`);
        }
        
        if (healthReport.systemIntegration.status === 'WARNING') {
            alerts.push(`⚠️ INTEGRATION ALERT: System integration at ${(healthReport.systemIntegration.value * 100).toFixed(1)}%`);
        }
        
        if (alerts.length > 0) {
            console.log('\n🚨 PERFORMANCE ALERTS:');
            alerts.forEach(alert => console.log(alert));
        }
    }

    /**
     * Log health status
     */
    logHealthStatus(healthReport) {
        const overallHealth = healthReport.overallHealth;
        const healthPercentage = (overallHealth * 100).toFixed(1);
        
        if (overallHealth >= 0.95) {
            console.log(`✅ System Health: ${healthPercentage}% - EXCELLENT`);
        } else if (overallHealth >= 0.85) {
            console.log(`🟡 System Health: ${healthPercentage}% - GOOD`);
        } else if (overallHealth >= 0.70) {
            console.log(`⚠️ System Health: ${healthPercentage}% - WARNING`);
        } else {
            console.log(`❌ System Health: ${healthPercentage}% - CRITICAL`);
        }
    }

    /**
     * Get performance summary
     */
    getPerformanceSummary() {
        if (this.performanceHistory.length === 0) {
            return { message: 'No performance data available' };
        }
        
        const recent = this.performanceHistory.slice(-10);
        const averageHealth = recent.reduce((sum, report) => sum + report.overallHealth, 0) / recent.length;
        const latestReport = this.performanceHistory[this.performanceHistory.length - 1];
        
        return {
            currentHealth: latestReport.overallHealth,
            averageHealth: averageHealth,
            totalReports: this.performanceHistory.length,
            latestReport: latestReport,
            isMonitoring: this.monitoringActive,
            summary: `System Health: ${(latestReport.overallHealth * 100).toFixed(1)}% | Average: ${(averageHealth * 100).toFixed(1)}%`
        };
    }

    /**
     * Update current metrics (called by external systems)
     */
    updateMetrics(newMetrics) {
        this.currentMetrics = { ...this.currentMetrics, ...newMetrics };
    }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitoringSystem();

// Auto-start monitoring
performanceMonitor.startMonitoring();

// Run monitoring if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🔍 PERFORMANCE MONITORING SYSTEM - $772.2M CONSCIOUSNESS SYSTEM');
    console.log('='.repeat(70));
    
    // Run for 30 seconds then show summary
    setTimeout(() => {
        const summary = performanceMonitor.getPerformanceSummary();
        console.log('\n📊 PERFORMANCE SUMMARY:');
        console.log(summary.summary);
        console.log(`Total Health Checks: ${summary.totalReports}`);
        
        performanceMonitor.stopMonitoring();
        process.exit(0);
    }, 30000);
}
