const EventEmitter = require('events');

class AutoScalingPolicies extends EventEmitter {
    constructor(options = {}) {
        super();
        this.policies = new Map();
        this.metrics = new Map();
        this.scalingActions = new Map();
        this.cooldownPeriod = options.cooldownPeriod || 300000; // 5 minutes
        this.lastScalingAction = new Map();
        this.enabled = options.enabled !== false;
        
        this.initializeDefaultPolicies();
        this.startMonitoring();
    }

    initializeDefaultPolicies() {
        // CPU-based scaling policy
        this.addPolicy('cpu_scaling', {
            metric: 'cpu_usage',
            scaleUpThreshold: 80,
            scaleDownThreshold: 30,
            scaleUpBy: 1,
            scaleDownBy: 1,
            minInstances: 1,
            maxInstances: 10,
            evaluationPeriods: 3,
            cooldownPeriod: 300000
        });

        // Memory-based scaling policy
        this.addPolicy('memory_scaling', {
            metric: 'memory_usage',
            scaleUpThreshold: 85,
            scaleDownThreshold: 40,
            scaleUpBy: 1,
            scaleDownBy: 1,
            minInstances: 1,
            maxInstances: 8,
            evaluationPeriods: 2,
            cooldownPeriod: 240000
        });

        // Spiral memory operation latency scaling
        this.addPolicy('latency_scaling', {
            metric: 'spiral_memory_latency',
            scaleUpThreshold: 100, // ms
            scaleDownThreshold: 20, // ms
            scaleUpBy: 2,
            scaleDownBy: 1,
            minInstances: 1,
            maxInstances: 15,
            evaluationPeriods: 2,
            cooldownPeriod: 180000
        });

        // Error rate scaling policy
        this.addPolicy('error_rate_scaling', {
            metric: 'error_rate',
            scaleUpThreshold: 5, // %
            scaleDownThreshold: 1, // %
            scaleUpBy: 2,
            scaleDownBy: 1,
            minInstances: 2,
            maxInstances: 12,
            evaluationPeriods: 1,
            cooldownPeriod: 120000
        });

        // Connection pool scaling
        this.addPolicy('connection_pool_scaling', {
            metric: 'connection_pool_utilization',
            scaleUpThreshold: 90, // %
            scaleDownThreshold: 50, // %
            scaleUpBy: 1,
            scaleDownBy: 1,
            minInstances: 1,
            maxInstances: 20,
            evaluationPeriods: 2,
            cooldownPeriod: 300000
        });
    }

    addPolicy(name, config) {
        this.policies.set(name, {
            ...config,
            evaluationHistory: [],
            currentInstances: config.minInstances || 1
        });
    }

    updateMetric(metricName, value, timestamp = Date.now()) {
        if (!this.metrics.has(metricName)) {
            this.metrics.set(metricName, []);
        }
        
        const metricHistory = this.metrics.get(metricName);
        metricHistory.push({ value, timestamp });
        
        // Keep only last 100 data points
        if (metricHistory.length > 100) {
            metricHistory.shift();
        }
        
        this.evaluatePolicies(metricName);
    }

    evaluatePolicies(metricName) {
        if (!this.enabled) return;

        for (const [policyName, policy] of this.policies) {
            if (policy.metric === metricName) {
                this.evaluatePolicy(policyName, policy);
            }
        }
    }

