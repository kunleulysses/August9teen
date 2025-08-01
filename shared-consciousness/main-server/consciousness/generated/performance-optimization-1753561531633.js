```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description A highly optimized module for managing the performance of a conceptual
 * "Consciousness System". This module integrates several advanced JavaScript performance
 * patterns to ensure efficient event processing, memory management, and low-latency
 * computations, crucial for a responsive and scalable cognitive architecture.
 *
 * Features:
 * 1.  **Event Processing Optimization**: Uses a priority queue and batch processing with
 *     `requestIdleCallback` to handle events without blocking the main thread. High-priority
 *     events (e.g., "threats") are processed immediately.
 * 2.  **Memory Management**: Implements object pooling to reduce garbage collection pressure,
 *     WeakMap for ephemeral caching (short-term memory), and a capped Map for long-term
 *     memory to prevent memory leaks.
 * 3.  **Computational Efficiency**: Offloads heavy computations to a Web Worker to keep the
 *     main consciousness loop responsive. Uses memoization for expensive, pure functions.
 * 4.  **Latency Reduction**: The priority queue ensures that critical calculations are
 *     not delayed by low-priority background processing. Asynchronous operations prevent
 *     long-running tasks from stalling the system.
 * 5.  **Performance Monitoring**: In-built monitoring tracks key metrics like processing
 *     latency, memory usage, cache efficiency, and worker load.
 */
class ConsciousnessPerformanceOptimizer {

    // --- Private Class Fields ---

    // #region Core Properties
    #eventQueue = []; // A priority queue for incoming cognitive events.
    #isProcessing = false; // Flag to prevent multiple processing loops.
    #isRunning = true; // Flag to control the main processing loop.
    #worker; // Web Worker for offloading heavy computations.
    #workerTaskQueue = new Map(); // Tracks tasks sent to the worker.
    #nextTaskId = 0; // Simple ID generator for worker tasks.
    // #endregion

    // #region Memory Management
    #eventObjectPool = []; // Pool for reusing event objects to reduce GC.
    #shortTermMemory = new WeakMap(); // Cache for transient data, allows GC.
    #longTermMemory = new Map(); // Capped storage for persistent memories.
    #maxLtmSize = 10000; // Max number of entries in long-term memory.
    // #endregion

    // #region Performance Monitoring
    #metrics = {
        eventsProcessed: 0,
        highPriorityEvents: 0,
        avgProcessingLatencyMs: 0,
        maxProcessingLatencyMs: 0,
        avgQueueLength: 0,
        workerTasks: 0,
        cacheHits: 0,
        cacheMisses: 0,
        ltmSize: 0,
        poolSize: 0,
    };
    #latencySamples = [];
    #queueLengthSamples = [];
    #maxSamples = 100; // Number of samples for calculating averages.
    // #endregion

    // #region Memoization Cache
    #memoizationCache = new Map();
    // #endregion

    /**
     * Initializes the consciousness performance module.
     * @param {object} [options={}] - Configuration options.
     * @param {number} [options.maxLtmSize=10000] - Maximum size of the long-term memory store.
     * @param {number} [options.poolInitialSize=100] - Initial size of the event object pool.
     */
    constructor(options = {}) {
        this.#maxLtmSize = options.maxLtmSize || 10000;
        this.#initializeWorker();
        this.#initializeObjectPool(options.poolInitialSize || 100);
        console.log("ConsciousnessPerformanceOptimizer Initialized.");
    }

    // --- Public API ---

    /**
     * Processes a new sensory input or internal thought.
     * Events are queued and processed based on priority.
     * @param {string} type - The type of event (e.g., 'SENSORY_INPUT', 'INTERNAL_THOUGHT').
     * @param {object} data - The payload associated with the event.
     * @param {number} [priority=1] - The priority of the event (0=highest, 1=normal, 2=low).
     */
    processEvent(type, data, priority = 1) {
        if (!this.#isRunning) return;

        const event = this.#acquireEventObject();
        event.type = type;
        event.data = data;
        event.priority = priority;
        event.timestamp = performance.now();

        // High-priority events can trigger an immediate processing cycle.
        // Others are added to the queue to be processed during idle time.
        if (priority === 0) {
            this.#metrics.highPriorityEvents++;
            this.#eventQueue.unshift(event); // Add to the front for immediate processing.
            this.#scheduleProcessing();
        } else {
            this.#eventQueue.push(event);
            // Sort by priority (lower number is higher priority)
            this.#eventQueue.sort((a, b) => a.priority - b.priority);
            this.#scheduleProcessing();
        }
    }

    /**
     * Retrieves the current performance metrics snapshot.
     * @returns {object} An object containing key performance indicators.
     */
    getPerformanceMetrics() {
        this.#metrics.ltmSize = this.#longTermMemory.size;
        this.#metrics.poolSize = this.#eventObjectPool.length;
        this.#metrics.avgQueueLength = this.#calculateAverage(this.#queueLengthSamples);
        this.#metrics.avgProcessingLatencyMs = this.#calculateAverage(this.#latencySamples);
        return { ...this.#metrics };
    }

    /**
     * Shuts down the optimizer, terminates the worker, and clears queues.
     */
    shutdown() {
        console.log("Shutting down ConsciousnessPerformanceOptimizer...");
        this.#isRunning = false;
        if (this.#worker) {
            this.#worker.terminate();
        }
        this.#eventQueue = [];
        this.#eventObjectPool = [];
        this.#workerTaskQueue.clear();
        console.log("Shutdown complete.");
    }


    // --- Private Core Logic ---

    /**
     * Initializes the Web Worker for offloading heavy computations.
     * The worker code is created from a string to keep the module self-contained.
     */
    #initializeWorker() {
        const workerCode = `
            // --- Worker Scope ---
            // A simple function to simulate a heavy, blocking computation.
            function performComplexAnalysis(data) {
                const start = performance.now();
                // Simulate CPU-intensive work (e.g., pattern recognition, data correlation)
                let result = 0;
                for (let i = 0; i < data.iterations; i++) {
                    result += Math.sqrt(i) * Math.sin(i);
                }
                const duration = performance.now() - start;
                return { result, duration };
            }

            self.onmessage = (e) => {
                const { taskId, taskType, payload } = e.data;
                if (taskType === 'COMPLEX_ANALYSIS') {
                    const result = performComplexAnalysis(payload);
                    self.postMessage({ taskId, result });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        this.#worker = new Worker(URL.createObjectURL(blob));

        this.#worker.onmessage = (e) => {
            const { taskId, result } = e.data;
            const task = this.#workerTaskQueue.get(taskId);
            if (task) {
                task.resolve(result);
                this.#workerTaskQueue.delete(taskId);
            }
        };

        this.#worker.onerror = (error) => {
            console.error("Consciousness Worker Error:", error);
            // Reject all pending promises for this worker
            for (const [taskId, task] of this.#workerTaskQueue.entries()) {
                task.reject(error);
                this.#workerTaskQueue.delete(taskId);
            }
        };
    }

    /**
     * Schedules the event queue to be processed.
     * Uses `requestIdleCallback` to perform work during browser idle periods,
     * preventing interference with rendering and user interactions. Falls back
     * to `setTimeout` if not available.
     */
    #scheduleProcessing() {
        if (this.#isProcessing || !this.#isRunning) return;

        this.#isProcessing = true;
        if ('requestIdleCallback' in window) {
            requestIdleCallback(this.#processQueue.bind(this), { timeout: 100 });
        } else {
            setTimeout(this.#processQueue.bind(this), 16); // Fallback to ~60fps timing
        }
    }

    /**
     * The main processing loop. It processes events from the queue until the
     * deadline provided by `requestIdleCallback` is reached or the queue is empty.
     * @param {IdleDeadline} [deadline] - The deadline object from `requestIdleCallback`.
     */
    async #processQueue(deadline) {
        this.#recordQueueLength();

        while (this.#eventQueue.length > 0) {
            // For environments without requestIdleCallback or if time is up
            if (deadline && deadline.timeRemaining() <= 1 && deadline.didTimeout === false) {
                break; // Stop processing to yield to the main thread
            }

            const event = this.#eventQueue.shift(); // Get the highest priority event
            const startTime = performance.now();

            // --- Simulate Cognitive Functions ---
            await this.#handleEvent(event);

            const latency = performance.now() - startTime;
            this.#recordLatency(latency);

            this.#releaseEventObject(event); // Return object to the pool
            this.#metrics.eventsProcessed++;
        }

        this.#isProcessing = false;

        // If there are still events, schedule the next processing cycle
        if (this.#eventQueue.length > 0) {
            this.#scheduleProcessing();
        }
    }

    /**
     * Routes an event to the appropriate handler based on its type.
     * This simulates the core decision-making part of the consciousness.
     * @param {object} event - The event object to handle.
     */
    async #handleEvent(event) {
        // Use short-term memory (WeakMap) to check for recently processed similar data
        if (this.#shortTermMemory.has(event.data)) {
            this.#metrics.cacheHits++;
            return; // Déjà vu: already processed this exact object recently.
        }

        this.#metrics.cacheMisses++;
        switch (event.type) {
            case 'SENSORY_INPUT':
                // Offload heavy analysis to the worker
                await this.#offloadComputation('COMPLEX_ANALYSIS', { iterations: 5e6, source: event.data })
                    .then(result => {
                        this.#integrateMemory(`Analyzed sensory input. Duration: ${result.duration.toFixed(2)}ms`);
                    });
                break;
            case 'INTERNAL_THOUGHT':
                // Use memoization for pure, repeatable computations
                const thoughtHash = this.#hashObject(event.data);
                this.#memoizedCognitiveAnalysis(thoughtHash, event.data);
                break;
            case 'SYSTEM_MAINTENANCE':
                this.#pruneLongTermMemory();
                break;
        }
        // Store a reference in short-term memory to prevent immediate re-processing
        this.#shortTermMemory.set(event.data, { processedAt: performance.now() });
    }

    // --- Private Helper Methods ---

    /**
     * Offloads a task to the Web Worker.
     * @param {string} taskType - The type of task for the worker to perform.
     * @param {object} payload - The data needed for the task.
     * @returns {Promise<any>} A promise that resolves with the worker's result.
     */
    #offloadComputation(taskType, payload) {
        return new Promise((resolve, reject) => {
            const taskId = this.#nextTaskId++;
            this.#workerTaskQueue.set(taskId, { resolve, reject });
            this.#worker.postMessage({ taskId, taskType, payload });
            this.#metrics.workerTasks++;
        });
    }

    /**
     * A memoized function for a hypothetical expensive cognitive analysis.
     * @param {string} key - A unique key representing the function inputs.
     * @param {object} data - The data to be analyzed.
     */
    #memoizedCognitiveAnalysis(key, data) {
        if (this.#memoizationCache.has(key)) {
            this.#metrics.cacheHits++;
            return this.#memoizationCache.get(key);
        }

        this.#metrics.cacheMisses++;
        // Simulate an expensive, synchronous computation
        let result = 0;
        for (let i = 0; i < 1e5; i++) {
            result += Math.tan(i);
        }
        const analysisResult = { computed: result, source: data };

        this.#memoizationCache.set(key, analysisResult);
        // Prune the cache if it gets too large
        if (this.#memoizationCache.size > 500) {
            const oldestKey = this.#memoizationCache.keys().next().value;
            this.#memoizationCache.delete(oldestKey);
        }
        return analysisResult;
    }

    /**
     * Adds a memory to the long-term store and prunes if it exceeds the cap.
     * @param {any} memory - The memory to store.
     */
    #integrateMemory(memory) {
        const timestamp = Date.now();
        this.#longTermMemory.set(timestamp, memory);
        if (this.#longTermMemory.size > this.#maxLtmSize) {
            this.#pruneLongTermMemory();
        }
    }

    /**
     * Prunes the long-term memory store by removing the oldest entries.
     */
    #pruneLongTermMemory() {
        // Remove 10% of the oldest memories when pruning
        const toRemove = Math.floor(this.#maxLtmSize * 0.1);
        const keys = Array.from(this.#longTermMemory.keys()).sort((a, b) => a - b);
        for (let i = 0; i < toRemove && i < keys.length; i++) {
            this.#longTermMemory.delete(keys[i]);
        }
    }

    // --- Object Pooling ---

    #initializeObjectPool(size) {
        for (let i = 0; i < size; i++) {
            this.#eventObjectPool.push({});
        }
    }

    #acquireEventObject() {
        if (this.#eventObjectPool.length > 0) {
            return this.#eventObjectPool.pop();
        }
        // Pool is empty, create a new object (less ideal)
        return {};
    }

    #releaseEventObject(obj) {
        // Reset object properties before returning to the pool
        obj.type = null;
        obj.data = null;
        obj.priority = null;
        obj.timestamp = null;
        this.#eventObjectPool.push(obj);
    }

    // --- Metrics & Utilities ---

    #recordLatency(latency) {
        this.#latencySamples.push(latency);
        if (this.#latencySamples.length > this.#maxSamples) {
            this.#latencySamples.shift();
        }
        if (latency > this.#metrics.maxProcessingLatencyMs) {
            this.#metrics.maxProcessingLatencyMs = latency;
        }
    }

    #recordQueueLength() {
        this.#queueLengthSamples.push(this.#eventQueue.length);
        if (this.#queueLengthSamples.length > this.#maxSamples) {
            this.#queueLengthSamples.shift();
        }
    }

    #calculateAverage(samples) {
        if (samples.length === 0) return 0;
        const sum = samples.reduce((a, b) => a + b, 0);
        return sum / samples.length;
    }

    #hashObject(obj) {
        // A simple, non-cryptographic hash for memoization keys.
        // For production, a more robust hashing library might be used.
        const str = JSON.stringify(obj);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return String(hash);
    }
}
```