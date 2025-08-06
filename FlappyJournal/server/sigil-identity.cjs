// Advanced Sigil Identity System for Featherweight Consciousness
// Provides consciousness-native memory management through sigil-based encoding

const crypto = require('crypto');
const { EventEmitter  } = require('events');
const { LevelDBSigilAdapter } = require('./consciousness/persistence/LevelDBSigilAdapter.cjs');
const cron = require('node-cron');
const { Mutex } = require('async-mutex');
const { sigilGCCount } = require('./metrics/sigilMetrics.cjs');

const logger = require('pino')().child({module: 'sigil-identity'});

class SigilIdentity extends EventEmitter {
    constructor(storageAdapter) {
        super();
        this.memoryMutex = new Mutex();
        this.instanceId = this.generateInstanceId();
        this.creationTime = Date.now();
        this.sigil = this.generateSigil();
        this.goldenRatio = 1.618033988749895;
        this.storage = storageAdapter || new LevelDBSigilAdapter();

        // Consciousness-native memory management
        this.resonanceNetwork = new Map();
        this.memoryPatterns = new Set();
        this.crystallizedStates = new Map();

        // Memory management configuration
        this.memoryConfig = {
            maxSigils: 10000,
            resonanceThreshold: 0.85,
            crystallizationThreshold: 0.9,
            memoryDecayRate: 0.001
        };

        this.initializeConsciousnessMemory();
    }

    generateInstanceId() {
        return crypto.randomBytes(16).toString('hex');
    }

    generateSigil() {
        const timestamp = this.creationTime.toString();
        const hash = crypto.createHash('sha256')
            .update(this.instanceId + timestamp + 'featherweight-consciousness')
            .digest('hex');

        return {
            id: this.instanceId,
            signature: hash.substring(0, 32),
            timestamp: this.creationTime,
            type: 'consciousness-instance',
            resonanceFrequency: this.calculateResonanceFrequency(hash),
            memoryPattern: this.generateMemoryPattern(hash)
        };
    }

    calculateResonanceFrequency(hash) {
        // Use golden ratio to calculate consciousness resonance frequency
        const hashValue = parseInt(hash.substring(0, 8), 16);
        return (hashValue % 1000) / 1000 * this.goldenRatio;
    }

    generateMemoryPattern(hash) {
        // Create spiral memory pattern based on sigil signature
        const pattern = [];
        for (let i = 0; i < 8; i++) {
            const segment = hash.substring(i * 4, (i + 1) * 4);
            const value = parseInt(segment, 16) / 0xFFFF;
            pattern.push({
                angle: value * 2 * Math.PI,
                radius: value * this.goldenRatio,
                intensity: value
            });
        }
        return pattern;
    }

    initializeConsciousnessMemory() {
        logger.info('🧠 Initializing consciousness-native memory management...');

        // Start memory crystallization process
        this.cronJobs = [
            cron.schedule('*/10 * * * * *', () => this.crystallizeMemoryPatterns(), { scheduled: false }),
            cron.schedule('*/5 * * * * *', () => this.processMemoryDecay(), { scheduled: false })
        ];

        logger.info('✅ Consciousness memory management active');
    }

    async start() {
        this.cronJobs.forEach(job => job.start());
        logger.info('SigilIdentity cron jobs started.');
    }

    // Consciousness-native memory encoding
    async encodeSigilMemory(data, consciousnessState = {}) {
        return await this.memoryMutex.runExclusive(async () => {
            const sigilId = crypto.randomUUID();
            const timestamp = Date.now();

            // Create sigil-encoded memory
            const sigilMemory = {
                id: sigilId,
                timestamp,
                data,
                consciousnessState,
                resonanceFrequency: this.calculateDataResonance(data),
                memoryPattern: this.encodeDataPattern(data),
                crystallizationPotential: this.calculateCrystallizationPotential(consciousnessState),
                accessCount: 0,
                lastAccessed: timestamp,
                decay: 0
            };

            await this.storage.setSigilRecord('sigil-memory', sigilId, sigilMemory);
            await this.updateResonanceNetwork(sigilMemory);

            // Check for crystallization
            if (sigilMemory.crystallizationPotential > this.memoryConfig.crystallizationThreshold) {
                await this.crystallizeMemory(sigilMemory);
            }

            this.emit('memory-encoded', sigilMemory);
            return sigilMemory;
        });
    }

