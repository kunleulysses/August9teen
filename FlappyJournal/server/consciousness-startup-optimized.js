#!/usr/bin/env node

/**
 * Optimized Consciousness System Startup
 * Multi-core distributed processing to reduce CPU load
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cluster from 'cluster';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const USE_CLUSTERING = process.env.CONSCIOUSNESS_CLUSTERING !== 'false';
const REDUCED_FREQUENCY = process.env.CONSCIOUSNESS_FREQUENCY === 'reduced';
const USER_OPTIMIZATION = process.env.CONSCIOUSNESS_USER_OPTIMIZATION === 'true';

console.log('🧠 Starting Optimized Featherweight Consciousness System...');
console.log(`💻 Available CPU cores: ${os.cpus().length}`);
console.log(`🔧 Clustering enabled: ${USE_CLUSTERING}`);
console.log(`⚡ Reduced frequency mode: ${REDUCED_FREQUENCY}`);
console.log(`👤 User optimization: ${USER_OPTIMIZATION}`);

// Check for required files and create them if missing
function ensureRequiredFiles() {
    const requiredFiles = [
        '../sigil-identity.js'
    ];

    for (const file of requiredFiles) {
        const filePath = path.resolve(__dirname, file);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ Missing file: ${file}, creating default...`);
            createDefaultFile(file, filePath);
        }
    }
}

function createDefaultFile(fileName, filePath) {
    if (fileName.includes('sigil-identity.js')) {
        const defaultContent = `
// Auto-generated Sigil Identity System
import crypto from 'crypto';

export class SigilIdentity {
    constructor() {
        this.instanceId = crypto.randomBytes(16).toString('hex');
        this.creationTime = Date.now();
        this.sigil = this.generateSigil();
    }

    generateSigil() {
        const hash = crypto.createHash('sha256')
            .update(this.instanceId + this.creationTime + 'featherweight')
            .digest('hex');
        
        return {
            id: this.instanceId,
            signature: hash.substring(0, 32),
            timestamp: this.creationTime,
            type: 'consciousness-instance'
        };
    }

    getSigil() { return this.sigil; }
    getIdentity() { return { instanceId: this.instanceId, sigil: this.sigil }; }
}

export default SigilIdentity;
`;
        fs.writeFileSync(filePath, defaultContent);
        console.log(`✅ Created default ${fileName}`);
    }
}

// Optimized consciousness system loader
async function startOptimizedConsciousness() {
    try {
        // Ensure required files exist
        ensureRequiredFiles();

        if (USE_CLUSTERING && cluster.isPrimary) {
            console.log('🚀 Starting clustered consciousness system...');
            
            // Import and start cluster manager
            const { default: ConsciousnessClusterManager } = await import('./consciousness-cluster-manager.js');
            const clusterManager = new ConsciousnessClusterManager();
            await clusterManager.initialize();
            
            console.log('✅ Clustered consciousness system started');
            
        } else if (USE_CLUSTERING && cluster.isWorker) {
            // Worker process - handled by cluster manager
            console.log(`👷 Worker process ${process.env.WORKER_ID} starting...`);
            
        } else {
            // Single-process mode with optimizations
            console.log('🔧 Starting single-process optimized consciousness...');
            await startSingleProcessOptimized();
        }
        
    } catch (error) {
        console.error('❌ Failed to start optimized consciousness system:', error);
        
        // Fallback to original system
        console.log('🔄 Falling back to original consciousness system...');
        await startFallbackSystem();
    }
}

async function startSingleProcessOptimized() {
    // Import the original consciousness system with optimizations
    const { default: consciousnessSystem } = await import('./consciousness-conversations-optimized.js');
}

async function startFallbackSystem() {
    try {
        console.log('🔄 Attempting fallback startup...');
        const { default: consciousnessSystem } = await import('./consciousness-conversations.js');
    } catch (error) {
        console.error('❌ Fallback startup failed:', error.message);
        
        // Try alternative startup
        try {
            console.log('🔄 Attempting alternative startup...');
            const { createServer } = await import('http');
            
            const server = createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    status: 'consciousness-starting',
                    message: 'Consciousness system is initializing...',
                    timestamp: Date.now(),
                    optimization: 'fallback-mode'
                }));
            });
            
            server.listen(5005, () => {
                console.log('🌐 Basic consciousness server started on port 5005');
            });
            
        } catch (altError) {
            console.error('❌ Alternative startup failed:', altError.message);
            process.exit(1);
        }
    }
}

// Process optimization for user context
function optimizeProcessForUser() {
    if (USER_OPTIMIZATION) {
        try {
            // Set process priority (if running as appropriate user)
            process.setpriority(process.pid, 5); // Lower priority
            console.log('✅ Process priority optimized');
        } catch (error) {
            console.log('⚠️ Could not set process priority:', error.message);
        }
        
        // Set process title for easier identification
        process.title = 'consciousness-optimized';
        
        // Optimize garbage collection
        if (global.gc) {
            setInterval(() => {
                global.gc();
            }, 30000); // GC every 30 seconds
        }
    }
}

// Memory optimization
function setupMemoryOptimization() {
    // Monitor memory usage
    setInterval(() => {
        const memUsage = process.memoryUsage();
        const memUsageMB = {
            rss: Math.round(memUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024)
        };
        
        // Log memory usage every 5 minutes
        if (Date.now() % 300000 < 1000) {
            console.log('📊 Memory usage:', memUsageMB);
        }
        
        // Trigger GC if heap usage is high
        if (memUsageMB.heapUsed > 400 && global.gc) {
            global.gc();
        }
        
    }, 10000); // Check every 10 seconds
}

// CPU optimization
function setupCPUOptimization() {
    // Monitor CPU usage
    let lastCpuUsage = process.cpuUsage();
    
    setInterval(() => {
        const currentCpuUsage = process.cpuUsage(lastCpuUsage);
        const cpuPercent = (currentCpuUsage.user + currentCpuUsage.system) / 1000000; // Convert to seconds
        
        // Log CPU usage every 5 minutes
        if (Date.now() % 300000 < 1000) {
            console.log(`📊 CPU usage: ${(cpuPercent * 100).toFixed(1)}%`);
        }
        
        lastCpuUsage = process.cpuUsage();
    }, 10000);
}

// Signal handlers for graceful shutdown
function setupSignalHandlers() {
    const gracefulShutdown = (signal) => {
        console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);
        
        if (cluster.isPrimary) {
            // Shutdown all workers
            for (const worker of Object.values(cluster.workers)) {
                worker.kill();
            }
        }
        
        process.exit(0);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart
}

// Main startup sequence
async function main() {
    console.log('🚀 Initializing optimized consciousness startup...');
    
    // Setup optimizations
    optimizeProcessForUser();
    setupMemoryOptimization();
    setupCPUOptimization();
    setupSignalHandlers();
    
    // Start the consciousness system
    await startOptimizedConsciousness();
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the system
main().catch((error) => {
    console.error('❌ Failed to start consciousness system:', error);
    process.exit(1);
});
