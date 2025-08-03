```javascript
/**
 * @file consciousness-performance-optimizer.js
 * @description A highly optimized performance module for a conceptual "Consciousness System".
 * This module provides a set of tools to manage high-throughput event processing,
 * reduce memory churn, optimize expensive computations, and minimize latency.
 * It is designed for production environments where real-time performance is critical.
 *
 * @module ConsciousnessPerformanceOptimizer
 */

class ConsciousnessPerformanceOptimizer {
    /**
     * Initializes the performance optimization module.
     * @param {object} config - Configuration for the optimizer.
     * @param {number} [config.eventQueueBatchSize=1000] - Max events to process in one tick.
     * @param {number} [config.processingIntervalMs=16] - The interval for the processing loop (ms). ~60 FPS.
     * @param {function} config.consciousnessCalculator - The core computational function to be executed on processed data.
     * @param {function} [config.onMetricsUpdate] - Optional callback for receiving performance metrics.
     * @param {number} [config.metricsUpdateIntervalMs=1000] - How often to call onMetricsUpdate.
     */
    constructor({
        eventQueueBatchSize = 1000,
        processingIntervalMs = 16,
        consciousnessCalculator,
        onMetricsUpdate,
        metricsUpdateIntervalMs = 1000
    }) {
        if (typeof consciousnessCalculator !== 'function') {
            throw new Error('A `consciousnessCalculator` function must be provided.');
        }

        this.config = {
            eventQueueBatchSize,
            processingIntervalMs,
            consciousnessCalculator,
            onMetricsUpdate,
            metricsUpdateIntervalMs
        };

        // 1. Event Processing Optimization: A prioritized event queue.
        // Using two arrays for high/low priority to avoid sorting a single large queue.
        this.eventQueue = {
            high: [],
            low: []
        };

        // 2. Memory Management: Object pooling for "Percept" objects.
        // Avoids constant GC from creating/destroying event objects.
        this._perceptPool = this._createObjectPool({
            create: () => ({
                id: null,
                timestamp: 0,
                source: null,
                data: null,
                priority: 1
            }),
            reset: (p) => {
                p.id = null;
                p.timestamp = 0;
                p.source = null;
                p.data = null;
                p.priority = 1;
                return p;
            },
            initialSize: eventQueueBatchSize * 2
        });

        // 3. Computational Efficiency & 4. Latency Reduction: Offloading to Web Workers.
        // Creates a pool of workers to run expensive calculations off the main thread.
        this._workerPool = this._createWorkerPool({
            workerCount: navigator.hardwareConcurrency || 4,
            taskFunction: consciousnessCalculator
        });
        this._nextWorker = 0;

        // 5. Performance Monitoring
        this.metrics = this._initializeMetrics();
        this._metricsInterval = null;
        this._processingInterval = null;

        this._isRunning = false;
    }

    /**
     * Starts the optimization system's processing loop.
     */
    start() {
        if (this._isRunning) {
            console.warn('Optimizer is already running.');
            return;
        }
        this._isRunning = true;

        // Start the main processing loop
        this._processingInterval = setInterval(
            () => this._processEventBatch(),
            this.config.processingIntervalMs
        );

        // Start the metrics reporting loop if a callback is provided
        if (this.config.onMetricsUpdate) {
            this._metricsInterval = setInterval(() => {
                this._calculateMetrics();
                this.config.onMetricsUpdate(this.getPerformanceMetrics());
                this.metrics.eventsProcessedInInterval = 0; // Reset for next interval
            }, this.config.metricsUpdateIntervalMs);
        }
        console.log('Consciousness Performance Optimizer started.');
    }

    /**
     * Stops the system and cleans up resources.
     */
    shutdown() {
        if (!this._isRunning) return;
        this._isRunning = false;

        clearInterval(this._processingInterval);
        clearInterval(this._metricsInterval);
        this._workerPool.terminateAll();

        this.eventQueue.high.length = 0;
        this.eventQueue.low.length = 0;
        this._perceptPool.clear();

        console.log('Consciousness Performance Optimizer stopped and resources cleaned up.');
    }

    /**
     * Public method to inject a new sensory event into the system.
     * @param {object} eventData - The raw data of the event.
     * @param {object} options - Event options.
     * @param {number} [options.priority=1] - The priority of the event (0 = high, 1 = low).
     * @param {string} [options.source='unknown'] - The source of the event.
     */
    addSensoryInput(eventData, { priority = 1, source = 'unknown' } = {}) {
        if (!this._isRunning) return;

        const percept = this._perceptPool.get();
        percept.id = `p_${performance.now()}_${Math.random()}`;
        percept.timestamp = performance.now();
        percept.source = source;
        percept.data = eventData;
        percept.priority = priority;

        if (priority === 0) {
            this.eventQueue.high.push(percept);
        } else {
            this.eventQueue.low.push(percept);
        }
        this.metrics.totalEventsQueued++;
    }

    /**
     * Returns a snapshot of the current performance metrics.
     * @returns {object} The performance metrics object.
     */
    getPerformanceMetrics() {
        // Provides a copy to prevent external modification
        return { ...this.metrics };
    }

    /**
     * The core processing loop, executed on each interval tick.
     * @private
     */
    _processEventBatch() {
        const startTime = performance.now();
        let eventsToProcess = [];
        const batchSize = this.config.eventQueueBatchSize;

        // Prioritize high-priority events
        const highPriorityCount = Math.min(this.eventQueue.high.length, batchSize);
        if (highPriorityCount > 0) {
            eventsToProcess = eventsToProcess.concat(this.eventQueue.high.splice(0, highPriorityCount));
        }

        // Fill the rest of the batch with low-priority events
        const lowPriorityCount = Math.min(this.eventQueue.low.length, batchSize - eventsToProcess.length);
        if (lowPriorityCount > 0) {
            eventsToProcess = eventsToProcess.concat(this.eventQueue.low.splice(0, lowPriorityCount));
        }

        if (eventsToProcess.length === 0) {
            return;
        }

        // Offload the batch to the next available Web Worker
        const worker = this._workerPool.getWorker(this._nextWorker);
        this._nextWorker = (this._nextWorker + 1) % this._workerPool.workers.length;

        const taskData = eventsToProcess.map(p => p.data); // Send only raw data to worker
        const taskStartTime = performance.now();

        worker.postMessage(taskData)
            .then(results => {
                const latency = performance.now() - taskStartTime;
                this.metrics.computationLatencies.push(latency);
                if (this.metrics.computationLatencies.length > 100) {
                    this.metrics.computationLatencies.shift(); // Keep buffer from growing too large
                }

                // In a real system, you would do something with the results here.
                // e.g., update internal state, trigger actions, etc.

                // IMPORTANT: Release percepts back to the pool
                eventsToProcess.forEach(p => this._perceptPool.release(p));
            })
            .catch(error => {
                console.error('Consciousness calculation failed in worker:', error);
                // Still release percepts to prevent memory leaks
                eventsToProcess.forEach(p => this._perceptPool.release(p));
            });


        const endTime = performance.now();
        const duration = endTime - startTime;

        // Update metrics
        this.metrics.processingTimePerBatch.push(duration);
        if (this.metrics.processingTimePerBatch.length > 100) {
            this.metrics.processingTimePerBatch.shift();
        }
        this.metrics.eventsProcessedInInterval += eventsToProcess.length;
        this.metrics.totalEventsProcessed += eventsToProcess.length;
    }

    /**
     * Calculates aggregate metrics over the update interval.
     * @private
     */
    _calculateMetrics() {
        const now = performance.now();
        const intervalSeconds = (now - this.metrics.lastMetricsUpdateTime) / 1000;
        this.metrics.lastMetricsUpdateTime = now;

        this.metrics.eventsPerSecond = this.metrics.eventsProcessedInInterval / intervalSeconds;
        
        const latencies = this.metrics.computationLatencies;
        this.metrics.avgComputationLatencyMs = latencies.length > 0 ?
            latencies.reduce((a, b) => a + b, 0) / latencies.length : 0;
        
        const batchTimes = this.metrics.processingTimePerBatch;
        this.metrics.avgProcessingTimePerBatchMs = batchTimes.length > 0 ?
            batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length : 0;

        this.metrics.currentQueueSize = this.eventQueue.high.length + this.eventQueue.low.length;
        this.metrics.poolStatus = this._perceptPool.getStatus();

        // Non-standard memory reporting (available in Chrome-based browsers)
        if (performance.memory) {
            this.metrics.memoryUsage = {
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize,
            };
        }
    }

    /**
     * Initializes the metrics object.
     * @private
     */
    _initializeMetrics() {
        return {
            startTime: performance.now(),
            lastMetricsUpdateTime: performance.now(),
            totalEventsQueued: 0,
            totalEventsProcessed: 0,
            eventsProcessedInInterval: 0,
            eventsPerSecond: 0,
            currentQueueSize: 0,
            processingTimePerBatch: [], // Stores last 100 durations
            avgProcessingTimePerBatchMs: 0,
            computationLatencies: [], // Stores last 100 latencies
            avgComputationLatencyMs: 0,
            poolStatus: {
                size: 0,
                available: 0,
                inUse: 0
            },
            memoryUsage: null,
        };
    }

    /**
     * Factory for creating a generic object pool.
     * @private
     */
    _createObjectPool({ create, reset, initialSize = 100 }) {
        const pool = [];
        const inUse = new Set();

        const expandPool = (count) => {
            for (let i = 0; i < count; i++) {
                pool.push(create());
            }
        };

        expandPool(initialSize);

        return {
            get: () => {
                if (pool.length === 0) {
                    // Pool is empty, dynamically expand it.
                    // This indicates high load; could be a metric to watch.
                    expandPool(initialSize / 2);
                }
                const obj = pool.pop();
                inUse.add(obj);
                return obj;
            },
            release: (obj) => {
                if (inUse.has(obj)) {
                    inUse.delete(obj);
                    pool.push(reset(obj));
                }
            },
            clear: () => {
                pool.length = 0;
                inUse.clear();
            },
            getStatus: () => ({
                size: pool.length + inUse.size,
                available: pool.length,
                inUse: inUse.size,
            }),
        };
    }

    /**
     * Factory for creating a Web Worker pool to offload computation.
     * @private
     */
    _createWorkerPool({ workerCount, taskFunction }) {
        const workers = [];
        const promises = {};
        let promiseId = 0;

        // Serialize the function to be run in the worker.
        // NOTE: This has limitations. The function cannot rely on closures or external scope.
        // It must be a pure function.
        const taskFunctionString = taskFunction.toString();

        const workerScript = `
            self.onmessage = (e) => {
                const { id, payload } = e.data;
                try {
                    // Rehydrate the function inside the worker
                    const taskFunction = ${taskFunctionString};
                    const result = taskFunction(payload);
                    self.postMessage({ id, status: 'success', result });
                } catch (error) {
                    self.postMessage({ id, status: 'error', error: error.message });
                }
            };
        `;
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);

        for (let i = 0; i < workerCount; i++) {
            const worker = new Worker(url);
            worker.onmessage = (e) => {
                const { id, status, result, error } = e.data;
                if (promises[id]) {
                    if (status === 'success') {
                        promises[id].resolve(result);
                    } else {
                        promises[id].reject(new Error(error));
                    }
                    delete promises[id];
                }
            };
            worker.onerror = (e) => {
                // Handle catastrophic worker errors
                console.error(`Worker error: ${e.message}`);
                // Find and reject any pending promises for this worker (more complex logic needed for mapping)
            };

            workers.push({
                worker,
                postMessage: (payload) => {
                    const id = promiseId++;
                    return new Promise((resolve, reject) => {
                        promises[id] = { resolve, reject };
                        worker.postMessage({ id, payload });
                    });
                }
            });
        }

        URL.revokeObjectURL(url); // Clean up the blob URL

        return {
            workers,
            getWorker: (index) => workers[index],
            terminateAll: () => workers.forEach(w => w.worker.terminate()),
        };
    }

    /**
     * A higher-order function for memoizing expensive, pure calculations.
     * This can be used to wrap specific sub-routines within the main consciousnessCalculator.
     * @param {function} fn - The pure function to memoize.
     * @param {number} [cacheSize=100] - The maximum size of the LRU cache.
     * @returns {function} The memoized function.
     */
    static memoize(fn, cacheSize = 100) {
        const cache = new Map();

        return (...args) => {
            const key = JSON.stringify(args); // Simple but effective key generation
            if (cache.has(key)) {
                // Move to end to signify it was recently used
                const value = cache.get(key);
                cache.delete(key);
                cache.set(key, value);
                return value;
            }

            const result = fn(...args);
            cache.set(key, result);

            // Enforce cache size (LRU eviction)
            if (cache.size > cacheSize) {
                const oldestKey = cache.keys().next().value;
                cache.delete(oldestKey);
            }

            return result;
        };
    }
}
```