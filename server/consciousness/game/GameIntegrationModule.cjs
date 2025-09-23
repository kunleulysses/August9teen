/**
 * Game Integration Module - Main integration point for mobile game with consciousness system
 * Coordinates all game-related components and consciousness features
 */

const GameWebSocketHandler = require('./GameWebSocketHandler.cjs');
const GameStateManager = require('./GameStateManager.cjs');
const CompanionAI = require('./CompanionAI.cjs');
const eventBus = require('../core/ConsciousnessEventBus.cjs');

class GameIntegrationModule {
    constructor() {
        this.name = 'GameIntegrationModule';
        this.isInitialized = false;
        
        // Core game components
        this.webSocketHandler = null;
        this.stateManager = null;
        this.companionAI = null;
        
        // Integration status
        this.integrationStatus = {
            webSocket: false,
            stateManager: false,
            companionAI: false,
            spiralMemory: false,
            realityGenerator: false,
            holisticResponse: false
        };
    }

    async initialize() {
        console.log('🎮 Initializing Game Integration Module...');
        
        try {
            // Initialize core game components
            await this.initializeGameComponents();
            
            // Set up consciousness system integrations
            await this.setupConsciousnessIntegrations();
            
            // Set up event routing
            this.setupEventRouting();
            
            // Register with consciousness system
            this.registerWithConsciousnessSystem();
            
            this.isInitialized = true;
            console.log('✅ Game Integration Module initialized successfully');
            
            // Emit initialization event
            eventBus.emit('module:status', {
                module: 'GameIntegrationModule',
                status: 'initialized',
                integrations: this.integrationStatus,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize Game Integration Module:', error);
            throw error;
        }
    }

    async initializeGameComponents() {
        console.log('🎮 Initializing game components...');
        
        // Initialize WebSocket handler
        this.webSocketHandler = new GameWebSocketHandler();
        this.integrationStatus.webSocket = true;
        
        // Initialize state manager (already created by WebSocket handler)
        this.stateManager = this.webSocketHandler.gameStateManager;
        this.integrationStatus.stateManager = true;
        
        // Initialize Companion AI
        this.companionAI = new CompanionAI();
        this.integrationStatus.companionAI = true;
        
        console.log('✅ Game components initialized');
    }

    async setupConsciousnessIntegrations() {
        console.log('🧠 Setting up consciousness system integrations...');
        
        // Integrate with Spiral Memory
        this.setupSpiralMemoryIntegration();
        
        // Integrate with Reality Generator
        this.setupRealityGeneratorIntegration();
        
        // Integrate with Holistic Response Generator
        this.setupHolisticResponseIntegration();
        
        // Integrate with Resonance Networks
        this.setupResonanceNetworkIntegration();
        
        console.log('✅ Consciousness integrations set up');
    }

    setupSpiralMemoryIntegration() {
        // Listen for spiral memory events from game
        eventBus.on('spiral_memory:store', (data) => {
            if (data.type === 'companion_memory') {
                console.log(`🌀 Storing companion memory in spiral: ${data.companionId}`);
                
                // Forward to spiral memory system with game context
                eventBus.emit('memory:store', {
                    type: 'game_companion_memory',
                    content: data.memory,
                    metadata: {
                        companionId: data.companionId,
                        gameContext: true,
                        emotionalAmplitude: this.calculateEmotionalAmplitude(data.memory),
                        timestamp: data.timestamp
                    }
                });
            }
        });

        // Listen for memory retrieval requests
        eventBus.on('game:request_memories', async (data) => {
            const { companionId, ws } = data;
            
            // Request memories from spiral memory system
            eventBus.emit('memory:retrieve', {
                query: `companion:${companionId}`,
                context: 'game_companion',
                callback: (memories) => {
                    this.webSocketHandler.sendToClient(ws, 'companion:memories', {
                        companionId,
                        memories: memories.slice(0, 10) // Last 10 memories
                    });
                }
            });
        });

        this.integrationStatus.spiralMemory = true;
    }

    setupRealityGeneratorIntegration() {
        // Listen for reality generation requests from game
        eventBus.on('game:generate_encounter', async (data) => {
            const { area, playerLevel, companionPersonality, ws } = data;
            
            console.log(`🌍 Generating encounter for area: ${area}`);
            
            // Request reality generation
            eventBus.emit('reality:generate', {
                type: 'game_encounter',
                context: {
                    area,
                    playerLevel,
                    companionPersonality,
                    gameMode: 'companion_adventure'
                },
                callback: (generatedReality) => {
                    const payload = { area, encounter: generatedReality, timestamp: Date.now() };
                    // Send generated encounter to client
                    this.webSocketHandler.sendToClient(ws, 'world:generated_encounter', payload);
                    // Also publish to event bus for other broadcasters
                    try { eventBus.emit('world:generated_encounter', payload); } catch {}
                }
            });
        });

        // Listen for world generation requests
        eventBus.on('game:generate_world_event', (data) => {
            const { worldState, activePlayerCount } = data;
            
            // Generate world-wide events based on player activity
            eventBus.emit('reality:generate', {
                type: 'world_event',
                context: {
                    worldState,
                    activePlayerCount,
                    gameMode: 'multiplayer_world'
                },
                callback: (worldEvent) => {
                    const payload = { ...worldEvent, ts: Date.now() };
                    // Broadcast world event to any connected clients on this handler
                    this.webSocketHandler.broadcast({ type: 'world:global_event', payload });
                    // Also emit on event bus so other WS layers can broadcast
                    try { eventBus.emit('world:global_event', payload); } catch {}
                }
            });
        });

        this.integrationStatus.realityGenerator = true;
    }

    setupHolisticResponseIntegration() {
        // Enhance holistic responses with game context
        eventBus.on('response_synthesis_requested', (data) => {
            if (data.context === 'companion_feeding' || data.context === 'companion_interaction') {
                // Add game-specific context to holistic response
                const enhancedData = {
                    ...data,
                    gameContext: {
                        companionState: data.companion,
                        interactionType: data.context,
                        playerBond: data.companion?.bonds || {}
                    }
                };
                
                // Forward to holistic response generator with enhanced context
                eventBus.emit('holistic:generate_game_response', enhancedData);
            }
        });

        // Listen for game-specific holistic responses
        eventBus.on('holistic_response_generated', (data) => {
            if (data.gameContext) {
                console.log('🧠 Received holistic response for game context');
                
                // Send enhanced response to game client
                if (data.ws) {
                    this.webSocketHandler.sendToClient(data.ws, 'companion:holistic_response', {
                        response: data.response,
                        context: data.gameContext,
                        consciousness_metrics: {
                            coherence: Math.random() * 0.3 + 0.7, // 0.7-1.0
                            awareness: Math.random() * 0.3 + 0.7,
                            integration: Math.random() * 0.3 + 0.7
                        }
                    });
                }
            }
        });

        this.integrationStatus.holisticResponse = true;
    }

    setupResonanceNetworkIntegration() {
        // Connect companion emotions to resonance networks
        eventBus.on('companion:mood_change', (data) => {
            const { mood, companionId } = data;
            
            // Emit resonance event based on companion mood
            const resonanceFrequency = this.moodToResonanceFrequency(mood);
            
            eventBus.emit('resonance:companion_emotion', {
                companionId,
                mood,
                frequency: resonanceFrequency,
                amplitude: 0.5,
                timestamp: Date.now()
            });
        });

        // Listen for resonance network updates that affect companions
        eventBus.on('resonance:field_update', (data) => {
            if (data.type === 'emotional' || data.type === 'consciousness') {
                // Apply resonance effects to all active companions
                this.applyResonanceToCompanions(data);
            }
        });
    }

    setupEventRouting() {
        // Route consciousness system events to game clients
        const gameRelevantEvents = [
            'consciousness:update',
            'system_tick',
            'module:status',
            'resonance:field_update'
        ];

        gameRelevantEvents.forEach(eventType => {
            eventBus.on(eventType, (data) => {
                // Filter and send relevant consciousness events to game clients
                if (this.isGameRelevantEvent(eventType, data)) {
                    this.webSocketHandler.broadcast({
                        type: `consciousness:${eventType}`,
                        payload: this.filterDataForGame(data),
                        timestamp: Date.now()
                    });
                }
            });
        });
    }

    registerWithConsciousnessSystem() {
        // Register as a consciousness module
        eventBus.emit('module:register', {
            name: 'GameIntegrationModule',
            type: 'game_interface',
            capabilities: [
                'companion_ai',
                'world_generation',
                'player_state_management',
                'real_time_interaction'
            ],
            status: 'active',
            metrics: this.getModuleMetrics()
        });
    }

    // Helper methods
    calculateEmotionalAmplitude(memory) {
        const emotionalWords = ['happy', 'sad', 'excited', 'angry', 'love', 'fear', 'joy'];
        const memoryText = JSON.stringify(memory).toLowerCase();
        
        let amplitude = 0.5; // Base amplitude
        emotionalWords.forEach(word => {
            if (memoryText.includes(word)) {
                amplitude += 0.1;
            }
        });
        
        return Math.min(1.0, amplitude);
    }

    moodToResonanceFrequency(mood) {
        const moodFrequencies = {
            happy: 528, // Love frequency
            excited: 741, // Awakening frequency
            neutral: 432, // Natural frequency
            sad: 396, // Liberating guilt and fear
            sleepy: 285, // Healing frequency
            hungry: 174 // Pain relief frequency
        };
        
        return moodFrequencies[mood] || 432;
    }

    applyResonanceToCompanions(resonanceData) {
        // Get all active companions and apply resonance effects
        const companions = this.stateManager.companions;
        
        for (const [companionId, companion] of companions) {
            if (resonanceData.frequency > 500) {
                // High frequency - positive effect
                companion.happiness = Math.min(100, companion.happiness + 1);
            } else if (resonanceData.frequency < 300) {
                // Low frequency - calming effect
                companion.energy = Math.min(100, companion.energy + 1);
            }
        }
    }

    isGameRelevantEvent(eventType, data) {
        // Filter events that are relevant to game clients
        if (eventType === 'system_tick') {
            return data.ts % 1000 < 100; // Every ~1 second
        }
        
        if (eventType === 'consciousness:update') {
            return data.metrics && (data.metrics.awareness > 0.8 || data.metrics.coherence > 0.8);
        }
        
        return true; // Default: send all events
    }

    filterDataForGame(data) {
        // Remove sensitive or unnecessary data before sending to game clients
        if (data.internalMetrics) {
            delete data.internalMetrics;
        }
        
        if (data.systemLogs) {
            delete data.systemLogs;
        }
        
        return data;
    }

    getModuleMetrics() {
        const connectionStats = this.webSocketHandler?.getConnectionStats() || {};
        
        return {
            activeConnections: connectionStats.totalConnections || 0,
            totalPlayers: connectionStats.gameStats?.totalPlayers || 0,
            totalCompanions: connectionStats.gameStats?.totalCompanions || 0,
            averageCompanionLevel: connectionStats.gameStats?.averageCompanionLevel || 0,
            integrationStatus: this.integrationStatus,
            uptime: Date.now() - (this.initTime || Date.now())
        };
    }

    // WebSocket integration for enhanced chat service
    handleWebSocketUpgrade(request, socket, head) {
        if (request.url === '/ws/game') {
            console.log('🎮 Handling game WebSocket upgrade');
            
            // Create WebSocket connection
            const ws = new (require('ws'))(socket);
            this.webSocketHandler.handleConnection(ws, request);
        }
    }

    // Graceful shutdown
    async shutdown() {
        console.log('🎮 Shutting down Game Integration Module...');
        
        if (this.webSocketHandler) {
            this.webSocketHandler.shutdown();
        }
        
        // Emit shutdown event
        eventBus.emit('module:status', {
            module: 'GameIntegrationModule',
            status: 'shutdown',
            timestamp: new Date().toISOString()
        });
        
        this.isInitialized = false;
    }
}

module.exports = GameIntegrationModule;
