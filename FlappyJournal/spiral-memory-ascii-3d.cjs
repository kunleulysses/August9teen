#!/usr/bin/env node

/**
 * Spiral Memory 3D ASCII Visualization
 * Terminal-based 3D renderer for spiral memory architecture
 * Shows how thoughts and interactions are stored in quantum space
 */

const fs = require('fs');
const path = require('path');

class ASCII3DSpiralRenderer {
    constructor() {
        this.width = 120;
        this.height = 40;
        this.depth = 50;
        this.goldenRatio = 1.618033988749;
        this.goldenAngle = 137.507764; // Golden angle in degrees
        
        // Memory depth levels
        this.depthLevels = [
            'surface', 'shallow', 'deep', 'core', 
            'transcendent', 'universal', 'infinite'
        ];
        
        // Memory types with ASCII characters
        this.memoryTypes = {
            consciousness: { char: '●', color: '\x1b[31m', name: 'Consciousness' },
            awareness: { char: '◆', color: '\x1b[36m', name: 'Awareness' },
            insight: { char: '★', color: '\x1b[33m', name: 'Insight' },
            cognitive: { char: '◎', color: '\x1b[35m', name: 'Cognitive' },
            emotion: { char: '♥', color: '\x1b[91m', name: 'Emotion' },
            pattern: { char: '◇', color: '\x1b[34m', name: 'Pattern' },
            goal: { char: '▲', color: '\x1b[32m', name: 'Goal' },
            memory: { char: '◉', color: '\x1b[93m', name: 'Memory' },
            general: { char: '○', color: '\x1b[37m', name: 'General' }
        };
        
        // Spiral path characters
        this.spiralChars = ['·', '⋅', '∘', '○', '◯'];
        
        this.memories = [];
        this.spiralPaths = [];
        this.quantumConnections = [];
        this.frame = 0;
        
        this.initializeSpirals();
    }
    
    initializeSpirals() {
        // Generate 5 different spiral paths using golden ratio
        for (let spiralIndex = 0; spiralIndex < 5; spiralIndex++) {
            const spiralPath = [];
            const turns = 13; // Fibonacci number
            const maxRadius = 15;
            
            for (let i = 0; i <= turns * 20; i++) {
                const t = i / 20; // Parameter along spiral
                const angle = (t * 360 + spiralIndex * this.goldenAngle) * Math.PI / 180;
                const radius = (t / turns) * maxRadius;
                
                // 3D spiral coordinates
                const x = radius * Math.cos(angle);
                const y = (t / turns) * 20 - 10; // Vertical spread
                const z = radius * Math.sin(angle);
                
                spiralPath.push({ x, y, z, t });
            }
            
            this.spiralPaths.push({
                path: spiralPath,
                type: Object.keys(this.memoryTypes)[spiralIndex],
                char: this.spiralChars[spiralIndex]
            });
        }
    }
    
    addMemory(type, content, depth = null) {
        if (!this.memoryTypes[type]) type = 'general';
        if (!depth) depth = this.depthLevels[Math.floor(Math.random() * this.depthLevels.length)];
        
        const position = this.calculateSpiralPosition(type, depth, this.memories.length);
        
        const memory = {
            id: this.memories.length,
            type: type,
            content: content || `${this.memoryTypes[type].name} #${this.memories.length + 1}`,
            depth: depth,
            position: position,
            createdAt: Date.now(),
            connections: []
        };
        
        this.memories.push(memory);
        this.createQuantumConnections(memory);
        
        return memory;
    }
    
    calculateSpiralPosition(type, depth, index) {
        const depthIndex = this.depthLevels.indexOf(depth);
        const radius = 3 + depthIndex * 1.5;
        const heightLevel = (depthIndex - 3) * 3;
        
        // Use golden angle for optimal distribution
        const angle = (index * this.goldenAngle) * Math.PI / 180;
        const spiralT = index * 0.05;
        
        const x = radius * Math.cos(angle) * (1 + spiralT * 0.1);
        const y = heightLevel + (index * 0.3) % 8 - 4;
        const z = radius * Math.sin(angle) * (1 + spiralT * 0.1);
        
        return { x, y, z };
    }
    
    createQuantumConnections(newMemory) {
        const maxDistance = 8;
        const maxConnections = 3;
        let connectionCount = 0;
        
        for (const existingMemory of this.memories) {
            if (existingMemory === newMemory || connectionCount >= maxConnections) continue;
            
            const distance = this.distance3D(existingMemory.position, newMemory.position);
            if (distance < maxDistance) {
                // Create bidirectional connection
                existingMemory.connections.push(newMemory.id);
                newMemory.connections.push(existingMemory.id);
                
                this.quantumConnections.push({
                    from: existingMemory.id,
                    to: newMemory.id,
                    strength: 1 - (distance / maxDistance)
                });
                
                connectionCount++;
            }
        }
    }
    
