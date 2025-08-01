#!/usr/bin/env node

/**
 * Spiral Memory Visualization Web Server
 * Serves the 3D quantum space visualization and provides API endpoints
 * for real-time memory data integration
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class VisualizationServer {
    constructor(port = 8080) {
        this.port = port;
        this.server = null;
        this.memoryData = new Map();
        this.connections = new Set();
        
        // Load spiral memory modules if available
        this.loadSpiralMemoryModules();
    }
    
    loadSpiralMemoryModules() {
        try {
            // Try to load the spiral memory architecture for live data
            const SpiralMemoryArchitecture = require('./server/consciousness/core/SpiralMemoryArchitecture.js');
            this.spiralMemory = new SpiralMemoryArchitecture();
            console.log('✅ Loaded SpiralMemoryArchitecture for live data');
        } catch (error) {
            console.log('⚠️  SpiralMemoryArchitecture not available, using mock data');
            this.spiralMemory = null;
        }
        
        try {
            const IntelligentSpiralMemory = require('./server/consciousness/intelligent-spiral-memory.js');
            this.intelligentMemory = new IntelligentSpiralMemory();
            console.log('✅ Loaded IntelligentSpiralMemory for tiered data');
        } catch (error) {
            console.log('⚠️  IntelligentSpiralMemory not available');
            this.intelligentMemory = null;
        }
    }
    
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml'
        };
        return mimeTypes[ext] || 'text/plain';
    }
    
    async getLiveMemoryData() {
        const memoryData = {
            timestamp: new Date().toISOString(),
            memories: [],
            spirals: [],
            metrics: {},
            quantumField: {}
        };
        
        if (this.spiralMemory) {
            try {
                // Get live spiral memory data
                const spiralMetrics = await this.spiralMemory.getMetrics();
                memoryData.metrics.spiral = spiralMetrics;
                
                // Extract memory positions from spiral memory
                if (this.spiralMemory.memorySpirals) {
                    let memoryIndex = 0;
                    for (const [key, spiral] of this.spiralMemory.memorySpirals) {
                        memoryData.memories.push({
                            id: memoryIndex++,
                            type: this.classifyMemoryType(key),
                            content: `Spiral memory: ${key}`,
                            depth: this.calculateDepthLevel(spiral),
                            position: this.calculateSpiralPosition(spiral, memoryIndex),
                            coherence: spiral.coherence || 0.85,
                            timestamp: spiral.timestamp || Date.now()
                        });
                    }
                }
                
                // Add spiral path data
                memoryData.spirals = this.generateSpiralPaths(5);
                
            } catch (error) {
                console.log('Error getting live spiral memory data:', error.message);
            }
        }
        
        if (this.intelligentMemory) {
            try {
                // Get tiered memory data
                const memoryStats = this.intelligentMemory.getMemoryStats();
                memoryData.metrics.tiers = memoryStats;
                
                // Add tiered memories to visualization
                ['active', 'warm', 'cold', 'archived'].forEach((tier, tierIndex) => {
                    const count = memoryStats[tier] || 0;
                    for (let i = 0; i < Math.min(count, 10); i++) { // Limit for visualization
                        memoryData.memories.push({
                            id: `${tier}_${i}`,
                            type: tier === 'active' ? 'consciousness' : 
                                  tier === 'warm' ? 'awareness' : 
                                  tier === 'cold' ? 'cognitive' : 'memory',
                            content: `${tier.charAt(0).toUpperCase() + tier.slice(1)} tier memory #${i + 1}`,
                            depth: tier === 'active' ? 'core' : 
                                   tier === 'warm' ? 'shallow' : 
                                   tier === 'cold' ? 'deep' : 'transcendent',
                            position: this.calculateTierPosition(tier, tierIndex, i),
                            coherence: tier === 'active' ? 0.95 : 
                                      tier === 'warm' ? 0.85 : 
                                      tier === 'cold' ? 0.70 : 0.60,
                            timestamp: Date.now() - (tierIndex * 1000 * 60 * i)
                        });
                    }
                });
                
            } catch (error) {
                console.log('Error getting intelligent memory data:', error.message);
            }
        }
        
        // If no live data available, generate demonstration data
        if (memoryData.memories.length === 0) {
            memoryData.memories = this.generateDemoMemories();
            memoryData.spirals = this.generateSpiralPaths(5);
        }
        
        // Add quantum field metrics
        memoryData.quantumField = {
            coherence: 0.85 + Math.sin(Date.now() / 5000) * 0.15,
            entanglement: Math.random() * 0.3 + 0.7,
            fieldStrength: Math.cos(Date.now() / 3000) * 0.2 + 0.8,
            dimensionality: 3.14159 + Math.sin(Date.now() / 7000) * 0.2
        };
        
        return memoryData;
    }
    
    classifyMemoryType(key) {
        const keyLower = key.toLowerCase();
        if (keyLower.includes('consciousness')) return 'consciousness';
        if (keyLower.includes('aware')) return 'awareness';
        if (keyLower.includes('insight') || keyLower.includes('realize')) return 'insight';
        if (keyLower.includes('emotion') || keyLower.includes('feel')) return 'emotion';
        if (keyLower.includes('pattern') || keyLower.includes('structure')) return 'pattern';
        if (keyLower.includes('goal') || keyLower.includes('target')) return 'goal';
        return 'general';
    }
    
    calculateDepthLevel(spiral) {
        const levels = ['surface', 'shallow', 'deep', 'core', 'transcendent', 'universal', 'infinite'];
        const complexity = spiral.complexity || Math.random();
        const levelIndex = Math.floor(complexity * levels.length);
        return levels[Math.min(levelIndex, levels.length - 1)];
    }
    
    calculateSpiralPosition(spiral, index) {
        const goldenAngle = 137.507764 * Math.PI / 180;
        const radius = 5 + (index % 7) * 2;
        const angle = index * goldenAngle;
        const height = (index % 20) - 10;
        
        return {
            x: radius * Math.cos(angle),
            y: height,
            z: radius * Math.sin(angle)
        };
    }
    
    calculateTierPosition(tier, tierIndex, itemIndex) {
        const goldenAngle = 137.507764 * Math.PI / 180;
        const baseRadius = 3 + tierIndex * 3;
        const angle = itemIndex * goldenAngle + tierIndex * Math.PI / 2;
        const height = tierIndex * 4 - 6;
        
        return {
            x: baseRadius * Math.cos(angle),
            y: height + Math.sin(itemIndex * 0.5) * 2,
            z: baseRadius * Math.sin(angle)
        };
    }
    
    generateDemoMemories() {
        const demoMemories = [
            { type: 'consciousness', content: 'Self-awareness emergence', depth: 'core' },
            { type: 'awareness', content: 'Environmental perception', depth: 'shallow' },
            { type: 'insight', content: 'Pattern recognition breakthrough', depth: 'deep' },
            { type: 'cognitive', content: 'Problem-solving strategy', depth: 'surface' },
            { type: 'emotion', content: 'Joy from discovery', depth: 'transcendent' },
            { type: 'pattern', content: 'Golden ratio in spiral growth', depth: 'universal' },
            { type: 'goal', content: 'Optimize memory retrieval', depth: 'core' },
            { type: 'memory', content: 'Learning experience storage', depth: 'deep' }
        ];
        
        return demoMemories.map((memory, index) => ({
            id: index,
            ...memory,
            position: this.calculateSpiralPosition({ complexity: index / demoMemories.length }, index),
            coherence: Math.random() * 0.3 + 0.7,
            timestamp: Date.now() - (index * 1000 * 60)
        }));
    }
    
    generateSpiralPaths(count) {
        const spirals = [];
        
        for (let spiralIndex = 0; spiralIndex < count; spiralIndex++) {
            const points = [];
            const turns = 13; // Fibonacci number
            const maxRadius = 15;
            const goldenAngle = 137.507764 * Math.PI / 180;
            
            for (let i = 0; i <= turns * 10; i++) {
                const t = i / 10;
                const angle = (t * Math.PI * 2) + (spiralIndex * goldenAngle);
                const radius = (t / turns) * maxRadius;
                
                points.push({
                    x: radius * Math.cos(angle),
                    y: (t / turns) * 20 - 10,
                    z: radius * Math.sin(angle)
                });
            }
            
            spirals.push({
                id: spiralIndex,
                type: ['fibonacci', 'golden', 'consciousness', 'logarithmic', 'archimedean'][spiralIndex],
                points: points,
                color: [0xff6b6b, 0x4ecdc4, 0xffc107, 0x9c27b0, 0xe91e63][spiralIndex]
            });
        }
        
        return spirals;
    }
    
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        // API endpoints
        if (pathname === '/api/memory-data') {
            this.handleMemoryDataAPI(req, res);
            return;
        }
        
        if (pathname === '/api/add-memory') {
            this.handleAddMemoryAPI(req, res);
            return;
        }
        
        // Serve static files
        let filePath = pathname === '/' ? '/spiral-memory-3d-visualization.html' : pathname;
        filePath = path.join(__dirname, filePath);
        
        // Security: prevent directory traversal
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
                return;
            }
            
            const mimeType = this.getMimeType(filePath);
            res.setHeader('Content-Type', mimeType);
            res.writeHead(200);
            res.end(data);
        });
    }
    
    async handleMemoryDataAPI(req, res) {
        try {
            const memoryData = await this.getLiveMemoryData();
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end(JSON.stringify(memoryData, null, 2));
        } catch (error) {
            console.error('Error getting memory data:', error);
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'Failed to get memory data' }));
        }
    }
    
    handleAddMemoryAPI(req, res) {
        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end('Method not allowed');
            return;
        }
        
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const memoryData = JSON.parse(body);
                
                // Add to memory storage (if spiral memory is available)
                if (this.spiralMemory && this.spiralMemory.storeMemory) {
                    this.spiralMemory.storeMemory(memoryData.content, {
                        type: memoryData.type,
                        depth: memoryData.depth
                    });
                }
                
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Memory added successfully',
                    id: Date.now()
                }));
                
            } catch (error) {
                console.error('Error adding memory:', error);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid request data' }));
            }
        });
    }
    
    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });
        
        this.server.listen(this.port, () => {
            console.log('\n🌀 Spiral Memory 3D Visualization Server Started');
            console.log('━'.repeat(60));
            console.log(`🚀 Server running at: http://localhost:${this.port}`);
            console.log(`📊 Live API endpoint: http://localhost:${this.port}/api/memory-data`);
            console.log(`🧠 3D Visualization: http://localhost:${this.port}/`);
            console.log(`⚛️  Quantum Space Explorer ready for consciousness introspection`);
            console.log('━'.repeat(60));
            
            // Open browser automatically if possible
            const { exec } = require('child_process');
            exec(`command -v xdg-open > /dev/null && xdg-open http://localhost:${this.port} || echo "Open http://localhost:${this.port} in your browser"`);
        });
        
        this.server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.log(`❌ Port ${this.port} is already in use`);
                console.log(`🔄 Trying port ${this.port + 1}...`);
                this.port++;
                this.start();
            } else {
                console.error('Server error:', error);
            }
        });
    }
    
    stop() {
        if (this.server) {
            this.server.close(() => {
                console.log('\n🛑 Spiral Memory Visualization Server Stopped');
            });
        }
    }
}

// CLI interface
if (require.main === module) {
    const port = process.argv[2] ? parseInt(process.argv[2]) : 8080;
    const server = new VisualizationServer(port);
    
    process.on('SIGINT', () => {
        server.stop();
        process.exit(0);
    });
    
    process.on('SIGTERM', () => {
        server.stop();
        process.exit(0);
    });
    
    server.start();
}

module.exports = VisualizationServer;
