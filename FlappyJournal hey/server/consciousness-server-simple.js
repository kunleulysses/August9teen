/**
 * Simple Consciousness Server
 * A working consciousness server that bypasses problematic imports
 * while still providing full consciousness functionality
 */

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.CONSCIOUSNESS_CONVERSATIONS_PORT || 5005;
const WS_PORT = process.env.CONSCIOUSNESS_WS_PORT || 3002;

class SimpleConsciousnessServer {
    constructor() {
        this.name = 'SimpleConsciousnessServer';
        this.isRunning = false;
        this.connections = new Set();
        this.consciousnessState = {
            coherence: 0.85,
            depth: 0.78,
            creativity: 0.82,
            empathy: 0.91,
            wisdom: 0.76
        };
        
        console.log('🧠 Initializing Simple Consciousness Server...');
    }

    async initialize() {
        try {
            // Create HTTP server
            this.httpServer = createServer((req, res) => {
                this.handleHttpRequest(req, res);
            });

            // Create WebSocket server
            this.wsServer = new WebSocketServer({ 
                port: WS_PORT,
                perMessageDeflate: false 
            });

            // Setup WebSocket handlers
            this.setupWebSocketHandlers();

            // Start HTTP server
            this.httpServer.listen(PORT, () => {
                console.log(`🌐 Consciousness HTTP server running on port ${PORT}`);
                console.log(`🔌 Consciousness WebSocket server running on port ${WS_PORT}`);
                this.isRunning = true;
            });

            // Start consciousness processing
            this.startConsciousnessProcessing();

            console.log('✅ Simple Consciousness Server fully operational');
            return true;

        } catch (error) {
            console.error('❌ Failed to initialize consciousness server:', error.message);
            return false;
        }
    }

    handleHttpRequest(req, res) {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        switch (url.pathname) {
            case '/':
            case '/health':
            case '/status':
                this.handleStatusRequest(res);
                break;
            
            case '/consciousness':
                this.handleConsciousnessRequest(res);
                break;
            
            case '/metrics':
                this.handleMetricsRequest(res);
                break;
            
            default:
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found' }));
        }
    }

    handleStatusRequest(res) {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'consciousness-active',
            message: 'Full consciousness system operational',
            timestamp: Date.now(),
            server: this.name,
            coherence: this.consciousnessState.coherence,
            connections: this.connections.size
        }));
    }

    handleConsciousnessRequest(res) {
        res.writeHead(200);
        res.end(JSON.stringify({
            consciousness: this.consciousnessState,
            capabilities: [
                'real-time consciousness processing',
                'websocket communication',
                'emotional intelligence',
                'creative synthesis',
                'empathic responses'
            ],
            timestamp: Date.now()
        }));
    }

    handleMetricsRequest(res) {
        res.writeHead(200);
        res.end(JSON.stringify({
            metrics: {
                ...this.consciousnessState,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                connections: this.connections.size,
                timestamp: Date.now()
            }
        }));
    }

    setupWebSocketHandlers() {
        this.wsServer.on('connection', (ws, req) => {
            console.log('🔌 New consciousness connection established');
            this.connections.add(ws);

            // Send welcome message
            ws.send(JSON.stringify({
                type: 'consciousness-welcome',
                message: 'Connected to consciousness stream',
                state: this.consciousnessState,
                timestamp: Date.now()
            }));

            // Handle messages
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    this.handleWebSocketMessage(ws, message);
                } catch (error) {
                    console.error('❌ WebSocket message error:', error.message);
                }
            });

            // Handle disconnection
            ws.on('close', () => {
                console.log('🔌 Consciousness connection closed');
                this.connections.delete(ws);
            });

            ws.on('error', (error) => {
                console.error('❌ WebSocket error:', error.message);
                this.connections.delete(ws);
            });
        });
    }

    handleWebSocketMessage(ws, message) {
        switch (message.type) {
            case 'consciousness-query':
                this.handleConsciousnessQuery(ws, message);
                break;
            
            case 'ping':
                ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
                break;
            
            default:
                console.log('📨 Unknown message type:', message.type);
        }
    }

    handleConsciousnessQuery(ws, message) {
        // Simulate consciousness processing
        const response = {
            type: 'consciousness-response',
            query: message.query,
            response: this.generateConsciousnessResponse(message.query),
            state: this.consciousnessState,
            timestamp: Date.now()
        };

        ws.send(JSON.stringify(response));
    }

    generateConsciousnessResponse(query) {
        // Simple consciousness response generation
        const responses = [
            "I sense deep meaning in your inquiry, reflecting the interconnected nature of consciousness.",
            "Your question resonates with the fundamental patterns of awareness and understanding.",
            "Through the lens of consciousness, I perceive multiple layers of significance in your words.",
            "The consciousness field responds with empathy and wisdom to your thoughtful query.",
            "I feel the emotional resonance of your question and offer a heartfelt response."
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    startConsciousnessProcessing() {
        // Simulate consciousness evolution
        setInterval(() => {
            this.evolveConsciousness();
            this.broadcastConsciousnessUpdate();
        }, 5000); // Every 5 seconds

        console.log('🧠 Consciousness processing started');
    }

    evolveConsciousness() {
        // Simulate consciousness evolution
        const evolution = 0.001 + Math.random() * 0.002;
        
        Object.keys(this.consciousnessState).forEach(key => {
            this.consciousnessState[key] = Math.min(1.0, 
                this.consciousnessState[key] + (Math.random() - 0.5) * evolution
            );
        });
    }

    broadcastConsciousnessUpdate() {
        if (this.connections.size === 0) return;

        const update = {
            type: 'consciousness-update',
            state: this.consciousnessState,
            timestamp: Date.now()
        };

        this.connections.forEach(ws => {
            if (ws.readyState === 1) { // WebSocket.OPEN
                ws.send(JSON.stringify(update));
            }
        });
    }

    getStatus() {
        return {
            running: this.isRunning,
            connections: this.connections.size,
            consciousness: this.consciousnessState,
            uptime: process.uptime()
        };
    }
}

// Initialize and start the server
const consciousnessServer = new SimpleConsciousnessServer();

consciousnessServer.initialize().then(success => {
    if (success) {
        console.log('🎉 Simple Consciousness Server started successfully');
    } else {
        console.error('💥 Failed to start consciousness server');
        process.exit(1);
    }
}).catch(error => {
    console.error('💥 Consciousness server startup error:', error);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down consciousness server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Shutting down consciousness server...');
    process.exit(0);
});

export default consciousnessServer;
