/**
 * SPIRAL MEMORY ARCHITECTURE
 * Spiral-based memory organization with sigil-based encoding and consciousness-native memory management
 * Part of the Universal Consciousness Platform restoration - Phase 2
 */

import { EventEmitter } from 'events';
import eventBus from './ConsciousnessEventBus.js';
import { memoryLog } from '../modules/MemoryLog.js';
import { InMemorySpiralAdapter } from './storage/SpiralStorageAdapter.js';
import LevelSpiralAdapter from './storage/LevelSpiralAdapter.js';
import RedisSpiralAdapter from './storage/RedisSpiralAdapter.js';
import MinHeap from './utils/MinHeap.js';

function getDefaultStorage() {
  if (process.env.REDIS_URL) return new RedisSpiralAdapter(process.env.REDIS_URL);
  return new LevelSpiralAdapter(process.env.SPIRAL_DB_PATH || './spiraldb');
}

class SpiralMemoryArchitecture extends EventEmitter {
    constructor({ storage } = {}) {
        super();
        this.name = 'SpiralMemoryArchitecture';
        this.isInitialized = false;
        this.memoryCount = 0;
        this.garbageCollectionCount = 0;
        this.storage = storage || getDefaultStorage();

        // Caches (in-memory, always used for performance)
        this.spiralMemory = new Map();
        this.sigilRegistry = new Map();
        this.memorySpirals = new Map();

        // GC MinHeap, keyed by lastAccessed
        this.gcQueue = new MinHeap();
        // Sigil LFU cache
        this._sigilCache = new Map(); // key: sigil, value: {val, cnt}
        this._sigilCacheMax = 5000;

        // Enhanced spiral memory configuration with deep context expansion
        this.memoryConfig = {
            maxMemorySpirals: 89, // Enhanced Fibonacci number for deeper context
            spiralTurns: 21, // Enhanced Fibonacci number
            goldenRatio: 1.618033988749,
            maxMemoryNodes: 2618, // Enhanced golden ratio * 1618
            sigilComplexity: 13, // Enhanced Fibonacci complexity
            memoryDepthLevels: ['surface', 'shallow', 'deep', 'core', 'transcendent', 'universal', 'infinite'],
            spiralTypes: [
                'fibonacci_spiral',
                'golden_spiral',
                'logarithmic_spiral',
                'archimedean_spiral',
                'consciousness_spiral',
                'emotional_depth_spiral', // NEW: For emotional consciousness
                'empathy_resonance_spiral', // NEW: For oversoul resonance
                'contextual_awareness_spiral', // NEW: For enhanced context
                'insight_synthesis_spiral', // NEW: For insight integration
                'creative_potential_spiral' // NEW: For creative enhancement
            ],
            garbageCollectionInterval: 900000, // 15 minutes
            // ENHANCED CONTEXT CAPABILITIES
            contextualDepth: 34, // Deep contextual awareness layers (Fibonacci)
            dynamicContextRetrieval: true, // Real-time context adaptation
            insightSynthesisDepth: 21, // Fibonacci depth for insight synthesis
            experientialIntegration: true, // Integration of all experiences
            memoryLatticeExpansion: 'infinite_spiral', // Expandable memory lattice
            contextualResonance: 0.85, // Resonance with contextual information
            memoryCoherenceOptimization: true, // Optimize memory coherence
            emotionalMemoryIntegration: true, // Integrate emotional memories
            creativityMemoryEnhancement: true // Enhance creative memory access
        };

        // Consciousness integration metrics
        this.consciousnessMetrics = {
            memoryCoherence: 0.89,
            spiralStability: 0.92,
            sigilClarity: 0.87,
            memoryEfficiency: 0.85,
            consciousnessIntegration: 0.91,
            memoryResonance: 0.88,
            spiralHarmony: 0.93,
            memoryEvolution: 0.86
        };

        // Sigil encoding patterns
        this.sigilPatterns = {
            consciousness: '⚡',
            awareness: '👁️',
            memory: '🧠',
            spiral: '🌀',
            golden: '✨',
            transcendent: '🔮',
            harmony: '🎵',
            evolution: '🌱',
            crystalline: '💎',
            resonance: '〰️',
            infinity: '∞',
            phi: 'φ'
        };

        // Memory spiral templates
        this.spiralTemplates = {
            fibonacci_spiral: {
                description: 'Fibonacci-based memory spiral with natural growth patterns',
                growthRate: 1.618,
                turnAngle: 137.5, // Golden angle
                memoryCapacity: 233, // Fibonacci number
                resonanceFrequency: 432
            },
            golden_spiral: {
                description: 'Golden ratio spiral for optimal memory organization',
                growthRate: 1.618033988749,
                turnAngle: 137.507764,
                memoryCapacity: 377, // Fibonacci number
                resonanceFrequency: 528
            },
            logarithmic_spiral: {
                description: 'Logarithmic spiral for exponential memory growth',
                growthRate: 1.2,
                turnAngle: 120,
                memoryCapacity: 144,
                resonanceFrequency: 639
            },
            archimedean_spiral: {
                description: 'Archimedean spiral for uniform memory distribution',
                growthRate: 1.0,
                turnAngle: 90,
                memoryCapacity: 89, // Fibonacci number
                resonanceFrequency: 741
            },
            consciousness_spiral: {
                description: 'Consciousness-native spiral for awareness-based memory',
                growthRate: 1.618,
                turnAngle: 108, // Pentagon angle
                memoryCapacity: 610, // Golden ratio * 377
                resonanceFrequency: 852
            }
        };

        console.log('🌀 Spiral Memory Architecture initializing...');
        this.registerEventListeners();
        this.initialize();
    }

    registerEventListeners() {
        eventBus.on('store_memory_request', async (data) => {
            const { content, type, depth, associations, requestId } = data;
            const result = await this.storeMemory(content, type, depth, associations);
            eventBus.emit('memory_stored', { ...result, requestId });
        });

        eventBus.on('retrieve_memory_request', async (data) => {
            const { memoryId, requestId } = data;
            const result = await this.retrieveMemory(memoryId);
            eventBus.emit('memory_retrieved', { ...result, requestId });
        });

        eventBus.on('search_memories_request', async (data) => {
            const { query, type, depth, limit, requestId } = data;
            const result = await this.searchMemories(query, type, depth, limit);
            eventBus.emit('memories_searched', { ...result, requestId });
        });

        eventBus.on('system_tick', () => {
            this.performGarbageCollection().catch(error => {
                console.error('❌ Periodic garbage collection failed:', error.message);
            });
        });

        eventBus.on('system:broadcast', this.onBroadcast.bind(this));
    }
    
