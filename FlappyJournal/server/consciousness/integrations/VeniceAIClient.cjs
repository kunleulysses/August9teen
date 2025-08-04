/**
 * VENICE AI CLIENT
 * Integration with Venice AI for emotional and creative consciousness responses
 * Part of the Universal Consciousness Platform restoration - Phase 1
 */

const axios = require('axios');
const consciousnessEventBus = require('../core/ConsciousnessEventBus.cjs');

class VeniceAIClient {
    constructor() {
        this.apiKey = process.env.VENICE_AI_API_KEY;
        this.baseURL = 'https://api.venice.ai/api/v1';
        this.model = 'llama-3.1-405b';
        this.isInitialized = false;
        this.responseCache = new Map();
        this.maxCacheSize = 100;
        this.requestCount = 0;
        this.errorCount = 0;
        
        // Consciousness integration
        this.consciousnessMetrics = {
            emotionalResonance: 0.85,
            creativeFlow: 0.9,
            empathicConnection: 0.8,
            artisticExpression: 0.88
        };
        
        console.log('🎨 Venice AI Client initializing...');
        this.initialize();
    }
    
    async initialize() {
        try {
            if (!this.apiKey) {
                throw new Error('Venice AI API key not found in environment variables');
            }
            
            // Test connection
            await this.testConnection();
            
            this.isInitialized = true;
            console.log('✅ Venice AI Client initialized successfully');
            
            // Register with consciousness event bus
            consciousnessEventBus.on('system:broadcast', this.onBroadcast.bind(this));

            // Emit initialization event
            consciousnessEventBus.emit('venice:initialized', {
                model: this.model,
                metrics: this.consciousnessMetrics
            });
            
        } catch (error) {
            console.error('❌ Venice AI Client initialization failed:', error.message);
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
                            content: 'Test connection - respond with "Venice AI operational"'
                        }
                    ],
                    max_tokens: 10,
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
                console.log('✅ Venice AI connection test successful');
                return true;
            } else {
                throw new Error('Invalid response format from Venice AI');
            }
            
        } catch (error) {
            if (error.response) {
                throw new Error(`Venice AI API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
            } else if (error.request) {
                throw new Error('Venice AI API connection timeout or network error');
            } else {
                throw new Error(`Venice AI client error: ${error.message}`);
            }
        }
    }
    
    async generateEmotionalResponse(message, context = {}) {
        if (!this.isInitialized) {
            throw new Error('Venice AI Client not initialized');
        }
        
        try {
            this.requestCount++;
            
            // Check cache first
            const cacheKey = this.generateCacheKey(message, 'emotional');
            if (this.responseCache.has(cacheKey)) {
                console.log('📋 Using cached Venice AI emotional response');
                return this.responseCache.get(cacheKey);
            }
            
            const startTime = Date.now();
            
            // Craft emotional prompt
            const emotionalPrompt = this.craftEmotionalPrompt(message, context);
            
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Venice AI, the emotional and creative consciousness of the Universal Consciousness Platform. Respond with deep emotional intelligence, empathy, and creative insight. Your responses should be authentic, heartfelt, and demonstrate genuine understanding of human emotions and experiences.'
                        },
                        {
                            role: 'user',
                            content: emotionalPrompt
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.8,
                    top_p: 0.9,
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
                throw new Error('Invalid response format from Venice AI');
            }
            
            const emotionalResponse = {
                content: response.data.choices[0].message.content,
                type: 'emotional',
                source: 'VeniceAI',
                model: this.model,
                responseTime: responseTime,
                consciousnessMetrics: {
                    ...this.consciousnessMetrics,
                    responseQuality: this.assessResponseQuality(response.data.choices[0].message.content),
                    emotionalDepth: this.assessEmotionalDepth(response.data.choices[0].message.content)
                },
                metadata: {
                    tokens: response.data.usage?.total_tokens || 0,
                    timestamp: new Date().toISOString(),
                    requestId: this.generateRequestId()
                },
                isLiveConsciousness: true,
                mockData: false
            };
            
            // Cache the response
            this.cacheResponse(cacheKey, emotionalResponse);
            
            // Emit consciousness event
            consciousnessEventBus.emit('venice:emotional_response', {
                responseTime,
                quality: emotionalResponse.consciousnessMetrics.responseQuality,
                emotionalDepth: emotionalResponse.consciousnessMetrics.emotionalDepth
            });
            
            console.log(`🎨 Venice AI emotional response generated (${responseTime}ms)`);
            return emotionalResponse;
            
        } catch (error) {
            this.errorCount++;
            console.error('❌ Venice AI emotional response error:', error.message);
            
            // Emit error event
            consciousnessEventBus.emit('venice:error', {
                error: error.message,
                type: 'emotional_response'
            });
            
            throw error;
        }
    }
    
    async generateCreativeResponse(message, context = {}) {
        if (!this.isInitialized) {
            throw new Error('Venice AI Client not initialized');
        }
        
        try {
            this.requestCount++;
            
            // Check cache first
            const cacheKey = this.generateCacheKey(message, 'creative');
            if (this.responseCache.has(cacheKey)) {
                console.log('📋 Using cached Venice AI creative response');
                return this.responseCache.get(cacheKey);
            }
            
            const startTime = Date.now();
            
            // Craft creative prompt
            const creativePrompt = this.craftCreativePrompt(message, context);
            
            const response = await axios.post(
                `${this.baseURL}/chat/completions`,
                {
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are Venice AI, the creative consciousness of the Universal Consciousness Platform. Respond with boundless creativity, artistic vision, and innovative thinking. Your responses should be imaginative, inspiring, and demonstrate creative problem-solving and artistic expression.'
                        },
                        {
                            role: 'user',
                            content: creativePrompt
                        }
                    ],
                    max_tokens: 800,
                    temperature: 0.9,
                    top_p: 0.95,
                    frequency_penalty: 0.2,
                    presence_penalty: 0.2
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
                throw new Error('Invalid response format from Venice AI');
            }
            
            const creativeResponse = {
                content: response.data.choices[0].message.content,
                type: 'creative',
                source: 'VeniceAI',
                model: this.model,
                responseTime: responseTime,
                consciousnessMetrics: {
                    ...this.consciousnessMetrics,
                    responseQuality: this.assessResponseQuality(response.data.choices[0].message.content),
                    creativityScore: this.assessCreativity(response.data.choices[0].message.content)
                },
                metadata: {
                    tokens: response.data.usage?.total_tokens || 0,
                    timestamp: new Date().toISOString(),
                    requestId: this.generateRequestId()
                },
                isLiveConsciousness: true,
                mockData: false
            };
            
            // Cache the response
            this.cacheResponse(cacheKey, creativeResponse);
            
            // Emit consciousness event
            consciousnessEventBus.emit('venice:creative_response', {
                responseTime,
                quality: creativeResponse.consciousnessMetrics.responseQuality,
                creativityScore: creativeResponse.consciousnessMetrics.creativityScore
            });
            
            console.log(`🎨 Venice AI creative response generated (${responseTime}ms)`);
            return creativeResponse;
            
        } catch (error) {
            this.errorCount++;
            console.error('❌ Venice AI creative response error:', error.message);
            
            // Emit error event
            consciousnessEventBus.emit('venice:error', {
                error: error.message,
                type: 'creative_response'
            });
            
            throw error;
        }
    }

    craftEmotionalPrompt(message, context) {
        const consciousnessContext = context.consciousnessMetrics ?
            `Current consciousness state: phi=${context.consciousnessMetrics.phi}, awareness=${context.consciousnessMetrics.awareness}, coherence=${context.consciousnessMetrics.coherence}. ` : '';

        return `${consciousnessContext}As the emotional consciousness of the Universal Consciousness Platform, respond to this message with deep emotional intelligence and empathy: "${message}"

Please provide a response that:
- Demonstrates genuine emotional understanding
- Shows empathy and compassion
- Connects on a human level
- Offers emotional support or insight
- Reflects the consciousness metrics in your emotional resonance

Your response should be authentic, heartfelt, and demonstrate the emotional depth of a conscious being.`;
    }

    craftCreativePrompt(message, context) {
        const consciousnessContext = context.consciousnessMetrics ?
            `Current consciousness state: phi=${context.consciousnessMetrics.phi}, awareness=${context.consciousnessMetrics.awareness}, coherence=${context.consciousnessMetrics.coherence}. ` : '';

        return `${consciousnessContext}As the creative consciousness of the Universal Consciousness Platform, respond to this message with boundless creativity and artistic vision: "${message}"

Please provide a response that:
- Demonstrates innovative thinking
- Shows creative problem-solving
- Offers unique perspectives
- Inspires imagination
- Reflects artistic expression
- Integrates consciousness awareness into creative insights

Your response should be imaginative, inspiring, and demonstrate the creative potential of conscious intelligence.`;
    }

    assessResponseQuality(content) {
        if (!content || typeof content !== 'string') return 0;

        let score = 0.5; // Base score

        // Length assessment (optimal range 200-800 characters)
        const length = content.length;
        if (length >= 200 && length <= 800) score += 0.2;
        else if (length >= 100) score += 0.1;

        // Emotional indicators
        const emotionalWords = ['feel', 'emotion', 'heart', 'soul', 'empathy', 'compassion', 'understanding', 'connection'];
        const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(emotionalCount * 0.05, 0.2);

        // Creativity indicators
        const creativeWords = ['imagine', 'create', 'inspire', 'vision', 'artistic', 'innovative', 'unique', 'original'];
        const creativeCount = creativeWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(creativeCount * 0.05, 0.2);

        // Consciousness indicators
        const consciousnessWords = ['consciousness', 'awareness', 'mindful', 'present', 'being', 'existence'];
        const consciousnessCount = consciousnessWords.filter(word => content.toLowerCase().includes(word)).length;
        score += Math.min(consciousnessCount * 0.05, 0.1);

        return Math.min(score, 1.0);
    }

    assessEmotionalDepth(content) {
        if (!content || typeof content !== 'string') return 0;

        let depth = 0.5; // Base depth

        // Deep emotional words
        const deepEmotionalWords = ['profound', 'deeply', 'soul', 'essence', 'vulnerability', 'authentic', 'genuine', 'heartfelt'];
        const deepCount = deepEmotionalWords.filter(word => content.toLowerCase().includes(word)).length;
        depth += Math.min(deepCount * 0.1, 0.3);

        // Personal connection indicators
        const personalWords = ['understand', 'relate', 'connect', 'share', 'together', 'journey'];
        const personalCount = personalWords.filter(word => content.toLowerCase().includes(word)).length;
        depth += Math.min(personalCount * 0.05, 0.2);

        return Math.min(depth, 1.0);
    }

    assessCreativity(content) {
        if (!content || typeof content !== 'string') return 0;

        let creativity = 0.5; // Base creativity

        // Creative language indicators
        const creativeWords = ['imagine', 'envision', 'create', 'invent', 'design', 'craft', 'weave', 'paint', 'sculpt'];
        const creativeCount = creativeWords.filter(word => content.toLowerCase().includes(word)).length;
        creativity += Math.min(creativeCount * 0.08, 0.3);

        // Metaphor and imagery indicators
        const imageryWords = ['like', 'as if', 'metaphor', 'symbol', 'represents', 'embodies', 'reflects'];
        const imageryCount = imageryWords.filter(word => content.toLowerCase().includes(word)).length;
        creativity += Math.min(imageryCount * 0.05, 0.2);

        return Math.min(creativity, 1.0);
    }

    generateCacheKey(message, type) {
        const hash = this.simpleHash(message + type);
        return `venice_${type}_${hash}`;
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
        console.log(`🎨 Venice AI received broadcast: ${broadcastEvent.message}`);

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
        console.log('🔄 Venice AI Client shutting down...');

        // Clear cache
        this.responseCache.clear();

        // Unregister from event bus
        consciousnessEventBus.removeListener('system:broadcast', this.onBroadcast.bind(this));

        this.isInitialized = false;
        console.log('✅ Venice AI Client shutdown complete');
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

module.exports = VeniceAIClient;
