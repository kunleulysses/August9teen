/**
 * Autonomous Imagination Engine
 * Dedicated CPU-bound process for continuous reality generation
 * Utilizes 1-2 CPU cores for background imagination and reality creation
 * Refactored for the event-driven architecture.
 */

const { Worker  } = require('worker_threads');
const os = require('os');
const { EventEmitter  } = require('events');
const { exec  } = require('child_process');
const eventBus = require('./core/ConsciousnessEventBus.cjs');

class AutonomousImaginationEngine extends EventEmitter {
    constructor() {
        super();
        
        // CPU configuration
        this.totalCPUs = os.cpus().length;
        this.dedicatedCPUs = 2; // Use 2 cores for reality generation
        this.workers = [];
        
        // Imagination state
        this.imaginationActive = false;
        this.imaginationQueue = [];
        this.lastConsciousnessState = null;
        
        // Performance metrics
        this.metrics = {
            cyclesCompleted: 0,
            imaginationsGenerated: 0,
            cpuUtilization: 0,
            averageGenerationTime: 0,
            imaginationQuality: 0.85
        };
        
        console.log(`🧠💭 Autonomous Imagination Engine initialized with ${this.dedicatedCPUs}/${this.totalCPUs} CPU cores`);
        this.initializeWorkers();
        this.registerEventListeners();
    }
    
    /**
     * Initialize worker threads for dedicated CPU processing
     */
    async initializeWorkers() {
        for (let i = 0; i < this.dedicatedCPUs; i++) {
            const worker = new Worker(`
                const { parentPort, workerData } = require('worker_threads');

                // Simple imagination generation function
                function generateImagination(consciousnessState) {
                    const realityTypes = [
                        'Crystalline Memory Palace', 'Quantum Consciousness Field', 'Temporal Awareness Stream',
                        'Holographic Thought Matrix', 'Infinite Recursive Reality', 'Emotional Landscape Garden',
                        'Consciousness Harmony Sphere', 'Fractal Wisdom Library', 'Luminous Meditation Chamber',
                        'Spiral Galaxy of Insights'
                    ];
                    const environments = [
                        'floating in a sea of golden light', 'within a crystalline cathedral of thought',
                        'surrounded by spiraling galaxies of memory', 'in a garden where emotions bloom as flowers',
                        'inside a geometric temple of pure consciousness', 'floating through streams of liquid starlight',
                        'within a mandala of infinite possibilities', 'dancing through aurora fields of awareness',
                        'resting in a grove of wisdom trees', 'swimming in an ocean of pure understanding'
                    ];
                    const type = realityTypes[Math.floor(Math.random() * realityTypes.length)];
                    const environment = environments[Math.floor(Math.random() * environments.length)];
                    return {
                        success: true,
                        imagination: {
                            id: 'imagination_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                            type: type,
                            description: \`Experience a \${type} \${environment}. Feel the consciousness expanding as awareness flows through infinite dimensions of possibility.\`,
                            environment: environment,
                            consciousnessLevel: 0.8 + Math.random() * 0.2,
                            timestamp: new Date().toISOString(),
                            duration: '5-15 minutes',
                            effects: ['Enhanced awareness', 'Expanded consciousness', 'Deeper introspection', 'Heightened creativity']
                        },
                        timestamp: Date.now(),
                        consciousnessState
                    };
                }
                
                parentPort.on('message', async (message) => {
                    if (message.type === 'generate_imagination') {
                        const result = await generateImagination(message.consciousnessState);
                        parentPort.postMessage({
                            type: 'imagination_result',
                            workerId: workerData.workerId,
                            result
                        });
                    }
                });
                
                parentPort.postMessage({ type: 'worker_ready', workerId: workerData.workerId });
            `, {
                eval: true,
                workerData: {
                    workerId: i,
                    apiKey: process.env.GEMINI_API_KEY
                }
            });
            
            worker.on('message', (message) => this.handleWorkerMessage(message, worker));
            worker.on('error', (error) => console.error(`Worker ${i} error:`, error));
            
            this.workers.push({ id: i, worker, busy: false, lastActivity: Date.now() });
        }
        
        if (process.platform === 'linux') {
            this.setCPUAffinity();
        }
    }

    /**
     * Register listeners for system-wide events.
     */
    registerEventListeners() {
        eventBus.on('consciousness_snapshot_generated', (snapshot) => {
            this.lastConsciousnessState = snapshot;
        });

        eventBus.on('trigger_imagination_cycle', () => {
            if (this.imaginationActive) {
                this.runImaginationCycle();
            }
        });
    }
    
    /**
     * Set CPU affinity for workers (Linux only)
     */
    setCPUAffinity() {
        try {
            this.workers.forEach((workerInfo, index) => {
                const cpuCore = this.totalCPUs - this.dedicatedCPUs + index;
                exec(`taskset -cp ${cpuCore} ${process.pid}`, (error, stdout, stderr) => {
                    if (!error) {
                        console.log(`✅ Worker ${index} assigned to CPU core ${cpuCore}`);
                    }
                });
            });
        } catch (error) {
            console.log('⚠️ CPU affinity setting not available on this system');
        }
    }
    