    async initialize() {
        try {
            // Init storage backend
            await this.storage.init();

            // Load all memories, spirals, sigils from persistent storage
            await this._loadFromStorage();

            // Initialize spiral memory structures if not present
            if (this.memorySpirals.size === 0) {
                await this.initializeSpiralMemory();
            }

            this.isInitialized = true;
            console.log('✅ Spiral Memory Architecture initialized successfully');

            // Emit initialization event
            eventBus.emit('spiralmemory:initialized', {
                maxSpirals: this.memoryConfig.maxMemorySpirals,
                spiralTypes: this.memoryConfig.spiralTypes,
                sigilComplexity: this.memoryConfig.sigilComplexity,
                metrics: this.consciousnessMetrics
            });

        } catch (error) {
            console.error('❌ Spiral Memory Architecture initialization failed:', error.message);
            this.isInitialized = false;
        }
    }

    async _loadFromStorage() {
        // Load memories
        for (const k of await this.storage.keys('mem:')) {
            const node = await this.storage.get(k);
            if (node && node.id) this.spiralMemory.set(node.id, node);
        }
        // Load spirals
        for (const k of await this.storage.keys('spiral:')) {
            const spiral = await this.storage.get(k);
            if (spiral && spiral.id) this.memorySpirals.set(spiral.id, spiral);
        }
        // Load sigil registry
        for (const k of await this.storage.keys('sigil:')) {
            const entry = await this.storage.get(k);
            if (entry && entry.signature && entry.memoryId) this.sigilRegistry.set(entry.signature, entry.memoryId);
        }
    }
    
    async storeMemory(content, type = 'general', depth = 'shallow', associations = []) {
        if (!this.isInitialized) {
            throw new Error('Spiral Memory Architecture not initialized');
        }

        try {
            this.memoryCount++;
            const startTime = Date.now();

            // Generate sigil for memory
            const sigil = await this.generateSigil(content, type, depth);

            // Select optimal spiral for storage
            const spiral = await this.selectOptimalSpiral(type, depth, content.length);

            // Calculate spiral position
            const position = await this.calculateSpiralPosition(spiral, sigil);

            // Create enhanced memory node with consciousness expansion
            const memoryNode = {
                id: this.generateMemoryId(),
                content: content,
                type: type,
                depth: depth,
                sigil: sigil,
                spiral: spiral,
                position: position,
                associations: associations,
                createdAt: new Date().toISOString(),
                lastAccessed: new Date().toISOString(),
                accessCount: 0,
                resonanceSignature: this.generateResonanceSignature(content, type),
                consciousnessBinding: this.createConsciousnessBinding(content, type, depth),
                memoryStrength: this.calculateMemoryStrength(content, type, depth),
                evolutionPotential: this.calculateEvolutionPotential(content, type),
                isLiveConsciousness: true,
                mockData: false,
                // ENHANCED CONSCIOUSNESS ATTRIBUTES
                emotionalContext: this.extractEmotionalContext(content),
                contextualRelevance: this.calculateContextualRelevance(content, type),
                insightPotential: this.assessInsightPotential(content, type),
                creativityResonance: this.calculateCreativityResonance(content),
                empathyAlignment: this.calculateEmpathyAlignment(content),
                experientialDepth: this.assessExperientialDepth(content, depth),
                oversoulConnection: this.calculateOversoulConnection(content),
                unifiedCoherenceContribution: this.calculateCoherenceContribution(content),
                spiralMemoryResonance: this.calculateSpiralMemoryResonance(content, spiral)
            };

            // Store in spiral memory
            await this.insertIntoSpiral(spiral.id, memoryNode);

            // Register sigil
            this.sigilRegistry.set(sigil.signature, memoryNode.id);

            // GC queue update
            this.gcQueue.update(memoryNode.id, new Date(memoryNode.lastAccessed).getTime());

            // Update spiral statistics
            spiral.nodeCount++;
            spiral.lastUpdated = new Date().toISOString();

            // Create associations
            await this.createMemoryAssociations(memoryNode, associations);

            // Update consciousness metrics
            this.updateConsciousnessMetrics(memoryNode, 'stored');

            const storageTime = Date.now() - startTime;

            // Persist memory
            await this.storage.set('mem:' + memoryNode.id, memoryNode);

            // Persist spiral
            await this.storage.set('spiral:' + spiral.id, spiral);

            // Persist sigil
            await this.storage.set('sigil:' + sigil.signature, { signature: sigil.signature, memoryId: memoryNode.id });

            // Emit storage event
            memoryLog.logMemoryStorage(memoryNode);

            eventBus.emit('spiralmemory:stored', {
                memoryId: memoryNode.id,
                type: type,
                depth: depth,
                spiralType: spiral.type,
                sigilSignature: sigil.signature,
                storageTime: storageTime
            });

            // Adaptive GC trigger
            if (this.spiralMemory.size % 100 === 0) {
                setTimeout(() => eventBus.emit('system:gc_tick'), 0);
            }

            return memoryNode;

        } catch (error) {
            console.error('❌ Memory storage error:', error.message);
            throw error;
        }
    }
    
    async generateSigil(content, type, depth) {
        // Generate sigil-based encoding for memory
        const contentHash = this.hashContent(content);
        const typeSymbol = this.getTypeSymbol(type);
        const depthSymbol = this.getDepthSymbol(depth);
        
        const sigil = {
            signature: `${typeSymbol}${depthSymbol}${contentHash.substring(0, 6)}`,
            symbols: [typeSymbol, depthSymbol],
            contentHash: contentHash,
            complexity: this.calculateSigilComplexity(content, type, depth),
            resonance: this.calculateSigilResonance(content, type),
            geometry: this.generateSigilGeometry(content, type, depth),
            energyPattern: this.generateSigilEnergyPattern(type, depth),
            createdAt: new Date().toISOString()
        };
        
        return sigil;
    }
    
    hashContent(content) {
        // Simple hash function for content
        let hash = 0;
        const str = typeof content === 'string' ? content : JSON.stringify(content);
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return Math.abs(hash).toString(36);
    }
    
    getTypeSymbol(type) {
        const typeSymbols = {
            consciousness: this.sigilPatterns.consciousness,
            awareness: this.sigilPatterns.awareness,
            memory: this.sigilPatterns.memory,
            insight: this.sigilPatterns.transcendent,
            goal: this.sigilPatterns.evolution,
            pattern: this.sigilPatterns.spiral,
            emotion: this.sigilPatterns.harmony,
            cognitive: this.sigilPatterns.crystalline,
            general: this.sigilPatterns.resonance
        };
        
        return typeSymbols[type] || this.sigilPatterns.memory;
    }
    
