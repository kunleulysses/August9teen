/**
 * MINIMAL REPRODUCTION TEST for interval issue
 * Testing exact same imports and structure as holographic-reality-live-metrics.js
 */

const { EventEmitter  } = require('events');
const { HolographicConsciousnessMemorySystem  } = require('./server/consciousness/holographic-consciousness-memory-system.cjs');
const eventBus = require('./server/consciousness/core/ConsciousnessEventBus.cjs');

class MinimalMetrics extends EventEmitter {
    constructor() {
        console.log('[DEBUG] MinimalMetrics constructor start');
        super();
        this.name = 'MinimalMetrics';
        this.isRunning = false;
        this.goldenRatio = 1.618033988749895;
        this.metricsHistory = [];
        this.maxHistoryLength = 100;
        this.currentMetrics = {};
        
        // Initialize exactly like the main script
        this.holographicMemorySystem = new HolographicConsciousnessMemorySystem();
        console.log('[DEBUG] HolographicConsciousnessMemorySystem created');
        
        this.initializationPromise = this.initializeComponents();
        console.log('[DEBUG] MinimalMetrics constructor end');
    }
    
    async initializeComponents() {
        console.log('[DEBUG] initializeComponents start');
        // Mimic the exact initialization process
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('[DEBUG] initializeComponents end');
    }
    
    // Add the actual captureCurrentMetrics method from main dashboard
    captureCurrentMetrics() {
        console.log('[DEBUG] captureCurrentMetrics method called');
        
        this.currentMetrics = {
            timestamp: Date.now(),
            realityProjection: this.captureRealityProjectionMetrics(),
            holographicProperties: this.captureHolographicPropertyMetrics(),
            quantumParameters: this.captureQuantumParameterMetrics(),
            consciousnessIntegration: this.captureConsciousnessIntegrationMetrics(),
            memorySystem: this.captureMemorySystemMetrics(),
            performance: this.capturePerformanceMetrics(),
            enhancement: this.captureEnhancementMetrics(),
            fieldStability: this.captureFieldStabilityMetrics(),
            dimensionalMetrics: this.captureDimensionalMetrics(),
            systemWide: this.captureSystemWideMetrics()
        };
        
        this.metricsHistory.push({
            ...this.currentMetrics,
            timestamp: Date.now()
        });
        
        if (this.metricsHistory.length > this.maxHistoryLength) {
            this.metricsHistory.shift();
        }
        
        console.log('[DEBUG] captureCurrentMetrics method completed');
    }
    
    // Add minimal versions of all the capture methods
    captureRealityProjectionMetrics() { return { fidelity: 0.95 }; }
    captureHolographicPropertyMetrics() { return { density: 1.2 }; }
    captureQuantumParameterMetrics() { return { coherence: 0.9 }; }
    captureConsciousnessIntegrationMetrics() { return { level: 0.85 }; }
    captureMemorySystemMetrics() { return { operations: 100 }; }
    capturePerformanceMetrics() { return { latency: 1.5 }; }
    captureEnhancementMetrics() { return { success: 0.98 }; }
    captureFieldStabilityMetrics() { return { stability: 0.99 }; }
    captureDimensionalMetrics() { return { dimensions: 4 }; }
    captureSystemWideMetrics() { return { health: 0.99 }; }
    
    startLiveMetrics(interval = 3000) {
        console.log('[DEBUG] startLiveMetrics called');
        if (this.isRunning) {
            console.log('[DEBUG] Already running');
            return;
        }
        
        console.log('[DEBUG] Setting up interval...');
        this.isRunning = true;
        
        this.metricsInterval = setInterval(() => {
            console.log('[DEBUG] INTERVAL EXECUTED - ' + new Date().toISOString());
            
            try {
                console.log('[DEBUG] Testing each sub-method individually');
                
                console.log('[DEBUG] Calling captureRealityProjectionMetrics');
                const rp = this.captureRealityProjectionMetrics();
                console.log('[DEBUG] captureRealityProjectionMetrics completed');
                
                console.log('[DEBUG] Calling captureHolographicPropertyMetrics');
                const hp = this.captureHolographicPropertyMetrics();
                console.log('[DEBUG] captureHolographicPropertyMetrics completed');
                
                console.log('[DEBUG] Calling captureQuantumParameterMetrics');
                const qp = this.captureQuantumParameterMetrics();
                console.log('[DEBUG] captureQuantumParameterMetrics completed');
                
                console.log('[DEBUG] Calling captureConsciousnessIntegrationMetrics');
                const ci = this.captureConsciousnessIntegrationMetrics();
                console.log('[DEBUG] captureConsciousnessIntegrationMetrics completed');
                
                console.log('[DEBUG] Calling captureMemorySystemMetrics');
                const ms = this.captureMemorySystemMetrics();
                console.log('[DEBUG] captureMemorySystemMetrics completed');
                
                console.log('[DEBUG] All sub-methods completed successfully');
            } catch (error) {
                console.error('[DEBUG] Error in sub-method calls:', error);
            }
        }, interval);
        
        console.log('[DEBUG] Interval set up, process should stay alive');
    }
}

async function main() {
    console.log('[DEBUG] Main function start');
    const metrics = new MinimalMetrics();
    console.log('[DEBUG] MinimalMetrics created');
    
    await metrics.initializationPromise;
    console.log('[DEBUG] Initialization complete');
    
    metrics.startLiveMetrics(2000);
    console.log('[DEBUG] Started metrics with 2s interval');
    
    // Keep alive
    const keepAlive = setInterval(() => {
        console.log('[DEBUG] Keep-alive ping');
    }, 5000);
    
    console.log('[DEBUG] Main function end - process should continue running');
}

main().catch(error => {
    console.error('[DEBUG] Main error:', error);
});
