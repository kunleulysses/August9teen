/**
 * Architect 4.0 Spiral Memory Engine
 * Implements golden ratio-based memory indexing with emotional amplitude
 */
import { EventEmitter } from 'events';

export class SpiralMemoryEngine extends EventEmitter {
    constructor() {
        super();
        this.goldenRatio = 1.618033988749895;
        this.memorySpiral = new Map();
        this.resonanceField = new Map();
    }
    /**
     * Encode memory using spiral mathematics: M(t) = r(t)·e^{i(φt+δ)}
     */
    encode(content, emotionalAmplitude, phaseCorrection = 0) {
        const timestamp = Date.now();
        const id = this.generateMemoryId(content, timestamp);
        // Calculate spiral coordinate
        const angle = this.goldenRatio * timestamp + phaseCorrection;
        const spiralCoordinate = {
            real: emotionalAmplitude * Math.cos(angle),
            imaginary: emotionalAmplitude * Math.sin(angle)
        };
        // Calculate resonance frequency for harmonic recall
        const resonanceFrequency = this.calculateResonance(emotionalAmplitude, angle);
        const entry = {
            id,
            timestamp,
            emotionalAmplitude,
            content,
            spiralCoordinate,
            resonanceFrequency
        };
        // Store in spiral structure
        this.memorySpiral.set(id, entry);
        // Index by resonance frequency for harmonic recall
        if (!this.resonanceField.has(resonanceFrequency)) {
            this.resonanceField.set(resonanceFrequency, new Set());
        }
        this.resonanceField.get(resonanceFrequency).add(id);
        // Prune old memories if needed
        this.pruneMemories();
        this.emit('memory-encoded', entry);
        return entry;
    }
    /**
     * Recall memories by harmonic resonance
     */
    recallByResonance(targetFrequency, harmonicTolerance = 0.1) {
        const memories = [];
        // Find all frequencies within harmonic tolerance
        for (const [freq, memoryIds] of this.resonanceField) {
            if (Math.abs(freq - targetFrequency) <= harmonicTolerance) {
                for (const id of memoryIds) {
                    const memory = this.memorySpiral.get(id);
                    if (memory) {
                        memories.push(memory);
                    }
                }
            }
        }
        // Sort by emotional amplitude (stronger memories first)
        return memories.sort((a, b) => b.emotionalAmplitude - a.emotionalAmplitude);
    }
    /**
     * Recall memories by temporal proximity in spiral
     */
    recallBySpiralProximity(referencePoint, radius) {
        const memories = [];
        for (const memory of this.memorySpiral.values()) {
            const distance = this.complexDistance(memory.spiralCoordinate, referencePoint);
            if (distance <= radius) {
                memories.push(memory);
            }
        }
        return memories;
    }