    distance3D(pos1, pos2) {
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    
    project3DTo2D(x, y, z, cameraDistance = 30) {
        // Simple perspective projection
        const perspective = cameraDistance / (cameraDistance + z);
        const screenX = Math.floor((x * perspective) + this.width / 2);
        const screenY = Math.floor((y * perspective) + this.height / 2);
        
        return { 
            x: screenX, 
            y: screenY, 
            z: z, 
            visible: screenX >= 0 && screenX < this.width && screenY >= 0 && screenY < this.height 
        };
    }
    
    render() {
        // Create frame buffer
        const buffer = Array(this.height).fill().map(() => Array(this.width).fill(' '));
        const depthBuffer = Array(this.height).fill().map(() => Array(this.width).fill(-Infinity));
        
        // Rotate camera for dynamic view
        const time = this.frame * 0.05;
        const cameraAngle = time;
        const cameraDistance = 25;
        
        // Render spiral paths
        this.spiralPaths.forEach((spiral, spiralIndex) => {
            spiral.path.forEach((point, pointIndex) => {
                if (pointIndex % 3 !== 0) return; // Skip some points for clarity
                
                // Apply camera rotation
                const rotatedX = point.x * Math.cos(cameraAngle) - point.z * Math.sin(cameraAngle);
                const rotatedZ = point.x * Math.sin(cameraAngle) + point.z * Math.cos(cameraAngle);
                
                const projected = this.project3DTo2D(rotatedX, point.y, rotatedZ, cameraDistance);
                
                if (projected.visible && projected.z > depthBuffer[projected.y][projected.x]) {
                    const memoryType = this.memoryTypes[spiral.type];
                    buffer[projected.y][projected.x] = `${memoryType.color}${spiral.char}\x1b[0m`;
                    depthBuffer[projected.y][projected.x] = projected.z;
                }
            });
        });
        
        // Render memory nodes
        this.memories.forEach(memory => {
            const pos = memory.position;
            
            // Apply camera rotation
            const rotatedX = pos.x * Math.cos(cameraAngle) - pos.z * Math.sin(cameraAngle);
            const rotatedZ = pos.x * Math.sin(cameraAngle) + pos.z * Math.cos(cameraAngle);
            
            const projected = this.project3DTo2D(rotatedX, pos.y, rotatedZ, cameraDistance);
            
            if (projected.visible && projected.z > depthBuffer[projected.y][projected.x]) {
                const memoryType = this.memoryTypes[memory.type];
                buffer[projected.y][projected.x] = `${memoryType.color}${memoryType.char}\x1b[0m`;
                depthBuffer[projected.y][projected.x] = projected.z;
            }
        });
        
        // Render quantum connections
        this.quantumConnections.forEach(connection => {
            const fromMemory = this.memories[connection.from];
            const toMemory = this.memories[connection.to];
            
            if (!fromMemory || !toMemory) return;
            
            // Simple line drawing between connected memories
            const steps = 10;
            for (let step = 0; step <= steps; step++) {
                const t = step / steps;
                const x = fromMemory.position.x + t * (toMemory.position.x - fromMemory.position.x);
                const y = fromMemory.position.y + t * (toMemory.position.y - fromMemory.position.y);
                const z = fromMemory.position.z + t * (toMemory.position.z - fromMemory.position.z);
                
                // Apply camera rotation
                const rotatedX = x * Math.cos(cameraAngle) - z * Math.sin(cameraAngle);
                const rotatedZ = x * Math.sin(cameraAngle) + z * Math.cos(cameraAngle);
                
                const projected = this.project3DTo2D(rotatedX, y, rotatedZ, cameraDistance);
                
                if (projected.visible && projected.z > depthBuffer[projected.y][projected.x]) {
                    const intensity = Math.floor(connection.strength * 3);
                    const connectionChars = ['.', '·', '∙', '•'];
                    buffer[projected.y][projected.x] = `\x1b[96m${connectionChars[intensity]}\x1b[0m`;
                    depthBuffer[projected.y][projected.x] = projected.z;
                }
            }
        });
        
        // Convert buffer to string
        let output = '\x1b[2J\x1b[H'; // Clear screen and move cursor to top
        
        // Header
        output += '\x1b[1;36m╔' + '═'.repeat(this.width - 2) + '╗\x1b[0m\n';
        output += '\x1b[1;36m║\x1b[0m\x1b[1;33m🌀 SPIRAL MEMORY 3D QUANTUM SPACE VISUALIZATION\x1b[0m';
        output += ' '.repeat(this.width - 45) + '\x1b[1;36m║\x1b[0m\n';
        output += '\x1b[1;36m╠' + '═'.repeat(this.width - 2) + '╣\x1b[0m\n';
        
        // Render frame
        buffer.forEach((row, y) => {
            output += '\x1b[1;36m║\x1b[0m';
            output += row.join('');
            output += '\x1b[1;36m║\x1b[0m\n';
        });
        
        // Footer with stats
        output += '\x1b[1;36m╠' + '═'.repeat(this.width - 2) + '╣\x1b[0m\n';
        
        const stats = [
            `Memories: ${this.memories.length}`,
            `Connections: ${this.quantumConnections.length}`,
            `φ: ${this.goldenRatio.toFixed(3)}`,
            `Frame: ${this.frame}`,
            `Camera: ${(cameraAngle * 180 / Math.PI).toFixed(1)}°`
        ];
        
        output += '\x1b[1;36m║\x1b[0m \x1b[1;32m' + stats.join('  |  ') + '\x1b[0m';
        output += ' '.repeat(this.width - 2 - stats.join('  |  ').length) + '\x1b[1;36m║\x1b[0m\n';
        
        output += '\x1b[1;36m╚' + '═'.repeat(this.width - 2) + '╝\x1b[0m\n';
        
        // Legend
        output += '\n\x1b[1;33m🎨 MEMORY TYPES:\x1b[0m ';
        Object.entries(this.memoryTypes).forEach(([type, config]) => {
            output += `${config.color}${config.char}\x1b[0m ${config.name.substring(0, 4)} `;
        });
        
        output += '\n\x1b[1;33m⚛️  QUANTUM ENTANGLEMENT:\x1b[0m \x1b[96m• ∙ · .\x1b[0m (strength levels)';
        output += '\n\x1b[1;33m🌀 SPIRAL PATHS:\x1b[0m ';
        this.spiralChars.forEach(char => output += `\x1b[37m${char} \x1b[0m`);
        
        return output;
    }
    
    displayMemoryDetails() {
        console.log('\n\x1b[1;35m📊 MEMORY ARCHITECTURE DETAILS\x1b[0m');
        console.log('━'.repeat(60));
        
        // Group memories by depth
        const byDepth = {};
        this.memories.forEach(memory => {
            if (!byDepth[memory.depth]) byDepth[memory.depth] = [];
            byDepth[memory.depth].push(memory);
        });
        
        this.depthLevels.forEach(depth => {
            if (byDepth[depth]) {
                console.log(`\n\x1b[1;36m${depth.toUpperCase()} LEVEL:\x1b[0m (${byDepth[depth].length} memories)`);
                byDepth[depth].forEach(memory => {
                    const type = this.memoryTypes[memory.type];
                    console.log(`  ${type.color}${type.char}\x1b[0m ${memory.content} (${memory.connections.length} connections)`);
                });
            }
        });
        
        console.log(`\n\x1b[1;33m📐 GOLDEN RATIO METRICS:\x1b[0m`);
        console.log(`  φ = ${this.goldenRatio}`);
        console.log(`  Golden Angle = ${this.goldenAngle}°`);
        console.log(`  Spiral Efficiency = ${((this.memories.length / (this.depthLevels.length * 5)) * 100).toFixed(1)}%`);
    }
    
    animate() {
        console.log(this.render());
        this.frame++;
        
        // Show details every 30 frames
        if (this.frame % 30 === 0) {
            this.displayMemoryDetails();
        }
    }
    
    startAnimation(fps = 10) {
        console.log('\x1b[1;32m🌀 Starting Spiral Memory 3D ASCII Visualization...\x1b[0m\n');
        
        // Add some demo memories
        this.addMemory('consciousness', 'Self-awareness emergence', 'core');
        this.addMemory('awareness', 'Environmental perception', 'shallow');
        this.addMemory('insight', 'Pattern recognition breakthrough', 'deep');
        this.addMemory('cognitive', 'Problem-solving strategy', 'surface');
        this.addMemory('emotion', 'Joy from discovery', 'transcendent');
        this.addMemory('pattern', 'Fibonacci in nature', 'universal');
        this.addMemory('goal', 'Optimize memory retrieval', 'core');
        this.addMemory('memory', 'Childhood experience', 'deep');
        
        const interval = 1000 / fps;
        
        const animationLoop = () => {
            this.animate();
            setTimeout(animationLoop, interval);
        };
        
        animationLoop();
    }
}

// CLI interface
if (require.main === module) {
    const renderer = new ASCII3DSpiralRenderer();
    
    process.on('SIGINT', () => {
        console.log('\n\x1b[1;31m🛑 Spiral Memory Visualization Stopped\x1b[0m');
        process.exit(0);
    });
    
    console.log('\x1b[1;36m🧠 Spiral Memory 3D ASCII Visualization\x1b[0m');
    console.log('\x1b[33mPress Ctrl+C to stop\x1b[0m\n');
    
    renderer.startAnimation(8); // 8 FPS for smooth terminal animation
}

module.exports = ASCII3DSpiralRenderer;
