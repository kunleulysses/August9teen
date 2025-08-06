/**
 * Advanced Caching System for Spiral Memory
 * Multi-tier caching with intelligent eviction and warming strategies
 * Part of Phase 2: Performance & Scalability Optimization
 */

const { EventEmitter } = require('events');
const crypto = require('crypto');

class AdvancedCachingSystem extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.config = {
            // L1 Cache (In-Memory, fastest)
            l1Cache: {
                maxSize: options.l1MaxSize || 1000,
                ttl: options.l1TTL || 60000, // 1 minute
                enabled: options.l1Enabled !== false
            },
            
            // L2 Cache (Redis, shared across instances)
            l2Cache: {
                maxSize: options.l2MaxSize || 10000,
                ttl: options.l2TTL || 300000, // 5 minutes
                enabled: options.l2Enabled !== false,
                redisClient: options.redisClient
            },
            
            // L3 Cache (Persistent, slowest but largest)
            l3Cache: {
                maxSize: options.l3MaxSize || 100000,
                ttl: options.l3TTL || 3600000, // 1 hour
                enabled: options.l3Enabled !== false,
                persistentStorage: options.persistentStorage
            },
            
            // Cache warming configuration
            warming: {
                enabled: options.warmingEnabled !== false,
                preloadSize: options.preloadSize || 100,
                warmingInterval: options.warmingInterval || 300000, // 5 minutes
                popularityThreshold: options.popularityThreshold || 10
            },
            