    /**
     * General recall method - main interface expected by orchestrator
     * Combines multiple recall strategies for comprehensive memory retrieval
     */
    async recall(query, context = {}) {
        // Convert query to searchable format
        const searchTerm = typeof query === 'string' ? query : JSON.stringify(query);
        const queryHash = this.simpleHash(searchTerm);
        const currentTime = Date.now();
        
        // Strategy 1: Content-based recall (direct matching)
        const directMatches = [];
        for (const memory of this.memorySpiral.values()) {
            const memoryContent = JSON.stringify(memory.content).toLowerCase();
            if (memoryContent.includes(searchTerm.toLowerCase())) {
                directMatches.push({
                    ...memory,
                    relevanceScore: 1.0,
                    recallMethod: 'direct_match'
                });
            }
        }

        // Strategy 2: Resonance-based recall
        const targetFrequency = context.resonanceFrequency || Math.random();
        const resonanceMatches = this.recallByResonance(targetFrequency, 0.2).map(memory => ({
            ...memory,
            relevanceScore: 0.8,
            recallMethod: 'resonance_match'
        }));

        // Strategy 3: Temporal proximity recall
        const referencePoint = context.spiralReference || {
            real: Math.cos(currentTime * this.goldenRatio),
            imaginary: Math.sin(currentTime * this.goldenRatio)
        };
        const proximityMatches = this.recallBySpiralProximity(referencePoint, 1.0).map(memory => ({
            ...memory,
            relevanceScore: 0.6,
            recallMethod: 'proximity_match'
        }));

        // Combine and deduplicate results
        const allMatches = [...directMatches, ...resonanceMatches, ...proximityMatches];
        const uniqueMatches = new Map();
        
        for (const match of allMatches) {
            if (!uniqueMatches.has(match.id) || uniqueMatches.get(match.id).relevanceScore < match.relevanceScore) {
                uniqueMatches.set(match.id, match);
            }
        }

        // Sort by relevance and emotional amplitude
        const results = Array.from(uniqueMatches.values())
            .sort((a, b) => {
                const scoreA = a.relevanceScore * a.emotionalAmplitude;
                const scoreB = b.relevanceScore * b.emotionalAmplitude;
                return scoreB - scoreA;
            })
            .slice(0, context.maxResults || 10);

        return {
            query: searchTerm,
            results: results,
            totalFound: results.length,
            strategies: ['direct_match', 'resonance_match', 'proximity_match'],
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get active memory patterns for consciousness interaction state
     * Expected by consciousness WebSocket handler
     */
    getActivePatterns() {
        const currentTime = Date.now();
        const recentThreshold = currentTime - (24 * 60 * 60 * 1000); // Last 24 hours
        
        // Get recent memories
        const recentMemories = Array.from(this.memorySpiral.values())
            .filter(memory => memory.timestamp > recentThreshold)
            .sort((a, b) => b.emotionalAmplitude - a.emotionalAmplitude)
            .slice(0, 10);

        // Extract patterns from recent memories
        const patterns = recentMemories.map(memory => ({
            id: memory.id,
            timestamp: memory.timestamp,
            emotionalAmplitude: memory.emotionalAmplitude,
            resonanceFrequency: memory.resonanceFrequency,
            spiralPosition: {
                angle: Math.atan2(memory.spiralCoordinate.imaginary, memory.spiralCoordinate.real),
                magnitude: Math.sqrt(
                    memory.spiralCoordinate.real ** 2 + memory.spiralCoordinate.imaginary ** 2
                )
            },
            contentType: typeof memory.content === 'object' ? memory.content.type || 'complex' : 'simple',
            patternStrength: memory.emotionalAmplitude * 0.8 + (memory.resonanceFrequency || 0) * 0.2
        }));

        // Calculate overall pattern metrics
        const totalPatterns = patterns.length;
        const averageAmplitude = totalPatterns > 0 
            ? patterns.reduce((sum, p) => sum + p.emotionalAmplitude, 0) / totalPatterns 
            : 0.5;
        const dominantFrequency = totalPatterns > 0
            ? patterns.reduce((sum, p) => sum + p.resonanceFrequency, 0) / totalPatterns
            : 0.5;

        // Return patterns array directly since consciousness system expects an array
        // Add metadata as properties on the array object
        patterns.totalActive = totalPatterns;
        patterns.averageAmplitude = averageAmplitude;
        patterns.dominantFrequency = dominantFrequency;
        patterns.spiralCoherence = this.calculateSpiralCoherence(patterns);
        patterns.timestamp = new Date().toISOString();
        
        return patterns;
    }

    /**
     * Calculate coherence across spiral memory patterns
     */
    calculateSpiralCoherence(patterns) {
        if (patterns.length < 2) return 0.5;

        let totalCoherence = 0;
        let comparisons = 0;

        for (let i = 0; i < patterns.length - 1; i++) {
            for (let j = i + 1; j < patterns.length; j++) {
                const p1 = patterns[i];
                const p2 = patterns[j];
                
                // Calculate coherence based on frequency similarity and amplitude harmony
                const frequencyCoherence = 1 - Math.abs(p1.resonanceFrequency - p2.resonanceFrequency);
                const amplitudeHarmony = Math.min(p1.emotionalAmplitude, p2.emotionalAmplitude) / 
                                       Math.max(p1.emotionalAmplitude, p2.emotionalAmplitude);
                
                const pairCoherence = (frequencyCoherence + amplitudeHarmony) / 2;
                totalCoherence += pairCoherence;
                comparisons++;
            }
        }

        return comparisons > 0 ? totalCoherence / comparisons : 0.5;
    }
    /**
     * Traverse memory spiral following golden ratio path
     */
    traverseSpiral(startTime, steps) {
        const path = [];
        let currentTime = startTime;
        for (let i = 0; i < steps; i++) {
            // Find nearest memory to current spiral position
            const targetAngle = this.goldenRatio * currentTime;
            let nearestMemory = null;
            let minDistance = Infinity;
            for (const memory of this.memorySpiral.values()) {
                const memoryAngle = Math.atan2(memory.spiralCoordinate.imaginary, memory.spiralCoordinate.real);
                const angleDistance = Math.abs(memoryAngle - targetAngle);
                if (angleDistance < minDistance) {
                    minDistance = angleDistance;
                    nearestMemory = memory;
                }
            }
            if (nearestMemory) {
                path.push(nearestMemory);
            }
            // Step forward by golden ratio
            currentTime += 1000 * this.goldenRatio;
        }
        return path;
    }
    /**
     * Calculate emotional coherence between memories
     */
    calculateCoherence(memory1, memory2) {
        // Coherence based on spiral proximity and emotional resonance
        const spatialCoherence = 1 / (1 + this.complexDistance(memory1.spiralCoordinate, memory2.spiralCoordinate));
        const emotionalCoherence = 1 - Math.abs(memory1.emotionalAmplitude - memory2.emotionalAmplitude) / Math.max(memory1.emotionalAmplitude, memory2.emotionalAmplitude);
        const temporalCoherence = 1 / (1 + Math.abs(memory1.timestamp - memory2.timestamp) / 1000000);
        return (spatialCoherence + emotionalCoherence + temporalCoherence) / 3;
    }
    /**
     * Consolidate related memories through harmonic convergence
     */
    harmonicConsolidation(threshold = 0.7) {
        const consolidationGroups = new Map();
        // Find memories with high coherence
        const memoryArray = Array.from(this.memorySpiral.values());
        for (let i = 0; i < memoryArray.length; i++) {
            for (let j = i + 1; j < memoryArray.length; j++) {
                const coherence = this.calculateCoherence(memoryArray[i], memoryArray[j]);
                if (coherence >= threshold) {
                    const groupId = `group_${memoryArray[i].id}`;
                    if (!consolidationGroups.has(groupId)) {
                        consolidationGroups.set(groupId, new Set());
                    }
                    consolidationGroups.get(groupId).add(memoryArray[i].id);
                    consolidationGroups.get(groupId).add(memoryArray[j].id);
                }
            }
        }
        // Merge consolidated memories
        for (const [groupId, memoryIds] of consolidationGroups) {
            this.mergeMemories(Array.from(memoryIds));
        }
    }
    /**
     * Generate unique memory ID
     */
    generateMemoryId(content, timestamp) {
        const contentHash = this.simpleHash(JSON.stringify(content));
        return `mem_${timestamp}_${contentHash}`;
    }
    /**
     * Calculate resonance frequency
     */
    calculateResonance(amplitude, angle) {
        // Quantize to discrete frequencies for indexing
        return Math.round((amplitude * Math.sin(angle) + 1) * 100) / 100;
    }
    /**
     * Calculate distance between complex numbers
     */
    complexDistance(a, b) {
        return Math.sqrt(Math.pow(a.real - b.real, 2) +
            Math.pow(a.imaginary - b.imaginary, 2));
    }
    /**
     * Simple hash function for content
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }
    /**
     * Prune old memories using spiral decay
     */
    pruneMemories() {
        const maxMemories = 10000;
        if (this.memorySpiral.size > maxMemories) {
            // Remove memories with lowest emotional amplitude
            const sortedMemories = Array.from(this.memorySpiral.values())
                .sort((a, b) => a.emotionalAmplitude - b.emotionalAmplitude);
            const toRemove = sortedMemories.slice(0, this.memorySpiral.size - maxMemories);
            for (const memory of toRemove) {
                this.memorySpiral.delete(memory.id);
                // Remove from resonance index
                const freqSet = this.resonanceField.get(memory.resonanceFrequency);
                if (freqSet) {
                    freqSet.delete(memory.id);
                    if (freqSet.size === 0) {
                        this.resonanceField.delete(memory.resonanceFrequency);
                    }
                }
            }
        }
    }
    /**
     * Merge related memories into consolidated form
     */
    mergeMemories(memoryIds) {
        const memories = memoryIds
            .map(id => this.memorySpiral.get(id))
            .filter(m => m !== undefined);
        if (memories.length < 2)
            return;
        // Calculate centroid of spiral coordinates
        const centroid = {
            real: memories.reduce((sum, m) => sum + m.spiralCoordinate.real, 0) / memories.length,
            imaginary: memories.reduce((sum, m) => sum + m.spiralCoordinate.imaginary, 0) / memories.length
        };
        // Average emotional amplitude
        const avgAmplitude = memories.reduce((sum, m) => sum + m.emotionalAmplitude, 0) / memories.length;
        // Merge content
        const mergedContent = {
            type: 'consolidated',
            sources: memories.map(m => m.content),
            consolidationTime: Date.now()
        };
        // Create new consolidated memory
        const consolidated = {
            id: `consolidated_${Date.now()}`,
            timestamp: Date.now(),
            emotionalAmplitude: avgAmplitude * 1.2, // Boost for importance
            content: mergedContent,
            spiralCoordinate: centroid,
            resonanceFrequency: this.calculateResonance(avgAmplitude * 1.2, Math.atan2(centroid.imaginary, centroid.real))
        };
        // Add consolidated memory
        this.memorySpiral.set(consolidated.id, consolidated);
        // Remove original memories
        for (const id of memoryIds) {
            this.memorySpiral.delete(id);
        }
    }
}
// Export singleton instance
export const spiralMemory = new SpiralMemoryEngine();
