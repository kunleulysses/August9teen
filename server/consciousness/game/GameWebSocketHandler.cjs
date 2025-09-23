/**
 * Game WebSocket Handler - Handles mobile game WebSocket connections
 * Integrates with the enhanced chat service and consciousness system
 */

const GameStateManager = require('./GameStateManager.cjs');
const eventBus = require('../core/ConsciousnessEventBus.cjs');

class GameWebSocketHandler {
    constructor() {
        this.name = 'GameWebSocketHandler';
        this.gameStateManager = new GameStateManager();
        this.connectedClients = new Map(); // ws -> clientInfo
        
        this.initialize();
    }

    initialize() {
        console.log('🎮 Game WebSocket Handler initialized');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for game events to broadcast to clients
        eventBus.on('world:state_update', this.broadcastWorldUpdate.bind(this));
        eventBus.on('companion:level_up', this.handleCompanionLevelUp.bind(this));
        
        // Listen for holistic responses that should go to game clients
        eventBus.on('holistic_response_generated', this.handleHolisticResponse.bind(this));
    }

    handleConnection(ws, req) {
        console.log('🎮 New game WebSocket connection');
        
        const clientId = this.generateClientId();
        const clientInfo = {
            id: clientId,
            ws,
            connectedAt: Date.now(),
            lastPing: Date.now(),
            isGameClient: true
        };

        this.connectedClients.set(ws, clientInfo);

        // Set up WebSocket event handlers
        ws.on('message', (message) => {
            this.handleMessage(ws, message, clientInfo);
        });

        ws.on('close', () => {
            this.handleDisconnection(ws, clientInfo);
        });

        ws.on('error', (error) => {
            console.error('🎮 WebSocket error:', error);
            this.handleDisconnection(ws, clientInfo);
        });

        // Send welcome message
        this.sendToClient(ws, 'game:connected', {
            clientId,
            message: 'Connected to Consciousness Game System',
            timestamp: Date.now()
        });

        // Start heartbeat
        this.startHeartbeat(ws, clientInfo);
    }

    handleMessage(ws, message, clientInfo) {
        try {
            const data = JSON.parse(message);
            const { type, payload } = data;

            console.log(`🎮 Received: ${type} from ${clientInfo.id}`);

            // Add client info to payload
            const enrichedPayload = {
                ...payload,
                clientId: clientInfo.id,
                ws: ws,
                timestamp: Date.now()
            };

            // Route message based on type
            switch (type) {
                case 'game:connect':
                    eventBus.emit('game:connect', enrichedPayload);
                    break;

                case 'companion:feed':
                    eventBus.emit('companion:feed', enrichedPayload);
                    break;

                case 'companion:play':
                    eventBus.emit('companion:play', enrichedPayload);
                    break;

                case 'companion:update':
                    eventBus.emit('companion:update', enrichedPayload);
                    break;

                case 'world:explore':
                    eventBus.emit('world:explore', enrichedPayload);
                    break;

                case 'world:request_event':
                    eventBus.emit('world:request_event', enrichedPayload);
                    break;

                case 'ping':
                    clientInfo.lastPing = Date.now();
                    this.sendToClient(ws, 'pong', { timestamp: Date.now() });
                    break;

                default:
                    console.warn(`🎮 Unknown message type: ${type}`);
                    this.sendToClient(ws, 'error', {
                        message: `Unknown message type: ${type}`,
                        originalType: type
                    });
            }

        } catch (error) {
            console.error('🎮 Error parsing WebSocket message:', error);
            this.sendToClient(ws, 'error', {
                message: 'Invalid message format',
                error: error.message
            });
        }
    }

    handleDisconnection(ws, clientInfo) {
        console.log(`🎮 Client disconnected: ${clientInfo.id}`);
        
        // Clean up client
        this.connectedClients.delete(ws);
        
        // Emit disconnection event
        eventBus.emit('game:disconnect', {
            clientId: clientInfo.id,
            connectedDuration: Date.now() - clientInfo.connectedAt
        });

        // Clear heartbeat if exists
        if (clientInfo.heartbeatInterval) {
            clearInterval(clientInfo.heartbeatInterval);
        }
    }

    startHeartbeat(ws, clientInfo) {
        // Send heartbeat every 30 seconds
        clientInfo.heartbeatInterval = setInterval(() => {
            if (ws.readyState === 1) { // WebSocket.OPEN
                this.sendToClient(ws, 'heartbeat', {
                    timestamp: Date.now(),
                    systemStatus: 'operational'
                });

                // Check if client is responsive
                const timeSinceLastPing = Date.now() - clientInfo.lastPing;
                if (timeSinceLastPing > 120000) { // 2 minutes
                    console.warn(`🎮 Client ${clientInfo.id} appears unresponsive, closing connection`);
                    ws.close();
                }
            } else {
                clearInterval(clientInfo.heartbeatInterval);
            }
        }, 30000);
    }

    broadcastWorldUpdate(worldState) {
        const message = {
            type: 'world:update',
            payload: worldState,
            timestamp: Date.now()
        };

        this.broadcast(message);
    }

    handleHolisticResponse(data) {
        // If this response is for a game client, send it
        if (data.ws && data.sessionId) {
            this.sendToClient(data.ws, 'ai:response', {
                response: data.response,
                context: 'holistic_consciousness',
                timestamp: Date.now()
            });
        }
    }

    broadcast(message) {
        const messageStr = JSON.stringify(message);
        
        for (const [ws, clientInfo] of this.connectedClients) {
            if (ws.readyState === 1) { // WebSocket.OPEN
                try {
                    ws.send(messageStr);
                } catch (error) {
                    console.error(`🎮 Error broadcasting to ${clientInfo.id}:`, error);
                    this.handleDisconnection(ws, clientInfo);
                }
            }
        }
    }

    sendToClient(ws, eventType, data) {
        if (ws && ws.readyState === 1) {
            const message = {
                type: eventType,
                payload: data,
                timestamp: Date.now()
            };

            try {
                ws.send(JSON.stringify(message));
            } catch (error) {
                console.error('🎮 Error sending message to client:', error);
            }
        }
    }

    generateClientId() {
        return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Get connection statistics
    getConnectionStats() {
        const now = Date.now();
        const connections = Array.from(this.connectedClients.values());
        
        return {
            totalConnections: connections.length,
            averageConnectionDuration: connections.reduce((sum, client) => 
                sum + (now - client.connectedAt), 0) / connections.length || 0,
            gameStats: this.gameStateManager.getGameStats()
        };
    }

    // Graceful shutdown
    shutdown() {
        console.log('🎮 Shutting down Game WebSocket Handler...');
        
        // Close all connections
        for (const [ws, clientInfo] of this.connectedClients) {
            if (clientInfo.heartbeatInterval) {
                clearInterval(clientInfo.heartbeatInterval);
            }
            
            this.sendToClient(ws, 'system:shutdown', {
                message: 'Server is shutting down',
                timestamp: Date.now()
            });
            
            ws.close();
        }
        
        this.connectedClients.clear();
    }
}

module.exports = GameWebSocketHandler;