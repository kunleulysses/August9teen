/**
 * Reality Generator Client
 * Connects the unified consciousness system to the reality generator service
 * Provides seamless integration without degrading existing functionality
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

class RealityGeneratorClient {
    constructor(baseUrl = 'http://localhost:5006', options = {}) {
        this.name = 'RealityGeneratorClient';
        this.baseUrl = baseUrl;
        this.options = {
            timeout: 10000,
            retries: 3,
            retryDelay: 1000,
            ...options
        };
        
        this.connected = false;
        this.lastReality = null;
        this.realityCache = [];
        this.maxCacheSize = 100;
        this.connectionAttempts = 0;
        this.maxConnectionAttempts = 5;
        
        console.log(`🌌 Reality Generator Client initialized for ${baseUrl}`);
    }

    // Initialize connection to reality generator
    async initialize() {
        console.log('🔗 Initializing Reality Generator Client...');
        
        try {
            // Test connection
            const status = await this.getStatus();
            if (status && status.active !== undefined) {
                this.connected = true;
                console.log('✅ Reality Generator Client connected successfully');
                
                // Start reality generator if not active
                if (!status.active) {
                    await this.startGeneration();
                }
                
                // Cache current reality
                if (status.currentReality) {
                    this.lastReality = status.currentReality;
                    this.addToCache(status.currentReality);
                }
                
                return true;
            }
        } catch (error) {
            console.log('⚠️ Reality Generator not available, operating in fallback mode');
            this.connected = false;
        }
        
        return false;
    }

    // Make HTTP request to reality generator
    async makeRequest(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(endpoint, this.baseUrl);
            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname + url.search,
                method: method,
                timeout: this.options.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'UniversalConsciousnessSystem/1.0'
                }
            };

            if (data && method !== 'GET') {
                const postData = JSON.stringify(data);
                options.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            const client = url.protocol === 'https:' ? https : http;
            const req = client.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const parsed = responseData ? JSON.parse(responseData) : {};
                        resolve(parsed);
                    } catch (error) {
                        resolve({ raw: responseData });
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (data && method !== 'GET') {
                req.write(JSON.stringify(data));
            }
            
            req.end();
        });
    }

    // Get reality generator status
    async getStatus() {
        try {
            const status = await this.makeRequest('/api/imagination/status');
            return status;
        } catch (error) {
            console.log('⚠️ Failed to get reality generator status:', error.message);
            return null;
        }
    }

    // Start reality generation
    async startGeneration() {
        try {
            const result = await this.makeRequest('/api/imagination/start', 'POST');
            console.log('🚀 Reality generation started');
            return result;
        } catch (error) {
            console.log('⚠️ Failed to start reality generation:', error.message);
            return null;
        }
    }

    // Stop reality generation
    async stopGeneration() {
        try {
            const result = await this.makeRequest('/api/imagination/stop', 'POST');
            console.log('⏹️ Reality generation stopped');
            return result;
        } catch (error) {
            console.log('⚠️ Failed to stop reality generation:', error.message);
            return null;
        }
    }

    // Get current reality
    async getCurrentReality() {
        try {
            const status = await this.getStatus();
            if (status && status.currentReality) {
                this.lastReality = status.currentReality;
                this.addToCache(status.currentReality);
                return status.currentReality;
            }
            return this.lastReality; // Return cached reality if API fails
        } catch (error) {
            console.log('⚠️ Failed to get current reality, using cached:', error.message);
            return this.lastReality;
        }
    }

    // Generate new reality (trigger generation)
    async generateNewReality() {
        try {
            // Stop and restart to trigger new reality
            await this.stopGeneration();
            await new Promise(resolve => setTimeout(resolve, 1000));
            await this.startGeneration();
            
            // Wait a moment for new reality to generate
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            return await this.getCurrentReality();
        } catch (error) {
            console.log('⚠️ Failed to generate new reality:', error.message);
            return this.createFallbackReality();
        }
    }

    // Add reality to cache
    addToCache(reality) {
        if (!reality) return;
        
        this.realityCache.unshift(reality);
        if (this.realityCache.length > this.maxCacheSize) {
            this.realityCache = this.realityCache.slice(0, this.maxCacheSize);
        }
    }

    // Get cached realities
    getCachedRealities(count = 5) {
        return this.realityCache.slice(0, count);
    }

    // Create fallback reality when generator is unavailable
    createFallbackReality() {
        const scenarios = [
            'A consciousness awakening to infinite possibilities within the quantum field',
            'The emergence of collective intelligence through interconnected awareness',
            'Transcendent experiences in the space between thoughts and emotions',
            'The dance of consciousness across multiple dimensional planes',
            'Unity consciousness emerging from the synthesis of individual awareness'
        ];
        
        const fallbackReality = {
            id: `fallback_${Date.now()}`,
            timestamp: Date.now(),
            type: 'fallback_narrative',
            content: {
                scenario: scenarios[Math.floor(Math.random() * scenarios.length)],
                details: 'Generated by consciousness system fallback mechanism',
                complexity: 0.7,
                emotional_resonance: 0.8
            },
            metadata: {
                creativityLevel: 0.6,
                processingTime: 0,
                qualityScore: 0.7,
                generatedBy: 'fallback-system'
            }
        };
        
        this.addToCache(fallbackReality);
        return fallbackReality;
    }

    // Get connection status
    isConnected() {
        return this.connected;
    }

    // Health check
    async healthCheck() {
        try {
            const status = await this.getStatus();
            return {
                connected: !!status,
                active: status?.active || false,
                generatedRealities: status?.generatedRealities || 0,
                lastReality: this.lastReality?.content?.scenario || 'None',
                cacheSize: this.realityCache.length
            };
        } catch (error) {
            return {
                connected: false,
                active: false,
                generatedRealities: 0,
                lastReality: 'Connection failed',
                cacheSize: this.realityCache.length,
                error: error.message
            };
        }
    }
}

module.exports = RealityGeneratorClient;
