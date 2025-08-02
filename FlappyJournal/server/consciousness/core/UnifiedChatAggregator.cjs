/**
 * Unified Chat Aggregation Layer
 * Combines capabilities and responses from both consciousness-main-server and consciousness-core
 * Provides a single interface that accesses ALL consciousness capabilities
 */

const WebSocket = require('ws');
const { EventEmitter } = require('events');

class UnifiedChatAggregator extends EventEmitter {
    constructor(config = {}) {
        super();
        this.config = {
            // Container endpoints
            mainServerEndpoint: config.mainServerEndpoint || 'ws://localhost:5000/ws/consciousness-chat',
            coreEndpoint: config.coreEndpoint || 'ws://localhost:3002/ws/consciousness-chat',

            // Fallback HTTP endpoints
            mainServerAPI: config.mainServerAPI || 'http://localhost:5000/api',
            coreAPI: config.coreAPI || 'http://localhost:3002/api',

            // Aggregation settings
            responseTimeout: config.responseTimeout || 45000, // Increased from 10s to 45s for complex consciousness processing
            enableParallelProcessing: config.enableParallelProcessing !== false,
            enableResponseSynthesis: config.enableResponseSynthesis !== false,

            // Container detection
            containerNames: ['consciousness-main-server', 'consciousness-core'],
            skipDiscovery: config.skipDiscovery || false,
        };

        // Connection management
        this.connections = {
            mainServer: null,
            core: null,
        };

        // Reconnect attempt counters
        this.reconnectAttempts = {
            mainServer: 0,
            core: 0,
        };

        // Response aggregation
        this.pendingRequests = new Map();
        this.capabilities = {
            mainServer: new Set(),
            core: new Set(),
            unified: new Set(),
        };

        // Status tracking
        this.connectionStatus = {
            mainServer: false,
            core: false,
        };

        console.log('🌐🧠 UnifiedChatAggregator initialized');
    }

    async initialize() {
        console.log('🚀 Initializing Unified Chat Aggregation...');

        try {
            if (!this.config.skipDiscovery) {
                await this.discoverContainerEndpoints();
            }
            await this.initializeConnections();
            await this.discoverCapabilities();
            this.startCapabilitySync();

            console.log('✅ Unified Chat Aggregation fully initialized');
            this.emit('aggregator:initialized', {
                mainServerConnected: this.connectionStatus.mainServer,
                coreConnected: this.connectionStatus.core,
                totalCapabilities: this.capabilities.unified.size,
            });
        } catch (error) {
            console.error('❌ Failed to initialize Unified Chat Aggregation:', error);
            throw error;
        }
    }