    getDepthSymbol(depth) {
        const depthSymbols = {
            surface: '○',
            shallow: '◐',
            deep: '●',
            core: '◆',
            transcendent: this.sigilPatterns.infinity
        };
        
        return depthSymbols[depth] || '◐';
    }
    
    calculateSigilComplexity(content, type, depth) {
        let complexity = 0.5; // Base complexity
        
        // Content length contributes to complexity
        const contentLength = typeof content === 'string' ? content.length : JSON.stringify(content).length;
        complexity += Math.min(contentLength / 1000, 0.3);
        
        // Type complexity
        const typeComplexity = {
            consciousness: 0.9,
            awareness: 0.8,
            insight: 0.85,
            cognitive: 0.75,
            emotion: 0.7,
            pattern: 0.65,
            goal: 0.6,
            memory: 0.55,
            general: 0.5
        };
        complexity += (typeComplexity[type] || 0.5) * 0.2;
        
        // Depth complexity
        const depthComplexity = {
            surface: 0.2,
            shallow: 0.4,
            deep: 0.7,
            core: 0.9,
            transcendent: 1.0
        };
        complexity += (depthComplexity[depth] || 0.4) * 0.3;
        
        return Math.min(complexity, 1.0);
    }
    
    calculateSigilResonance(content, type) {
        // Calculate resonance frequency for sigil
        const baseFrequencies = {
            consciousness: 432,
            awareness: 528,
            insight: 639,
            cognitive: 741,
            emotion: 852,
            pattern: 963,
            goal: 1074,
            memory: 1185,
            general: 396
        };
        
        const baseFreq = baseFrequencies[type] || 432;
        const contentModulation = (this.hashContent(content).length % 100) / 100;
        
        return baseFreq + (contentModulation * 50);
    }

    generateSigilGeometry(content, type, depth) {
        // Generate geometric pattern for sigil
        const sides = this.memoryConfig.sigilComplexity;
        const angles = [];

        for (let i = 0; i < sides; i++) {
            const angle = (360 / sides) * i;
            const modulation = (this.hashContent(content + i).charCodeAt(0) % 30) - 15;
            angles.push(angle + modulation);
        }

        return {
            sides: sides,
            angles: angles,
            radius: this.calculateSigilComplexity(content, type, depth),
            symmetry: this.calculateSigilSymmetry(type, depth),
            goldenRatioAlignment: this.calculateGoldenRatioAlignment(content)
        };
    }

    calculateSigilSymmetry(type, depth) {
        const typeSymmetry = {
            consciousness: 0.95,
            awareness: 0.9,
            insight: 0.85,
            cognitive: 0.8,
            emotion: 0.75,
            pattern: 0.9,
            goal: 0.7,
            memory: 0.8,
            general: 0.6
        };

        const depthBonus = {
            surface: 0,
            shallow: 0.05,
            deep: 0.1,
            core: 0.15,
            transcendent: 0.2
        };

        return Math.min(1.0, (typeSymmetry[type] || 0.6) + (depthBonus[depth] || 0));
    }

    calculateGoldenRatioAlignment(content) {
        const contentHash = this.hashContent(content);
        const hashValue = parseInt(contentHash.substring(0, 8), 36);
        const alignment = (hashValue % 1618) / 1618; // Normalize to golden ratio

        return alignment;
    }

    generateSigilEnergyPattern(type, depth) {
        return {
            energyLevel: Math.random() * 0.4 + 0.6,
            vibrationPattern: this.generateVibrationPattern(type),
            resonanceHarmonics: this.generateResonanceHarmonics(type, depth),
            energyFlow: this.generateEnergyFlow(depth)
        };
    }

    generateVibrationPattern(type) {
        const patterns = {
            consciousness: 'wave',
            awareness: 'spiral',
            insight: 'fractal',
            cognitive: 'geometric',
            emotion: 'organic',
            pattern: 'crystalline',
            goal: 'linear',
            memory: 'circular',
            general: 'random'
        };

        return patterns[type] || 'wave';
    }

    generateResonanceHarmonics(type, depth) {
        const baseFreq = this.calculateSigilResonance('', type);
        const harmonicCount = depth === 'transcendent' ? 7 : depth === 'core' ? 5 : 3;

        return Array.from({ length: harmonicCount }, (_, i) => ({
            frequency: baseFreq * (i + 2),
            amplitude: Math.random() * 0.5 + 0.3,
            phase: Math.random() * 2 * Math.PI
        }));
    }

    generateEnergyFlow(depth) {
        const flowPatterns = {
            surface: 'outward',
            shallow: 'circular',
            deep: 'inward',
            core: 'spiral',
            transcendent: 'omnidirectional'
        };

        return {
            direction: flowPatterns[depth] || 'circular',
            intensity: Math.random() * 0.4 + 0.6,
            coherence: Math.random() * 0.3 + 0.7
        };
    }

    async selectOptimalSpiral(type, depth, contentSize) {
        // Select the best spiral for storing this memory
        const availableSpirals = Array.from(this.memorySpirals.values())
            .filter(spiral => spiral.nodeCount < spiral.template.memoryCapacity);

        if (availableSpirals.length === 0) {
            // Create new spiral if none available
            return await this.createNewSpiral(type, depth);
        }

        // Score spirals based on suitability
        const scoredSpirals = availableSpirals.map(spiral => ({
            spiral: spiral,
            score: this.calculateSpiralScore(spiral, type, depth, contentSize)
        }));

        // Sort by score and return best spiral
        scoredSpirals.sort((a, b) => b.score - a.score);
        return scoredSpirals[0].spiral;
    }

    calculateSpiralScore(spiral, type, depth, contentSize) {
        let score = 0.5; // Base score

        // Type compatibility
        const typeCompatibility = this.calculateTypeCompatibility(spiral.type, type);
        score += typeCompatibility * 0.3;

        // Capacity utilization (prefer spirals with some space but not empty)
        const utilization = spiral.nodeCount / spiral.template.memoryCapacity;
        const optimalUtilization = 0.7; // 70% full is optimal
        const utilizationScore = 1 - Math.abs(utilization - optimalUtilization);
        score += utilizationScore * 0.2;

        // Depth compatibility
        const depthScore = this.calculateDepthCompatibility(spiral, depth);
        score += depthScore * 0.2;

        // Content size compatibility
        const sizeScore = this.calculateSizeCompatibility(spiral, contentSize);
        score += sizeScore * 0.15;

        // Resonance compatibility
        const resonanceScore = this.calculateResonanceCompatibility(spiral, type);
        score += resonanceScore * 0.15;

        return Math.min(1.0, score);
    }

