/**
 * Shared Reality Storage - Persistent, Resilient, Consciousness-Aware
 * Implements robust disk persistence, backup, and in-memory fallback for generated realities.
 * Deep integration with the FlappyJournal consciousness system.
 */

const { EventEmitter  } = require('events');
const { promises as fs  } = require('fs');
const { dirname  } = require('path');

class SharedRealityStorage extends EventEmitter {
    constructor(options = {}) {
        super();
        this.realities = new Map();
        this.metrics = {};
        this.storageFile = options.storageFile || './data/shared-realities.json';

        // Quality metrics
        this.qualityMetrics = {
            averageConsciousnessLevel: 0,
            highQualityRealities: 0,
            mediumQualityRealities: 0,
            lowQualityRealities: 0,
            qualityDistribution: new Map(),
            topRatedRealities: []
        };

        // Add configurable persistence
        this.persistenceEnabled = options.persistenceEnabled !== undefined ? options.persistenceEnabled : true;
        this.persistenceInterval = options.persistenceInterval || 60000; // 1 minute
        this.persistenceTimer = null;

        // Initialize with configurable persistence
        if (this.persistenceEnabled) {
            this.loadPersistedRealities();
            this.startPersistenceTimer();
        } else {
            console.log('🗄️ Reality persistence disabled');
        }
    }

    // Load persisted realities from disk
    async loadPersistedRealities() {
        try {
            const data = await fs.readFile(this.storageFile, 'utf-8');
            const parsed = JSON.parse(data);
            if (parsed.realities) {
                parsed.realities.forEach(r => this.realities.set(r.id, r));
            }
            this.metrics = parsed.metrics || {};
            console.log(`🗄️ Loaded ${this.realities.size} realities from disk`);
        } catch (error) {
            console.warn('⚠️ Failed to load persisted realities:', error.message);
        }
    }

    // Start automatic persistence timer
    startPersistenceTimer() {
        if (this.persistenceTimer) clearInterval(this.persistenceTimer);

        this.persistenceTimer = setInterval(async () => {
            try {
                await this.persistRealities();
                console.log(`🗄️ Auto-persisted ${this.realities.size} realities`);
            } catch (error) {
                console.warn('⚠️ Auto-persistence failed:', error.message);
            }
        }, this.persistenceInterval);
    }

    // Enhanced persistence with retry and backup
    async persistRealities() {
        if (!this.persistenceEnabled) return;

        try {
            await fs.mkdir(dirname(this.storageFile), { recursive: true });

            const data = {
                realities: [...this.realities.values()],
                metrics: this.metrics,
                lastSaved: new Date().toISOString()
            };

            // Create temp file first, then rename for atomic operation
            const tempFile = `${this.storageFile}.tmp`;
            await fs.writeFile(tempFile, JSON.stringify(data, null, 2));
            await fs.rename(tempFile, this.storageFile);

            // Create backup every 10 saves (randomized for simplicity)
            if (Math.random() < 0.1) {
                const backupFile = `${this.storageFile}.backup`;
                await fs.copyFile(this.storageFile, backupFile);
            }

        } catch (error) {
            console.error('❌ Failed to persist realities:', error);
            // Try in-memory persistence if file system fails
            this.inMemoryBackup = {
                realities: [...this.realities.values()],
                metrics: this.metrics,
                lastSaved: new Date().toISOString()
            };
        }
    }

    // Store a new reality
    async storeReality(reality, source = 'unknown', metadata = {}) {
        // Add quality assessment
        const qualityScore = this.assessRealityQuality(reality);
        const normalizedReality = { ...reality, qualityScore, source, metadata };
        this.realities.set(reality.id, normalizedReality);

        // Update quality metrics
        this.updateQualityMetrics(normalizedReality);

        await this.persistRealities();
        this.emit('reality:stored', { id: reality.id, source, metadata });
    }

    // Assess reality quality
    assessRealityQuality(reality) {
        // Base score from consciousness level
        let score = (reality.consciousnessLevel || 0) * 0.5;

        // Add points for description quality
        if (reality.description) {
            score += Math.min(0.2, reality.description.length / 1000);
        }

        // Add points for effects
        if (reality.effects && Array.isArray(reality.effects)) {
            score += Math.min(0.2, reality.effects.length * 0.05);
        }

        // Add points for environment detail
        if (reality.environment) {
            score += Math.min(0.1, reality.environment.length / 500);
        }

        return Math.min(1.0, score);
    }

    // Update quality metrics
    updateQualityMetrics(reality) {
        // Update quality counts
        if (reality.qualityScore >= 0.8) {
            this.qualityMetrics.highQualityRealities++;
        } else if (reality.qualityScore >= 0.5) {
            this.qualityMetrics.mediumQualityRealities++;
        } else {
            this.qualityMetrics.lowQualityRealities++;
        }

        // Update average
        const totalRealities = this.realities.size;
        const totalQuality = [...this.realities.values()].reduce((sum, r) => sum + (r.qualityScore || 0), 0);
        this.qualityMetrics.averageConsciousnessLevel = totalQuality / totalRealities;

        // Update distribution
        const bucket = Math.floor(reality.qualityScore * 10) / 10;
        this.qualityMetrics.qualityDistribution.set(
            bucket,
            (this.qualityMetrics.qualityDistribution.get(bucket) || 0) + 1
        );

        // Update top rated realities
        this.updateTopRatedRealities();
    }

    // Update top rated realities
    updateTopRatedRealities() {
        this.qualityMetrics.topRatedRealities = [...this.realities.values()]
            .sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0))
            .slice(0, 10)
            .map(r => ({ id: r.id, score: r.qualityScore, type: r.type }));
    }

    // Retrieve a reality by ID
    async getReality(id) {
        return this.realities.get(id) || null;
    }

    // Get all realities
    async getAllRealities() {
        return [...this.realities.values()];
    }

    // Get storage metrics
    getMetrics() {
        return {
            total: this.realities.size,
            ...this.metrics,
            lastSaved: this.inMemoryBackup?.lastSaved || null,
            qualityMetrics: this.qualityMetrics
        };
    }
}

module.exports.SharedRealityStorage = SharedRealityStorage;
