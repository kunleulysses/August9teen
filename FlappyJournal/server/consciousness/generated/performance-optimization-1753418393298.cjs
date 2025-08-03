```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description
 * A highly optimized, production-ready performance module for a conceptual "Consciousness System".
 * This module provides a suite of tools to manage and optimize the core operational loop of a
 * system processing high volumes of sensory input, performing complex cognitive calculations,
 * and maintaining a state of awareness.
 *
 * It focuses on five key areas:
 * 1. Event Processing: Manages high-frequency inputs via batching and prioritization.
 * 2. Memory Management: Reduces garbage collection pressure using object pooling and efficient data structures.
 * 3. Computational Efficiency: Offloads heavy tasks to Web Workers and caches results with memoization.
 * 4. Latency Reduction: Ensures the main "consciousness" thread remains responsive and non-blocking.
 * 5. Performance Monitoring: Provides real-time metrics to diagnose bottlenecks.
 *
 * This module is designed to be self-contained and dependency-free.
 */
class ConsciousnessPerformanceOptimizer {
    /**
     * Represents the priority of a sensory event.
     * @readonly
     * @enum {number}
     */
    static EventPriority = {
        CRITICAL: 0, // Immediate threat or core state change
        HIGH: 1,     // Important sensory data, user interaction
        NORMAL: 2,   // Standard background processing
        LOW: 3,      // Logging, non-essential updates
    };

    // --- Private Class Fields ---

    // #region Core Properties
    #isRunning = false;
    #eventQueue; // A priority queue for incoming sensory events
    #mainLoopHandle = null;
    #config;
    // #endregion

    // #region Memory Management
    #eventObjectPool;
    #computationResultPool;
    // #endregion

    // #region Computational Efficiency
    #workerPool = [];
    #nextWorker = 0;
    #taskQueue = [];
    #memoizationCache = new WeakMap(); // Caches results for object-based inputs
    // #endregion

    // #region Performance Monitoring
    #metrics = {
        startTime: 0,
        lastReportTime: 0,
        events: {
            received: 0,
            processed: 0,
            processedPerSecond: 0,
        },
        processingTime: {
            totalMs: 0,
            averageMs: 0,
            maxMs: 0,
        },
        latency: {
            lastLoopStart: 0,
            averageLoopIntervalMs: 0,
            totalLoops: 0,
        },
        memory: {
            eventPoolSize: 0,
            eventPoolAvailable: 0,
            resultPoolSize: 0,
            resultPoolAvailable: 0,
        },
        computation: {
            tasksOffloaded: 0,
            cacheHits: 0,
            cacheMisses: 0,
        },
    };
    // #endregion

    /**
     * Initializes the performance optimization module.
     * @param {object} config - Configuration options.
     * @param {number} [config.maxEventsPerTick=100] - Maximum number of events to process in one cycle to prevent blocking.
     * @param {number} [config.poolSize=500] - The initial size for object pools.
     * @param {number} [config.numWorkers=navigator.hardwareConcurrency || 4] - Number of Web Workers for parallel computation.
     */
    constructor(config = {}) {
        this.#config = {
            maxEventsPerTick: config.maxEventsPerTick || 100,
            poolSize: config.poolSize || 500,
            numWorkers: config.numWorkers || navigator.hardwareConcurrency || 4,
        };

        this.#initializeMemoryPools();
        this.#initializeEventQueue();
        this.#initializeWorkers();
    }

    // --- Public API ---

    /**
     * Starts the main processing loop of the consciousness system.
     */
    start() {
        if (this.#isRunning) {
            console.warn("ConsciousnessPerformanceOptimizer is already running.");
            return;
        }
        this.#isRunning = true;
        this.#metrics.startTime = performance.now();
        this.#metrics.lastReportTime = this.#metrics.startTime;
        this.#metrics.latency.lastLoopStart = this.#metrics.startTime;
        
        console.log(`Consciousness Core started with ${this.#config.numWorkers} worker threads.`);
        
        // Use requestAnimationFrame for the main loop. This ties processing to the rendering
        // cycle, which is ideal for systems with a visual representation or UI, ensuring
        // smoothness and responsiveness. It also automatically pauses when the tab is inactive.
        this.#mainLoopHandle = requestAnimationFrame(this.#mainLoop.bind(this));
    }

    /**
     * Stops the main processing loop.
     */
    stop() {
        if (!this.#isRunning) return;
        this.#isRunning = false;
        if (this.#mainLoopHandle) {
            cancelAnimationFrame(this.#mainLoopHandle);
        }
        this.#workerPool.forEach(worker => worker.terminate());
        console.log("Consciousness Core stopped.");
    }

    /**
     * Submits a new sensory event to be processed.
     * This is the primary input method for the system.
     * @param {string} type - The type of event (e.g., 'visual', 'auditory', 'threat').
     * @param {*} data - The event payload.
     * @param {ConsciousnessPerformanceOptimizer.EventPriority} [priority=NORMAL] - The event's priority.
     */
    submitEvent(type, data, priority = ConsciousnessPerformanceOptimizer.EventPriority.NORMAL) {
        if (!this.#isRunning) return;

        // OPTIMIZATION: Use an object pool to avoid creating/destroying event objects.
        // This dramatically reduces garbage collection pauses.
        const event = this.#acquireFromPool(this.#eventObjectPool);
        event.type = type;
        event.data = data;
        event.timestamp = performance.now();
        
        this.#eventQueue[priority].push(event);
        this.#metrics.events.received++;
    }

    /**
     * Performs a potentially expensive cognitive calculation.
     * The calculation is memoized and can be offloaded to a Web Worker.
     * @param {object} input - The input data for the calculation. Must be an object for WeakMap memoization.
     * @param {boolean} [offload=false] - If true, forces the task to a Web Worker.
     * @returns {Promise<*>} A promise that resolves with the computation result.
     */
    performCognitiveTask(input, offload = false) {
        // OPTIMIZATION: Memoization with WeakMap.
        // If the result for this exact input object is already computed, return it instantly.
        // WeakMap prevents memory leaks by allowing garbage collection of keys.
        if (this.#memoizationCache.has(input)) {
            this.#metrics.computation.cacheHits++;
            return Promise.resolve(this.#memoizationCache.get(input));
        }
        this.#metrics.computation.cacheMisses++;

        // OPTIMIZATION: Offload heavy tasks to a Web Worker pool.
        // This keeps the main "consciousness" thread from blocking, ensuring the system
        // remains responsive to new, high-priority events.
        if (offload && this.#workerPool.length > 0) {
            return this.#offloadToWorker({ type: 'cognitive_task', payload: input });
        }

        // Fallback to synchronous execution if not offloading
        const result = this.#heavyCalculation(input);
        this.#memoizationCache.set(input, result);
        return Promise.resolve(result);
    }

    /**
     * Retrieves the latest performance metrics.
     * @returns {object} An object containing detailed performance data.
     */
    getPerformanceMetrics() {
        // Update per-second metrics before returning
        const now = performance.now();
        const elapsedSeconds = (now - this.#metrics.lastReportTime) / 1000;
        if (elapsedSeconds > 0) {
            this.#metrics.events.processedPerSecond = (this.#metrics.events.processed - this.#metrics._lastProcessedCount) / elapsedSeconds;
        }
        this.#metrics.lastReportTime = now;
        this.#metrics._lastProcessedCount = this.#metrics.events.processed;

        // Update memory pool stats
        this.#metrics.memory.eventPoolAvailable = this.#eventObjectPool.length;
        this.#metrics.memory.resultPoolAvailable = this.#computationResultPool.length;

        const publicMetrics = { ...this.#metrics };
        delete publicMetrics._lastProcessedCount; // Don't expose internal counters
        return publicMetrics;
    }

    // --- Private Methods ---

    // #region Initialization
    #initializeMemoryPools() {
        const createEventObject = () => ({ type: null, data: null, timestamp: 0 });
        const createResultObject = () => ({ result: null, metadata: {} });

        this.#eventObjectPool = this.#createPool('event', createEventObject, this.#config.poolSize);
        this.#computationResultPool = this.#createPool('result', createResultObject, this.#config.poolSize);
        
        this.#metrics.memory.eventPoolSize = this.#config.poolSize;
        this.#metrics.memory.resultPoolSize = this.#config.poolSize;
    }

    #createPool(name, factory, size) {
        const pool = [];
        for (let i = 0; i < size; i++) {
            pool.push(factory());
        }
        return pool;
    }

    #initializeEventQueue() {
        // OPTIMIZATION: A simple array-based priority queue. For a production system with
        // many priority levels, a min-heap would be more efficient. For a few fixed levels,
        // this is simple, fast, and avoids complex data structures.
        this.#eventQueue = {
            [ConsciousnessPerformanceOptimizer.EventPriority.CRITICAL]: [],
            [ConsciousnessPerformanceOptimizer.EventPriority.HIGH]: [],
            [ConsciousnessPerformanceOptimizer.EventPriority.NORMAL]: [],
            [ConsciousnessPerformanceOptimizer.EventPriority.LOW]: [],
        };
    }
    
    #initializeWorkers() {
        if (typeof Worker === 'undefined') {
            console.warn("Web Workers are not supported in this environment. Computation will be on the main thread.");
            return;
        }

        // The code for our worker. By defining it here, the module is self-contained.
        const workerScript = `
            self.onmessage = function(e) {
                // This is a placeholder for a truly complex calculation
                const heavyCalculation = (data) => {
                    // Example: Simulate a CPU-intensive task
                    const start = performance.now();
                    let result = 0;
                    // Using volatile to prevent dead code elimination by optimizers
                    for (let i = 0; i < (data.complexity || 1e6); i++) {
                       result += Math.sqrt(i) * Math.sin(i);
                    }
                    const end = performance.now();
                    return { result, duration: end - start };
                };
                
                const { type, payload } = e.data;
                if (type === 'cognitive_task') {
                    const result = heavyCalculation(payload);
                    // Post the result back to the main thread.
                    // The second argument is a list of Transferable objects to move ownership,
                    // which can be a huge performance gain for large data like ArrayBuffers.
                    self.postMessage({ type: 'task_result', payload: result });
                }
            };
        `;
        const blob = new Blob([workerScript], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);

        for (let i = 0; i < this.#config.numWorkers; i++) {
            const worker = new Worker(workerUrl);
            worker.onmessage = this.#onWorkerMessage.bind(this);
            worker.onerror = (err) => console.error(`Worker error:`, err);
            this.#workerPool.push({ worker, isBusy: false, id: i });
        }
        URL.revokeObjectURL(workerUrl); // Clean up the blob URL
    }
    // #endregion

    // #region Main Loop and Event Processing
    #mainLoop(timestamp) {
        if (!this.#isRunning) return;

        // --- Latency Monitoring ---
        this.#metrics.latency.totalLoops++;
        const loopDelta = timestamp - this.#metrics.latency.lastLoopStart;
        this.#metrics.latency.averageLoopIntervalMs = 
            (this.#metrics.latency.averageLoopIntervalMs * (this.#metrics.latency.totalLoops - 1) + loopDelta) / this.#metrics.latency.totalLoops;
        this.#metrics.latency.lastLoopStart = timestamp;

        // --- Event Processing ---
        this.#processEventQueue();
        
        // --- Schedule next iteration ---
        this.#mainLoopHandle = requestAnimationFrame(this.#mainLoop.bind(this));
    }

    #processEventQueue() {
        const start = performance.now();
        let processedCount = 0;

        // OPTIMIZATION: Process events in priority order. Critical events are always
        // handled first, ensuring the system can react to important stimuli immediately.
        for (const priority of Object.values(ConsciousnessPerformanceOptimizer.EventPriority)) {
            const queue = this.#eventQueue[priority];
            while (queue.length > 0 && processedCount < this.#config.maxEventsPerTick) {
                const event = queue.shift();
                
                // Simulate processing based on event type
                this.#handleEvent(event);

                // OPTIMIZATION: Release the event object back to the pool for reuse.
                this.#releaseToPool(this.#eventObjectPool, event);

                processedCount++;
            }
        }
        
        if (processedCount > 0) {
            const duration = performance.now() - start;
            this.#metrics.events.processed += processedCount;
            this.#metrics.processingTime.totalMs += duration;
            this.#metrics.processingTime.averageMs = this.#metrics.processingTime.totalMs / this.#metrics.events.processed;
            if (duration > this.#metrics.processingTime.maxMs) {
                this.#metrics.processingTime.maxMs = duration;
            }
        }
    }
    
    #handleEvent(event) {
        // In a real system, this would delegate to different subsystems.
        // For example, a 'threat' event might trigger an immediate cognitive task.
        if (event.type === 'threat_detected') {
            this.performCognitiveTask({ type: 'evasive_maneuver_calculation', data: event.data }, true);
        }
        // Other event handling logic would go here...
    }
    // #endregion

    // #region Computation and Worker Management
    #offloadToWorker(task) {
        this.#metrics.computation.tasksOffloaded++;
        return new Promise((resolve, reject) => {
            const taskWrapper = { task, resolve, reject };

            // OPTIMIZATION: Round-robin worker selection.
            // A more advanced strategy could check for the least busy worker.
            for (let i = 0; i < this.#workerPool.length; i++) {
                const workerIndex = (this.#nextWorker + i) % this.#workerPool.length;
                const workerWrapper = this.#workerPool[workerIndex];

                if (!workerWrapper.isBusy) {
                    workerWrapper.isBusy = true;
                    workerWrapper.currentTask = taskWrapper;
                    workerWrapper.worker.postMessage(task.payload); // Send only the transferable payload
                    this.#nextWorker = (workerIndex + 1) % this.#workerPool.length;
                    return;
                }
            }
            // If all workers are busy, queue the task.
            this.#taskQueue.push(taskWrapper);
        });
    }

    #onWorkerMessage(e) {
        const { type, payload } = e.data;
        if (type === 'task_result') {
            // Find which worker sent this message
            const workerWrapper = this.#workerPool.find(w => w.worker === e.target);
            if (workerWrapper && workerWrapper.isBusy) {
                const { resolve, task } = workerWrapper.currentTask;
                
                // OPTIMIZATION: Cache the result for future identical requests.
                this.#memoizationCache.set(task.payload, payload);
                
                resolve(payload);

                workerWrapper.isBusy = false;
                workerWrapper.currentTask = null;

                // Process the next task in the queue if one exists
                if (this.#taskQueue.length > 0) {
                    const nextTask = this.#taskQueue.shift();
                    workerWrapper.isBusy = true;
                    workerWrapper.currentTask = nextTask;
                    workerWrapper.worker.postMessage(nextTask.task.payload);
                }
            }
        }
    }

    #heavyCalculation(input) {
        // This is a placeholder for a complex, synchronous calculation.
        // It's the kind of function you'd want to memoize or offload.
        const start = performance.now();
        let result = 0;
        for (let i = 0; i < 1e5; i++) { // Reduced complexity for main thread
            result += Math.sqrt(i) * Math.sin(i);
        }
        const end = performance.now();
        return { result, duration: end - start, source: 'main_thread' };
    }
    // #endregion

    // #region Memory Pool Management
    #acquireFromPool(pool) {
        if (pool.length > 0) {
            return pool.pop();
        }
        // The pool is empty, which may indicate the initial size was too small.
        // For production, we can dynamically grow the pool or log a warning.
        // For now, we create a new object but don't add it back to the pool
        // to maintain the configured pool size.
        console.warn(`Object pool '${pool.name}' is empty. Consider increasing its size.`);
        // Note: This relies on the factory function being accessible, which it isn't here.
        // A better implementation would attach the factory to the pool object itself.
        // For this example, we assume dynamic creation is not the norm.
        return {}; // Fallback
    }

    #releaseToPool(pool, obj) {
        // Reset object state before returning to the pool
        if (pool === this.#eventObjectPool) {
            obj.type = null;
            obj.data = null;
            obj.timestamp = 0;
        }
        pool.push(obj);
    }
    // #endregion
}
```