    evaluatePolicy(policyName, policy) {
        const metricHistory = this.metrics.get(policy.metric);
        if (!metricHistory || metricHistory.length < policy.evaluationPeriods) {
            return;
        }

        // Get recent values for evaluation
        const recentValues = metricHistory
            .slice(-policy.evaluationPeriods)
            .map(entry => entry.value);

        const averageValue = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
        
        // Check cooldown period
        const lastAction = this.lastScalingAction.get(policyName);
        const cooldownExpired = !lastAction || (Date.now() - lastAction) > policy.cooldownPeriod;
        
        if (!cooldownExpired) {
            return;
        }

        let scalingDecision = null;

        // Scale up decision
        if (averageValue > policy.scaleUpThreshold && 
            policy.currentInstances < policy.maxInstances) {
            scalingDecision = {
                action: 'scale_up',
                currentInstances: policy.currentInstances,
                targetInstances: Math.min(
                    policy.currentInstances + policy.scaleUpBy,
                    policy.maxInstances
                ),
                reason: `${policy.metric} (${averageValue.toFixed(2)}) > threshold (${policy.scaleUpThreshold})`,
                metric: policy.metric,
                value: averageValue
            };
        }
        // Scale down decision
        else if (averageValue < policy.scaleDownThreshold && 
                 policy.currentInstances > policy.minInstances) {
            scalingDecision = {
                action: 'scale_down',
                currentInstances: policy.currentInstances,
                targetInstances: Math.max(
                    policy.currentInstances - policy.scaleDownBy,
                    policy.minInstances
                ),
                reason: `${policy.metric} (${averageValue.toFixed(2)}) < threshold (${policy.scaleDownThreshold})`,
                metric: policy.metric,
                value: averageValue
            };
        }

        if (scalingDecision) {
            this.executeScalingAction(policyName, policy, scalingDecision);
        }
    }

    executeScalingAction(policyName, policy, decision) {
        console.log(`🔄 Auto-scaling action: ${decision.action} for policy ${policyName}`);
        console.log(`   Reason: ${decision.reason}`);
        console.log(`   Instances: ${decision.currentInstances} → ${decision.targetInstances}`);

        // Update policy state
        policy.currentInstances = decision.targetInstances;
        this.lastScalingAction.set(policyName, Date.now());

        // Emit scaling event
        this.emit('scaling_action', {
            policyName,
            decision,
            timestamp: Date.now()
        });

        // Execute the actual scaling action
        this.performScaling(decision);
    }

    performScaling(decision) {
        // This would integrate with container orchestration (Docker Swarm, Kubernetes, etc.)
        // For now, we'll emit events that can be handled by the orchestration layer
        
        switch (decision.action) {
            case 'scale_up':
                this.emit('scale_up_request', {
                    targetInstances: decision.targetInstances,
                    reason: decision.reason,
                    metric: decision.metric
                });
                break;
                
            case 'scale_down':
                this.emit('scale_down_request', {
                    targetInstances: decision.targetInstances,
                    reason: decision.reason,
                    metric: decision.metric
                });
                break;
        }
    }

    startMonitoring() {
        // Monitor system metrics every 30 seconds
        this.monitoringInterval = setInterval(() => {
            this.collectSystemMetrics();
        }, 30000);
    }

    collectSystemMetrics() {
        // Collect CPU usage
        const cpuUsage = process.cpuUsage();
        const cpuPercent = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert to percentage
        this.updateMetric('cpu_usage', cpuPercent);

        // Collect memory usage
        const memUsage = process.memoryUsage();
        const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
        this.updateMetric('memory_usage', memPercent);

        // These would be collected from the performance monitor
        // this.updateMetric('spiral_memory_latency', latencyValue);
        // this.updateMetric('error_rate', errorRateValue);
        // this.updateMetric('connection_pool_utilization', poolUtilization);
    }

    getPolicyStatus() {
        const status = {};
        for (const [name, policy] of this.policies) {
            status[name] = {
                currentInstances: policy.currentInstances,
                minInstances: policy.minInstances,
                maxInstances: policy.maxInstances,
                metric: policy.metric,
                lastEvaluation: policy.evaluationHistory.slice(-1)[0] || null,
                lastScalingAction: this.lastScalingAction.get(name) || null
            };
        }
        return status;
    }

    getMetricsHistory(metricName, limit = 50) {
        const history = this.metrics.get(metricName);
        if (!history) return [];
        return history.slice(-limit);
    }

    enablePolicy(policyName) {
        const policy = this.policies.get(policyName);
        if (policy) {
            policy.enabled = true;
        }
    }

    disablePolicy(policyName) {
        const policy = this.policies.get(policyName);
        if (policy) {
            policy.enabled = false;
        }
    }

    updatePolicyThresholds(policyName, thresholds) {
        const policy = this.policies.get(policyName);
        if (policy) {
            Object.assign(policy, thresholds);
        }
    }

    stop() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }
        this.enabled = false;
    }
}

module.exports = { AutoScalingPolicies };