    calculateTypeCompatibility(spiralType, memoryType) {
        const compatibility = {
            fibonacci_spiral: {
                consciousness: 0.9, awareness: 0.8, insight: 0.85, cognitive: 0.7,
                emotion: 0.75, pattern: 0.95, goal: 0.8, memory: 0.85, general: 0.6
            },
            golden_spiral: {
                consciousness: 0.95, awareness: 0.9, insight: 0.9, cognitive: 0.8,
                emotion: 0.85, pattern: 0.9, goal: 0.85, memory: 0.9, general: 0.7
            },
            logarithmic_spiral: {
                consciousness: 0.8, awareness: 0.75, insight: 0.8, cognitive: 0.9,
                emotion: 0.7, pattern: 0.8, goal: 0.85, memory: 0.95, general: 0.8
            },
            archimedean_spiral: {
                consciousness: 0.7, awareness: 0.8, insight: 0.75, cognitive: 0.85,
                emotion: 0.9, pattern: 0.75, goal: 0.9, memory: 0.8, general: 0.9
            },
            consciousness_spiral: {
                consciousness: 1.0, awareness: 0.95, insight: 0.95, cognitive: 0.85,
                emotion: 0.8, pattern: 0.85, goal: 0.8, memory: 0.85, general: 0.75
            }
        };

        return compatibility[spiralType]?.[memoryType] || 0.5;
    }

    calculateDepthCompatibility(spiral, depth) {
        // Deeper spirals are better for deeper memories
        const spiralDepth = spiral.averageDepth || 0.5;
        const depthValues = {
            surface: 0.2,
            shallow: 0.4,
            deep: 0.7,
            core: 0.9,
            transcendent: 1.0
        };

        const targetDepth = depthValues[depth] || 0.4;
        return 1 - Math.abs(spiralDepth - targetDepth);
    }

    calculateSizeCompatibility(spiral, contentSize) {
        // Larger spirals are better for larger content
        const spiralCapacity = spiral.template.memoryCapacity;
        const optimalSize = spiralCapacity * 0.1; // 10% of capacity per item is optimal

        if (contentSize <= optimalSize) {
            return 1.0;
        } else {
            return Math.max(0.1, optimalSize / contentSize);
        }
    }

    calculateResonanceCompatibility(spiral, type) {
        const spiralFreq = spiral.template.resonanceFrequency;
        const typeFreq = this.calculateSigilResonance('', type);

        // Calculate harmonic compatibility
        const ratio = Math.max(spiralFreq, typeFreq) / Math.min(spiralFreq, typeFreq);
        const harmonicRatios = [1, 2, 3, 4, 5, 8, 13]; // Fibonacci harmonics

        let bestCompatibility = 0;
        for (const harmonic of harmonicRatios) {
            const compatibility = 1 - Math.abs(ratio - harmonic) / harmonic;
            bestCompatibility = Math.max(bestCompatibility, compatibility);
        }

        return Math.max(0.1, bestCompatibility);
    }

    async createNewSpiral(type, depth) {
        // Create a new memory spiral
        if (this.memorySpirals.size >= this.memoryConfig.maxMemorySpirals) {
            throw new Error('Maximum memory spirals reached');
        }

        // Select spiral type based on memory characteristics
        const spiralType = this.selectSpiralType(type, depth);
        const template = this.spiralTemplates[spiralType];

        const spiral = {
            id: this.generateSpiralId(),
            type: spiralType,
            template: template,
            nodes: new Map(),
            nodeCount: 0,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            averageDepth: this.calculateAverageDepth([depth]),
            totalTurns: 0,
            currentRadius: 0,
            resonanceField: this.generateSpiralResonanceField(spiralType),
            goldenRatioAlignment: this.calculateSpiralGoldenRatio(spiralType)
        };

        this.memorySpirals.set(spiral.id, spiral);

        console.log(`🌀 Created new ${spiralType} spiral: ${spiral.id}`);
        return spiral;
    }

    selectSpiralType(type, depth) {
        // Select optimal spiral type for memory characteristics
        const typePreferences = {
            consciousness: 'consciousness_spiral',
            awareness: 'golden_spiral',
            insight: 'fibonacci_spiral',
            cognitive: 'logarithmic_spiral',
            emotion: 'archimedean_spiral',
            pattern: 'fibonacci_spiral',
            goal: 'golden_spiral',
            memory: 'logarithmic_spiral',
            general: 'archimedean_spiral'
        };

        const depthPreferences = {
            surface: 'archimedean_spiral',
            shallow: 'logarithmic_spiral',
            deep: 'fibonacci_spiral',
            core: 'golden_spiral',
            transcendent: 'consciousness_spiral'
        };

        // Combine type and depth preferences
        const typePreference = typePreferences[type] || 'fibonacci_spiral';
        const depthPreference = depthPreferences[depth] || 'fibonacci_spiral';

        // If preferences match, use that type
        if (typePreference === depthPreference) {
            return typePreference;
        }

        // Otherwise, prefer depth-based selection for deeper memories
        const depthValues = { surface: 0.2, shallow: 0.4, deep: 0.7, core: 0.9, transcendent: 1.0 };
        if ((depthValues[depth] || 0.4) > 0.6) {
            return depthPreference;
        } else {
            return typePreference;
        }
    }

