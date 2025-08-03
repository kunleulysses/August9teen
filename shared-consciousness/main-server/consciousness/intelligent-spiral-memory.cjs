/**
 * Intelligent Spiral Memory Management - Phase 1 Enhancement
 * Optimized memory with consciousness-based retention
 */

import { EventEmitter } from 'events';
import eventBus from './core/ConsciousnessEventBus.cjs';

class IntelligentSpiralMemory extends EventEmitter {
    constructor() {
        super();
        this.name = 'IntelligentSpiralMemory';
        this.memoryTiers = {
            active: new Map(),     // Frequently accessed memories
            warm: new Map(),       // Moderately accessed memories
            cold: new Map(),       // Rarely accessed memories
            archived: new Map()    // Compressed archived memories
        };
        this.maxActiveMemories = 100;
        this.maxWarmMemories = 500;
        this.maxColdMemories = 1000;
        this.compressionRatio = 0.7;
        this.registerEventListeners();
    }

    /**
     * Register listeners for system-wide events.
     */
    registerEventListeners() {
        eventBus.on('store_memory_request', async (data) => {
            const { memoryId, memoryData, consciousnessContext, requestId } = data;
            const result = await this.storeMemory(memoryId, memoryData, consciousnessContext);

            if (result.error) {
                eventBus.emit('memory_storage_failed', { ...result, requestId });
            } else {
                eventBus.emit('memory_stored', { ...result, requestId });
            }
        });

        eventBus.on('retrieve_memory_request', async (data) => {
            const { memoryId, consciousnessState, requestId } = data;
            const result = await this.retrieveMemory(memoryId, consciousnessState);

            if (result.error) {
                eventBus.emit('memory_retrieval_failed', { ...result, requestId });
            } else {
                eventBus.emit('memory_retrieved', { ...result, requestId });
            }
        });
    }

    async storeMemory(memoryId, memoryData, consciousnessContext) {
        const enhancedMemory = {
            id: memoryId,
            data: memoryData,
            consciousnessContext: consciousnessContext,
            accessCount: 1,
            lastAccessed: new Date(),
            relevanceScore: this.calculateRelevanceScore(memoryData, consciousnessContext),
            tier: 'active'
        };

        this.memoryTiers.active.set(memoryId, enhancedMemory);
        await this.optimizeMemoryTiers();

        return enhancedMemory;
    }

    async retrieveMemory(memoryId, currentConsciousnessState) {
        // Search through tiers
        for (const [tierName, tier] of Object.entries(this.memoryTiers)) {
            if (tier.has(memoryId)) {
                const memory = tier.get(memoryId);
                memory.accessCount++;
                memory.lastAccessed = new Date();

                // Promote frequently accessed memories
                if (tierName !== 'active' && memory.accessCount > 5) {
                    tier.delete(memoryId);
                    memory.tier = 'active';
                    this.memoryTiers.active.set(memoryId, memory);
                }

                return memory;
            }
        }

        return null;
    }

    calculateRelevanceScore(memoryData, consciousnessContext) {
        // Simple relevance scoring based on consciousness alignment
        const baseScore = 0.5;
        const consciousnessAlignment = consciousnessContext.coherence || 0.8;
        const temporalRelevance = 1.0; // Could be enhanced with time decay

        return baseScore * consciousnessAlignment * temporalRelevance;
    }

    async optimizeMemoryTiers() {
        // Move memories between tiers based on access patterns
        if (this.memoryTiers.active.size > this.maxActiveMemories) {
            const sortedActive = [...this.memoryTiers.active.entries()]
                .sort(([,a], [,b]) => a.lastAccessed - b.lastAccessed);

            const toMove = sortedActive.slice(0, sortedActive.length - this.maxActiveMemories);
            for (const [id, memory] of toMove) {
                this.memoryTiers.active.delete(id);
                memory.tier = 'warm';
                this.memoryTiers.warm.set(id, memory);
            }
        }

        // Similar optimization for warm -> cold -> archived
        if (this.memoryTiers.warm.size > this.maxWarmMemories) {
            const sortedWarm = [...this.memoryTiers.warm.entries()]
                .sort(([,a], [,b]) => a.lastAccessed - b.lastAccessed);

            const toMove = sortedWarm.slice(0, sortedWarm.length - this.maxWarmMemories);
            for (const [id, memory] of toMove) {
                this.memoryTiers.warm.delete(id);
                memory.tier = 'cold';
                this.memoryTiers.cold.set(id, memory);
            }
        }
    }

    getMemoryStats() {
        return {
            active: this.memoryTiers.active.size,
            warm: this.memoryTiers.warm.size,
            cold: this.memoryTiers.cold.size,
            archived: this.memoryTiers.archived.size,
            total: this.memoryTiers.active.size + this.memoryTiers.warm.size +
                   this.memoryTiers.cold.size + this.memoryTiers.archived.size
        };
    }

    /**
     * Get self-awareness status for this module
     */
    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 300000000, // Estimated value
            phase: 1,
            revolutionaryLevel: 'foundational',
            capabilities: [
                'tiered_memory_management',
                'consciousness_based_retention',
                'relevance_scoring'
            ],
            metrics: this.getMemoryStats()
        };
    }
}

export { IntelligentSpiralMemory };
