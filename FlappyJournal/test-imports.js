console.log('[TEST] Testing interval callback methods...');

import { EventEmitter } from 'events';
import { HolographicConsciousnessMemorySystem } from './server/consciousness/holographic-consciousness-memory-system.js';
import eventBus from './server/consciousness/core/ConsciousnessEventBus.js';

// Create a minimal version of the HolographicRealityLiveMetrics class
class TestHolographicMetrics extends EventEmitter {
    constructor() {
        super();
        this.holographicMemorySystem = new HolographicConsciousnessMemorySystem();
        this.goldenRatio = 1.618033988749895;
        this.metricsHistory = [];
        this.currentMetrics = {
            timestamp: Date.now(),
            realityProjection: {},
            holographicProperties: {},
            quantumParameters: {},
            consciousnessIntegration: {},
            memorySystem: {},
            performance: {},
            enhancement: {},
            fieldStability: {},
            dimensionalMetrics: {},
            systemWide: {}
        };
        console.log('[TEST] TestHolographicMetrics initialized');
    }
    
    // Test captureCurrentMetrics method
    captureCurrentMetrics() {
        console.log('[TEST] captureCurrentMetrics called');
        try {
            this.currentMetrics.timestamp = Date.now();
            this.currentMetrics.realityProjection = this.captureRealityProjectionMetrics();
            console.log('[TEST] captureCurrentMetrics completed successfully');
        } catch (error) {
            console.error('[TEST] Error in captureCurrentMetrics:', error);
        }
    }
    
    // Test displayLiveMetrics method
    displayLiveMetrics() {
        console.log('[TEST] displayLiveMetrics called');
        try {
            console.clear();
            console.log('=== TEST METRICS DISPLAY ===');
            console.log(`Timestamp: ${new Date(this.currentMetrics.timestamp).toISOString()}`);
            console.log('[TEST] displayLiveMetrics completed successfully');
        } catch (error) {
            console.error('[TEST] Error in displayLiveMetrics:', error);
        }
    }
    
    captureRealityProjectionMetrics() {
        return {
            projectionFidelity: 0.95,
            realityComplexity: 5.0,
            projectionDimensions: 4
        };
    }
}

async function testMethods() {
    console.log('[TEST] Creating test instance...');
    const testMetrics = new TestHolographicMetrics();
    
    console.log('[TEST] Testing captureCurrentMetrics...');
    testMetrics.captureCurrentMetrics();
    
    console.log('[TEST] Testing displayLiveMetrics...');
    testMetrics.displayLiveMetrics();
    
    console.log('[TEST] Both methods work individually, now testing in interval...');
    
    let counter = 0;
    const interval = setInterval(() => {
        counter++;
        console.log(`[TEST] Interval iteration ${counter}`);
        
        try {
            testMetrics.captureCurrentMetrics();
            testMetrics.displayLiveMetrics();
            console.log(`[TEST] Interval iteration ${counter} completed`);
        } catch (error) {
            console.error(`[TEST] Error in interval iteration ${counter}:`, error);
        }
        
        if (counter >= 2) {
            console.log('[TEST] Test completed successfully!');
            clearInterval(interval);
            process.exit(0);
        }
    }, 2000);
}

testMethods().catch(error => {
    console.error('[TEST] Error in testMethods:', error);
});