            // Eviction policies
            eviction: {
                policy: options.evictionPolicy || 'LRU', // LRU, LFU, FIFO, TTL
                batchSize: options.evictionBatchSize || 10
            }
        };
        
        // Cache storage layers
        this.l1Cache = new Map(); // In-memory cache
        this.l2Cache = null; // Redis cache (initialized if available)
        this.l3Cache = new Map(); // Persistent cache simulation
        
        // Cache metadata
        this.cacheMetadata = {
            l1: new Map(), // { key: { accessCount, lastAccess, createdAt, size } }
            l2: new Map(),
            l3: new Map()
        };
        
        // Access patterns for intelligent caching
        this.accessPatterns = new Map(); // { key: { count, lastAccess, frequency } }
        
        // Cache statistics
        this.stats = {
            l1: { hits: 0, misses: 0, evictions: 0, size: 0 },
            l2: { hits: 0, misses: 0, evictions: 0, size: 0 },
            l3: { hits: 0, misses: 0, evictions: 0, size: 0 },
            overall: { hits: 0, misses: 0, hitRate: 0 }
        };
        
        // Cache warming queue
        this.warmingQueue = [];
        this.warmingInProgress = false;
        
        this.initializeCaches();
        this.startCacheWarming();
    }

    initializeCaches() {
        // Initialize Redis cache if available
        if (this.config.l2Cache.enabled && this.config.l2Cache.redisClient) {
            this.l2Cache = this.config.l2Cache.redisClient;
            console.log('🔄 L2 Cache (Redis) initialized');
        }
        
        // Start cleanup intervals
        this.startCleanupIntervals();
        
        console.log('🚀 Advanced Caching System initialized');
    }

    startCleanupIntervals() {
        // L1 Cache cleanup
        setInterval(() => {
            this.cleanupExpiredEntries('l1');
        }, 60000); // Every minute
        
        // L2 Cache cleanup (if using Redis)
        if (this.l2Cache) {
            setInterval(() => {
                this.cleanupExpiredEntries('l2');
            }, 300000); // Every 5 minutes
        }
        
        // L3 Cache cleanup
        setInterval(() => {
            this.cleanupExpiredEntries('l3');
        }, 600000); // Every 10 minutes
    }

    startCacheWarming() {
        if (!this.config.warming.enabled) return;
        
        setInterval(() => {
            this.performCacheWarming();
        }, this.config.warming.warmingInterval);
    }

    // Main cache interface methods
    async get(key, options = {}) {
        const startTime = process.hrtime.bigint();
        let result = null;
        let cacheLevel = null;
        
        try {
            // Try L1 cache first
            if (this.config.l1Cache.enabled) {
                result = this.getFromL1(key);
                if (result !== null) {
                    cacheLevel = 'l1';
                    this.stats.l1.hits++;
                    this.updateAccessPattern(key);
                    return { data: result, cacheLevel, fromCache: true };
                }
                this.stats.l1.misses++;
            }
            
            // Try L2 cache (Redis)
            if (this.config.l2Cache.enabled && this.l2Cache) {
                result = await this.getFromL2(key);
                if (result !== null) {
                    cacheLevel = 'l2';
                    this.stats.l2.hits++;
                    this.updateAccessPattern(key);
                    
                    // Promote to L1 cache
                    if (this.config.l1Cache.enabled) {
                        this.setInL1(key, result, options);
                    }
                    
                    return { data: result, cacheLevel, fromCache: true };
                }
                this.stats.l2.misses++;
            }
            
            // Try L3 cache (Persistent)
            if (this.config.l3Cache.enabled) {
                result = await this.getFromL3(key);
                if (result !== null) {
                    cacheLevel = 'l3';
                    this.stats.l3.hits++;
                    this.updateAccessPattern(key);
                    
                    // Promote to higher cache levels
                    if (this.config.l2Cache.enabled && this.l2Cache) {
                        await this.setInL2(key, result, options);
                    }
                    if (this.config.l1Cache.enabled) {
                        this.setInL1(key, result, options);
                    }
                    
                    return { data: result, cacheLevel, fromCache: true };
                }
                this.stats.l3.misses++;
            }
            
            // Cache miss - update statistics
            this.stats.overall.misses++;
            this.updateOverallStats();
            
            return { data: null, cacheLevel: null, fromCache: false };
            
        } finally {
            const duration = Number(process.hrtime.bigint() - startTime) / 1000000;
            this.emit('cacheOperation', {
                operation: 'get',
                key: this.hashKey(key),
                cacheLevel,
                hit: result !== null,
                duration
            });
        }
    }

    async set(key, value, options = {}) {
        const startTime = process.hrtime.bigint();
        
        try {
            const ttl = options.ttl || this.config.l1Cache.ttl;
            const size = this.calculateSize(value);
            
            // Set in all enabled cache levels
            const promises = [];
            
            if (this.config.l1Cache.enabled) {
                this.setInL1(key, value, { ...options, ttl, size });
            }
            
            if (this.config.l2Cache.enabled && this.l2Cache) {
                promises.push(this.setInL2(key, value, { ...options, ttl, size }));
            }
            
            if (this.config.l3Cache.enabled) {
                promises.push(this.setInL3(key, value, { ...options, ttl, size }));
            }
            
            await Promise.all(promises);
            
            this.updateAccessPattern(key);
            
            return true;
            
        } finally {
            const duration = Number(process.hrtime.bigint() - startTime) / 1000000;
            this.emit('cacheOperation', {
                operation: 'set',
                key: this.hashKey(key),
                duration
            });
        }
    }

    async delete(key) {
        const promises = [];
        
        if (this.config.l1Cache.enabled) {
            this.l1Cache.delete(key);
            this.cacheMetadata.l1.delete(key);
        }
        
        if (this.config.l2Cache.enabled && this.l2Cache) {
            promises.push(this.deleteFromL2(key));
        }
        
        if (this.config.l3Cache.enabled) {
            promises.push(this.deleteFromL3(key));
        }
        
        await Promise.all(promises);
        this.accessPatterns.delete(key);
        
        return true;
    }

    // L1 Cache methods (In-Memory)
    getFromL1(key) {
        const value = this.l1Cache.get(key);
        const metadata = this.cacheMetadata.l1.get(key);
        
        if (value === undefined || !metadata) {
            return null;
        }
        
        // Check TTL
        if (Date.now() > metadata.createdAt + this.config.l1Cache.ttl) {
            this.l1Cache.delete(key);
            this.cacheMetadata.l1.delete(key);
            return null;
        }
        
        // Update access metadata
        metadata.accessCount++;
        metadata.lastAccess = Date.now();
        
        return value;
    }

    setInL1(key, value, options = {}) {
        // Check if cache is full and evict if necessary
        if (this.l1Cache.size >= this.config.l1Cache.maxSize) {
            this.evictFromL1();
        }
        
        const size = options.size || this.calculateSize(value);
        const metadata = {
            accessCount: 1,
            lastAccess: Date.now(),
            createdAt: Date.now(),
            size: size,
            ttl: options.ttl || this.config.l1Cache.ttl
        };
        
        this.l1Cache.set(key, value);
        this.cacheMetadata.l1.set(key, metadata);
        this.stats.l1.size = this.l1Cache.size;
    }

    evictFromL1() {
        const evictionCandidates = this.getEvictionCandidates('l1');
        const toEvict = evictionCandidates.slice(0, this.config.eviction.batchSize);
        
        toEvict.forEach(key => {
            this.l1Cache.delete(key);
            this.cacheMetadata.l1.delete(key);
            this.stats.l1.evictions++;
        });
        
        this.stats.l1.size = this.l1Cache.size;
    }

    // L2 Cache methods (Redis)
    async getFromL2(key) {
        if (!this.l2Cache) return null;
        
        try {
            const value = await this.l2Cache.get(`spiral:cache:${key}`);
            if (value) {
                return JSON.parse(value);
            }
        } catch (error) {
            console.error('L2 Cache get error:', error);
        }
        
        return null;
    }

    async setInL2(key, value, options = {}) {
        if (!this.l2Cache) return;
        
        try {
            const ttl = options.ttl || this.config.l2Cache.ttl;
            const serializedValue = JSON.stringify(value);
            
            await this.l2Cache.setex(`spiral:cache:${key}`, Math.floor(ttl / 1000), serializedValue);
            
            // Update metadata
            const metadata = {
                accessCount: 1,
                lastAccess: Date.now(),
                createdAt: Date.now(),
                size: options.size || this.calculateSize(value),
                ttl: ttl
            };
            
            this.cacheMetadata.l2.set(key, metadata);
            this.stats.l2.size++;
            
        } catch (error) {
            console.error('L2 Cache set error:', error);
        }
    }

    async deleteFromL2(key) {
        if (!this.l2Cache) return;
        
        try {
            await this.l2Cache.del(`spiral:cache:${key}`);
            this.cacheMetadata.l2.delete(key);
            this.stats.l2.size--;
        } catch (error) {
            console.error('L2 Cache delete error:', error);
        }
    }

    // L3 Cache methods (Persistent Storage)
    async getFromL3(key) {
        const value = this.l3Cache.get(key);
        const metadata = this.cacheMetadata.l3.get(key);
        
        if (value === undefined || !metadata) {
            return null;
        }
        
        // Check TTL
        if (Date.now() > metadata.createdAt + this.config.l3Cache.ttl) {
            this.l3Cache.delete(key);
            this.cacheMetadata.l3.delete(key);
            return null;
        }
        
        // Update access metadata
        metadata.accessCount++;
        metadata.lastAccess = Date.now();
        
        return value;
    }

    async setInL3(key, value, options = {}) {
        // Check if cache is full and evict if necessary
        if (this.l3Cache.size >= this.config.l3Cache.maxSize) {
            this.evictFromL3();
        }
        
        const size = options.size || this.calculateSize(value);
        const metadata = {
            accessCount: 1,
            lastAccess: Date.now(),
            createdAt: Date.now(),
            size: size,
            ttl: options.ttl || this.config.l3Cache.ttl
        };
        
        this.l3Cache.set(key, value);
        this.cacheMetadata.l3.set(key, metadata);
        this.stats.l3.size = this.l3Cache.size;
    }

    async deleteFromL3(key) {
        this.l3Cache.delete(key);
        this.cacheMetadata.l3.delete(key);
        this.stats.l3.size = this.l3Cache.size;
    }

    evictFromL3() {
        const evictionCandidates = this.getEvictionCandidates('l3');
        const toEvict = evictionCandidates.slice(0, this.config.eviction.batchSize);
        
        toEvict.forEach(key => {
            this.l3Cache.delete(key);
            this.cacheMetadata.l3.delete(key);
            this.stats.l3.evictions++;
        });
        
        this.stats.l3.size = this.l3Cache.size;
    }

    // Eviction policy implementations
    getEvictionCandidates(cacheLevel) {
        const metadata = this.cacheMetadata[cacheLevel];
        const entries = Array.from(metadata.entries());
        
        switch (this.config.eviction.policy) {
            case 'LRU': // Least Recently Used
                return entries
                    .sort((a, b) => a[1].lastAccess - b[1].lastAccess)
                    .map(entry => entry[0]);
                    
            case 'LFU': // Least Frequently Used
                return entries
                    .sort((a, b) => a[1].accessCount - b[1].accessCount)
                    .map(entry => entry[0]);
                    
            case 'FIFO': // First In, First Out
                return entries
                    .sort((a, b) => a[1].createdAt - b[1].createdAt)
                    .map(entry => entry[0]);
                    
            case 'TTL': // Time To Live (oldest first)
                return entries
                    .sort((a, b) => (a[1].createdAt + a[1].ttl) - (b[1].createdAt + b[1].ttl))
                    .map(entry => entry[0]);
                    
            default:
                return entries.map(entry => entry[0]);
        }
    }

    // Cache warming implementation
    async performCacheWarming() {
        if (this.warmingInProgress) return;
        
        this.warmingInProgress = true;
        
        try {
            // Identify popular keys that should be warmed
            const popularKeys = this.getPopularKeys();
            
            // Add to warming queue
            popularKeys.forEach(key => {
                if (!this.warmingQueue.includes(key)) {
                    this.warmingQueue.push(key);
                }
            });
            
            // Process warming queue
            const batchSize = Math.min(this.config.warming.preloadSize, this.warmingQueue.length);
            const keysToWarm = this.warmingQueue.splice(0, batchSize);
            
            for (const key of keysToWarm) {
                // Check if key is already in L1 cache
                if (!this.l1Cache.has(key)) {
                    // Try to promote from lower cache levels
                    const result = await this.get(key);
                    if (result.fromCache && result.cacheLevel !== 'l1') {
                        console.log(`🔥 Cache warming: promoted ${this.hashKey(key)} from ${result.cacheLevel} to l1`);
                    }
                }
            }
            
        } finally {
            this.warmingInProgress = false;
        }
    }

    getPopularKeys() {
        return Array.from(this.accessPatterns.entries())
            .filter(([key, pattern]) => pattern.count >= this.config.warming.popularityThreshold)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, this.config.warming.preloadSize)
            .map(entry => entry[0]);
    }

    // Access pattern tracking
    updateAccessPattern(key) {
        const pattern = this.accessPatterns.get(key) || { count: 0, lastAccess: 0, frequency: 0 };
        
        const now = Date.now();
        const timeSinceLastAccess = now - pattern.lastAccess;
        
        pattern.count++;
        pattern.lastAccess = now;
        
        // Calculate frequency (accesses per hour)
        if (timeSinceLastAccess > 0) {
            pattern.frequency = pattern.count / (timeSinceLastAccess / 3600000);
        }
        
        this.accessPatterns.set(key, pattern);
        
        // Update overall statistics
        this.stats.overall.hits++;
        this.updateOverallStats();
    }

    updateOverallStats() {
        const totalRequests = this.stats.overall.hits + this.stats.overall.misses;
        this.stats.overall.hitRate = totalRequests > 0 ? this.stats.overall.hits / totalRequests : 0;
    }

    // Cleanup methods
    cleanupExpiredEntries(cacheLevel) {
        const cache = this[`${cacheLevel}Cache`];
        const metadata = this.cacheMetadata[cacheLevel];
        const config = this.config[`${cacheLevel}Cache`];
        
        if (!cache || !metadata || !config) return;
        
        const now = Date.now();
        const expiredKeys = [];
        
        for (const [key, meta] of metadata.entries()) {
            if (now > meta.createdAt + config.ttl) {
                expiredKeys.push(key);
            }
        }
        
        expiredKeys.forEach(key => {
            cache.delete(key);
            metadata.delete(key);
        });
        
        if (expiredKeys.length > 0) {
            console.log(`🧹 Cleaned up ${expiredKeys.length} expired entries from ${cacheLevel} cache`);
        }
    }

    // Utility methods
    calculateSize(value) {
        if (typeof value === 'string') {
            return Buffer.byteLength(value, 'utf8');
        } else if (typeof value === 'object') {
            return Buffer.byteLength(JSON.stringify(value), 'utf8');
        }
        return 0;
    }

    hashKey(key) {
        return crypto.createHash('md5').update(key).digest('hex').substring(0, 8);
    }

    // Statistics and monitoring
    getStats() {
        return {
            ...this.stats,
            accessPatterns: {
                totalKeys: this.accessPatterns.size,
                popularKeys: this.getPopularKeys().length
            },
            warmingQueue: {
                size: this.warmingQueue.length,
                inProgress: this.warmingInProgress
            }
        };
    }

    getCacheInfo() {
        return {
            config: this.config,
            stats: this.getStats(),
            cacheStates: {
                l1: {
                    size: this.l1Cache.size,
                    maxSize: this.config.l1Cache.maxSize,
                    utilization: this.l1Cache.size / this.config.l1Cache.maxSize
                },
                l2: {
                    size: this.stats.l2.size,
                    maxSize: this.config.l2Cache.maxSize,
                    utilization: this.stats.l2.size / this.config.l2Cache.maxSize,
                    enabled: this.config.l2Cache.enabled && !!this.l2Cache
                },
                l3: {
                    size: this.l3Cache.size,
                    maxSize: this.config.l3Cache.maxSize,
                    utilization: this.l3Cache.size / this.config.l3Cache.maxSize
                }
            }
        };
    }

    // Cache invalidation patterns
    async invalidatePattern(pattern) {
        const regex = new RegExp(pattern);
        const keysToInvalidate = [];
        
        // Find matching keys in all cache levels
        for (const key of this.l1Cache.keys()) {
            if (regex.test(key)) {
                keysToInvalidate.push(key);
            }
        }
        
        // Invalidate matching keys
        for (const key of keysToInvalidate) {
            await this.delete(key);
        }
        
        console.log(`🗑️  Invalidated ${keysToInvalidate.length} cache entries matching pattern: ${pattern}`);
        return keysToInvalidate.length;
    }

    // Bulk operations
    async mget(keys) {
        const results = {};
        const promises = keys.map(async key => {
            const result = await this.get(key);
            results[key] = result;
        });
        
        await Promise.all(promises);
        return results;
    }

    async mset(keyValuePairs, options = {}) {
        const promises = Object.entries(keyValuePairs).map(([key, value]) => 
            this.set(key, value, options)
        );
        
        await Promise.all(promises);
        return true;
    }
}

module.exports = { AdvancedCachingSystem };