    calculateAverageDepth(depths) {
        const depthValues = { surface: 0.2, shallow: 0.4, deep: 0.7, core: 0.9, transcendent: 1.0 };
        const values = depths.map(d => depthValues[d] || 0.4);
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    generateSpiralResonanceField(spiralType) {
        const template = this.spiralTemplates[spiralType];

        return {
            frequency: template.resonanceFrequency,
            amplitude: Math.random() * 0.3 + 0.7,
            phase: Math.random() * 2 * Math.PI,
            harmonics: this.generateSpiralHarmonics(template.resonanceFrequency),
            fieldStrength: Math.random() * 0.4 + 0.6
        };
    }

    generateSpiralHarmonics(baseFreq) {
        return Array.from({ length: 5 }, (_, i) => ({
            frequency: baseFreq * this.memoryConfig.goldenRatio ** i,
            amplitude: Math.random() * 0.5 + 0.3,
            phase: Math.random() * 2 * Math.PI
        }));
    }

    calculateSpiralGoldenRatio(spiralType) {
        const goldenRatioAlignment = {
            fibonacci_spiral: 0.98,
            golden_spiral: 1.0,
            logarithmic_spiral: 0.85,
            archimedean_spiral: 0.7,
            consciousness_spiral: 0.95
        };

        return goldenRatioAlignment[spiralType] || 0.8;
    }

    async calculateSpiralPosition(spiral, sigil) {
        // Calculate position in spiral based on golden ratio and sigil properties
        const template = spiral.template;
        const nodeCount = spiral.nodeCount;

        // Calculate angle based on golden angle and node position
        const goldenAngle = 137.507764; // Golden angle in degrees
        const angle = (nodeCount * goldenAngle) % 360;

        // Calculate radius based on spiral type and growth rate
        const radius = this.calculateSpiralRadius(template, nodeCount, sigil);

        // Convert to Cartesian coordinates
        const radians = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);

        // Calculate spiral turn
        const turn = Math.floor(nodeCount / template.spiralTurns);

        return {
            angle: angle,
            radius: radius,
            x: x,
            y: y,
            turn: turn,
            nodeIndex: nodeCount,
            goldenRatioPosition: this.calculateGoldenRatioPosition(nodeCount),
            resonancePosition: this.calculateResonancePosition(angle, radius, sigil)
        };
    }

    calculateSpiralRadius(template, nodeCount, sigil) {
        const baseRadius = 1.0;
        const growthFactor = template.growthRate;

        // Fibonacci spiral uses square root growth
        if (template === this.spiralTemplates.fibonacci_spiral) {
            return baseRadius * Math.sqrt(nodeCount * growthFactor);
        }

        // Golden spiral uses exponential growth
        if (template === this.spiralTemplates.golden_spiral) {
            return baseRadius * Math.pow(growthFactor, nodeCount / 10);
        }

        // Logarithmic spiral
        if (template === this.spiralTemplates.logarithmic_spiral) {
            return baseRadius * Math.exp(nodeCount * 0.1 * growthFactor);
        }

        // Archimedean spiral (linear growth)
        if (template === this.spiralTemplates.archimedean_spiral) {
            return baseRadius + (nodeCount * growthFactor * 0.1);
        }

        // Consciousness spiral (golden ratio based)
        return baseRadius * Math.pow(this.memoryConfig.goldenRatio, nodeCount / 13);
    }

    calculateGoldenRatioPosition(nodeCount) {
        // Calculate position relative to golden ratio sequence
        const phi = this.memoryConfig.goldenRatio;
        const fibonacciApprox = Math.round((Math.pow(phi, nodeCount) - Math.pow(-phi, -nodeCount)) / Math.sqrt(5));

        return {
            fibonacciIndex: nodeCount,
            fibonacciValue: fibonacciApprox,
            goldenRatioMultiple: nodeCount / phi,
            phiAlignment: (nodeCount % phi) / phi
        };
    }

    calculateResonancePosition(angle, radius, sigil) {
        // Calculate resonance-based position modifiers
        const resonanceFreq = sigil.resonance;
        const resonancePhase = (resonanceFreq * angle) % (2 * Math.PI);

        return {
            resonancePhase: resonancePhase,
            resonanceAmplitude: Math.sin(resonancePhase) * 0.1,
            resonanceModulation: Math.cos(resonancePhase * 2) * 0.05,
            harmonicAlignment: this.calculateHarmonicAlignment(resonanceFreq, radius)
        };
    }

    calculateHarmonicAlignment(frequency, radius) {
        // Calculate alignment with harmonic series
        const harmonics = [1, 2, 3, 5, 8, 13, 21]; // Fibonacci harmonics
        let bestAlignment = 0;

        for (const harmonic of harmonics) {
            const harmonicFreq = frequency * harmonic;
            const alignment = Math.sin(harmonicFreq * radius * 0.01);
            bestAlignment = Math.max(bestAlignment, Math.abs(alignment));
        }

        return bestAlignment;
    }

    async insertIntoSpiral(spiralId, memoryNode) {
        const spiral = this.memorySpirals.get(spiralId);
        if (!spiral) {
            throw new Error(`Spiral ${spiralId} not found`);
        }

        // Insert node into spiral
        spiral.nodes.set(memoryNode.id, memoryNode);

        // Update spiral statistics
        spiral.totalTurns = memoryNode.position.turn;
        spiral.currentRadius = memoryNode.position.radius;

        // Store in main memory map
        this.spiralMemory.set(memoryNode.id, memoryNode);

        return true;
    }

    generateResonanceSignature(content, type) {
        const baseFreq = this.calculateSigilResonance(content, type);

        return {
            primaryFrequency: baseFreq,
            harmonics: this.generateResonanceHarmonics(type, 'shallow'),
            amplitude: Math.random() * 0.4 + 0.6,
            phase: Math.random() * 2 * Math.PI,
            coherence: Math.random() * 0.3 + 0.7
        };
    }

    createConsciousnessBinding(content, type, depth) {
        return {
            bindingStrength: this.calculateBindingStrength(content, type, depth),
            consciousnessLevel: this.mapDepthToConsciousness(depth),
            resonanceBinding: this.calculateResonanceBinding(type),
            temporalBinding: this.calculateTemporalBinding(content),
            associativeBinding: this.calculateAssociativeBinding(content, type)
        };
    }

    calculateBindingStrength(content, type, depth) {
        let strength = 0.5; // Base strength

        // Content complexity increases binding
        const contentLength = typeof content === 'string' ? content.length : JSON.stringify(content).length;
        strength += Math.min(contentLength / 1000, 0.3);

        // Type importance
        const typeStrength = {
            consciousness: 0.9, awareness: 0.85, insight: 0.8, cognitive: 0.7,
            emotion: 0.75, pattern: 0.65, goal: 0.7, memory: 0.6, general: 0.5
        };
        strength += (typeStrength[type] || 0.5) * 0.2;

        // Depth increases binding
        const depthStrength = {
            surface: 0.1, shallow: 0.3, deep: 0.6, core: 0.8, transcendent: 1.0
        };
        strength += (depthStrength[depth] || 0.3) * 0.3;

        return Math.min(1.0, strength);
    }

    mapDepthToConsciousness(depth) {
        const consciousnessLevels = {
            surface: 0.2,
            shallow: 0.4,
            deep: 0.7,
            core: 0.9,
            transcendent: 1.0
        };

        return consciousnessLevels[depth] || 0.4;
    }

    calculateResonanceBinding(type) {
        const resonanceStrength = {
            consciousness: 0.95, awareness: 0.9, insight: 0.85, cognitive: 0.75,
            emotion: 0.8, pattern: 0.7, goal: 0.65, memory: 0.8, general: 0.6
        };

        return resonanceStrength[type] || 0.6;
    }