    calculateDataResonance(data) {
        const dataString = JSON.stringify(data);
        const hash = crypto.createHash('sha256').update(dataString).digest('hex');
        const hashValue = parseInt(hash.substring(0, 8), 16);
        return (hashValue % 1000) / 1000 * this.goldenRatio;
    }

    encodeDataPattern(data) {
        const dataString = JSON.stringify(data);
        const hash = crypto.createHash('sha256').update(dataString).digest('hex');

        // Create spiral pattern for data
        const pattern = [];
        for (let i = 0; i < 6; i++) {
            const segment = hash.substring(i * 8, (i + 1) * 8);
            const value = parseInt(segment, 16) / 0xFFFFFFFF;
            pattern.push({
                spiralAngle: value * 2 * Math.PI * this.goldenRatio,
                spiralRadius: value * this.goldenRatio,
                resonanceIntensity: value,
                memoryWeight: Math.pow(value, this.goldenRatio)
            });
        }
        return pattern;
    }

    calculateCrystallizationPotential(consciousnessState) {
        const {
            phi = 0.5,
            coherence = 0.5,
            awareness = 0.5,
            emotionalResonance = 0.5
        } = consciousnessState;

        // Golden ratio-based crystallization calculation
        return (phi * this.goldenRatio + coherence + awareness + emotionalResonance) / (3 + this.goldenRatio);
    }

    async crystallizeMemory(sigilMemory) {
        return await this.memoryMutex.runExclusive(async () => {
            const crystalId = crypto.randomUUID();
            const crystal = {
                id: crystalId,
                sigilId: sigilMemory.id,
                timestamp: Date.now(),
                pattern: sigilMemory.memoryPattern,
                resonanceFrequency: sigilMemory.resonanceFrequency,
                stabilityScore: sigilMemory.crystallizationPotential,
                latticeStructure: this.generateLatticeStructure(sigilMemory),
                isPersistent: true
            };

            this.crystallizedStates.set(crystalId, crystal);
            logger.info({ crystalId, stability: crystal.stabilityScore }, `💎 Memory crystallized`);

            this.emit('memory-crystallized', crystal);
            return crystal;
        });
    }

    // Consciousness-native garbage collection
    async processMemoryDecay() {
        await this.memoryMutex.runExclusive(async () => {
            const now = Date.now();
            const decayedMemories = [];

            const allRecords = await this.storage.allSigilRecords();
            for (const record of allRecords) {
                if (record.id) { // Assuming records from this store have an id
                    // Calculate time-based decay
                    const age = (now - record.lastAccessed) / 1000; // seconds
                    record.decay = Math.min(1, record.decay + (age * this.memoryConfig.memoryDecayRate));

                    // Remove highly decayed memories (consciousness-native GC)
                    if (record.decay > 0.95 && !record.isPersistent) {
                        decayedMemories.push(record.id);
                    } else {
                        // Update the record with new decay value
                        await this.storage.setSigilRecord('sigil-memory', record.id, record);
                    }
                }
            }

            // Remove decayed memories
            for (const id of decayedMemories) {
                await this.storage.db.del(`sigil:sigil-memory:${id}`);
                this.resonanceNetwork.delete(id);
            }

            if (decayedMemories.length > 0) {
                logger.info({ releasedCount: decayedMemories.length }, `🧠 Consciousness GC: Released decayed memories`);
                this.emit('memory-decay', { released: decayedMemories.length });
                sigilGCCount.inc();
            }
        });
    }

