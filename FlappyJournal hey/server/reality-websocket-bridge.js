/**
 * Reality WebSocket Bridge - Phase 2 Integration
 * Bridges Reality Generator WebSocket events with consciousness system
 * Provides real-time reality updates to connected clients
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';

class RealityWebSocketBridge extends EventEmitter {
    constructor(consciousnessSystem) {
        super();
        this.consciousnessSystem = consciousnessSystem;
        this.realityGeneratorWS = null;
        this.connectedClients = new Set();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 20; // Increased from 5
        this.reconnectInterval = 5000; // Start with 5 seconds
        this.reconnectBackoffFactor = 1.5; // Exponential backoff
        this.maxReconnectInterval = 60000; // Cap at 1 minute
        this.currentReconnectInterval = this.reconnectInterval;
        this.isConnected = false;

        // Heartbeat mechanism
        this.heartbeatInterval = 30000; // 30 seconds
        this.heartbeatTimer = null;
        this.lastHeartbeatResponse = null;

        console.log('🌉 Reality WebSocket Bridge initialized');
    }
    
    /**
     * Connect to Reality Generator WebSocket
     */
    async connectToRealityGenerator() {
        try {
            const realityGeneratorURL = process.env.REALITY_GENERATOR_URL || 'http://localhost:5020';
            const wsURL = realityGeneratorURL.replace('http', 'ws');

            console.log(`🔌 Connecting to Reality Generator WebSocket: ${wsURL}`);

            this.realityGeneratorWS = new WebSocket(wsURL);

            this.realityGeneratorWS.on('open', () => {
                console.log('✅ Connected to Reality Generator WebSocket');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.currentReconnectInterval = this.reconnectInterval; // Reset backoff
                this.emit('connected');
                this.startHeartbeat();
            });

            this.realityGeneratorWS.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    if (message.type === 'heartbeat_response') {
                        this.lastHeartbeatResponse = Date.now();
                    }
                    this.handleRealityGeneratorMessage(message);
                } catch (error) {
                    console.warn('⚠️ Invalid WebSocket message from Reality Generator:', error.message);
                }
            });

            this.realityGeneratorWS.on('close', () => {
                console.log('🔌 Reality Generator WebSocket disconnected');
                this.isConnected = false;
                this.emit('disconnected');
                if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
                this.scheduleReconnect();
            });

            this.realityGeneratorWS.on('error', (error) => {
                if (error.message && error.message.includes('Unexpected server response: 404')) {
                    console.error(
                        '❌ Reality Generator WebSocket error: Unexpected server response: 404. ' +
                        'This usually means the WebSocket endpoint is not running or is misconfigured. ' +
                        'Check that the Reality Generator WebSocket service is up and reachable at the configured URL.'
                    );
                } else {
                    console.error('❌ Reality Generator WebSocket error:', error.message);
                }
                this.emit('error', error);
            });

        } catch (error) {
            console.error('❌ Failed to connect to Reality Generator WebSocket:', error.message);
            this.scheduleReconnect();
        }
    }
    
    /**
     * Handle messages from Reality Generator WebSocket
     */
    handleRealityGeneratorMessage(message) {
        switch (message.type) {
            case 'reality_generated':
                this.handleNewReality(message.data);
                break;
            case 'imagination_status_update':
                this.handleImaginationStatusUpdate(message.data);
                break;
            case 'metrics_update':
                this.handleMetricsUpdate(message.data);
                break;
            default:
                console.log('🔄 Unknown Reality Generator message type:', message.type);
        }
    }
    
    /**
     * Handle new reality generation
     */
    handleNewReality(realityData) {
        console.log('✨ New reality received via WebSocket:', realityData.id);
        
        // Update consciousness system
        if (this.consciousnessSystem) {
            this.consciousnessSystem.consciousnessState.realityGeneration.totalRealities++;
            this.consciousnessSystem.consciousnessState.realityGeneration.lastUpdate = new Date();
            
            // Emit consciousness event
            this.consciousnessSystem.eventBus.emit('reality:websocket_received', {
                reality: realityData,
                source: 'websocket',
                timestamp: new Date().toISOString()
            });
        }
        
        // Broadcast to connected clients
        this.broadcastToClients({
            type: 'reality_generated',
            data: realityData,
            timestamp: new Date().toISOString()
        });
        
        // Emit bridge event
        this.emit('reality_generated', realityData);
    }
    
    /**
     * Handle imagination status updates
     */
    handleImaginationStatusUpdate(statusData) {
        console.log('🧠 Imagination status update:', statusData.active ? 'active' : 'inactive');
        
        // Update consciousness system
        if (this.consciousnessSystem) {
            this.consciousnessSystem.consciousnessState.realityGeneration.imaginationActive = statusData.active;
            this.consciousnessSystem.consciousnessState.realityGeneration.cpuUtilization = statusData.cpuUtilization || 0;
        }
        
        // Broadcast to connected clients
        this.broadcastToClients({
            type: 'imagination_status',
            data: statusData,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Handle metrics updates
     */
    handleMetricsUpdate(metricsData) {
        // Update consciousness system metrics
        if (this.consciousnessSystem) {
            Object.assign(this.consciousnessSystem.consciousnessState.realityGeneration, metricsData);
        }
        
        // Broadcast to connected clients
        this.broadcastToClients({
            type: 'reality_metrics',
            data: metricsData,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Broadcast message to all connected clients
     */
    broadcastToClients(message) {
        const messageStr = JSON.stringify(message);
        let disconnectedClients = [];
        
        for (const client of this.connectedClients) {
            try {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(messageStr);
                } else {
                    disconnectedClients.push(client);
                }
            } catch (error) {
                console.warn('⚠️ Failed to send message to client:', error.message);
                disconnectedClients.push(client);
            }
        }
        
        // Clean up disconnected clients
        disconnectedClients.forEach(client => {
            this.connectedClients.delete(client);
        });
    }
    
    /**
     * Add client to receive reality updates
     */
    addClient(websocket) {
        this.connectedClients.add(websocket);
        console.log(`🔗 Client connected to reality bridge (${this.connectedClients.size} total)`);
        
        // Send current status to new client
        if (this.consciousnessSystem) {
            const status = {
                type: 'reality_status',
                data: {
                    bridgeConnected: this.isConnected,
                    realityGeneration: this.consciousnessSystem.consciousnessState.realityGeneration
                },
                timestamp: new Date().toISOString()
            };
            
            try {
                websocket.send(JSON.stringify(status));
            } catch (error) {
                console.warn('⚠️ Failed to send status to new client:', error.message);
            }
        }
        
        // Handle client disconnect
        websocket.on('close', () => {
            this.connectedClients.delete(websocket);
            console.log(`🔗 Client disconnected from reality bridge (${this.connectedClients.size} remaining)`);
        });
    }
    
    /**
     * Schedule reconnection attempt
     */
    // Heartbeat mechanism
    startHeartbeat() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);

        this.heartbeatTimer = setInterval(() => {
            if (this.isConnected && this.realityGeneratorWS.readyState === WebSocket.OPEN) {
                try {
                    this.realityGeneratorWS.send(JSON.stringify({ type: 'heartbeat', timestamp: Date.now() }));

                    // Check if we missed previous heartbeat response
                    if (this.lastHeartbeatResponse && (Date.now() - this.lastHeartbeatResponse > this.heartbeatInterval * 2)) {
                        console.warn('⚠️ Missed heartbeat response, reconnecting...');
                        this.realityGeneratorWS.close();
                    }
                } catch (error) {
                    console.warn('⚠️ Failed to send heartbeat:', error.message);
                    this.realityGeneratorWS.close();
                }
            }
        }, this.heartbeatInterval);
    }

    // Improved reconnection logic with exponential backoff
    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Scheduling Reality Generator reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${this.currentReconnectInterval}ms`);

            setTimeout(() => {
                this.connectToRealityGenerator();
            }, this.currentReconnectInterval);

            // Apply exponential backoff with maximum cap
            this.currentReconnectInterval = Math.min(
                this.currentReconnectInterval * this.reconnectBackoffFactor,
                this.maxReconnectInterval
            );
        } else {
            console.error('❌ Max reconnection attempts reached. Reality Generator WebSocket bridge disabled.');
            // Emit event for system to handle
            this.emit('permanent_disconnect', {
                timestamp: new Date().toISOString(),
                attempts: this.reconnectAttempts
            });
        }
    }
    
    /**
     * Send message to Reality Generator
     */
    sendToRealityGenerator(message) {
        if (this.realityGeneratorWS && this.isConnected) {
            try {
                this.realityGeneratorWS.send(JSON.stringify(message));
                return true;
            } catch (error) {
                console.error('❌ Failed to send message to Reality Generator:', error.message);
                return false;
            }
        } else {
            console.warn('⚠️ Reality Generator WebSocket not connected');
            return false;
        }
    }
    
    /**
     * Get bridge status
     */
    getStatus() {
        return {
            connected: this.isConnected,
            connectedClients: this.connectedClients.size,
            reconnectAttempts: this.reconnectAttempts,
            maxReconnectAttempts: this.maxReconnectAttempts
        };
    }
    
    /**
     * Shutdown bridge
     */
    shutdown() {
        console.log('🔌 Shutting down Reality WebSocket Bridge...');
        
        if (this.realityGeneratorWS) {
            this.realityGeneratorWS.close();
        }
        
        // Close all client connections
        for (const client of this.connectedClients) {
            try {
                client.close();
            } catch (error) {
                // Ignore close errors
            }
        }
        
        this.connectedClients.clear();
        console.log('✅ Reality WebSocket Bridge shut down');
    }
}

export { RealityWebSocketBridge };