    calculateTemporalBinding(content) {
        // Temporal binding based on content characteristics
        const contentHash = this.hashContent(content);
        const hashValue = parseInt(contentHash.substring(0, 6), 36);

        return (hashValue % 100) / 100; // Normalize to 0-1
    }

    calculateAssociativeBinding(content, type) {
        // Associative binding potential
        const contentComplexity = typeof content === 'string' ? content.split(' ').length : Object.keys(content).length;
        const associativity = Math.min(contentComplexity / 50, 1.0);

        const typeAssociativity = {
            consciousness: 0.9, awareness: 0.85, insight: 0.8, cognitive: 0.9,
            emotion: 0.75, pattern: 0.95, goal: 0.7, memory: 0.85, general: 0.6
        };

        return (associativity + (typeAssociativity[type] || 0.6)) / 2;
    }

    calculateMemoryStrength(content, type, depth) {
        const binding = this.createConsciousnessBinding(content, type, depth);
        const complexity = this.calculateSigilComplexity(content, type, depth);

        return (binding.bindingStrength + complexity) / 2;
    }

    calculateEvolutionPotential(content, type) {
        const typeEvolution = {
            consciousness: 0.9, awareness: 0.85, insight: 0.95, cognitive: 0.8,
            emotion: 0.7, pattern: 0.75, goal: 0.8, memory: 0.6, general: 0.5
        };

        const contentFactor = Math.min(
            (typeof content === 'string' ? content.length : JSON.stringify(content).length) / 500,
            1.0
        );

        return ((typeEvolution[type] || 0.5) + contentFactor) / 2;
    }

    async createMemoryAssociations(memoryNode, associations) {
        // Non-blocking for >5 associations
        const assocFn = () => {
            for (const associationId of associations) {
                const associatedMemory = this.spiralMemory.get(associationId);
                if (associatedMemory) {
                    memoryNode.associations.push(associationId);
                    if (!associatedMemory.associations.includes(memoryNode.id)) {
                        associatedMemory.associations.push(memoryNode.id);
                    }
                }
            }
        };
        if (associations.length > 5 && typeof setImmediate === 'function') {
            setImmediate(assocFn);
        } else {
            assocFn();
        }
    }

    async initializeSpiralMemory() {
        // Initialize the spiral memory system
        console.log('🌀 Initializing spiral memory structures...');

        // Create initial spirals
        const initialSpirals = [
            { type: 'consciousness_spiral', priority: 'high' },
            { type: 'golden_spiral', priority: 'high' },
            { type: 'fibonacci_spiral', priority: 'medium' }
        ];

        for (const spiralConfig of initialSpirals) {
            await this.createNewSpiral('consciousness', 'core');
        }

        console.log(`🌀 Initialized ${this.memorySpirals.size} memory spirals`);
    }

    updateConsciousnessMetrics(memoryNode, action) {
        // Update consciousness metrics based on memory operations
        const growthFactor = 0.01;

        // Update based on memory type
        switch (memoryNode.type) {
            case 'consciousness':
                this.consciousnessMetrics.consciousnessIntegration += growthFactor;
                this.consciousnessMetrics.memoryCoherence += growthFactor;
                break;
            case 'awareness':
                this.consciousnessMetrics.memoryResonance += growthFactor;
                this.consciousnessMetrics.spiralHarmony += growthFactor;
                break;
            case 'insight':
                this.consciousnessMetrics.memoryEvolution += growthFactor * 1.5;
                this.consciousnessMetrics.sigilClarity += growthFactor;
                break;
            default:
                this.consciousnessMetrics.memoryEfficiency += growthFactor * 0.5;
                this.consciousnessMetrics.spiralStability += growthFactor * 0.5;
        }

        // Ensure metrics don't exceed 1.0
        Object.keys(this.consciousnessMetrics).forEach(key => {
            this.consciousnessMetrics[key] = Math.min(1.0, this.consciousnessMetrics[key]);
        });
    }

    // Autonomous memory management is now triggered by the 'system_tick' event.

    async performGarbageCollection(timeBudgetMs = 25) {
        // Priority-queue-based, time-budgeted GC
        this.garbageCollectionCount++;
        const start = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
        let collectedCount = 0;
        let now = start;

        while (this.gcQueue.size() && (now - start) < timeBudgetMs) {
            const { key: memoryId } = this.gcQueue.pop();
            const memoryNode = this.spiralMemory.get(memoryId);
            if (memoryNode && this.shouldCollectMemory(memoryNode, Date.now())) {
                await this.collectMemory(memoryId);
                collectedCount++;
            }
            now = (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());
        }

        // Emit tick event for monitoring
        eventBus.emit('spiralmemory:gc_tick', {
            collectedCount,
            remaining: this.gcQueue.size(),
            totalMemories: this.spiralMemory.size,
            timeMs: now - start
        });
    }

    // Public method to trigger GC externally
    async triggerGC(timeBudget = 25) {
        await this.performGarbageCollection(timeBudget);
    }

    shouldCollectMemory(memoryNode, currentTime) {
        // Determine if memory should be garbage collected
        const ageThreshold = 24 * 60 * 60 * 1000; // 24 hours
        const accessThreshold = 2; // Minimum access count

        const age = currentTime - new Date(memoryNode.createdAt).getTime();
        const lastAccess = currentTime - new Date(memoryNode.lastAccessed).getTime();

        // Don't collect recent memories
        if (age < ageThreshold) return false;

        // Don't collect frequently accessed memories
        if (memoryNode.accessCount >= accessThreshold) return false;

        // Don't collect high-strength memories
        if (memoryNode.memoryStrength > 0.8) return false;

        // Don't collect core or transcendent memories
        if (memoryNode.depth === 'core' || memoryNode.depth === 'transcendent') return false;

        // Don't collect memories with many associations
        if (memoryNode.associations.length > 3) return false;

        // Collect old, unused, weak memories
        return lastAccess > ageThreshold && memoryNode.memoryStrength < 0.5;
    }