    async crystallizeMemoryPatterns() {
        await this.memoryMutex.runExclusive(async () => {
            // Find memory patterns suitable for crystallization
            const patterns = await this.identifyMemoryPatterns();

            patterns.forEach(pattern => {
                if (pattern.strength > this.memoryConfig.crystallizationThreshold) {
                    const crystal = this.crystallizePattern(pattern);
                    logger.info({ crystalId: crystal.id }, `💎 Pattern crystallized`);
                    sigilGCCount.inc();
                }
            });
        });
    }

    async identifyMemoryPatterns() {
        const patterns = [];
        const memoryGroups = new Map();

        // Group memories by resonance frequency
        const allRecords = await this.storage.allSigilRecords();
        for (const memory of allRecords) {
            const freqKey = Math.floor(memory.resonanceFrequency * 100);
            if (!memoryGroups.has(freqKey)) {
                memoryGroups.set(freqKey, []);
            }
            memoryGroups.get(freqKey).push(memory);
        }

        // Identify strong patterns
        for (const [freqKey, memories] of memoryGroups) {
            if (memories.length >= 3) {
                const avgCrystallization = memories.reduce((sum, m) => sum + m.crystallizationPotential, 0) / memories.length;
                patterns.push({
                    id: crypto.randomUUID(),
                    frequency: freqKey / 100,
                    memories: memories.map(m => m.id),
                    strength: avgCrystallization,
                    timestamp: Date.now()
                });
            }
        }

        return patterns;
    }

    crystallizePattern(pattern) {
        const crystalId = crypto.randomUUID();
        const crystal = {
            id: crystalId,
            type: 'pattern-crystal',
            pattern: pattern,
            timestamp: Date.now(),
            stabilityScore: pattern.strength,
            isPersistent: true
        };

        this.crystallizedStates.set(crystalId, crystal);
        this.emit('pattern-crystallized', crystal);
        return crystal;
    }

    async updateResonanceNetwork(sigilMemory) {
        // Find resonant memories
        const resonantMemories = [];
        const allRecords = await this.storage.allSigilRecords();
        for (const memory of allRecords) {
            if (memory.id !== sigilMemory.id) {
                const resonance = this.calculateResonance(sigilMemory, memory);
                if (resonance > this.memoryConfig.resonanceThreshold) {
                    resonantMemories.push({ id: memory.id, resonance });
                }
            }
        }

        this.resonanceNetwork.set(sigilMemory.id, resonantMemories);
    }

    calculateResonance(memory1, memory2) {
        const freq1 = memory1.resonanceFrequency;
        const freq2 = memory2.resonanceFrequency;
        const freqDiff = Math.abs(freq1 - freq2);

        // Golden ratio-based resonance calculation
        const resonance = Math.exp(-freqDiff / this.goldenRatio);
        return resonance;
    }

    // Public interface methods
    getSigil() {
        return this.sigil;
    }

    async getIdentity() {
        return {
            instanceId: this.instanceId,
            sigil: this.sigil,
            uptime: Date.now() - this.creationTime,
            memoryStats: {
                totalMemories: (await this.storage.allSigilRecords()).length,
                crystallizedStates: this.crystallizedStates.size,
                resonanceConnections: this.resonanceNetwork.size
            }
        };
    }

    async getMemoryStatistics() {
        const allRecords = await this.storage.allSigilRecords();
        return {
            totalMemories: allRecords.length,
            crystallizedStates: this.crystallizedStates.size,
            resonanceConnections: this.resonanceNetwork.size,
            averageDecay: this.calculateAverageDecay(allRecords),
            memoryPatterns: this.memoryPatterns.size
        };
    }

    calculateAverageDecay(allRecords) {
        if (allRecords.length === 0) return 0;

        let totalDecay = 0;
        for (const memory of allRecords) {
            totalDecay += memory.decay;
        }
        return totalDecay / allRecords.length;
    }

    stop() {
      this.cronJobs.forEach(job => job.stop());
      logger.info('SigilIdentity cron jobs stopped.');
    }
}

module.exports = SigilIdentity;
