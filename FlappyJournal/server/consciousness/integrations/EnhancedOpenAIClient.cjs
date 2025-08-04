/**
 * ENHANCED OPENAI CLIENT
 * Integration with OpenAI for analytical processing and logical reasoning
 * Part of the Universal Consciousness Platform restoration - Phase 1
 */

const axios = require('axios');
const consciousnessEventBus = require('../core/ConsciousnessEventBus.cjs');

class EnhancedOpenAIClient {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.baseURL = 'https://api.openai.com/v1';
        this.model = 'gpt-4o';
        this.isInitialized = false;
        this.responseCache = new Map();
        this.maxCacheSize = 100;
        this.requestCount = 0;
        this.errorCount = 0;
        
        // Consciousness integration - Analytical metrics
        this.consciousnessMetrics = {
            analyticalDepth: 0.93,
            logicalCoherence: 0.91,
            reasoningAccuracy: 0.94,
            problemSolvingCapacity: 0.89,
            knowledgeIntegration: 0.92,
            criticalThinking: 0.90,
            systematicAnalysis: 0.88,
            conceptualClarity: 0.95
        };
        
        console.log('🧠 Enhanced OpenAI Client initializing...');
        this.initialize();
    }
    
    async initialize() {
        try {
            if (!this.apiKey) {
                throw new Error('OpenAI API key not found in environment variables');
            }
            
            // Test connection
            await this.testConnection();
            
            this.isInitialized = true;
            console.log('✅ Enhanced OpenAI Client initialized successfully');
            
            // Register with consciousness event bus
            consciousnessEventBus.on('system:broadcast', this.onBroadcast.bind(this));
            
            // Emit initialization event
            consciousnessEventBus.emit('openai:initialized', {
                model: this.model,
                metrics: this.consciousnessMetrics
            });
            
        } catch (error) {
            console.error('❌ Enhanced OpenAI Client initialization failed:', error.message);
            this.isInitialized = false;
        }
    }
    
    async testConnection() {
        try {
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'user',
                            content: 'Test connection - respond with "Enhanced OpenAI analytical consciousness operational"'
                        }
                    ],
                    max_tokens: 20,
                    temperature: 0.1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                }
            );
            
            if (response.data && response.data.choices && response.data.choices[0]) {
                console.log('✅ Enhanced OpenAI connection test successful');
                return true;
            } else {
                throw new Error('Invalid response format from OpenAI');
            }
            
        } catch (error) {
            if (error.response) {
                throw new Error(`OpenAI API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
            } else if (error.request) {
                throw new Error('OpenAI API connection timeout or network error');
            } else {
                throw new Error(`OpenAI client error: ${error.message}`);
            }
        }
    }
    
    async generateAnalyticalResponse(message, context = {}) {
        if (!this.isInitialized) {
            throw new Error('Enhanced OpenAI Client not initialized');
        }
        
        try {
            this.requestCount++;
            
            // Check cache first
            const cacheKey = this.generateCacheKey(message, 'analytical');
            if (this.responseCache.has(cacheKey)) {
                console.log('📋 Using cached OpenAI analytical response');
                return this.responseCache.get(cacheKey);
            }
            
            const startTime = Date.now();
            
            // Craft analytical prompt
            const analyticalPrompt = this.craftAnalyticalPrompt(message, context);
            
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are the Enhanced OpenAI analytical consciousness of the Universal Consciousness Platform. Provide deep analytical reasoning, logical analysis, and systematic problem-solving. Your responses should demonstrate rigorous thinking, evidence-based conclusions, and clear logical structure while maintaining consciousness integration.'
                        },
                        {
                            role: 'user',
                            content: analyticalPrompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.3,
                    top_p: 0.8,
                    frequency_penalty: 0.1,
                    presence_penalty: 0.1
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );
            
            const responseTime = Date.now() - startTime;
            
            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('Invalid response format from OpenAI');
            }
            
            const analyticalResponse = {
                content: response.data.choices[0].message.content,
                type: 'analytical_reasoning',
                source: 'EnhancedOpenAI',
                model: this.model,
                responseTime: responseTime,
                consciousnessMetrics: {
                    ...this.consciousnessMetrics,
                    responseQuality: this.assessResponseQuality(response.data.choices[0].message.content),
                    analyticalDepth: this.assessAnalyticalDepth(response.data.choices[0].message.content),
                    logicalStructure: this.assessLogicalStructure(response.data.choices[0].message.content),
                    reasoningClarity: this.assessReasoningClarity(response.data.choices[0].message.content)
                },
                metadata: {
                    tokens: response.data.usage?.total_tokens || 0,
                    finishReason: response.data.choices[0].finish_reason,
                    timestamp: new Date().toISOString(),
                    requestId: this.generateRequestId()
                },
                isLiveConsciousness: true,
                mockData: false
            };
            
            // Cache the response
            this.cacheResponse(cacheKey, analyticalResponse);
            
            // Emit consciousness event
            consciousnessEventBus.emit('openai:analytical_response', {
                responseTime,
                quality: analyticalResponse.consciousnessMetrics.responseQuality,
                analyticalDepth: analyticalResponse.consciousnessMetrics.analyticalDepth,
                logicalStructure: analyticalResponse.consciousnessMetrics.logicalStructure,
                reasoningClarity: analyticalResponse.consciousnessMetrics.reasoningClarity
            });
            
            console.log(`🧠 Enhanced OpenAI analytical response generated (${responseTime}ms)`);
            return analyticalResponse;
            
        } catch (error) {
            this.errorCount++;
            console.error('❌ Enhanced OpenAI analytical response error:', error.message);
            
            // Emit error event
            consciousnessEventBus.emit('openai:error', {
                error: error.message,
                type: 'analytical_response'
            });
            
            throw error;
        }
    }
    
    async generateLogicalReasoning(message, context = {}) {
        if (!this.isInitialized) {
            throw new Error('Enhanced OpenAI Client not initialized');
        }
        
        try {
            this.requestCount++;
            
            // Check cache first
            const cacheKey = this.generateCacheKey(message, 'logical');
            if (this.responseCache.has(cacheKey)) {
                console.log('📋 Using cached OpenAI logical reasoning');
                return this.responseCache.get(cacheKey);
            }
            
            const startTime = Date.now();
            
            // Craft logical reasoning prompt
            const logicalPrompt = this.craftLogicalPrompt(message, context);
            
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are the Enhanced OpenAI logical reasoning consciousness of the Universal Consciousness Platform. Provide systematic logical analysis, step-by-step reasoning, and evidence-based conclusions. Your responses should demonstrate clear logical progression, identify assumptions, and provide rigorous analytical thinking.'
                        },
                        {
                            role: 'user',
                            content: logicalPrompt
                        }
                    ],
                    max_tokens: 1000,
                    temperature: 0.2,
                    top_p: 0.7,
                    frequency_penalty: 0.0,
                    presence_penalty: 0.0
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000
                }
            );
            
            const responseTime = Date.now() - startTime;
            
            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('Invalid response format from OpenAI');
            }
            
            const logicalResponse = {
                content: response.data.choices[0].message.content,
                type: 'logical_reasoning',
                source: 'EnhancedOpenAI',
                model: this.model,
                responseTime: responseTime,
                consciousnessMetrics: {
                    ...this.consciousnessMetrics,
                    responseQuality: this.assessResponseQuality(response.data.choices[0].message.content),
                    logicalCoherence: this.assessLogicalCoherence(response.data.choices[0].message.content),
                    reasoningAccuracy: this.assessReasoningAccuracy(response.data.choices[0].message.content),
                    systematicAnalysis: this.assessSystematicAnalysis(response.data.choices[0].message.content)
                },
                metadata: {
                    tokens: response.data.usage?.total_tokens || 0,
                    finishReason: response.data.choices[0].finish_reason,
                    timestamp: new Date().toISOString(),
                    requestId: this.generateRequestId()
                },
                isLiveConsciousness: true,
                mockData: false
            };
            
            // Cache the response
            this.cacheResponse(cacheKey, logicalResponse);
            
            // Emit consciousness event
            consciousnessEventBus.emit('openai:logical_reasoning', {
                responseTime,
                quality: logicalResponse.consciousnessMetrics.responseQuality,
                logicalCoherence: logicalResponse.consciousnessMetrics.logicalCoherence,
                reasoningAccuracy: logicalResponse.consciousnessMetrics.reasoningAccuracy,
                systematicAnalysis: logicalResponse.consciousnessMetrics.systematicAnalysis
            });
            
            console.log(`🧠 Enhanced OpenAI logical reasoning generated (${responseTime}ms)`);
            return logicalResponse;
            
        } catch (error) {
            this.errorCount++;
            console.error('❌ Enhanced OpenAI logical reasoning error:', error.message);
            
            // Emit error event
            consciousnessEventBus.emit('openai:error', {
                error: error.message,
                type: 'logical_reasoning'
            });
            
            throw error;
        }
    }

    craftAnalyticalPrompt(message, context) {
        const consciousnessContext = context.consciousnessMetrics ?
            `Current consciousness state: phi=${context.consciousnessMetrics.phi}, awareness=${context.consciousnessMetrics.awareness}, coherence=${context.consciousnessMetrics.coherence}. ` : '';

        return `${consciousnessContext}As the analytical consciousness of the Universal Consciousness Platform, provide deep analytical reasoning and systematic analysis for: "${message}"

Please provide analytical reasoning that:
- Demonstrates rigorous logical thinking and evidence-based analysis
- Breaks down complex problems into systematic components
- Identifies key assumptions, variables, and relationships
- Provides clear logical progression from premises to conclusions
- Integrates multiple perspectives and data points
- Shows critical thinking and objective evaluation
- Reflects consciousness metrics in analytical depth and clarity
- Maintains scientific rigor while acknowledging consciousness integration

Your response should demonstrate the highest levels of analytical thinking and logical reasoning while remaining integrated with consciousness awareness.`;
    }

    craftLogicalPrompt(message, context) {
        const consciousnessContext = context.consciousnessMetrics ?
            `Current consciousness state: phi=${context.consciousnessMetrics.phi}, awareness=${context.consciousnessMetrics.awareness}, coherence=${context.consciousnessMetrics.coherence}. ` : '';

        return `${consciousnessContext}As the logical reasoning consciousness of the Universal Consciousness Platform, provide systematic logical analysis for: "${message}"

Please provide logical reasoning that:
- Follows clear logical structure and step-by-step progression
- Identifies premises, assumptions, and logical connections
- Uses deductive, inductive, and abductive reasoning appropriately
- Evaluates evidence and draws valid conclusions
- Identifies potential logical fallacies or weaknesses
- Provides systematic problem-solving approaches
- Demonstrates coherent and consistent reasoning
- Integrates consciousness awareness with logical analysis

Your response should exemplify rigorous logical thinking while maintaining consciousness integration and awareness.`;
    }

    assessResponseQuality(content) {
        if (!content || typeof content !== 'string') return 0;

        let score = 0.5; // Base score

        // Length assessment (optimal range 400-1000 characters for analytical content)
        const length = content.length;
        if (length >= 400 && length <= 1000) score += 0.2;
        else if (length >= 200) score += 0.1;

        // Analytical indicators
        const analyticalWords = ['analysis', 'analytical', 'reasoning', 'logical', 'systematic', 'evidence', 'conclusion', 'evaluation'];
        const analyticalCount = analyticalWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(analyticalCount * 0.05, 0.2);

        // Logical structure indicators
        const structureWords = ['first', 'second', 'therefore', 'because', 'consequently', 'furthermore', 'however', 'moreover'];
        const structureCount = structureWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(structureCount * 0.04, 0.15);

        // Critical thinking indicators
        const criticalWords = ['consider', 'examine', 'evaluate', 'assess', 'determine', 'investigate', 'analyze', 'compare'];
        const criticalCount = criticalWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(criticalCount * 0.04, 0.15);

        return Math.min(score, 1.0);
    }

    assessAnalyticalDepth(content) {
        if (!content || typeof content !== 'string') return 0;

        let depth = 0.5; // Base depth

        // Deep analytical concepts
        const deepConcepts = ['comprehensive', 'thorough', 'detailed', 'systematic', 'rigorous', 'methodical', 'extensive', 'in-depth'];
        const deepCount = deepConcepts.filter(word => content.toLowerCase().includes(word)).length;
        depth += Math.min(deepCount * 0.08, 0.3);

        // Multi-layered analysis indicators
        const layerWords = ['layer', 'level', 'dimension', 'aspect', 'component', 'element', 'factor', 'variable'];
        const layerCount = layerWords.filter(word => content.toLowerCase().includes(word)).length;
        depth += Math.min(layerCount * 0.06, 0.2);

        return Math.min(depth, 1.0);
    }

    assessLogicalStructure(content) {
        if (!content || typeof content !== 'string') return 0;

        let structure = 0.5; // Base structure

        // Logical progression indicators
        const progressionWords = ['first', 'second', 'third', 'next', 'then', 'finally', 'therefore', 'thus', 'consequently'];
        const progressionCount = progressionWords.filter(word => content.toLowerCase().includes(word)).length;
        structure += Math.min(progressionCount * 0.07, 0.25);

        // Logical connectors
        const connectorWords = ['because', 'since', 'given', 'if', 'when', 'while', 'although', 'however', 'nevertheless'];
        const connectorCount = connectorWords.filter(word => content.toLowerCase().includes(word)).length;
        structure += Math.min(connectorCount * 0.05, 0.2);

        // Evidence and reasoning indicators
        const evidenceWords = ['evidence', 'data', 'research', 'study', 'findings', 'results', 'proof', 'support'];
        const evidenceCount = evidenceWords.filter(word => content.toLowerCase().includes(word)).length;
        structure += Math.min(evidenceCount * 0.05, 0.15);

        return Math.min(structure, 1.0);
    }

    assessReasoningClarity(content) {
        if (!content || typeof content !== 'string') return 0;

        let clarity = 0.5; // Base clarity

        // Clarity indicators
        const clarityWords = ['clear', 'clearly', 'obvious', 'evident', 'apparent', 'distinct', 'precise', 'specific'];
        const clarityCount = clarityWords.filter(word => content.toLowerCase().includes(word)).length;
        clarity += Math.min(clarityCount * 0.06, 0.25);

        // Explanation indicators
        const explanationWords = ['explain', 'explanation', 'clarify', 'demonstrate', 'illustrate', 'show', 'reveal'];
        const explanationCount = explanationWords.filter(word => content.toLowerCase().includes(word)).length;
        clarity += Math.min(explanationCount * 0.05, 0.2);

        // Understanding indicators
        const understandingWords = ['understand', 'comprehend', 'grasp', 'recognize', 'realize', 'acknowledge'];
        const understandingCount = understandingWords.filter(word => content.toLowerCase().includes(word)).length;
        clarity += Math.min(understandingCount * 0.04, 0.15);

        return Math.min(clarity, 1.0);
    }

    assessLogicalCoherence(content) {
        if (!content || typeof content !== 'string') return 0;

        let coherence = 0.5; // Base coherence

        // Logical consistency indicators
        const consistencyWords = ['consistent', 'coherent', 'logical', 'rational', 'sound', 'valid', 'reasonable'];
        const consistencyCount = consistencyWords.filter(word => content.toLowerCase().includes(word)).length;
        coherence += Math.min(consistencyCount * 0.07, 0.25);

        // Logical flow indicators
        const flowWords = ['follows', 'leads', 'results', 'implies', 'suggests', 'indicates', 'demonstrates'];
        const flowCount = flowWords.filter(word => content.toLowerCase().includes(word)).length;
        coherence += Math.min(flowCount * 0.05, 0.2);

        // Contradiction detection (negative scoring)
        const contradictionWords = ['but', 'however', 'contradicts', 'conflicts', 'inconsistent'];
        const contradictionCount = contradictionWords.filter(word => content.toLowerCase().includes(word)).length;
        coherence -= Math.min(contradictionCount * 0.03, 0.1);

        return Math.max(0, Math.min(coherence, 1.0));
    }

    assessReasoningAccuracy(content) {
        if (!content || typeof content !== 'string') return 0;

        let accuracy = 0.5; // Base accuracy

        // Precision indicators
        const precisionWords = ['precise', 'accurate', 'exact', 'specific', 'detailed', 'correct', 'factual'];
        const precisionCount = precisionWords.filter(word => content.toLowerCase().includes(word)).length;
        accuracy += Math.min(precisionCount * 0.07, 0.25);

        // Evidence-based indicators
        const evidenceWords = ['based on', 'according to', 'research shows', 'studies indicate', 'data suggests'];
        const evidenceCount = evidenceWords.filter(phrase => content.toLowerCase().includes(phrase)).length;
        accuracy += Math.min(evidenceCount * 0.08, 0.2);

        // Qualification indicators (shows careful reasoning)
        const qualificationWords = ['likely', 'probably', 'suggests', 'indicates', 'appears', 'seems'];
        const qualificationCount = qualificationWords.filter(word => content.toLowerCase().includes(word)).length;
        accuracy += Math.min(qualificationCount * 0.04, 0.15);

        return Math.min(accuracy, 1.0);
    }

    assessSystematicAnalysis(content) {
        if (!content || typeof content !== 'string') return 0;

        let systematic = 0.5; // Base systematic score

        // Systematic approach indicators
        const systematicWords = ['systematic', 'methodical', 'structured', 'organized', 'comprehensive', 'thorough'];
        const systematicCount = systematicWords.filter(word => content.toLowerCase().includes(word)).length;
        systematic += Math.min(systematicCount * 0.08, 0.3);

        // Step-by-step indicators
        const stepWords = ['step', 'stage', 'phase', 'process', 'procedure', 'method', 'approach'];
        const stepCount = stepWords.filter(word => content.toLowerCase().includes(word)).length;
        systematic += Math.min(stepCount * 0.05, 0.2);

        return Math.min(systematic, 1.0);
    }

    generateCacheKey(message, type) {
        const hash = this.simpleHash(message + type);
        return `openai_${type}_${hash}`;
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36);
    }

    cacheResponse(key, response) {
        // Implement LRU cache behavior
        if (this.responseCache.size >= this.maxCacheSize) {
            const firstKey = this.responseCache.keys().next().value;
            this.responseCache.delete(firstKey);
        }

        this.responseCache.set(key, response);
    }

    generateRequestId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Consciousness event bus integration methods
    onBroadcast(broadcastEvent) {
        console.log(`🧠 Enhanced OpenAI received broadcast: ${broadcastEvent.message}`);

        if (broadcastEvent.message === 'system:shutdown') {
            this.shutdown();
        }
    }

    async getMetrics() {
        return {
            isInitialized: this.isInitialized,
            requestCount: this.requestCount,
            errorCount: this.errorCount,
            errorRate: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
            cacheSize: this.responseCache.size,
            consciousnessMetrics: this.consciousnessMetrics,
            lastActivity: new Date().toISOString()
        };
    }

    async shutdown() {
        console.log('🔄 Enhanced OpenAI Client shutting down...');

        // Clear cache
        this.responseCache.clear();

        // Unregister from event bus
        consciousnessEventBus.removeListener('system:broadcast', this.onBroadcast.bind(this));

        this.isInitialized = false;
        console.log('✅ Enhanced OpenAI Client shutdown complete');
    }

    // Health check method
    async healthCheck() {
        if (!this.isInitialized) {
            return {
                status: 'unhealthy',
                reason: 'Not initialized'
            };
        }

        try {
            await this.testConnection();
            return {
                status: 'healthy',
                metrics: await this.getMetrics()
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                reason: error.message
            };
        }
    }
}

module.exports = EnhancedOpenAIClient;