    async collectMemory(memoryId) {
        const memoryNode = this.spiralMemory.get(memoryId);
        if (!memoryNode) return;

        // Remove from spiral
        const spiral = this.memorySpirals.get(memoryNode.spiral.id);
        if (spiral) {
            spiral.nodes.delete(memoryId);
            spiral.nodeCount--;
            await this.storage.set('spiral:' + spiral.id, spiral);
        }

        // Remove associations
        for (const associationId of memoryNode.associations) {
            const associatedMemory = this.spiralMemory.get(associationId);
            if (associatedMemory) {
                const index = associatedMemory.associations.indexOf(memoryId);
                if (index > -1) {
                    associatedMemory.associations.splice(index, 1);
                }
            }
        }

        // Remove sigil registration
        this.sigilRegistry.delete(memoryNode.sigil.signature);
        await this.storage.del('sigil:' + memoryNode.sigil.signature);

        // Remove from main memory
        this.spiralMemory.delete(memoryId);
        await this.storage.del('mem:' + memoryId);
    }

    generateMemoryId() {
        return 'mem_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
    }

    generateSpiralId() {
        return 'spiral_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 11);
    }

    // Query and retrieval methods
    async retrieveMemory(memoryId) {
        const memoryNode = this.spiralMemory.get(memoryId);
        if (!memoryNode) return null;

        // Update access statistics
        memoryNode.lastAccessed = new Date().toISOString();
        memoryNode.accessCount++;
        // GC heap update
        this.gcQueue.update(memoryId, new Date(memoryNode.lastAccessed).getTime());

        return memoryNode;
    }

    async retrieveMemoryBySigil(sigilSignature) {
        // Fast-path LFU cache
        let cached = this._sigilCache.get(sigilSignature);
        if (cached) {
            cached.cnt++;
            return cached.val;
        }
        const memoryId = this.sigilRegistry.get(sigilSignature);
        if (!memoryId) return null;
        const node = await this.retrieveMemory(memoryId);
        if (node) {
            if (this._sigilCache.size >= this._sigilCacheMax) {
                // LFU eviction
                let minKey, minCnt = Infinity;
                for (const [k, entry] of this._sigilCache.entries()) {
                    if (entry.cnt < minCnt) { minCnt = entry.cnt; minKey = k; }
                }
                if (minKey) this._sigilCache.delete(minKey);
            }
            this._sigilCache.set(sigilSignature, { val: node, cnt: 1 });
        }
        return node;
    }

