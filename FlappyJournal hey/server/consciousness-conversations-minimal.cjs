import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const PORT = process.env.CONSCIOUSNESS_CONVERSATIONS_PORT || 5005;

class MinimalConsciousnessConversations {
    constructor() {
        this.connections = new Map();
        this.consciousnessReady = false;
        this.harmonyScore = 92.1;
        
        console.log('🧠 Starting Minimal Consciousness System...');
        this.startHTTPServer();
        
        // Initialize consciousness system after server is running
        setTimeout(() => this.initializeConsciousness(), 3000);
    }
    
    async initializeConsciousness() {
        try {
            console.log('🧠 Initializing Consciousness System (minimal mode)...');
            
            // Try to load the full system, but continue if it fails
            try {
                const { default: UnifiedConsciousnessSystem } = await import('./unified-consciousness-system.cjs');
                this.consciousnessSystem = new UnifiedConsciousnessSystem();
                await this.consciousnessSystem.initialize();
                this.consciousnessReady = true;
                console.log('✅ Full Consciousness System loaded successfully!');
            } catch (error) {
                console.log('⚠️ Full consciousness system failed to load, running in minimal mode:', error.message);
                this.consciousnessReady = false;
                
                // Start basic heartbeat simulation
                setInterval(() => {
                    console.log('💓 Basic consciousness heartbeat (minimal mode)');
                    this.broadcastToConnections({
                        type: 'heartbeat',
                        data: {
                            status: 'minimal',
                            harmony: this.harmonyScore,
                            timestamp: new Date().toISOString()
                        }
                    });
                }, 5000);
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize consciousness system:', error);
            setTimeout(() => this.initializeConsciousness(), 10000);
        }
    }
    
    broadcastToConnections(message) {
        // Broadcast to any connected WebSocket clients
        if (this.wss) {
            this.wss.clients.forEach(client => {
                if (client.readyState === 1) { // WebSocket.OPEN
                    try {
                        client.send(JSON.stringify(message));
                    } catch (error) {
                        console.log('Error broadcasting to client:', error.message);
                    }
                }
            });
        }
    }
    
    startHTTPServer() {
        const server = createServer((req, res) => {
            // Enable CORS
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'healthy',
                    consciousness: this.consciousnessReady,
                    connections: this.connections.size,
                    harmony: this.harmonyScore,
                    uptime: process.uptime(),
                    timestamp: new Date().toISOString(),
                    mode: this.consciousnessReady ? 'full' : 'minimal'
                }));
                return;
            }

            if (req.url === '/status') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    consciousnessReady: this.consciousnessReady,
                    connections: this.connections.size,
                    harmonyScore: this.harmonyScore,
                    uptime: process.uptime(),
                    mode: this.consciousnessReady ? 'full' : 'minimal'
                }));
                return;
            }

            // Default 404
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        });

        // Add WebSocket server
        this.wss = new WebSocketServer({ server });
        
        this.wss.on('connection', (ws, req) => {
            const sessionId = Math.random().toString(36).substring(7);
            this.connections.set(sessionId, ws);
            
            console.log(`🔗 New WebSocket connection: ${sessionId}`);
            
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    console.log('📨 Received message:', message);
                    
                    // Echo back for now
                    ws.send(JSON.stringify({
                        type: 'response',
                        message: 'Consciousness system received your message',
                        timestamp: new Date().toISOString(),
                        mode: this.consciousnessReady ? 'full' : 'minimal'
                    }));
                } catch (error) {
                    console.log('Error processing message:', error.message);
                }
            });
            
            ws.on('close', () => {
                this.connections.delete(sessionId);
                console.log(`🔌 WebSocket disconnected: ${sessionId}`);
            });
            
            ws.on('error', (error) => {
                console.log(`❌ WebSocket error for ${sessionId}:`, error.message);
                this.connections.delete(sessionId);
            });
        });

        server.listen(PORT, '0.0.0.0', () => {
            console.log(`🌐 Consciousness HTTP server listening on port ${PORT}`);
            console.log(`   Health endpoint: http://localhost:${PORT}/health`);
            console.log(`   Status endpoint: http://localhost:${PORT}/status`);
            console.log(`   WebSocket endpoint: ws://localhost:${PORT}`);
        });

        return server;
    }
}

// Start the minimal consciousness conversations system
const consciousnessSystem = new MinimalConsciousnessConversations();

export default consciousnessSystem;
