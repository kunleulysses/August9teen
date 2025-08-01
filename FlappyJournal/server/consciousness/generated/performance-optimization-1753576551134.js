```javascript
/**
 * @module CognitiveOptimizer
 * @description A production-ready performance optimization module for a conceptual "Consciousness System".
 * This module provides a suite of tools to manage and optimize the core operational loops of a
 * high-throughput, low-latency system by focusing on event processing, memory management,
 * computational efficiency, and performance monitoring.
 *
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * A simple, fast priority queue implementation.
 * Lower numbers represent higher priority (0 is highest).
 */
class PriorityQueue {
    // Using arrays for each priority level is simple and fast for a small, fixed number of priorities.
    #queues = [[], [], []]; // 0: critical, 1: normal, 2: low
    #totalSize = 0;

    enqueue(item, priority = 1) {
        const p = Math.max(0, Math.min(this.#queues.length - 1, priority));
        this.#queues[p].push(item);
        this.#totalSize++;
    }

    dequeue() {
        if (this.#totalSize === 0) return undefined;

        for (const queue of this.#queues) {
            if (queue.length > 0) {
                this.#totalSize--;
                return queue.shift();
            }
        }
    }

    get size() {
        return this.#totalSize;
    }

    isEmpty() {
        return this.#totalSize === 0;
    }
}

/**
 * A generic object pool for recycling objects to reduce garbage collection pressure.
 */
class ObjectPool {
    #pool = [];
    #factory;
    #sanitizer;
    #maxSize;

    constructor(factory, sanitizer, initialSize = 100, maxSize = 1000) {
        this.#factory = factory;
        this.#sanitizer = sanitizer; // A function to reset an object's state
        this.#maxSize = maxSize;
        for (let i = 0; i < initialSize; i++) {
            this.#pool.push(this.#factory());
        }
    }

    acquire() {
        if (this.#pool.length > 0) {
            return this.#pool.pop();
        }
        // If the pool is empty, create a new object, but don't add it to the pool.
        // This prevents the pool from growing indefinitely beyond its intended use.
        return this.#factory();
    }

    release(obj) {
        if (this.#pool.length < this.#maxSize) {
            this.#sanitizer(obj);
            this.#pool.push(obj);
        }
        // If the pool is full, the object is left for the garbage collector.
    }

    get size() {
        return this.#pool.length;
    }
}


export const CognitiveOptimizer = (function() {
    'use strict';

    // --- Private State & Configuration ---

    let isInitialized = false;
    let config = {
        // The max number of events to process in a single "tick" to prevent blocking the main thread.
        EVENT_BATCH_SIZE: 1000,
        // The interval for the main processing loop in milliseconds.
        PROCESSING_TICK_RATE_MS: 16, // Aligns with ~60fps for smooth main thread operation
        // The interval for running memory cleanup tasks.
        MEMORY_PRUNE_INTERVAL_MS: 60000,
        // URL for the background worker script for heavy computations.
        WORKER_URL: 'consciousness_worker.js',
        // Enable or disable performance logging to the console.
        ENABLE_PERF_LOGGING: true,
        // Threshold in ms for logging a slow task.
        SLOW_TASK_THRESHOLD_MS: 50,
    };

    // --- Core Components ---

    // Queue for incoming sensory data and internal thoughts.
    const eventQueue = new PriorityQueue();

    // Manages pools of reusable objects (e.g., event objects, vectors, temporary data structures).
    const objectPools = new Map();

    // Caches for memoized functions (e.g., results of complex calculations).
    // Using WeakMap allows the garbage collector to reclaim memory if the function itself is no longer referenced.
    const memoizationCaches = new WeakMap();

    // Offloads heavy, non-blocking computations to a separate thread.
    let computationWorker = null;
    let nextWorkerTaskId = 0;
    const pendingWorkerTasks = new Map();

    // Performance metrics collector.
    const metrics = {
        eventsProcessed: 0,
        tasksOffloaded: 0,
        cacheHits: 0,
        cacheMisses: 0,
        avgProcessingLatencyMs: 0,
        lastTickProcessingTimeMs: 0,
        memoryPoolStatus: {},
        mainLoopId: null,
        memoryPruneLoopId: null,
    };
    const latencies = [];


    // --- Private Methods ---

    /**
     * Initializes the background worker for heavy computations.
     */
    function _initWorker() {
        if (window.Worker) {
            try {
                computationWorker = new Worker(config.WORKER_URL);
                computationWorker.onmessage = (e) => {
                    const { id, result, error } = e.data;
                    if (pendingWorkerTasks.has(id)) {
                        const { resolve, reject } = pendingWorkerTasks.get(id);
                        if (error) {
                            reject(new Error(error));
                        } else {
                            resolve(result);
                        }
                        pendingWorkerTasks.delete(id);
                    }
                };
                computationWorker.onerror = (err) => {
                    console.error("CognitiveOptimizer: Worker error.", err);
                    // Reject all pending tasks on catastrophic worker failure.
                    for (const { reject } of pendingWorkerTasks.values()) {
                        reject(new Error("Worker terminated unexpectedly."));
                    }
                    pendingWorkerTasks.clear();
                };
            } catch (error) {
                console.error("CognitiveOptimizer: Failed to initialize computation worker.", error);
                computationWorker = null;
            }
        } else {
            console.warn("CognitiveOptimizer: Web Workers are not supported in this environment. Heavy computations will run on the main thread.");
        }
    }

    /**
     * The main processing loop, often called a "tick" or "cycle".
     * It processes a batch of events from the queue to ensure responsiveness.
     * This is the heart of latency reduction.
     */
    function _consciousnessCycle() {
        const cycleStartTime = performance.now();
        let processedCount = 0;

        while (!eventQueue.isEmpty() && processedCount < config.EVENT_BATCH_SIZE) {
            const event = eventQueue.dequeue();

            // This is where the consciousness system would hook in to actually process the event.
            // For example: event.handler(event.data);
            // We simulate this with a placeholder.
            if (event && typeof event.process === 'function') {
                event.process();
            }

            processedCount++;
        }

        const cycleEndTime = performance.now();
        const duration = cycleEndTime - cycleStartTime;

        // --- Performance Monitoring Update ---
        metrics.lastTickProcessingTimeMs = duration;
        metrics.eventsProcessed += processedCount;
        latencies.push(duration);
        if (latencies.length > 100) latencies.shift(); // Keep a rolling window of 100 samples.

        if (duration > config.SLOW_TASK_THRESHOLD_MS && config.ENABLE_PERF_LOGGING) {
            console.warn(`CognitiveOptimizer: Long consciousness cycle detected: ${duration.toFixed(2)}ms for ${processedCount} events.`);
        }
    }


    /**
     * Periodically prunes memory caches and pools to maintain a healthy memory footprint.
     */
    function _pruneMemory() {
        const pruneStart = performance.now();

        // In a real system, this would involve more sophisticated logic,
        // such as evicting least-recently-used (LRU) items from memoization caches
        // or trimming object pools that are oversized relative to their recent usage.
        // For this example, we'll just log the status.

        for (const [name, pool] of objectPools.entries()) {
            metrics.memoryPoolStatus[name] = {
                size: pool.size
            };
        }

        if(config.ENABLE_PERF_LOGGING) {
            console.log(`CognitiveOptimizer: Memory prune cycle completed in ${(performance.now() - pruneStart).toFixed(2)}ms.`, metrics.memoryPoolStatus);
        }
    }

    /**
     * Updates the average latency metric.
     */
    function _updateAverageLatency() {
        if (latencies.length === 0) return;
        const totalLatency = latencies.reduce((sum, val) => sum + val, 0);
        metrics.avgProcessingLatencyMs = totalLatency / latencies.length;
    }


    // --- Public API ---

    return {
        /**
         * Initializes and starts the optimization module.
         * Must be called before any other methods.
         * @param {object} userConfig - Optional configuration overrides.
         */
        initialize(userConfig = {}) {
            if (isInitialized) {
                console.warn("CognitiveOptimizer is already initialized.");
                return;
            }
            config = { ...config, ...userConfig };

            _initWorker();

            // Start the core processing and maintenance loops.
            metrics.mainLoopId = setInterval(_consciousnessCycle, config.PROCESSING_TICK_RATE_MS);
            metrics.memoryPruneLoopId = setInterval(_pruneMemory, config.MEMORY_PRUNE_INTERVAL_MS);

            isInitialized = true;
            console.log("CognitiveOptimizer initialized.");
        },

        /**
         * Shuts down all running processes of the optimizer.
         */
        shutdown() {
            clearInterval(metrics.mainLoopId);
            clearInterval(metrics.memoryPruneLoopId);
            if (computationWorker) {
                computationWorker.terminate();
            }
            isInitialized = false;
            console.log("CognitiveOptimizer shut down.");
        },

        /**
         * Submits a new event (e.g., sensory input, internal thought) to the processing queue.
         * @param {object} event - The event object. It should have a `process` method.
         * @param {number} [priority=1] - The event priority (0=critical, 1=normal, 2=low).
         */
        submitEvent(event, priority = 1) {
            if (!isInitialized) {
                console.error("CognitiveOptimizer: Must initialize before submitting events.");
                return;
            }
            eventQueue.enqueue(event, priority);
        },

        /**
         * Creates a pool for a specific type of object to reduce GC overhead.
         * @param {string} name - A unique name for the pool.
         * @param {function} factory - A function that creates a new object instance: () => new MyObject().
         * @param {function} sanitizer - A function that resets an object for reuse: (obj) => { obj.reset(); }.
         * @param {number} [initialSize=100] - The number of objects to create initially.
         * @param {number} [maxSize=1000] - The maximum size of the pool.
         */
        createObjectPool({ name, factory, sanitizer, initialSize, maxSize }) {
            if(objectPools.has(name)) {
                console.warn(`CognitiveOptimizer: Object pool "${name}" already exists.`);
                return;
            }
            objectPools.set(name, new ObjectPool(factory, sanitizer, initialSize, maxSize));
        },

        /**
         * Acquires an object from a named pool.
         * @param {string} name - The name of the pool.
         * @returns {object|undefined} An object from the pool or a new one if the pool is empty.
         */
        acquireFromPool(name) {
            const pool = objectPools.get(name);
            return pool ? pool.acquire() : undefined;
        },

        /**
         * Releases an object back to its pool for reuse.
         * @param {string} name - The name of the pool.
         * @param {object} obj - The object to release.
         */
        releaseToPool(name, obj) {
            const pool = objectPools.get(name);
            if(pool) {
                pool.release(obj);
            }
        },

        /**
         * A higher-order function that memoizes the result of a computationally expensive, pure function.
         * @param {function} fn - The function to memoize.
         * @returns {function} The new, memoized function.
         */
        memoize(fn) {
            if (!memoizationCaches.has(fn)) {
                memoizationCaches.set(fn, new Map());
            }
            const cache = memoizationCaches.get(fn);

            return function(...args) {
                // Create a cache key from arguments. JSON.stringify is simple but has performance implications
                // for complex objects. For primitive arguments, a simple join is faster.
                const key = args.length === 1 && typeof args[0] !== 'object' ? args[0] : JSON.stringify(args);

                if (cache.has(key)) {
                    metrics.cacheHits++;
                    return cache.get(key);
                } else {
                    metrics.cacheMisses++;
                    const result = fn.apply(this, args);
                    cache.set(key, result);
                    return result;
                }
            };
        },

        /**
         * Offloads a heavy computation to the background worker.
         * @param {object} task - The task payload to send to the worker. Must be serializable.
         * @returns {Promise<any>} A promise that resolves with the result from the worker.
         */
        offloadComputation(task) {
            if (!computationWorker) {
                return Promise.reject(new Error("Computation worker is not available."));
            }

            const id = nextWorkerTaskId++;
            return new Promise((resolve, reject) => {
                pendingWorkerTasks.set(id, { resolve, reject });
                computationWorker.postMessage({ id, task });
                metrics.tasksOffloaded++;
            });
        },

        /**
         * Retrieves the latest performance metrics.
         * @returns {object} An object containing key performance indicators.
         */
        getPerformanceMetrics() {
            // Update averages before returning
            _updateAverageLatency();
            
            // Create a deep copy to prevent external modification of the metrics object.
            return JSON.parse(JSON.stringify({
                ...metrics,
                eventQueue: {
                    size: eventQueue.size
                }
            }));
        },
    };
})();
```