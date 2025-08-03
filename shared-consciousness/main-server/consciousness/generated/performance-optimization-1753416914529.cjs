```javascript
/**
 * @file consciousness-optimizer.js
 * @description A high-performance optimization module for a hypothetical Consciousness System.
 * This module provides a suite of tools to manage and optimize the core operational pillars of a
 * complex, real-time data processing system: event handling, memory usage, computation, and latency.
 * It is designed to be production-ready, robust, and highly configurable.
 *
 * The "Consciousness System" metaphor represents any application requiring:
 * - High-throughput event processing (e.g., sensory data, user interactions).
 * - Efficient management of a large, dynamic state (e.g., short-term memory, world models).
 * - Performant execution of complex algorithms (e.g., pattern recognition, decision making).
 * - Low-latency responses to maintain a fluid, interactive experience.
 *
 * @author AI Assistant
 * @version 1.0.0
 */

/**
 * A generic Web Worker script for offloading heavy computations.
 * This script should be saved as a separate file (e.g., 'consciousness.worker.cjs') and
 * referenced when instantiating the ConsciousnessOptimizer.
 *
 * --- consciousness.worker.js ---
 *
 * self.onmessage = ({ data }) => {
 *     const { taskId, fnString, args } = data;
 *     try {
 *         // Reconstitute the function from its string representation.
 *         // CAUTION: This uses `new Function`, which has security implications similar to eval().
 *         // Ensure that `fnString` originates from a trusted source. For production, a
 *         // module-based approach (importing functions) is safer.
 *         const fn = new Function(`return ${fnString}`)();
 *         const result = fn(...args);
 *         self.postMessage({ taskId, status: 'success', result });
 *     } catch (error) {
 *         self.postMessage({ taskId, status: 'error', error: error.message });
 *     }
 * };
 *
 * --- End of consciousness.worker.js ---
 */

/**
 * A simple, array-based priority queue for managing event importance.
 * Critical events (lower priority number) are processed first.
 * @class
 */
class PriorityQueue {
    constructor() {
        this._items = [];
    }

    /**
     * Adds an item with a given priority.
     * @param {*} item The item to add.
     * @param {number} priority The priority of the item (lower is higher priority).
     */
    enqueue(item, priority = 5) {
        this._items.push({ item, priority });
        // Sort by priority after insertion. For very high frequency, a heap is better.
        this._items.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Removes and returns the highest-priority item.
     * @returns {{item: *, priority: number}|undefined} The dequeued item or undefined if empty.
     */
    dequeue() {
        return this._items.shift();
    }

    /**
     * @returns {number} The number of items in the queue.
     */
    get size() {
        return this._items.length;
    }

    /**
     * Clears the queue.
     */
    clear() {
        this._items = [];
    }
}

/**
 * An object pool to reuse objects and reduce garbage collection pressure.
 * Ideal for frequently created and discarded objects like event data or vectors.
 * @class
 */
class ObjectPool {
    /**
     * @param {Function} factory A function that creates a new object for the pool.
     * @param {Function} [resetFn] An optional function to reset an object's state before reuse.
     * @param {number} [initialSize=10] The initial number of objects in the pool.
     */
    constructor(factory, resetFn = null, initialSize = 10) {
        this._factory = factory;
        this._resetFn = resetFn;
        this._pool = [];
        this._metrics = {
            totalCreated: 0,
            totalReleased: 0,
            totalAcquired: 0,
            misses: 0,
        };

        for (let i = 0; i < initialSize; i++) {
            const obj = this._factory();
            this._metrics.totalCreated++;
            this._pool.push(obj);
        }
    }

    /**
     * Acquires an object from the pool. Creates a new one if the pool is empty.
     * @returns {*} An object instance.
     */
    acquire() {
        this._metrics.totalAcquired++;
        let obj = this._pool.pop();
        if (!obj) {
            this._metrics.misses++;
            obj = this._factory();
            this._metrics.totalCreated++;
        }
        return obj;
    }

    /**
     * Releases an object back to the pool for later reuse.
     * @param {*} obj The object to release.
     */
    release(obj) {
        if (this._resetFn) {
            this._resetFn(obj);
        }
        this._pool.push(obj);
        this._metrics.totalReleased++;
    }

    /**
     * @returns {object} The performance metrics for this pool.
     */
    getMetrics() {
        return { ...this._metrics, currentSize: this._pool.length };
    }
}


/**
 * The main Consciousness Optimizer module.
 * @class
 */
class ConsciousnessOptimizer {
    /**
     * @param {object} [config={}] Configuration options.
     * @param {string} [config.workerPath] Path to the Web Worker script for heavy computations.
     * @param {number} [config.eventBatchSize=100] Max number of events to process per frame.
     * @param {Function} [config.onMetricsReport] Callback function to receive performance reports.
     * @param {number} [config.metricsReportInterval=5000] Interval in ms to report metrics.
     */
    constructor(config = {}) {
        this.config = {
            workerPath: config.workerPath || null,
            eventBatchSize: config.eventBatchSize || 100,
            onMetricsReport: config.onMetricsReport || null,
            metricsReportInterval: config.metricsReportInterval || 5000,
        };

        // 1. Event Processing
        this._eventQueue = new PriorityQueue();
        this._isProcessingEvents = false;
        this._eventProcessorHandle = null;

        // 2. Memory Management
        this._objectPools = new Map();

        // 3. Computational Efficiency
        this._computationWorker = null;
        this._workerNextTaskId = 0;
        this._workerPendingTasks = new Map();
        this._memoizationCaches = new Map();
        this._registeredComputations = new Map();
        if (this.config.workerPath) {
            this._setupWorker();
        }

        // 4. Performance Monitoring
        this._metrics = this._initializeMetrics();
        this._monitorInterval = null;
        this._startMonitoring();
    }

    /**
     * Initializes the metrics object.
     * @private
     */
    _initializeMetrics() {
        return {
            eventProcessing: {
                processedTotal: 0,
                processedPerSecond: 0,
                queueSize: 0,
                avgLatencyMs: 0,
            },
            computation: {
                workerTasksSent: 0,
                workerTasksCompleted: 0,
                workerTasksFailed: 0,
                memoizationHits: 0,
                memoizationMisses: 0,
            },
            memory: {
                pools: {},
                jsHeapSizeLimit: performance.memory ? (performance.memory.jsHeapSizeLimit / 1e6).toFixed(2) : 'N/A',
                totalJSHeapSize: performance.memory ? (performance.memory.totalJSHeapSize / 1e6).toFixed(2) : 'N/A',
                usedJSHeapSize: performance.memory ? (performance.memory.usedJSHeapSize / 1e6).toFixed(2) : 'N/A',
            },
            lastReportTime: performance.now(),
        };
    }

    /**
     * Sets up the Web Worker for offloading computations.
     * @private
     */
    _setupWorker() {
        try {
            this._computationWorker = new Worker(this.config.workerPath);
            this._computationWorker.onmessage = this._handleWorkerMessage.bind(this);
            this._computationWorker.onerror = (error) => {
                console.error("ConsciousnessOptimizer: Worker error.", error);
                this._metrics.computation.workerTasksFailed += this._workerPendingTasks.size;
                this._workerPendingTasks.forEach(task => task.reject(error));
                this._workerPendingTasks.clear();
            };
        } catch (error) {
            console.error("ConsciousnessOptimizer: Failed to initialize Web Worker.", error);
            this._computationWorker = null;
        }
    }

    /**
     * Handles messages received from the computation worker.
     * @param {MessageEvent} event
     * @private
     */
    _handleWorkerMessage({ data }) {
        const { taskId, status, result, error } = data;
        const task = this._workerPendingTasks.get(taskId);
        if (task) {
            if (status === 'success') {
                this._metrics.computation.workerTasksCompleted++;
                task.resolve(result);
            } else {
                this._metrics.computation.workerTasksFailed++;
                task.reject(new Error(error));
            }
            this._workerPendingTasks.delete(taskId);
        }
    }

    /**
     * Schedules the event queue to be processed. Uses `requestAnimationFrame` for
     * smooth, non-blocking execution aligned with the browser's render cycle.
     * @private
     */
    _scheduleEventProcessing() {
        if (this._isProcessingEvents) return;
        this._isProcessingEvents = true;
        this._eventProcessorHandle = requestAnimationFrame(this._processEventQueue.bind(this));
    }

    /**
     * Processes a batch of events from the queue. This represents a single "cognitive cycle".
     * @private
     */
    _processEventQueue() {
        performance.mark('event-batch-start');
        let processedCount = 0;

        while (this._eventQueue.size > 0 && processedCount < this.config.eventBatchSize) {
            const eventData = this._eventQueue.dequeue();
            if (eventData && typeof eventData.item === 'function') {
                try {
                    // Execute the event handler function
                    eventData.item();
                } catch (e) {
                    console.error("ConsciousnessOptimizer: Error processing event.", e);
                }
                processedCount++;
            }
        }

        this._metrics.eventProcessing.processedTotal += processedCount;

        performance.mark('event-batch-end');
        performance.measure('event-batch-latency', 'event-batch-start', 'event-batch-end');
        const measure = performance.getEntriesByName('event-batch-latency', 'measure')[0];
        if(measure) {
            // Update average latency using a moving average
            const { avgLatencyMs, processedTotal } = this._metrics.eventProcessing;
            this._metrics.eventProcessing.avgLatencyMs = ((avgLatencyMs * (processedTotal - processedCount)) + measure.duration) / processedTotal;
        }
        performance.clearMeasures('event-batch-latency');


        if (this._eventQueue.size > 0) {
            // More events to process, schedule the next cycle
            this._isProcessingEvents = false;
            this._scheduleEventProcessing();
        } else {
            // Queue is empty, go idle
            this._isProcessingEvents = false;
        }
    }

    // --- PUBLIC API ---

    /**
     * Submits a new "sensory input" or event to be processed.
     * @param {Function} handler The function to execute for this event.
     * @param {number} [priority=5] The event's priority (1=highest, 10=lowest).
     */
    processEvent(handler, priority = 5) {
        if (typeof handler !== 'function') {
            console.error("ConsciousnessOptimizer: Event handler must be a function.");
            return;
        }
        this._eventQueue.enqueue(handler, priority);
        this._scheduleEventProcessing();
    }

    /**
     * Creates and registers an object pool for a specific type of object.
     * @param {string} name A unique name for the pool (e.g., 'ThoughtFragment', 'SensoryEvent').
     * @param {Function} factory A function that creates new objects for the pool.
     * @param {Function} [resetFn] A function to reset an object before it's reused.
     * @param {number} [initialSize=10] The number of objects to pre-allocate.
     */
    createObjectPool(name, factory, resetFn, initialSize) {
        if (this._objectPools.has(name)) {
            console.warn(`ConsciousnessOptimizer: Object pool '${name}' already exists.`);
            return;
        }
        const pool = new ObjectPool(factory, resetFn, initialSize);
        this._objectPools.set(name, pool);
    }

    /**
     * Acquires an object from a named pool.
     * @param {string} name The name of the pool.
     * @returns {*} An object instance or null if the pool doesn't exist.
     */
    acquireObject(name) {
        const pool = this._objectPools.get(name);
        return pool ? pool.acquire() : null;
    }

    /**
     * Releases an object back to its named pool.
     * @param {string} name The name of the pool.
     * @param {*} obj The object to release.
     */
    releaseObject(name, obj) {
        const pool = this._objectPools.get(name);
        if (pool) {
            pool.release(obj);
        } else {
            console.warn(`ConsciousnessOptimizer: Cannot release object. Pool '${name}' not found.`);
        }
    }

    /**
     * Registers a computationally expensive function for optimization.
     * The function will be memoized. If `offloadToWorker` is true, it may be run in a Web Worker.
     * @param {string} name A unique name for the computation.
     * @param {Function} fn The expensive function to optimize.
     * @param {object} [options={}]
     * @param {boolean} [options.offloadToWorker=false] Whether to run this in the Web Worker.
     * @param {boolean} [options.useWeakMap=false] Use WeakMap for memoization (keys must be objects).
     */
    registerComputation(name, fn, options = {}) {
        const { offloadToWorker = false, useWeakMap = false } = options;
        const cache = useWeakMap ? new WeakMap() : new Map();
        this._memoizationCaches.set(name, cache);

        const memoizedFn = (...args) => {
            const cacheKey = useWeakMap ? args[0] : JSON.stringify(args); // Simple key for non-object args
            if (cache.has(cacheKey)) {
                this._metrics.computation.memoizationHits++;
                return cache.get(cacheKey);
            }

            this._metrics.computation.memoizationMisses++;
            const result = fn(...args);
            cache.set(cacheKey, result);
            return result;
        };

        this._registeredComputations.set(name, {
            originalFn: fn,
            memoizedFn,
            offload: offloadToWorker && !!this._computationWorker,
        });
    }

    /**
     * Executes a registered computation.
     * It automatically uses the memoization cache and offloads to a worker if configured.
     * @param {string} name The name of the registered computation.
     * @param {...*} args Arguments to pass to the function.
     * @returns {Promise<*>|*} The result of the computation. Returns a Promise if offloaded to a worker.
     */
    compute(name, ...args) {
        const computation = this._registeredComputations.get(name);
        if (!computation) {
            throw new Error(`ConsciousnessOptimizer: Computation '${name}' is not registered.`);
        }

        if (computation.offload) {
            this._metrics.computation.workerTasksSent++;
            const taskId = this._workerNextTaskId++;
            const promise = new Promise((resolve, reject) => {
                this._workerPendingTasks.set(taskId, { resolve, reject });
            });

            this._computationWorker.postMessage({
                taskId,
                fnString: computation.originalFn.toString(),
                args,
            });
            return promise;
        } else {
            // Use the memoized version on the main thread
            return computation.memoizedFn(...args);
        }
    }

    /**
     * Starts the performance monitoring and reporting interval.
     * @private
     */
    _startMonitoring() {
        if (this._monitorInterval) clearInterval(this._monitorInterval);
        this._monitorInterval = setInterval(() => {
            this._updateAndReportMetrics();
        }, this.config.metricsReportInterval);
    }

    /**
     * Gathers current metrics, calculates rates, and reports them.
     * @private
     */
    _updateAndReportMetrics() {
        const now = performance.now();
        const elapsedSeconds = (now - this._metrics.lastReportTime) / 1000;

        // Calculate events per second
        const processedSinceLast = this._metrics.eventProcessing.processedTotal - (this._metrics.lastProcessedTotal || 0);
        this._metrics.eventProcessing.processedPerSecond = (processedSinceLast / elapsedSeconds).toFixed(2);
        this._metrics.lastProcessedTotal = this._metrics.eventProcessing.processedTotal;

        // Update queue size
        this._metrics.eventProcessing.queueSize = this._eventQueue.size;

        // Update memory usage
        if (performance.memory) {
            this._metrics.memory.totalJSHeapSize = (performance.memory.totalJSHeapSize / 1e6).toFixed(2);
            this._metrics.memory.usedJSHeapSize = (performance.memory.usedJSHeapSize / 1e6).toFixed(2);
        }

        // Update pool metrics
        this._objectPools.forEach((pool, name) => {
            this._metrics.memory.pools[name] = pool.getMetrics();
        });

        this._metrics.lastReportTime = now;

        if (this.config.onMetricsReport) {
            // Create a deep copy to prevent mutation
            this.config.onMetricsReport(JSON.parse(JSON.stringify(this._metrics)));
        } else {
            // Default console logging if no callback is provided
            console.group(`[ConsciousnessOptimizer] Performance Report @ ${new Date().toLocaleTimeString()}`);
            console.log(`Event Processing: ${this._metrics.eventProcessing.processedPerSecond} EPS, Queue: ${this._metrics.eventProcessing.queueSize}, Avg Latency: ${this._metrics.eventProcessing.avgLatencyMs.toFixed(3)}ms`);
            console.log(`Computation: Memo Hits: ${this._metrics.computation.memoizationHits}, Misses: ${this._metrics.computation.memoizationMisses}`);
            console.log(`Worker: Sent: ${this._metrics.computation.workerTasksSent}, Completed: ${this._metrics.computation.workerTasksCompleted}, Failed: ${this._metrics.computation.workerTasksFailed}`);
            console.log(`Memory: Used JS Heap: ${this._metrics.memory.usedJSHeapSize} MB / ${this._metrics.memory.totalJSHeapSize} MB`);
            console.groupEnd();
        }
    }

    /**
     * Shuts down the optimizer, cleaning up workers and intervals.
     * Essential for preventing memory leaks in single-page applications.
     */
    shutdown() {
        // Stop processing events
        if (this._eventProcessorHandle) {
            cancelAnimationFrame(this._eventProcessorHandle);
        }
        this._eventQueue.clear();

        // Terminate the worker
        if (this._computationWorker) {
            this._computationWorker.terminate();
            this._computationWorker = null;
        }
        this._workerPendingTasks.forEach(task => task.reject(new Error("Optimizer is shutting down.")));
        this._workerPendingTasks.clear();

        // Stop monitoring
        if (this._monitorInterval) {
            clearInterval(this._monitorInterval);
        }

        console.log("ConsciousnessOptimizer has been shut down.");
    }
}
```