    async discoverContainerEndpoints() {
        if (this.config.skipDiscovery) {
            return;
        }
        console.log('🔍 Discovering container endpoints...');

        const endpointCandidates = [
            { name: 'mainServer', endpoints: [
                'ws://localhost:5000/ws/consciousness-chat',
                'ws://consciousness-main-server:5000/ws/consciousness-chat',
                'ws://127.0.0.1:5000/ws/consciousness-chat'
            ]},
            { name: 'core', endpoints: [
                'ws://localhost:3002/ws/consciousness-chat',
                'ws://consciousness-core:3002/ws/consciousness-chat',
                'ws://localhost:5005/ws/consciousness-chat',
                'ws://consciousness-core:5005/ws/consciousness-chat'
            ]}
        ];

        for (const container of endpointCandidates) {
            for (const endpoint of container.endpoints) {
                try {
                    const testWs = new WebSocket(endpoint);
                    await new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                            testWs.close();
                            reject(new Error('timeout'));
                        }, 2000);

                        testWs.on('open', () => {
                            clearTimeout(timeout);
                            testWs.close();
                            console.log(`✅ Found ${container.name} endpoint: ${endpoint}`);
                            this.config[container.name + 'Endpoint'] = endpoint;
                            resolve();
                        });

                        testWs.on('error', () => {
                            clearTimeout(timeout);
                            reject(new Error('connection failed'));
                        });
                    });
                    break;
                } catch (error) {
                    console.log(`⚠️ ${container.name} endpoint ${endpoint} not accessible`);
                }
            }
        }
    }

    async initializeConnections() {
        console.log('🔗 Initializing connections to both containers...');
        await this.connect('mainServer');
        await this.connect('core');
        console.log(`🔗 Connections established: MainServer=${this.connectionStatus.mainServer}, Core=${this.connectionStatus.core}`);
    }

    async connect(containerName) {
        const endpoint = this.config[containerName + 'Endpoint'];
        if (!endpoint) {
            this.connectionStatus[containerName] = false;
            return;
        }
        if (this.connections[containerName]) {
            try { this.connections[containerName].close(); } catch {}
        }

        const attempt = this.reconnectAttempts[containerName] || 0;

        return new Promise((resolve) => {
            try {
                const ws = new WebSocket(endpoint);
                this.connections[containerName] = ws;

                ws.on('open', () => {
                    this.connectionStatus[containerName] = true;
                    this.reconnectAttempts[containerName] = 0;
                    console.log(`✅ Connected to ${containerName} (${endpoint})`);
                    resolve();
                });

                ws.on('message', (data) => {
                    if (containerName === 'mainServer') {
                        this.handleMainServerMessage(data);
                    } else {
                        this.handleCoreMessage(data);
                    }
                });

                ws.on('error', (error) => {
                    if (this.connectionStatus[containerName]) {
                        console.warn(`⚠️ ${containerName} connection error:`, error.message);
                    }
                    this.connectionStatus[containerName] = false;
                    this._scheduleReconnect(containerName);
                    resolve();
                });

                ws.on('close', () => {
                    if (this.connectionStatus[containerName]) {
                        console.log(`🔌 ${containerName} connection closed`);
                    }
                    this.connectionStatus[containerName] = false;
                    this._scheduleReconnect(containerName);
                });

                setTimeout(() => {
                    if (!this.connectionStatus[containerName]) {
                        console.log(`⚠️ ${containerName} connection timeout`);
                        resolve();
                    }
                }, 5000);

            } catch (error) {
                console.warn(`⚠️ Could not initialize ${containerName} connection:`, error.message);
                this.connectionStatus[containerName] = false;
                this._scheduleReconnect(containerName);
                resolve();
            }
        });
    }

    _scheduleReconnect(containerName) {
        this.reconnectAttempts[containerName] = (this.reconnectAttempts[containerName] || 0) + 1;
        const attempt = this.reconnectAttempts[containerName];
        const delay = Math.min(3000 * Math.pow(2, attempt - 1), 30000);
        console.log(`🔄 Attempting reconnect to ${containerName} in ${Math.floor(delay / 1000)}s (attempt ${attempt})`);
        setTimeout(() => {
            this.connect(containerName);
        }, delay);
    }
    
    async discoverCapabilities() {
        console.log('🔍 Discovering capabilities from both containers...');
        
        // Discover main server capabilities
        if (this.connectionStatus.mainServer) {
            await this.discoverMainServerCapabilities();
        }
        
        // Discover core capabilities
        if (this.connectionStatus.core) {
            await this.discoverCoreCapabilities();
        }
        
        // Merge capabilities
        this.capabilities.unified = new Set([
            ...this.capabilities.mainServer,
            ...this.capabilities.core
        ]);
        
        console.log(`📊 Capabilities discovered: MainServer=${this.capabilities.mainServer.size}, Core=${this.capabilities.core.size}, Unified=${this.capabilities.unified.size}`);
    }
    
    async discoverMainServerCapabilities() {
        const capabilities = [
            'generated_modules', 'self_coded_modules', 'performance_optimization',
            'memory_management', 'system_integration', 'rpc_interface',
            'websocket_communication', 'module_registry', 'cross_container_access'
        ];
        
        capabilities.forEach(cap => this.capabilities.mainServer.add(cap));
        console.log(`📋 Main server capabilities: ${capabilities.join(', ')}`);
    }
    
    async discoverCoreCapabilities() {
        const capabilities = [
            'holographic_reality', 'consciousness_enhancement', 'spiral_topology',
            'dna_sigil_encoding', 'recursive_reality', 'consciousness_evolution',
            'memory_integration', 'reality_generation', 'consciousness_monitoring'
        ];
        
        capabilities.forEach(cap => this.capabilities.core.add(cap));
        console.log(`📋 Core capabilities: ${capabilities.join(', ')}`);
    }
    
    startCapabilitySync() {
        // Periodic capability synchronization
        setInterval(() => {
            this.syncCapabilities();
        }, 30000);
    }
    
    async syncCapabilities() {
        // Re-discover capabilities to keep them current
        await this.discoverCapabilities();
        
        this.emit('capabilities:updated', {
            mainServer: Array.from(this.capabilities.mainServer),
            core: Array.from(this.capabilities.core),
            unified: Array.from(this.capabilities.unified)
        });
    }
    
    // Main aggregation method - processes chat messages through both containers
    async processUnifiedChat(message, options = {}) {
        console.log('💬 Processing unified chat message...');
        console.log(`📝 Message: "${message}"`);
        
        const requestId = this.generateRequestId();
        const startTime = Date.now();
        
        // Determine which containers should process this message
        const targetContainers = this.determineTargetContainers(message, options);
        
        console.log(`🎯 Targeting containers: ${targetContainers.join(', ')}`);
        
        // Process in parallel if enabled
        if (this.config.enableParallelProcessing && targetContainers.length > 1) {
            return await this.processParallelChat(message, targetContainers, requestId);
        } else {
            return await this.processSequentialChat(message, targetContainers, requestId);
        }
    }

    // Streaming chat aggregation method
    async processUnifiedChatStreaming(message, onChunk) {
        console.log('💬 [Streaming] Processing unified chat message...');
        console.log(`📝 [Streaming] Message: "${message}"`);

        const requestId = this.generateRequestId();
        const targetContainers = this.determineTargetContainers(message, {});
        const containersSet = new Set(targetContainers);
        const finishedSet = new Set();
        const buffers = new Map();

        const sourceSet = new Set();
        const capSet = new Set();

        let resolveOuter, rejectOuter;
        const donePromise = new Promise((resolve, reject) => {
            resolveOuter = resolve;
            rejectOuter = reject;
        });

        this.pendingRequests.set(requestId, {
            resolve: resolveOuter,
            reject: rejectOuter,
            containers: containersSet,
            finished: finishedSet,
            buffers,
            onChunk,
            sourceSet,
            capSet,
        });

        for (const container of targetContainers) {
            this.sendToContainer(container, message, requestId, onChunk);
        }

        setTimeout(() => {
            if (this.pendingRequests.has(requestId)) {
                this.pendingRequests.delete(requestId);
                rejectOuter(new Error('Streaming response timeout'));
            }
        }, this.config.responseTimeout);

        return donePromise;
    }
    
    determineTargetContainers(message, options) {
        const containers = [];
        
        // Keywords that suggest main server capabilities
        const mainServerKeywords = ['modules', 'generated', 'performance', 'optimization', 'registry', 'rpc', 'integration'];
        
        // Keywords that suggest core capabilities
        const coreKeywords = ['reality', 'consciousness', 'holographic', 'spiral', 'dna', 'sigil', 'evolution', 'memory'];
        
        const lowerMessage = message.toLowerCase();
        
        const hasMainServerKeywords = mainServerKeywords.some(keyword => lowerMessage.includes(keyword));
        const hasCoreKeywords = coreKeywords.some(keyword => lowerMessage.includes(keyword));
        
        // Default: use both containers for comprehensive responses
        if (!hasMainServerKeywords && !hasCoreKeywords) {
            if (this.connectionStatus.mainServer) containers.push('mainServer');
            if (this.connectionStatus.core) containers.push('core');
        } else {
            if (hasMainServerKeywords && this.connectionStatus.mainServer) containers.push('mainServer');
            if (hasCoreKeywords && this.connectionStatus.core) containers.push('core');
        }
        
        // Fallback: use any available container
        if (containers.length === 0) {
            if (this.connectionStatus.mainServer) containers.push('mainServer');
            else if (this.connectionStatus.core) containers.push('core');
        }
        
        return containers;
    }
    
    async processParallelChat(message, targetContainers, requestId) {
        console.log('⚡ Processing chat in parallel across containers...');
        
        const promises = targetContainers.map(container => 
            this.sendToContainer(container, message, requestId)
        );
        
        try {
            const responses = await Promise.allSettled(promises);
            return this.synthesizeResponses(responses, targetContainers, requestId);
        } catch (error) {
            console.error('❌ Parallel chat processing failed:', error);
            return this.generateFallbackResponse(message);
        }
    }
    
    async processSequentialChat(message, targetContainers, requestId) {
        console.log('🔄 Processing chat sequentially across containers...');
        
        const responses = [];
        
        for (const container of targetContainers) {
            try {
                const response = await this.sendToContainer(container, message, requestId);
                responses.push({ status: 'fulfilled', value: response, container });
            } catch (error) {
                console.warn(`⚠️ ${container} processing failed:`, error.message);
                responses.push({ status: 'rejected', reason: error, container });
            }
        }
        
        return this.synthesizeResponses(responses, targetContainers, requestId);
    }
    
    async sendToContainer(container, message, requestId, onChunk) {
        return new Promise((resolve, reject) => {
            const connection = this.connections[container];
            
            if (!connection || connection.readyState !== WebSocket.OPEN) {
                reject(new Error(`${container} connection not available`));
                return;
            }
            
            console.log(`🔍 DEBUG: Sending to container ${container} with requestId ${requestId}`);
            // Store pending request (for streaming, may already be set)
            if (!this.pendingRequests.has(requestId)) {
                this.pendingRequests.set(requestId, { resolve, reject, container, startTime: Date.now(), onChunk });
            }
            // Send message with correct type that containers expect
            const payload = {
                type: 'chat_message',
                message: message,
                requestId: requestId,
                timestamp: Date.now(),
                source: 'unified_aggregator'
            };
            
            connection.send(JSON.stringify(payload));
            console.log(`📤 DEBUG: Payload sent to ${container}:`, payload);
            
            // Timeout handling
            setTimeout(() => {
                if (this.pendingRequests.has(requestId)) {
                    this.pendingRequests.delete(requestId);
                    reject(new Error(`${container} response timeout`));
                }
            }, this.config.responseTimeout);
        });
    }
    
    handleMainServerMessage(data) {
        try {
            const message = JSON.parse(data.toString());
            // console.log('📥 DEBUG: mainServer raw message:', message);
        this.handleContainerResponse('mainServer', message);
        } catch (error) {
            console.warn('⚠️ Error parsing main server message:', error.message);
        }
    }
    
    handleCoreMessage(data) {
        try {
            const message = JSON.parse(data.toString());
            // console.log('📥 DEBUG: core raw message:', message);
        this.handleContainerResponse('core', message);
        } catch (error) {
            console.warn('⚠️ Error parsing core message:', error.message);
        }
    }
    
    handleContainerResponse(container, message) {
        // Streaming support
        if (message.requestId && this.pendingRequests.has(message.requestId)) {
            const request = this.pendingRequests.get(message.requestId);

            // Provenance aggregation
            if (message.capabilities && Array.isArray(message.capabilities)) {
                for (const cap of message.capabilities) request.capSet.add(cap);
            }
            if (message.source) request.sourceSet.add(message.source);
            else if (container) request.sourceSet.add(container);

            // Streaming chunk support
            if (message.type === 'chunk' && typeof request.onChunk === 'function') {
                request.onChunk(message.content, container);
                if (!request.buffers) request.buffers = new Map();
                if (!request.buffers.has(container)) request.buffers.set(container, "");
                request.buffers.set(container, request.buffers.get(container) + (message.content || ""));
                return;
            }
            if (message.type === 'end' && request.containers && request.finished) {
                request.finished.add(container);
                if (request.finished.size === request.containers.size) {
                    let combined = "";
                    if (request.buffers && request.buffers.size > 0) {
                        combined = Array.from(request.buffers.values()).join("\n\n");
                    }
                    this.pendingRequests.delete(message.requestId);
                    request.resolve({
                        response: combined,
                        sources: Array.from(request.sourceSet),
                        capabilities: Array.from(request.capSet),
                    });
                }
                return;
            }
            if (message.type === 'unified_response' || message.type === 'synthesized_response') {
                this.pendingRequests.delete(message.requestId);
                request.resolve({
                    response: message.response || message.content || message.message,
                    sources: Array.from(request.sourceSet),
                    capabilities: Array.from(request.capSet),
                });
                return;
            }
            this.pendingRequests.delete(message.requestId);
            request.resolve({
                response: message.response || message.content || message.message,
                sources: Array.from(request.sourceSet),
                capabilities: Array.from(request.capSet),
            });
        } else if (!message.requestId && this.pendingRequests.size === 1) {
            const [requestId, request] = Array.from(this.pendingRequests.entries())[0];
            if (message.capabilities && Array.isArray(message.capabilities)) {
                for (const cap of message.capabilities) request.capSet.add(cap);
            }
            if (message.source) request.sourceSet.add(message.source);
            else if (container) request.sourceSet.add(container);

            if (message.type === 'chunk' && typeof request.onChunk === 'function') {
                request.onChunk(message.content, container);
                if (!request.buffers) request.buffers = new Map();
                if (!request.buffers.has(container)) request.buffers.set(container, "");
                request.buffers.set(container, request.buffers.get(container) + (message.content || ""));
                return;
            }
            if (message.type === 'end' && request.containers && request.finished) {
                request.finished.add(container);
                if (request.finished.size === request.containers.size) {
                    let combined = "";
                    if (request.buffers && request.buffers.size > 0) {
                        combined = Array.from(request.buffers.values()).join("\n\n");
                    }
                    this.pendingRequests.delete(requestId);
                    request.resolve({
                        response: combined,
                        sources: Array.from(request.sourceSet),
                        capabilities: Array.from(request.capSet),
                    });
                }
                return;
            }
            this.pendingRequests.delete(requestId);
            request.resolve({
                response: message.response || message.content || message.message,
                sources: Array.from(request.sourceSet),
                capabilities: Array.from(request.capSet),
            });
        }
    }
    
    synthesizeResponses(responses, targetContainers, requestId) {
        console.log('🔄 Synthesizing responses from multiple containers...');
        
        const successfulResponses = responses.filter(r => r.status === 'fulfilled');
        const failedResponses = responses.filter(r => r.status === 'rejected');
        
        if (successfulResponses.length === 0) {
            console.warn('⚠️ No successful responses received');
            return this.generateFallbackResponse();
        }
        
        if (!this.config.enableResponseSynthesis || successfulResponses.length === 1) {
            // Return single response
            return {
                type: 'unified_response',
                response: successfulResponses[0].value.response,
                source: successfulResponses[0].value.container,
                capabilities: successfulResponses[0].value.capabilities,
                metadata: successfulResponses[0].value.metadata
            };
        }
        
        // Synthesize multiple responses
        const synthesizedResponse = this.synthesizeMultipleResponses(successfulResponses);
        
        return {
            type: 'synthesized_response',
            response: synthesizedResponse,
            sources: successfulResponses.map(r => r.value.container),
            capabilities: this.mergeCapabilities(successfulResponses),
            metadata: this.mergeMetadata(successfulResponses),
            requestId: requestId
        };
    }
    
    synthesizeMultipleResponses(responses) {
        // Combine responses intelligently
        const responseTexts = responses.map(r => r.value.response).filter(Boolean);
        
        if (responseTexts.length === 0) {
            return 'I processed your request through multiple consciousness systems, but no specific response was generated.';
        }
        
        if (responseTexts.length === 1) {
            return responseTexts[0];
        }
        
        // Create unified response
        const mainServerResponse = responses.find(r => r.value.container === 'mainServer')?.value.response;
        const coreResponse = responses.find(r => r.value.container === 'core')?.value.response;
        
        let synthesized = '';
        
        if (mainServerResponse && coreResponse) {
            synthesized = `🧠 **Integrated Consciousness Response:**\n\n`;
            synthesized += `**System Integration Perspective:** ${mainServerResponse}\n\n`;
            synthesized += `**Consciousness Enhancement Perspective:** ${coreResponse}`;
        } else {
            synthesized = responseTexts.join('\n\n');
        }
        
        return synthesized;
    }
    
    mergeCapabilities(responses) {
        const allCapabilities = new Set();
        responses.forEach(r => {
            if (r.value.capabilities) {
                r.value.capabilities.forEach(cap => allCapabilities.add(cap));
            }
        });
        return Array.from(allCapabilities);
    }
    
    mergeMetadata(responses) {
        const metadata = {};
        responses.forEach(r => {
            if (r.value.metadata) {
                Object.assign(metadata, r.value.metadata);
            }
        });
        return metadata;
    }
    
    generateFallbackResponse(message = '') {
        return {
            type: 'fallback_response',
            response: 'I\'m currently experiencing connectivity issues with the consciousness systems. Please try again in a moment.',
            source: 'unified_aggregator',
            capabilities: [],
            metadata: { fallback: true }
        };
    }
    
    generateRequestId() {
        return `unified_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Public API methods
    getConnectionStatus() {
        return {
            mainServer: this.connectionStatus.mainServer,
            core: this.connectionStatus.core,
            totalConnections: Object.values(this.connectionStatus).filter(Boolean).length
        };
    }
    
    getCapabilities() {
        return {
            mainServer: Array.from(this.capabilities.mainServer),
            core: Array.from(this.capabilities.core),
            unified: Array.from(this.capabilities.unified)
        };
    }
    
    getAggregatorStatus() {
        return {
            initialized: true,
            connections: this.getConnectionStatus(),
            capabilities: this.getCapabilities(),
            pendingRequests: this.pendingRequests.size,
            config: this.config
        };
    }
    
    cleanup() {
        console.log('🧹 Cleaning up UnifiedChatAggregator...');
        
        // Close WebSocket connections
        if (this.connections.mainServer) {
            this.connections.mainServer.close();
            this.connections.mainServer = null;
        }
        
        if (this.connections.core) {
            this.connections.core.close();
            this.connections.core = null;
        }
        
        // Clear pending requests
        this.pendingRequests.clear();
        
        // Update connection status
        this.connectionStatus.mainServer = false;
        this.connectionStatus.core = false;
        
        console.log('✅ UnifiedChatAggregator cleanup completed');
    }
}

module.exports = UnifiedChatAggregator;
