```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description A production-ready JavaScript module for optimizing the performance
 * of a conceptual "consciousness system". It focuses on event processing, memory management,
 * computational efficiency, and latency reduction, complete with performance monitoring.
 *
 * This module is designed to be the core performance layer of a system that processes
 * a continuous stream of sensory inputs, maintains a state (memory), and performs

 * complex cognitive calculations.
 */
const ConsciousnessPerformanceOptimizer = (() => {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        // Max number of events to process in a single batch to prevent blocking the main thread.
        EVENT_PROCESSING_BATCH_SIZE: 100,
        // How often to prune the working memory cache (in ms).
        MEMORY_PRUNE_INTERVAL: 60000,
        // Time in ms before a cached item in working memory is considered stale.
        WORKING_MEMORY_TTL: 55000,
        // How often to report performance metrics (in ms).
        METRICS_REPORT_INTERVAL: 5000,
        // Timeout for async tasks. If requestIdleCallback isn't supported or takes too long.
        ASYNC_TASK_TIMEOUT: 1000,
    };

    // --- Private State ---
    let isInitialized = false;
    let memoryPruneIntervalId = null;
    let metricsReportIntervalId = null;

    // --- 1. Performance Monitoring ---
    const metrics = {
        eventsEnqueued: 0,
        eventsProcessed: 0,
        processingCycles: 0,
        totalProcessingTimeMs: 0,
        avgProcessingTimeMs: 0,
        maxLatencyMs: 0,
        memoryCacheHits: 0,
        memoryCacheMisses: 0,
        objectsPooled: 0,
        objectsReused: 0,
        lastReportTimestamp: performance.now(),
    };

    /**
     * Starts a performance measurement for a named operation.
     * @param {string} markerName - The unique name for the performance marker.
     */
    const startPerfMarker = (markerName) => {
        performance.mark(`${markerName}-start`);
    };

    /**
     * Ends a performance measurement and records the duration.
     * @param {string} markerName - The name of the marker to end.
     * @param {function(number):void} [onComplete] - Optional callback with the duration.
     */
    const endPerfMarker = (markerName, onComplete) => {
        try {
            performance.mark(`${markerName}-end`);
            const measure = performance.measure(markerName, `${markerName}-start`, `${markerName}-end`);
            if (onComplete) {
                onComplete(measure.duration);
            }
        } catch (e) {
            // Silently fail if marks are missing, common in long-running async ops
        } finally {
            // Clean up marks to prevent memory leaks in the performance buffer
            performance.clearMarks(`${markerName}-start`);
            performance.clearMarks(`${markerName}-end`);
            performance.clearMeasures(markerName);
        }
    };

    /**
     * Periodically reports key performance indicators.
     * In a real system, this would send data to a monitoring service.
     */
    const reportMetrics = () => {
        const now = performance.now();
        const elapsed = (now - metrics.lastReportTimestamp) / 1000;
        console.log('--- Consciousness Performance Report ---');
        console.table({
            'Events Processed/sec': (metrics.eventsProcessed / elapsed).toFixed(2),
            'Avg Processing Time (ms)': metrics.avgProcessingTimeMs.toFixed(4),
            'Max Latency (ms)': metrics.maxLatencyMs.toFixed(4),
            'Memory Cache Hit Rate': ((metrics.memoryCacheHits / (metrics.memoryCacheHits + metrics.memoryCacheMisses || 1)) * 100).toFixed(2) + '%',
            'Objects Reused from Pool': metrics.objectsReused,
        });

        // Reset per-interval metrics
        metrics.eventsProcessed = 0;
        metrics.lastReportTimestamp = now;
        metrics.maxLatencyMs = 0; // Reset max latency for the next interval
    };


    // --- 2. Memory Management ---

    /**
     * A generic object pool to reduce garbage collection pressure by reusing objects.
     * @template T
     */
    class ObjectPool {
        /**
         * @param {function(): T} factory - A function that creates a new object.
         * @param {function(T): void} [resetter] - A function that resets an object's state before reuse.
         * @param {number} initialSize - The initial size of the pool.
         */
        constructor(factory, resetter = () => {}, initialSize = 100) {
            this._factory = factory;
            this._resetter = resetter;
            this._pool = [];
            this._populate(initialSize);
            metrics.objectsPooled += initialSize;
        }

        _populate(count) {
            for (let i = 0; i < count; i++) {
                this._pool.push(this._factory());
            }
        }

        /**
         * Get an object from the pool. Creates a new one if the pool is empty.
         * @returns {T} An object instance.
         */
        get() {
            if (this._pool.length === 0) {
                metrics.objectsPooled++;
                return this._factory();
            }
            metrics.objectsReused++;
            return this._pool.pop();
        }

        /**
         * Return an object to the pool for later reuse.
         * @param {T} obj - The object to release.
         */
        release(obj) {
            this._resetter(obj);
            this._pool.push(obj);
        }
    }

    // Pool for sensory event objects
    const eventObjectPool = new ObjectPool(
        () => ({ id: null, type: null, data: null, timestamp: 0, priority: 2 }),
        (event) => {
            event.id = null;
            event.type = null;
            event.data = null;
            event.timestamp = 0;
            event.priority = 2; // Default priority
        }
    );

    // Using a Map for working memory allows for any key type and better performance than objects for frequent additions/deletions.
    // The value is an object containing the data and a timestamp for TTL management.
    const workingMemoryCache = new Map();

    /**
     * Periodically prunes stale data from the working memory cache to prevent memory leaks.
     */
    const pruneWorkingMemory = () => {
        const now = Date.now();
        const staleKeys = [];
        for (const [key, value] of workingMemoryCache.entries()) {
            if (now - value.timestamp > CONFIG.WORKING_MEMORY_TTL) {
                staleKeys.push(key);
            }
        }
        staleKeys.forEach(key => workingMemoryCache.delete(key));
    };


    // --- 3. Event Processing ---

    // A prioritized event queue. Lower number = higher priority.
    // 0: Critical (e.g., danger), 1: High (e.g., direct interaction), 2: Normal (e.g., background stimuli)
    const eventQueue = {
        0: [],
        1: [],
        2: [],
    };
    let isProcessing = false;

    /**
     * Enqueues a sensory event with a specific priority.
     * @param {number} priority - The priority of the event (0-2).
     * @param {string} type - The type of event (e.g., 'visual', 'auditory').
     * @param {any} data - The event payload.
     */
    const enqueueEvent = (priority, type, data) => {
        const event = eventObjectPool.get();
        event.id = `evt_${performance.now()}_${Math.random()}`;
        event.priority = priority;
        event.type = type;
        event.data = data;
        event.timestamp = performance.now();

        if (eventQueue[priority]) {
            eventQueue[priority].push(event);
            metrics.eventsEnqueued++;
        }

        // If not currently processing, start the cycle.
        if (!isProcessing) {
            isProcessing = true;
            // Use setImmediate or setTimeout(0) to defer processing to the next event loop tick.
            // This allows the current execution context to complete, making the system more responsive.
            setTimeout(processEventQueue, 0);
        }
    };

    /**
     * The core event processing loop. It processes events in batches and by priority.
     */
    const processEventQueue = () => {
        startPerfMarker('event_cycle');
        let processedCount = 0;

        // Process by priority: 0, then 1, then 2
        for (let priority = 0; priority <= 2; priority++) {
            const queue = eventQueue[priority];
            while (queue.length > 0 && processedCount < CONFIG.EVENT_PROCESSING_BATCH_SIZE) {
                const event = queue.shift();
                if (event) {
                    // Simulate processing this event through the cognitive model
                    CognitiveProcessor.processSensoryInput(event);

                    // Release the event object back to the pool
                    eventObjectPool.release(event);
                    processedCount++;
                }
            }
        }

        metrics.eventsProcessed += processedCount;
        metrics.processingCycles++;

        endPerfMarker('event_cycle', duration => {
            metrics.totalProcessingTimeMs += duration;
            metrics.avgProcessingTimeMs = metrics.totalProcessingTimeMs / metrics.processingCycles;
            if (duration > metrics.maxLatencyMs) {
                metrics.maxLatencyMs = duration;
            }
        });

        // If there are still events in any queue, schedule the next batch.
        if (eventQueue[0].length > 0 || eventQueue[1].length > 0 || eventQueue[2].length > 0) {
            setTimeout(processEventQueue, 0);
        } else {
            isProcessing = false; // No more events, stop the loop.
        }
    };


    // --- 4. Computational Efficiency & Latency Reduction ---

    /**
     * A higher-order function for memoization. It uses a WeakMap for efficient caching
     * when keys are objects, preventing memory leaks.
     * @param {function} func - The expensive function to memoize.
     * @returns {function} The memoized version of the function.
     */
    const memoize = (func) => {
        // WeakMap holds weak references, allowing garbage collection if the key object is no longer used elsewhere.
        const cache = new WeakMap();
        const primitiveCache = new Map();

        return function(...args) {
            const key = args.length > 0 && typeof args[0] === 'object' && args[0] !== null ? args[0] : args.join('_');
            const useWeakMap = typeof key === 'object' && key !== null;
            const currentCache = useWeakMap ? cache : primitiveCache;

            if (currentCache.has(key)) {
                metrics.memoryCacheHits++;
                return currentCache.get(key);
            }

            metrics.memoryCacheMisses++;
            const result = func.apply(this, args);
            currentCache.set(key, result);
            return result;
        };
    };

    /**
     * Executes a task asynchronously during the browser's idle periods to avoid
     * blocking the main thread. Falls back to setTimeout if requestIdleCallback is not available.
     * @param {function} task - The function to execute.
     */
    const runAsyncTask = (task) => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(task, { timeout: CONFIG.ASYNC_TASK_TIMEOUT });
        } else {
            setTimeout(task, 0);
        }
    };

    /**
     * Represents the core "thinking" component of the consciousness system.
     */
    const CognitiveProcessor = {
        /**
         * Processes a single sensory input. This function is memoized for efficiency.
         * If the same event data is received, the cached "perception" is returned.
         */
        processSensoryInput: memoize((event) => {
            // Simulate a complex, computationally expensive analysis of the event.
            // In a real system, this could be a neural network inference or complex logic.
            const perception = {
                interpretation: `Interpreted '${event.type}' with data: ${JSON.stringify(event.data)}`,
                relevance: Math.random(), // Assign a random relevance score
                timestamp: Date.now(),
            };

            // Store the result in working memory for quick access by other cognitive functions.
            workingMemoryCache.set(`perception_${event.id}`, { data: perception, timestamp: Date.now() });

            // Trigger a longer "thought cycle" as a non-blocking async task.
            runAsyncTask(() => CognitiveProcessor.thoughtCycle(perception));

            return perception;
        }),

        /**
         * Simulates a longer, deeper thought process based on a new perception.
         * This runs asynchronously to avoid blocking event processing.
         * @param {object} perception - The initial perception that triggered this thought.
         */
        thoughtCycle: (perception) => {
            startPerfMarker('thought_cycle');
            // This represents a very heavy calculation, like planning, reasoning, or consolidating memory.
            // For this simulation, we just burn some CPU time.
            let sum = 0;
            for (let i = 0; i < 1e6; i++) {
                sum += Math.sqrt(i) * Math.sin(i);
            }
            // The result of this thought might trigger an action or update long-term memory.
            endPerfMarker('thought_cycle');
        },
    };

    // --- Public API ---

    return {
        /**
         * Initializes the performance optimizer and starts its background tasks.
         */
        initialize: () => {
            if (isInitialized) {
                console.warn('ConsciousnessPerformanceOptimizer is already initialized.');
                return;
            }
            memoryPruneIntervalId = setInterval(pruneWorkingMemory, CONFIG.MEMORY_PRUNE_INTERVAL);
            metricsReportIntervalId = setInterval(reportMetrics, CONFIG.METRICS_REPORT_INTERVAL);
            isInitialized = true;
            console.log('ConsciousnessPerformanceOptimizer initialized.');
        },

        /**
         * Shuts down the optimizer and clears intervals.
         */
        shutdown: () => {
            clearInterval(memoryPruneIntervalId);
            clearInterval(metricsReportIntervalId);
            isInitialized = false;
            console.log('ConsciousnessPerformanceOptimizer shut down.');
        },

        /**
         * The primary entry point for new sensory data into the system.
         * @param {object} options
         * @param {number} [options.priority=2] - Priority (0=critical, 1=high, 2=normal).
         * @param {string} options.type - Type of stimulus (e.g., 'visual', 'auditory').
         * @param {any} options.data - The data payload.
         */
        registerSensoryInput: ({ priority = 2, type, data }) => {
            if (!isInitialized) {
                console.error('Optimizer not initialized. Call .initialize() first.');
                return;
            }
            enqueueEvent(priority, type, data);
        },

        /**
         * Returns a snapshot of the current performance metrics.
         * @returns {object} The metrics object.
         */
        getMetrics: () => {
            return { ...metrics };
        },
    };
})();


// --- EXAMPLE USAGE ---

// 1. Initialize the system
ConsciousnessPerformanceOptimizer.initialize();

// 2. Simulate a stream of sensory inputs with varying priorities
console.log("--- Simulating Sensory Input Stream ---");

// Critical event (e.g., a threat)
ConsciousnessPerformanceOptimizer.registerSensoryInput({
    priority: 0,
    type: 'proprioception',
    data: { alert: 'imminent_danger', source: 'internal_balance' }
});

// High priority event (e.g., a direct question)
ConsciousnessPerformanceOptimizer.registerSensoryInput({
    priority: 1,
    type: 'auditory',
    data: { query: 'what_is_your_purpose' }
});

// A burst of normal background events
for (let i = 0; i < 200; i++) {
    ConsciousnessPerformanceOptimizer.registerSensoryInput({
        priority: 2,
        type: 'visual',
        data: { object: `background_element_${i}`, color: 'blue' }
    });
}

// Another high priority event that arrives during the burst
ConsciousnessPerformanceOptimizer.registerSensoryInput({
    priority: 1,
    type: 'tactile',
    data: { sensation: 'pressure', location: 'arm' }
});

// The system will now process these events according to priority in non-blocking batches.
// Performance metrics will be logged to the console every 5 seconds.

// To stop the simulation:
// setTimeout(() => {
//     ConsciousnessPerformanceOptimizer.shutdown();
//     console.log("--- Simulation Stopped ---");
// }, 12000);
```