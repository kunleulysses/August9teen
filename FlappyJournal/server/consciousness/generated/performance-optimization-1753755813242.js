```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 *
 * A highly optimized module for managing the core performance of a conceptual
 * consciousness system. It focuses on ensuring low-latency, high-throughput
 * processing by optimizing event handling, memory usage, and computational load.
 *
 * Features:
 * 1.  **Prioritized Event Batching**: Processes sensory inputs in batches based on
 *     priority, preventing high-frequency event storms from overwhelming the system.
 * 2.  **Object Pooling**: Reduces garbage collection pressure by reusing frequently
 *     created objects like events and cognitive fragments.
 * 3.  **Computational Offloading**: Uses a pool of Web Workers to handle heavy,
 *     non-blocking computations (e.g., pattern analysis, predictive modeling).
 * 4.  **Memoization Caching**: Caches the results of expensive, pure functions
 *     using WeakMaps to prevent memory leaks.
 * 5.  **Time-Sliced Processing**: The main processing loop is time-sliced to
 *     prevent blocking the main thread, ensuring a responsive system.
 * 6.  **Real-time Performance Monitoring**: Tracks key metrics like processing
 *     latency, memory usage, and throughput.
 */
const ConsciousnessPerformanceOptimizer = (() => {

    'use strict';

    // --- 1. Configuration ---
    const CONFIG = {
        // The main processing loop frequency in Hz.
        TICK_RATE: 60,
        // Max time in ms the main loop can run before yielding to the event loop.
        MAX_PROCESSING_MS_PER_TICK: 10,
        // Number of web workers for heavy computations.
        WORKER_POOL_SIZE: Math.max(1, (navigator.hardwareConcurrency || 4) - 1),
        // Max size of the object pool for events to prevent unbounded memory growth.
        EVENT_OBJECT_POOL_MAX_SIZE: 1000,
        // How often to report performance metrics (in ms).
        PERF_MONITOR_INTERVAL: 2000,
    };

    // --- 2. System State & Interface ---
    let state = {
        isRunning: false,
        consciousnessInterface: null, // Hook to the actual consciousness logic
        mainLoopId: null,
        perfMonitorId: null,
        nextWorker: 0,
        lastTickTime: 0,
    };

    // --- 3. Performance Monitoring ---
    const perfMetrics = {
        tickProcessingTime: { current: 0, avg: 0, max: 0, history: [] },
        eventsProcessedPerSecond: { current: 0, total: 0 },
        queueLength: { current: 0, max: 0 },
        memory: { jsHeapSizeLimit: 0, totalJSHeapSize: 0, usedJSHeapSize: 0 },
        workerLoad: { totalTasks: 0, completedTasks: 0 },
        lastReportTime: 0,
    };

    /**
     * Updates performance metrics during each processing cycle.
     * @param {number} startTime - The timestamp when the tick started.
     */
    function updatePerfMetrics(startTime) {
        const processingTime = performance.now() - startTime;
        perfMetrics.tickProcessingTime.current = processingTime;
        perfMetrics.tickProcessingTime.history.push(processingTime);
        if (perfMetrics.tickProcessingTime.history.length > CONFIG.TICK_RATE) {
            perfMetrics.tickProcessingTime.history.shift();
        }
        perfMetrics.tickProcessingTime.max = Math.max(perfMetrics.tickProcessingTime.max, processingTime);
        perfMetrics.tickProcessingTime.avg = perfMetrics.tickProcessingTime.history.reduce((a, b) => a + b, 0) / perfMetrics.tickProcessingTime.history.length;
        perfMetrics.queueLength.current = eventQueue.size();
        perfMetrics.queueLength.max = Math.max(perfMetrics.queueLength.max, eventQueue.size());
    }

    /**
     * Starts a periodic reporter for performance metrics.
     */
    function startPerfMonitor() {
        perfMetrics.lastReportTime = performance.now();
        state.perfMonitorId = setInterval(() => {
            const now = performance.now();
            const elapsedSeconds = (now - perfMetrics.lastReportTime) / 1000;

            perfMetrics.eventsProcessedPerSecond.current = perfMetrics.eventsProcessedPerSecond.total / elapsedSeconds;

            if (performance.memory) {
                perfMetrics.memory = performance.memory;
            }

            // Reset for next interval
            perfMetrics.lastReportTime = now;
            perfMetrics.eventsProcessedPerSecond.total = 0;

            // Optional: Log the report
            // console.log('Perf Report:', getPerformanceReport());

        }, CONFIG.PERF_MONITOR_INTERVAL);
    }


    // --- 4. Memory Management: Object Pooling ---
    /**
     * A generic object pool for recycling objects to reduce GC overhead.
     * @template T
     */
    class ObjectPool {
        /**
         * @param {() => T} objectFactory - A function that creates new objects.
         * @param {number} maxSize - The maximum number of objects to store in the pool.
         */
        constructor(objectFactory, maxSize) {
            this.pool = [];
            this.objectFactory = objectFactory;
            this.maxSize = maxSize;
        }

        /**
         * Acquires an object from the pool or creates a new one.
         * @returns {T} An object instance.
         */
        acquire() {
            return this.pool.length > 0 ? this.pool.pop() : this.objectFactory();
        }

        /**
         * Releases an object back into the pool for reuse.
         * @param {T} obj - The object to release.
         */
        release(obj) {
            if (this.pool.length < this.maxSize) {
                // Optional: Reset object state before pooling
                // if (typeof obj.reset === 'function') {
                //     obj.reset();
                // }
                this.pool.push(obj);
            }
        }
    }

    const eventPool = new ObjectPool(() => ({ type: null, data: null, timestamp: 0 }), CONFIG.EVENT_OBJECT_POOL_MAX_SIZE);


    // --- 5. Event Processing: Priority Queue ---
    /**
     * A min-heap based Priority Queue for efficient event handling.
     * Lower priority numbers are processed first.
     */
    const eventQueue = {
        _heap: [],
        size() { return this._heap.length; },
        isEmpty() { return this.size() === 0; },
        enqueue(item, priority) {
            this._heap.push({ item, priority });
            this._bubbleUp(this.size() - 1);
        },
        dequeue() {
            if (this.isEmpty()) return null;
            this._swap(0, this.size() - 1);
            const { item } = this._heap.pop();
            if (!this.isEmpty()) this._sinkDown(0);
            return item;
        },
        _parent(i) { return Math.floor((i - 1) / 2); },
        _left(i) { return 2 * i + 1; },
        _right(i) { return 2 * i + 2; },
        _swap(i, j) { [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]]; },
        _compare(i, j) { return this._heap[i].priority < this._heap[j].priority; },
        _bubbleUp(i) {
            let p = this._parent(i);
            while (i > 0 && this._compare(i, p)) {
                this._swap(i, p);
                i = p;
                p = this._parent(i);
            }
        },
        _sinkDown(i) {
            let minIndex = i;
            const left = this._left(i);
            const right = this._right(i);
            const size = this.size();
            if (left < size && this._compare(left, minIndex)) minIndex = left;
            if (right < size && this._compare(right, minIndex)) minIndex = right;
            if (i !== minIndex) {
                this._swap(i, minIndex);
                this._sinkDown(minIndex);
            }
        }
    };


    // --- 6. Computational Efficiency: Web Workers & Memoization ---

    // --- Web Worker Pool ---
    const workerPool = {
        workers: [],
        taskQueue: [],
        taskCallbacks: new Map(),
        nextTaskId: 0,
    };

    /**
     * Initializes the pool of Web Workers.
     */
    function initializeWorkers() {
        const workerCode = `
            self.onmessage = function(e) {
                const { taskId, taskName, taskData } = e.data;
                // In a real system, you'd have a map of complex functions.
                // Here we simulate a heavy computation.
                try {
                    // Simulating work: e.g., complex pattern matching, data analysis
                    const startTime = performance.now();
                    let result = 0;
                    for (let i = 0; i < 5e7; i++) {
                        result += Math.sqrt(i) * Math.sin(i);
                    }
                    const duration = performance.now() - startTime;
                    self.postMessage({
                        taskId,
                        result: { value: result, computationTime: duration, input: taskData },
                        error: null
                    });
                } catch (err) {
                     self.postMessage({ taskId, result: null, error: err.message });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);

        for (let i = 0; i < CONFIG.WORKER_POOL_SIZE; i++) {
            const worker = new Worker(url);
            worker.onmessage = (e) => {
                const { taskId, result, error } = e.data;
                const callback = workerPool.taskCallbacks.get(taskId);
                if (callback) {
                    if (error) {
                        callback.reject(new Error(error));
                    } else {
                        callback.resolve(result);
                    }
                    workerPool.taskCallbacks.delete(taskId);
                    perfMetrics.workerLoad.completedTasks++;
                }
            };
            workerPool.workers.push(worker);
        }
        URL.revokeObjectURL(url); // Clean up the blob URL
    }

    /**
     * Dispatches a heavy computation task to the next available worker.
     * @param {string} taskName - The name of the task to run.
     * @param {*} taskData - The data to pass to the task.
     * @returns {Promise<any>} A promise that resolves with the computation result.
     */
    function dispatchToWorker(taskName, taskData) {
        return new Promise((resolve, reject) => {
            const taskId = workerPool.nextTaskId++;
            workerPool.taskCallbacks.set(taskId, { resolve, reject });

            const worker = workerPool.workers[state.nextWorker];
            worker.postMessage({ taskId, taskName, taskData });

            state.nextWorker = (state.nextWorker + 1) % CONFIG.WORKER_POOL_SIZE;
            perfMetrics.workerLoad.totalTasks++;
        });
    }


    // --- Memoization ---
    const memoizationCache = new WeakMap();
    /**
     * A higher-order function that memoizes the results of another function.
     * Uses a WeakMap to avoid memory leaks by allowing garbage collection of keys.
     * @param {Function} fn The pure function to memoize.
     * @returns {Function} The memoized function.
     */
    function memoize(fn) {
        return function(...args) {
            // Note: This simple memoization works best for functions with a single object argument.
            // For multiple/primitive arguments, a more complex key generation is needed.
            const key = args[0];
            if (typeof key !== 'object' || key === null) {
                // Bypass for non-object keys to avoid WeakMap errors.
                return fn.apply(this, args);
            }

            if (memoizationCache.has(key)) {
                return memoizationCache.get(key);
            }

            const result = fn.apply(this, args);
            memoizationCache.set(key, result);
            return result;
        };
    }


    // --- 7. Core Processing Loop ---
    /**
     * The main loop that drives the consciousness system.
     * It dequeues events, processes them, and yields control to prevent blocking.
     */
    async function processingLoop() {
        if (!state.isRunning) return;

        const tickStartTime = performance.now();
        state.lastTickTime = tickStartTime;
        let processedInTick = 0;

        while (!eventQueue.isEmpty() && (performance.now() - tickStartTime) < CONFIG.MAX_PROCESSING_MS_PER_TICK) {
            const event = eventQueue.dequeue();
            if (event) {
                // The actual "conscious" processing is delegated.
                if (state.consciousnessInterface && typeof state.consciousnessInterface.onProcessEvent === 'function') {
                    state.consciousnessInterface.onProcessEvent(event);
                }
                
                // Release the event object back to the pool
                eventPool.release(event);
                
                processedInTick++;
            }
        }
        
        perfMetrics.eventsProcessedPerSecond.total += processedInTick;
        updatePerfMetrics(tickStartTime);

        // If the queue is still full, we immediately schedule the next check
        // instead of waiting for the full interval, ensuring responsiveness.
        if (!eventQueue.isEmpty()) {
            // Yield to the event loop to allow rendering, I/O, etc.
            setTimeout(processingLoop, 0);
        }
    }


    // --- 8. Public API ---
    return {
        /**
         * Initializes and starts the optimizer and the consciousness system.
         * @param {object} consciousnessInterface - An object with callbacks for the system's logic.
         * @param {function(object): void} consciousnessInterface.onProcessEvent - Called for each processed event.
         * @param {function(object): void} consciousnessInterface.onHeavyComputationResult - Called with worker results.
         */
        init(consciousnessInterface) {
            if (state.isRunning) {
                console.warn("Optimizer is already running.");
                return;
            }
            console.log("Initializing Consciousness Performance Optimizer...");

            state.consciousnessInterface = consciousnessInterface;
            initializeWorkers();

            state.isRunning = true;
            state.lastTickTime = performance.now();
            // Use setInterval for a consistent tick rate, but the loop itself can be chained with setTimeout for yielding.
            state.mainLoopId = setInterval(processingLoop, 1000 / CONFIG.TICK_RATE);
            startPerfMonitor();

            console.log(`Optimizer started. Tick Rate: ${CONFIG.TICK_RATE}Hz, Worker Pool: ${CONFIG.WORKER_POOL_SIZE}`);
        },

        /**
         * Shuts down the optimizer, clears queues, and terminates workers.
         */
        shutdown() {
            if (!state.isRunning) return;
            console.log("Shutting down Consciousness Performance Optimizer...");

            state.isRunning = false;
            clearInterval(state.mainLoopId);
            clearInterval(state.perfMonitorId);

            workerPool.workers.forEach(worker => worker.terminate());
            workerPool.workers = [];
            eventQueue._heap = [];
            eventPool.pool = [];

            console.log("Optimizer shut down.");
        },

        /**
         * Posts a new sensory event to the processing queue.
         * @param {string} type - The type of event (e.g., 'SIGHT', 'SOUND', 'INTERNAL_THOUGHT').
         * @param {object} data - The payload of the event.
         * @param {number} [priority=10] - The event priority (lower is higher priority). 0 is highest.
         */
        postEvent(type, data, priority = 10) {
            if (!state.isRunning) return;
            const event = eventPool.acquire();
            event.type = type;
            event.data = data;
            event.timestamp = performance.now();
            eventQueue.enqueue(event, priority);
        },

        /**
         * Offloads a heavy, non-blocking computation to the worker pool.
         * @param {string} taskName - A name for the task (e.g., 'ANALYZE_PATTERN').
         * @param {object} taskData - Data required for the computation.
         * @returns {Promise<any>} A promise that resolves with the result.
         */
        runHeavyComputation(taskName, taskData) {
             if (!state.isRunning) {
                return Promise.reject(new Error("Optimizer is not running."));
             }
             return dispatchToWorker(taskName, taskData);
        },

        /**
         * Returns a snapshot of the current performance metrics.
         * @returns {object} The performance metrics object.
         */
        getPerformanceReport() {
            return {
                timestamp: performance.now(),
                is_running: state.isRunning,
                tick_processing_ms: {
                    current: parseFloat(perfMetrics.tickProcessingTime.current.toFixed(2)),
                    average: parseFloat(perfMetrics.tickProcessingTime.avg.toFixed(2)),
                    max: parseFloat(perfMetrics.tickProcessingTime.max.toFixed(2)),
                },
                events_per_second: parseFloat(perfMetrics.eventsProcessedPerSecond.current.toFixed(1)),
                event_queue: {
                    current_length: perfMetrics.queueLength.current,
                    max_length: perfMetrics.queueLength.max,
                },
                worker_pool: {
                    size: CONFIG.WORKER_POOL_SIZE,
                    total_tasks_dispatched: perfMetrics.workerLoad.totalTasks,
                    completed_tasks: perfMetrics.workerLoad.completedTasks,
                },
                memory_usage_mb: {
                    limit: (perfMetrics.memory.jsHeapSizeLimit / 1048576).toFixed(2),
                    total: (perfMetrics.memory.totalJSHeapSize / 1048576).toFixed(2),
                    used: (perfMetrics.memory.usedJSHeapSize / 1048576).toFixed(2),
                }
            };
        },

        /**
         * Exposes the memoize utility for use in the consciousness logic.
         */
        memoize,
    };
})();
```