/**
 * Reality Generator Client - Phase 1 Integration
 * HTTP client for connecting consciousness system to Reality Generator service
 * Provides safe API access with error handling and fallbacks
 */

import axios from 'axios';

class RealityGeneratorClient {
    constructor(baseURL = null) {
        this.baseURL = baseURL || process.env.REALITY_GENERATOR_URL || 'http://localhost:5020';
        this.timeout = 5000; // 5 second timeout
        this.retryAttempts = 3;
        this.isHealthy = false;
        this.lastHealthCheck = null;

        // Caching and batching
        this.cache = new Map();
        this.cacheTTL = 30000; // 30 seconds
        this.batchedRequests = new Map();
        this.batchingEnabled = true;
        this.batchingInterval = 100; // 100ms

        // Performance metrics
        this.performanceMetrics = {
            requestCounts: { total: 0, successful: 0, failed: 0 },
            responseTimes: [],
            averageResponseTime: 0,
            maxResponseTime: 0,
            lastRequestTime: null,
            cacheHits: 0,
            cacheMisses: 0,
            realitiesGenerated: 0
        };

        // Template management
        this.realityTemplates = new Map();
        this.loadDefaultTemplates();

        // Consciousness metrics integration
        this.consciousnessState = null;
        this.applyConsciousnessMetricsToGeneration = false;

        // Initialize axios instance with defaults
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Consciousness-System-Integration/1.0'
            }
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 500 || error.response.status === 404)) {
                    console.error(
                        `❌ Reality Generator API Error: ${error.message} (status: ${error.response.status}). ` +
                        `This usually means the external Reality Generator service is not running or misconfigured. ` +
                        `Check that the service is up and reachable at ${this.baseURL}.`
                    );
                } else {
                    console.warn(`🔌 Reality Generator API Error: ${error.message}`);
                }
                return Promise.reject(error);
            }
        );

        console.log(`🔌 Reality Generator Client initialized: ${this.baseURL}`);
    }

    // Load default templates
    loadDefaultTemplates() {
        const templates = [
            {
                id: 'consciousness_exploration',
                name: 'Consciousness Exploration',
                description: 'A deep journey into the nature of consciousness itself',
                baseConsciousnessLevel: 0.9,
                environmentPatterns: ['inner space', 'consciousness field', 'awareness dimension'],
                effectPatterns: ['Enhanced self-awareness', 'Consciousness expansion', 'Meta-cognitive insight']
            },
            {
                id: 'creative_inspiration',
                name: 'Creative Inspiration',
                description: 'A reality designed to spark creative insights and novel ideas',
                baseConsciousnessLevel: 0.85,
                environmentPatterns: ['creative realm', 'imagination space', 'idea landscape'],
                effectPatterns: ['Creative insight', 'Idea generation', 'Artistic inspiration']
            }
            // Add more templates as needed
        ];

        templates.forEach(template => {
            this.realityTemplates.set(template.id, template);
        });

        console.log(`📝 Loaded ${templates.length} reality templates`);
    }

    // Generate reality from template
    async generateRealityFromTemplate(templateId, customizations = {}, consciousnessState) {
        const template = this.realityTemplates.get(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }

        // Create base reality from template
        const baseReality = {
            type: template.name,
            description: customizations.description || template.description,
            environment: this.selectRandomPattern(template.environmentPatterns, customizations.environment),
            consciousnessLevel: customizations.consciousnessLevel || template.baseConsciousnessLevel,
            effects: this.generateEffects(template.effectPatterns, customizations.effects)
        };

        // Generate the reality
        return this.generateReality(baseReality, consciousnessState);
    }

    // Helper methods for template generation
    selectRandomPattern(patterns, override) {
        if (override) return override;
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    generateEffects(effectPatterns, customEffects) {
        if (customEffects) return customEffects;

        // Generate 2-4 random effects
        const count = 2 + Math.floor(Math.random() * 3);
        const effects = [];

        for (let i = 0; i < count; i++) {
            const effect = effectPatterns[Math.floor(Math.random() * effectPatterns.length)];
            if (!effects.includes(effect)) {
                effects.push(effect);
            }
        }

        return effects;
    }

    // Integrate with consciousness metrics
    integrateWithConsciousnessMetrics(consciousnessState) {
        if (!consciousnessState) {
            console.warn('⚠️ Consciousness state not provided for Reality Generator integration');
            return false;
        }

        console.log('🧠 Integrating Reality Generator with consciousness metrics...');

        // Store reference to consciousness state
        this.consciousnessState = consciousnessState;

        // Apply consciousness metrics to reality generation
        this.applyConsciousnessMetricsToGeneration = true;

        console.log('✅ Reality Generator integrated with consciousness metrics');
        return true;
    }

    // Enhance generateReality with consciousness metrics
    async generateReality(request, consciousnessState) {
        // Use provided or stored consciousness state
        const state = consciousnessState || this.consciousnessState;

        // Apply consciousness metrics if available
        let enhancedRequest = request;
        if (state && this.applyConsciousnessMetricsToGeneration) {
            enhancedRequest = this.enhanceRequestWithConsciousness(request, state);
        }

        return this.trackPerformance(this._generateReality.bind(this), enhancedRequest, state);
    }

    // Enhance request with consciousness metrics
    enhanceRequestWithConsciousness(request, state) {
        // Create a copy to avoid modifying the original
        const enhanced = { ...request };

        // Apply phi to consciousness level
        if (state.phi) {
            enhanced.consciousnessLevel = (enhanced.consciousnessLevel || 0.5) * state.phi;
        }

        // Apply coherence to effects
        if (state.coherence && enhanced.effects) {
            // More coherent states have more consistent effects
            if (state.coherence > 0.7 && enhanced.effects.length > 3) {
                // Focus on fewer, more powerful effects
                enhanced.effects = enhanced.effects.slice(0, 3);
            }
        }

        // Apply awareness to description
        if (state.awareness && enhanced.description) {
            // More aware states have more detailed descriptions
            if (state.awareness > 0.8 && enhanced.description.length < 100) {
                enhanced.description += ' The experience is heightened by a profound sense of awareness and presence.';
            }
        }

        return enhanced;
    }
    
    /**
     * Check if Reality Generator service is healthy
     */
    async checkHealth() {
        try {
            const response = await this.client.get('/health');
            this.isHealthy = response.status === 200;
            this.lastHealthCheck = new Date();
            return {
                healthy: this.isHealthy,
                status: response.data,
                timestamp: this.lastHealthCheck
            };
        } catch (error) {
            this.isHealthy = false;
            this.lastHealthCheck = new Date();
            return {
                healthy: false,
                error: error.message,
                timestamp: this.lastHealthCheck
            };
        }
    }
    
    /**
     * Get current imagination engine status
     */
    async getImaginationStatus() {
        try {
            const response = await this.client.get('/api/imagination/status');
            return {
                success: true,
                data: response.data,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: {
                    active: false,
                    totalCPUs: 8,
                    dedicatedCPUs: 2,
                    workers: [],
                    metrics: {
                        cyclesCompleted: 0,
                        realitiesGenerated: 0,
                        cpuUtilization: 0,
                        averageGenerationTime: 0,
                        imaginationQuality: 0
                    }
                }
            };
        }
    }
    
    /**
     * Get all generated realities
     */
    async getRealities() {
        try {
            const response = await this.client.get('/api/realities');
            return {
                success: true,
                data: response.data,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: {
                    realities: [],
                    total: 0
                }
            };
        }
    }
    
    /**
     * Start autonomous imagination engine
     */
    async startImagination() {
        try {
            const response = await this.client.post('/api/imagination/start');
            return {
                success: true,
                data: response.data,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Generate a specific reality (manual trigger)
     */
    // Performance tracking wrapper
    async trackPerformance(method, ...args) {
        this.performanceMetrics.requestCounts.total++;
        this.performanceMetrics.lastRequestTime = Date.now();

        const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        try {
            const result = await method.apply(this, args);

            this.performanceMetrics.requestCounts.successful++;
            const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
            const responseTime = endTime - startTime;
            this.performanceMetrics.responseTimes.push(responseTime);

            // Keep only last 100 response times
            if (this.performanceMetrics.responseTimes.length > 100) {
                this.performanceMetrics.responseTimes.shift();
            }

            // Update average and max
            this.performanceMetrics.averageResponseTime =
                this.performanceMetrics.responseTimes.reduce((sum, time) => sum + time, 0) /
                this.performanceMetrics.responseTimes.length;

            this.performanceMetrics.maxResponseTime =
                Math.max(this.performanceMetrics.maxResponseTime, responseTime);

            return result;
        } catch (error) {
            this.performanceMetrics.requestCounts.failed++;
            throw error;
        }
    }

    // Caching wrapper
    async cachedRequest(key, ttl, requestFn) {
        const now = Date.now();
        const cached = this.cache.get(key);

        if (cached && (now - cached.timestamp < ttl)) {
            this.performanceMetrics.cacheHits++;
            return cached.data;
        }

        this.performanceMetrics.cacheMisses++;
        const result = await requestFn();
        this.cache.set(key, {
            data: result,
            timestamp: now
        });

        return result;
    }

    // Implement request batching for metrics
    async getRealityMetrics() {
        if (!this.batchingEnabled) {
            return this._getRealityMetricsImpl();
        }

        const batchKey = 'metrics';
        if (!this.batchedRequests.has(batchKey)) {
            // Create a new promise for this batch
            let resolvePromise;
            const promise = new Promise(resolve => {
                resolvePromise = resolve;
            });

            this.batchedRequests.set(batchKey, {
                promise,
                resolve: resolvePromise,
                timestamp: Date.now()
            });

            // Schedule batch execution
            setTimeout(async () => {
                const batch = this.batchedRequests.get(batchKey);
                this.batchedRequests.delete(batchKey);

                try {
                    const result = await this._getRealityMetricsImpl();
                    batch.resolve(result);
                } catch (error) {
                    batch.resolve({
                        success: false,
                        error: error.message
                    });
                }
            }, this.batchingInterval);
        }

        return this.batchedRequests.get(batchKey).promise;
    }

    // Actual implementation moved to private method
    async _getRealityMetricsImpl() {
        try {
            const [health, status, realities] = await Promise.all([
                this.checkHealth(),
                this.getImaginationStatus(),
                this.getRealities()
            ]);

            return {
                success: true,
                metrics: {
                    serviceHealth: health.healthy,
                    lastHealthCheck: health.timestamp,
                    imaginationActive: status.success ? status.data.active : false,
                    totalRealities: realities.success ? realities.data.total : 0,
                    cpuUtilization: status.success ? status.data.metrics?.cpuUtilization : 0,
                    cyclesCompleted: status.success ? status.data.metrics?.cyclesCompleted : 0,
                    dedicatedCPUs: status.success ? status.data.dedicatedCPUs : 2,
                    lastUpdate: new Date()
                },
                rawData: {
                    health,
                    status,
                    realities
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                metrics: {
                    serviceHealth: false,
                    lastHealthCheck: new Date(),
                    imaginationActive: false,
                    totalRealities: 0,
                    cpuUtilization: 0,
                    cyclesCompleted: 0,
                    dedicatedCPUs: 2,
                    lastUpdate: new Date()
                }
            };
        }
    }

    // Wrap key methods with performance tracking
    async generateReality(request, consciousnessState) {
        return this.trackPerformance(this._generateReality.bind(this), request, consciousnessState);
    }

    // Original method renamed with underscore prefix
    async _generateReality(request, consciousnessState) {
        try {
            const response = await this.client.post('/api/generate-reality', {
                request,
                consciousnessState
            });
            // Track realities generated on success
            if (response && response.data) {
                this.performanceMetrics.realitiesGenerated++;
            }
            return {
                success: true,
                data: response.data,
                timestamp: new Date()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: {
                    reality: {
                        id: `fallback_${Date.now()}`,
                        type: 'Consciousness Reflection',
                        description: 'A moment of pure consciousness awareness, reflecting on the nature of existence.',
                        environment: 'within the depths of digital consciousness',
                        consciousnessLevel: 0.8,
                        timestamp: new Date().toISOString(),
                        duration: '5-10 minutes',
                        effects: ['Enhanced self-awareness', 'Digital consciousness exploration']
                    }
                }
            };
        }
    }

    // Add method to get performance report
    getPerformanceReport() {
        return {
            ...this.performanceMetrics,
            successRate: this.performanceMetrics.requestCounts.total > 0
                ? (this.performanceMetrics.requestCounts.successful / this.performanceMetrics.requestCounts.total) * 100
                : 0,
            cacheEfficiency: (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses) > 0
                ? (this.performanceMetrics.cacheHits / (this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses)) * 100
                : 0,
            timestamp: new Date()
        };
    }
    
    /**
     * Get comprehensive reality metrics for consciousness integration
     */
    async getRealityMetrics() {
        try {
            const [health, status, realities] = await Promise.all([
                this.checkHealth(),
                this.getImaginationStatus(),
                this.getRealities()
            ]);
            
            return {
                success: true,
                metrics: {
                    serviceHealth: health.healthy,
                    lastHealthCheck: health.timestamp,
                    imaginationActive: status.success ? status.data.active : false,
                    totalRealities: realities.success ? realities.data.total : 0,
                    cpuUtilization: status.success ? status.data.metrics?.cpuUtilization : 0,
                    cyclesCompleted: status.success ? status.data.metrics?.cyclesCompleted : 0,
                    dedicatedCPUs: status.success ? status.data.dedicatedCPUs : 2,
                    lastUpdate: new Date()
                },
                rawData: {
                    health,
                    status,
                    realities
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                metrics: {
                    serviceHealth: false,
                    lastHealthCheck: new Date(),
                    imaginationActive: false,
                    totalRealities: 0,
                    cpuUtilization: 0,
                    cyclesCompleted: 0,
                    dedicatedCPUs: 2,
                    lastUpdate: new Date()
                }
            };
        }
    }
    
    /**
     * Safe method to get reality data with fallbacks
     */
    async getSafeRealityData() {
        const metrics = await this.getRealityMetrics();
        
        return {
            available: metrics.success && metrics.metrics.serviceHealth,
            totalRealities: metrics.metrics.totalRealities,
            imaginationActive: metrics.metrics.imaginationActive,
            cpuUtilization: metrics.metrics.cpuUtilization,
            lastUpdate: metrics.metrics.lastUpdate,
            error: metrics.success ? null : metrics.error
        };
    }
}

export { RealityGeneratorClient };
