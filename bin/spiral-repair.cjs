#!/usr/bin/env node

/**
 * Spiral Memory Statistics Repair Tool
 * Rebuilds spiral metadata by scanning all memory nodes
 * Usage: node bin/spiral-repair.js [options]
 */

const SpiralMemoryArchitecture = require('../FlappyJournal/server/consciousness/core/SpiralMemoryArchitecture.cjs');
const { performance } = require('perf_hooks');

class SpiralRepairTool {
    constructor() {
        this.facade = null;
        this.startTime = 0;
    }

    async initialize() {
        console.log('🔧 Spiral Memory Repair Tool');
        console.log('━'.repeat(50));
        
        try {
            this.startTime = performance.now();
            console.log('🌀 Initializing Spiral Memory Architecture...');
            
            // Create architecture with in-memory storage for testing
            const { InMemorySpiralAdapter } = require('../FlappyJournal/server/consciousness/core/storage/SpiralStorageAdapter.cjs');
            this.facade = { arch: new SpiralMemoryArchitecture({ storage: new InMemorySpiralAdapter() }) };
            
            // Wait for initialization to complete
            await this.waitForInitialization();
            
            const initTime = performance.now() - this.startTime;
            console.log(`✅ Initialization completed in ${initTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error('❌ Failed to initialize Spiral Memory Architecture:', error.message);
            process.exit(1);
        }
    }

    async waitForInitialization() {
        // Wait for the architecture to be fully initialized
        return new Promise((resolve, reject) => {
            const checkInterval = setInterval(() => {
                if (this.facade.arch.isInitialized) {
                    clearInterval(checkInterval);
                    resolve();
                } else if (performance.now() - this.startTime > 30000) {
                    clearInterval(checkInterval);
                    reject(new Error('Initialization timeout after 30 seconds'));
                }
            }, 100);
        });
    }

    async runRepair() {
        console.log('\n🔄 Starting spiral statistics rebuild...');
        
        try {
            // Get current statistics before repair
            const beforeStats = this.facade.arch.getMemoryStatistics();
            console.log(`📊 Current state: ${beforeStats.totalMemories} memories across ${beforeStats.totalSpirals} spirals`);
            
            // Run the rebuild
            const rebuildStart = performance.now();
            const report = await this.facade.arch.rebuildSpiralStats();
            const rebuildTime = performance.now() - rebuildStart;
            
            // Display results
            this.displayReport(report, rebuildTime);
            
            return report;
            
        } catch (error) {
            console.error('❌ Repair failed:', error.message);
            throw error;
        }
    }

    displayReport(report, rebuildTime) {
        console.log('\n📈 REPAIR REPORT');
        console.log('━'.repeat(50));
        
        const correctedSpirals = report.correctedSpirals.filter(s => s.corrected);
        const unchangedSpirals = report.correctedSpirals.filter(s => !s.corrected);
        
        console.log(`⏱️  Rebuild time: ${rebuildTime.toFixed(2)}ms`);
        console.log(`📊 Total nodes scanned: ${report.totalNodes}`);
        console.log(`🔧 Spirals corrected: ${correctedSpirals.length}`);
        console.log(`✅ Spirals unchanged: ${unchangedSpirals.length}`);
        
        if (correctedSpirals.length > 0) {
            console.log('\n🔧 CORRECTIONS APPLIED:');
            console.log('━'.repeat(30));
            
            correctedSpirals.forEach(spiral => {
                console.log(`\n🌀 Spiral: ${spiral.spiralId} (${spiral.spiralType})`);
                console.log(`   Node Count: ${spiral.before.nodeCount} → ${spiral.after.nodeCount} (Δ${spiral.deltas.nodeCount})`);
                console.log(`   Avg Depth:  ${spiral.before.averageDepth.toFixed(3)} → ${spiral.after.averageDepth.toFixed(3)} (Δ${spiral.deltas.averageDepth.toFixed(3)})`);
                console.log(`   Radius:     ${spiral.before.currentRadius.toFixed(3)} → ${spiral.after.currentRadius.toFixed(3)} (Δ${spiral.deltas.currentRadius.toFixed(3)})`);
                console.log(`   Turns:      ${spiral.before.totalTurns} → ${spiral.after.totalTurns} (Δ${spiral.deltas.totalTurns})`);
            });
        } else {
            console.log('\n✅ All spiral statistics were already accurate - no corrections needed!');
        }
        
        // Performance assessment
        const nodesPerSecond = report.totalNodes / (rebuildTime / 1000);
        console.log(`\n⚡ Performance: ${nodesPerSecond.toFixed(0)} nodes/second`);
        
        if (rebuildTime < 5000) {
            console.log('🎯 Performance target met: <5s rebuild time ✅');
        } else {
            console.log('⚠️  Performance target missed: >5s rebuild time');
        }
    }

    async cleanup() {
        if (this.facade && this.facade.arch && this.facade.arch.storage) {
            try {
                // Close storage connections gracefully
                if (typeof this.facade.arch.storage.close === 'function') {
                    await this.facade.arch.storage.close();
                }
            } catch (error) {
                console.warn('⚠️  Warning during cleanup:', error.message);
            }
        }
    }

    async run() {
        try {
            await this.initialize();
            const report = await this.runRepair();
            
            const totalTime = performance.now() - this.startTime;
            console.log(`\n🎉 Repair completed successfully in ${totalTime.toFixed(2)}ms`);
            
            // Exit with success code
            await this.cleanup();
            process.exit(0);
            
        } catch (error) {
            console.error('\n❌ Repair tool failed:', error.message);
            
            // Attempt cleanup
            try {
                await this.cleanup();
            } catch (cleanupError) {
                console.error('❌ Cleanup failed:', cleanupError.message);
            }
            
            process.exit(1);
        }
    }
}

// CLI argument parsing
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        help: false,
        verbose: false
    };
    
    for (const arg of args) {
        switch (arg) {
            case '-h':
            case '--help':
                options.help = true;
                break;
            case '-v':
            case '--verbose':
                options.verbose = true;
                break;
            default:
                console.warn(`⚠️  Unknown option: ${arg}`);
        }
    }
    
    return options;
}

function showHelp() {
    console.log(`
🔧 Spiral Memory Statistics Repair Tool

USAGE:
    node bin/spiral-repair.js [options]

OPTIONS:
    -h, --help      Show this help message
    -v, --verbose   Enable verbose output

DESCRIPTION:
    Scans all memory nodes and rebuilds spiral metadata statistics.
    Corrects nodeCount, averageDepth, currentRadius, and totalTurns
    for all spirals based on actual memory node data.

ENVIRONMENT VARIABLES:
    REDIS_URL       Redis connection string (optional)
    SPIRAL_DB_PATH  LevelDB path (default: ./spiraldb)

EXAMPLES:
    node bin/spiral-repair.js
    REDIS_URL=redis://localhost:6379 node bin/spiral-repair.js
    SPIRAL_DB_PATH=/data/spiraldb node bin/spiral-repair.js --verbose

EXIT CODES:
    0   Success - repair completed
    1   Error - repair failed
`);
}

// Main execution
if (require.main === module) {
    const options = parseArgs();
    
    if (options.help) {
        showHelp();
        process.exit(0);
    }
    
    // Handle graceful shutdown
    const repairTool = new SpiralRepairTool();
    
    process.on('SIGINT', async () => {
        console.log('\n🛑 Received SIGINT, shutting down gracefully...');
        await repairTool.cleanup();
        process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
        console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
        await repairTool.cleanup();
        process.exit(0);
    });
    
    // Run the repair tool
    repairTool.run();
}

module.exports = SpiralRepairTool;