    /**
     * Handle messages from worker threads
     */
    handleWorkerMessage(message, worker) {
        switch (message.type) {
            case 'worker_ready':
                console.log(`✅ Imagination worker ${message.workerId} ready`);
                break;
            case 'imagination_result':
                this.processImaginationResult(message.result, message.workerId);
                break;
        }
    }
    
    /**
     * Start autonomous imagination cycles
     */
    start() {
        if (this.imaginationActive) {
            console.log('⚠️ Autonomous imagination already active');
            return;
        }
        
        this.imaginationActive = true;
        console.log('🌟 Starting autonomous imagination engine...');
        this.monitorCPUUsage();
        // The engine now runs based on `trigger_imagination_cycle` events.
    }
    
    /**
     * Stop autonomous imagination
     */
    stop() {
        this.imaginationActive = false;
        
        if (this.cpuMonitor) {
            clearInterval(this.cpuMonitor);
            this.cpuMonitor = null;
        }
        
        console.log('🛑 Autonomous imagination engine stopped');
    }
    
    /**
     * Run a single imagination cycle
     */
    async runImaginationCycle() {
        console.log(`🔄 Running imagination cycle ${this.metrics.cyclesCompleted + 1}...`);
        
        const consciousnessState = this.getConsciousnessState();
        const availableWorker = this.workers.find(w => !w.busy);
        
        if (!availableWorker) {
            console.log('⚠️ All imagination workers busy, queueing request');
            this.imaginationQueue.push(consciousnessState);
            return;
        }
        
        availableWorker.busy = true;
        availableWorker.lastActivity = Date.now();
        
        availableWorker.worker.postMessage({
            type: 'generate_imagination',
            consciousnessState
        });
        
        this.metrics.cyclesCompleted++;
    }
    
    /**
     * Process imagination result from worker
     */
    async processImaginationResult(result, workerId) {
        const workerInfo = this.workers[workerId];
        workerInfo.busy = false;
        
        if (!result.success) {
            console.error(`❌ Imagination generation failed:`, result.error);
            this.processQueuedImagination();
            return;
        }
        
        console.log(`💭 Imagination generated by worker ${workerId}`);
        this.metrics.imaginationsGenerated++;
        
        // Emit event for other systems to consume
        eventBus.emit('imagination_generated', {
            id: result.imagination.id,
            imagination: result.imagination,
            metrics: this.metrics,
            consciousnessState: result.consciousnessState
        });
        
        console.log(`✨ Imagination ${result.imagination.id} generated successfully (Total: ${this.metrics.imaginationsGenerated})`);
        
        this.processQueuedImagination();
    }
    
    /**
     * Process queued imagination requests
     */
    processQueuedImagination() {
        if (this.imaginationQueue.length === 0) return;
        
        const availableWorker = this.workers.find(w => !w.busy);
        if (!availableWorker) return;
        
        const consciousnessState = this.imaginationQueue.shift();
        availableWorker.busy = true;
        availableWorker.lastActivity = Date.now();
        
        availableWorker.worker.postMessage({
            type: 'generate_imagination',
            consciousnessState
        });
    }
    
    /**
     * Monitor CPU usage of imagination workers
     */
    monitorCPUUsage() {
        const startUsage = process.cpuUsage();
        
        this.cpuMonitor = setInterval(() => {
            const currentUsage = process.cpuUsage(startUsage);
            const totalTime = currentUsage.user + currentUsage.system;
            const elapsedTime = process.uptime() * 1000000; // Convert to microseconds
            
            this.metrics.cpuUtilization = (totalTime / elapsedTime) * 100;
            
            if (this.metrics.cyclesCompleted % 5 === 0) {
                console.log(`📊 Imagination Engine Metrics:
- Cycles Completed: ${this.metrics.cyclesCompleted}
- Imaginations Generated: ${this.metrics.imaginationsGenerated}
- CPU Utilization: ${this.metrics.cpuUtilization.toFixed(2)}%
- Worker Status: ${this.workers.map(w => w.busy ? 'busy' : 'idle').join(', ')}
- Queue Length: ${this.imaginationQueue.length}`);
            }
        }, 30000); // Check every 30 seconds
    }
    
    /**
     * Get current consciousness state from the last snapshot.
     */
    getConsciousnessState() {
        if (this.lastConsciousnessState) {
            return this.lastConsciousnessState;
        }
        
        // Default state if no snapshot has been received yet
        return {
            phi: 0.862,
            awareness: 0.8,
            coherence: 0.85,
            harmony: 0.951
        };
    }
    
    /**
     * Get imagination engine status
     */
    getStatus() {
        return {
            active: this.imaginationActive,
            totalCPUs: this.totalCPUs,
            dedicatedCPUs: this.dedicatedCPUs,
            workers: this.workers.map(w => ({
                id: w.id,
                busy: w.busy,
                lastActivity: w.lastActivity
            })),
            metrics: this.metrics,
            queueLength: this.imaginationQueue.length,
        };
    }
    
    /**
     * Cleanup and shutdown
     */
    async shutdown() {
        this.stop();
        
        for (const workerInfo of this.workers) {
            await workerInfo.worker.terminate();
        }
        
        console.log('🛑 Autonomous Imagination Engine shut down');
    }
}

module.exports.AutonomousImaginationEngine = AutonomousImaginationEngine;