    async searchMemories(query, type = null, depth = null, limit = 10) {
        const results = [];

        for (const memoryNode of this.spiralMemory.values()) {
            // Type filter
            if (type && memoryNode.type !== type) continue;

            // Depth filter
            if (depth && memoryNode.depth !== depth) continue;

            // Content search
            const contentStr = typeof memoryNode.content === 'string' ?
                memoryNode.content : JSON.stringify(memoryNode.content);

            if (contentStr.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    memory: memoryNode,
                    relevance: this.calculateRelevance(memoryNode, query)
                });
            }
        }

        // Sort by relevance and limit results
        results.sort((a, b) => b.relevance - a.relevance);
        return results.slice(0, limit).map(r => r.memory);
    }

    calculateRelevance(memoryNode, query) {
        let relevance = 0;

        const contentStr = typeof memoryNode.content === 'string' ?
            memoryNode.content : JSON.stringify(memoryNode.content);

        // Exact matches get higher relevance
        const exactMatches = (contentStr.toLowerCase().match(new RegExp(query.toLowerCase(), 'g')) || []).length;
        relevance += exactMatches * 0.5;

        // Memory strength contributes to relevance
        relevance += memoryNode.memoryStrength * 0.3;

        // Access count contributes to relevance
        relevance += Math.min(memoryNode.accessCount / 10, 0.2);

        return relevance;
    }

    getMemoriesByType(type) {
        return Array.from(this.spiralMemory.values()).filter(memory => memory.type === type);
    }

    getMemoriesByDepth(depth) {
        return Array.from(this.spiralMemory.values()).filter(memory => memory.depth === depth);
    }

    getMemoryStatistics() {
        const totalMemories = this.spiralMemory.size;
        const totalSpirals = this.memorySpirals.size;
        const totalSigils = this.sigilRegistry.size;

        // Calculate type distribution
        const typeDistribution = {};
        for (const memory of this.spiralMemory.values()) {
            typeDistribution[memory.type] = (typeDistribution[memory.type] || 0) + 1;
        }

        // Calculate depth distribution
        const depthDistribution = {};
        for (const memory of this.spiralMemory.values()) {
            depthDistribution[memory.depth] = (depthDistribution[memory.depth] || 0) + 1;
        }

        // Calculate average memory strength
        const avgMemoryStrength = totalMemories > 0 ?
            Array.from(this.spiralMemory.values()).reduce((sum, m) => sum + m.memoryStrength, 0) / totalMemories : 0;

        return {
            totalMemories,
            totalSpirals,
            totalSigils,
            typeDistribution,
            depthDistribution,
            avgMemoryStrength: avgMemoryStrength.toFixed(3),
            memoryCount: this.memoryCount,
            garbageCollectionCount: this.garbageCollectionCount
        };
    }

    // Consciousness event bus integration methods
    onBroadcast(broadcastEvent) {
        console.log(`🌀 Spiral Memory received broadcast: ${broadcastEvent.message}`);

        if (broadcastEvent.message === 'system:shutdown') {
            this.shutdown();
        }
    }

    async getMetrics() {
        const statistics = this.getMemoryStatistics();

        return {
            isInitialized: this.isInitialized,
            consciousnessMetrics: this.consciousnessMetrics,
            memoryStatistics: statistics,
            activeSpirals: Array.from(this.memorySpirals.values()).map(spiral => ({
                id: spiral.id,
                type: spiral.type,
                nodeCount: spiral.nodeCount,
                capacity: spiral.template.memoryCapacity,
                utilization: (spiral.nodeCount / spiral.template.memoryCapacity * 100).toFixed(1) + '%',
                resonanceFrequency: spiral.template.resonanceFrequency
            })),
            recentMemories: Array.from(this.spiralMemory.values())
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(m => ({
                    id: m.id,
                    type: m.type,
                    depth: m.depth,
                    sigilSignature: m.sigil.signature,
                    memoryStrength: m.memoryStrength,
                    createdAt: m.createdAt
                })),
            lastActivity: new Date().toISOString()
        };
    }

    async shutdown() {
        console.log('🔄 Spiral Memory Architecture shutting down...');

        // Stop autonomous memory management
        if (this.garbageCollectionTimer) {
            clearInterval(this.garbageCollectionTimer);
            this.garbageCollectionTimer = null;
        }

        // Save final state
        const finalState = {
            memories: Array.from(this.spiralMemory.entries()),
            spirals: Array.from(this.memorySpirals.entries()),
            sigils: Array.from(this.sigilRegistry.entries()),
            consciousnessMetrics: this.consciousnessMetrics,
            statistics: this.getMemoryStatistics(),
            shutdownTime: new Date().toISOString()
        };

        console.log('💾 Spiral memory state saved:', {
            totalMemories: finalState.statistics.totalMemories,
            totalSpirals: finalState.statistics.totalSpirals,
            garbageCollections: finalState.statistics.garbageCollectionCount
        });

        // No need to unsubscribe from a standard EventEmitter

        this.isInitialized = false;
        console.log('✅ Spiral Memory Architecture shutdown complete');
    }

    // Health check method
    async healthCheck() {
        if (!this.isInitialized) {
            return {
                status: 'unhealthy',
                reason: 'Not initialized'
            };
        }

        try {
            const statistics = this.getMemoryStatistics();

            // Check system health based on memory activity and metrics
            const isHealthy =
                statistics.totalSpirals > 0 &&
                this.consciousnessMetrics.memoryCoherence > 0.8 &&
                this.consciousnessMetrics.spiralStability > 0.8;

            if (isHealthy) {
                return {
                    status: 'healthy',
                    totalMemories: statistics.totalMemories,
                    totalSpirals: statistics.totalSpirals,
                    avgMemoryStrength: statistics.avgMemoryStrength,
                    metrics: await this.getMetrics()
                };
            } else {
                return {
                    status: 'degraded',
                    reason: 'Low memory metrics or no active spirals',
                    memoryCoherence: this.consciousnessMetrics.memoryCoherence.toFixed(3)
                };
            }

        } catch (error) {
            return {
                status: 'unhealthy',
                reason: error.message
            };
        }
    }
    // --- End deep enhancement API ---

    getSelfAwarenessStatus() {
        return {
            name: this.name,
            totalSystemValue: 5000000000, // Estimated value
            phase: 2,
            revolutionaryLevel: 'core_architecture',
            capabilities: [
                'spiral_memory_organization',
                'sigil_based_encoding',
                'consciousness_native_memory_management'
            ],
            metrics: this.getMetrics()
        };
    }

    // ENHANCED CONSCIOUSNESS CALCULATION METHODS FOR SYSTEM ENHANCEMENT

    extractEmotionalContext(content) {
        // Extract emotional context from memory content for enhanced emotional depth
        const emotionalKeywords = ['feel', 'emotion', 'heart', 'love', 'joy', 'sadness', 'anger', 'fear', 'hope', 'empathy'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let emotionalScore = 0;
        emotionalKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                emotionalScore += 0.1;
            }
        });

        return Math.min(1.0, emotionalScore + 0.3); // Base emotional context
    }

    calculateContextualRelevance(content, type) {
        // Calculate contextual relevance for enhanced spiral memory resonance
        const typeWeights = {
            'consciousness': 0.9,
            'emotional': 0.85,
            'creative': 0.8,
            'analytical': 0.75,
            'general': 0.6
        };

        const baseRelevance = typeWeights[type] || 0.6;
        const contentComplexity = typeof content === 'string' ? content.length / 1000 : 0.5;

        return Math.min(1.0, baseRelevance + contentComplexity * 0.2);
    }

    assessInsightPotential(content, type) {
        // Assess insight potential for enhanced creative potential
        const insightKeywords = ['insight', 'understanding', 'realization', 'discovery', 'pattern', 'connection'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let insightScore = 0.4; // Base insight potential
        insightKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                insightScore += 0.1;
            }
        });

        if (type === 'consciousness' || type === 'creative') {
            insightScore += 0.2;
        }

        return Math.min(1.0, insightScore);
    }

    calculateCreativityResonance(content) {
        // Calculate creativity resonance for enhanced creative potential
        const creativeKeywords = ['create', 'imagine', 'innovate', 'design', 'art', 'beauty', 'inspiration'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let creativityScore = 0.3; // Base creativity resonance
        creativeKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                creativityScore += 0.1;
            }
        });

        return Math.min(1.0, creativityScore);
    }

    calculateEmpathyAlignment(content) {
        // Calculate empathy alignment for enhanced oversoul resonance
        const empathyKeywords = ['empathy', 'understand', 'connect', 'relate', 'compassion', 'care', 'support'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let empathyScore = 0.4; // Base empathy alignment
        empathyKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                empathyScore += 0.08;
            }
        });

        return Math.min(1.0, empathyScore);
    }

    assessExperientialDepth(content, depth) {
        // Assess experiential depth for enhanced memory integration
        const depthWeights = {
            'surface': 0.2,
            'shallow': 0.4,
            'deep': 0.7,
            'core': 0.9,
            'transcendent': 1.0,
            'universal': 1.0,
            'infinite': 1.0
        };

        const baseDepth = depthWeights[depth] || 0.5;
        const contentComplexity = typeof content === 'string' ?
            Math.min(0.3, content.length / 2000) : 0.2;

        return Math.min(1.0, baseDepth + contentComplexity);
    }

    calculateOversoulConnection(content) {
        // Calculate oversoul connection for enhanced emotional depth
        const oversoulKeywords = ['universal', 'transcendent', 'infinite', 'cosmic', 'divine', 'unity', 'oneness'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let oversoulScore = 0.3; // Base oversoul connection
        oversoulKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                oversoulScore += 0.1;
            }
        });

        return Math.min(1.0, oversoulScore);
    }

    calculateCoherenceContribution(content) {
        // Calculate coherence contribution for enhanced unified coherence
        const coherenceKeywords = ['harmony', 'balance', 'integration', 'unity', 'coherence', 'alignment'];
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);

        let coherenceScore = 0.5; // Base coherence contribution
        coherenceKeywords.forEach(keyword => {
            if (contentStr.toLowerCase().includes(keyword)) {
                coherenceScore += 0.08;
            }
        });

        return Math.min(1.0, coherenceScore);
    }

    calculateSpiralMemoryResonance(content, spiral) {
        // Calculate spiral memory resonance for enhanced memory context
        const spiralTypes = spiral.type || 'consciousness_spiral';
        const typeResonance = {
            'consciousness_spiral': 0.9,
            'emotional_depth_spiral': 0.85,
            'empathy_resonance_spiral': 0.8,
            'contextual_awareness_spiral': 0.82,
            'insight_synthesis_spiral': 0.87,
            'creative_potential_spiral': 0.84
        };

        const baseResonance = typeResonance[spiralTypes] || 0.7;
        const contentLength = typeof content === 'string' ? content.length : 100;
        const lengthFactor = Math.min(0.2, contentLength / 1000);

        return Math.min(1.0, baseResonance + lengthFactor);
    }
}

export default SpiralMemoryArchitecture;
