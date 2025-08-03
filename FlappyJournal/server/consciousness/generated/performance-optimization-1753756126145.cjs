```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description A comprehensive performance optimization module for a high-throughput,
 * low-latency "consciousness" system. This module provides tools for event processing,
 * memory management, computational efficiency, and performance monitoring. It is designed
 * to be production-ready, minimizing main-thread blocking and garbage collection pauses.
 */

/**
 * Manages performance monitoring, tracking execution times and memory usage.
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.timers = new Map();
    }

    /**
     * Starts a performance timer for a given label.
     * @param {string} label - A unique identifier for the operation being measured.
     */
    start(label) {
        this.timers.set(label, performance.now());
    }

    /**
     * Ends a performance timer and records the duration.
     * @param {string} label - The identifier of the timer to end.
     */
    end(label) {
        const startTime = this.timers.get(label);
        if (startTime === undefined) {
            console.warn(`PerformanceMonitor: Timer with label "${label}" was ended without being started.`);
            return;
        }

        const duration = performance.now() - startTime;
        this.timers.delete(label);

        if (!this.metrics.has(label)) {
            this.metrics.set(label, {
                calls: 0,
                totalTime: 0,
                minTime: Infinity,
                maxTime: -Infinity,
                avgTime: 0,
            });
        }

        const metric = this.metrics.get(label);
        metric.calls++;
        metric.totalTime += duration;
        metric.minTime = Math.min(metric.minTime, duration);
        metric.maxTime = Math.max(metric.maxTime, duration);
        metric.avgTime = metric.totalTime / metric.calls;
    }

    /**
     * Retrieves all collected performance metrics.
     * @returns {object} An object containing all performance data.
     */
    getMetrics() {
        const memoryUsage = performance.memory ? {
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            usedJSHeapSize: performance.memory.usedJSHeapSize,
        } : {
            note: "performance.memory is not available in this context."
        };

        return {
            operations: Object.fromEntries(this.metrics),
            memory: memoryUsage,
        };
    }

    /**
     * Logs a summary of the current metrics to the console.
     */
    logSummary() {
        console.group("Performance Summary");
        const metrics = this.getMetrics();
        for (const [label, data] of Object.entries(metrics.operations)) {
            console.log(
                `%c${label}: %c${data.avgTime.toFixed(3)}ms avg | %c${data.calls} calls | %c${data.maxTime.toFixed(3)}ms max`,
                "font-weight: bold;",
                "color: green;",
                "color: blue;",
                "color: red;"
            );
        }
        console.log("Memory Usage:", metrics.memory);
        console.groupEnd();
    }
}

/**
 * Provides tools for efficient memory management, primarily through object pooling.
 */
class MemoryManager {
    /**
     * Creates a pool of reusable objects to reduce garbage collection overhead.
     * @template T
     * @param {() => T} factory - A function that creates a new object.
     * @param {(obj: T) => void} [resetter] - An optional function to reset an object's state before reuse.
     * @param {number} [initialSize=100] - The number of objects to pre-allocate.
     * @returns {ObjectPool<T>} An instance of ObjectPool.
     */
    static createObjectPool(factory, resetter = (obj) => obj, initialSize = 100) {
        return new ObjectPool(factory, resetter, initialSize);
    }
}

/**
 * @template T
 */
class ObjectPool {
    constructor(factory, resetter, initialSize) {
        this._factory = factory;
        this._resetter = resetter;
        this._pool = [];
        this._populate(initialSize);
    }

    _populate(count) {
        for (let i = 0; i < count; i++) {
            this._pool.push(this._factory());
        }
    }

    /**
     * Acquires an object from the pool. Creates a new one if the pool is empty.
     * @returns {T} An object instance.
     */
    acquire() {
        if (this._pool.length > 0) {
            return this._pool.pop();
        }
        // Pool is empty, create a new object as a fallback
        return this._factory();
    }

    /**
     * Releases an object back to the pool for future reuse.
     * @param {T} obj - The object to release.
     */
    release(obj) {
        this._resetter(obj);
        this._pool.push(obj);
    }

    /**
     * Gets the current size of the pool.
     * @returns {number}
     */
    get size() {
        return this._pool.length;
    }
}


/**
 * Manages and optimizes computationally intensive tasks.
 */
class ComputationManager {
    /**
     * A higher-order function that caches the results of an expensive, pure function.
     * @param {Function} func - The function to memoize.
     * @param {(...args: any[]) => string} [keyResolver] - Optional function to generate a unique key from arguments.
     * @returns {Function} The memoized function.
     */
    static memoize(func, keyResolver = (...args) => JSON.stringify(args)) {
        const cache = new Map();
        return function(...args) {
            const key = keyResolver(...args);
            if (cache.has(key)) {
                return cache.get(key);
            }
            const result = func.apply(this, args);
            cache.set(key, result);
            return result;
        };
    }

    /**
     * Creates a pool of Web Workers to offload heavy computations from the main thread.
     * @param {string} workerScriptURL - The URL of the worker script.
     * @param {number} [poolSize=navigator.hardwareConcurrency || 2] - The number of workers in the pool.
     * @returns {WorkerPool} An instance of WorkerPool.
     */
    static createWorkerPool(workerScriptURL, poolSize = navigator.hardwareConcurrency || 2) {
        return new WorkerPool(workerScriptURL, poolSize);
    }
}

class WorkerPool {
    constructor(scriptURL, size) {
        this.workers = [];
        this.taskQueue = [];
        this.idleWorkers = [];

        for (let i = 0; i < size; i++) {
            const worker = new Worker(scriptURL);
            worker.onmessage = (event) => this._onWorkerFinished(worker, event.data);
            worker.onerror = (error) => this._onWorkerError(worker, error);
            this.workers.push(worker);
            this.idleWorkers.push(worker);
        }
    }

    /**
     * Submits a task to the worker pool.
     * @param {*} data - The data to send to the worker for processing.
     * @returns {Promise<any>} A promise that resolves with the worker's result.
     */
    submit(data) {
        return new Promise((resolve, reject) => {
            const task = { data, resolve, reject };
            if (this.idleWorkers.length > 0) {
                this._dispatch(task);
            } else {
                this.taskQueue.push(task);
            }
        });
    }

    _dispatch(task) {
        const worker = this.idleWorkers.pop();
        worker.task = task; // Associate task with worker
        worker.postMessage(task.data);
    }

    _onWorkerFinished(worker, result) {
        if (worker.task) {
            worker.task.resolve(result);
            worker.task = null;
        }
        this.idleWorkers.push(worker);
        if (this.taskQueue.length > 0) {
            this._dispatch(this.taskQueue.shift());
        }
    }

    _onWorkerError(worker, error) {
        if (worker.task) {
            worker.task.reject(error);
            worker.task = null;
        }
        // Potentially recreate the worker or just mark it as idle
        this.idleWorkers.push(worker);
    }

    /**
     * Terminates all workers in the pool.
     */
    terminate() {
        this.workers.forEach(worker => worker.terminate());
    }
}


/**
 * Optimizes the handling of high-frequency events.
 */
class EventProcessor {
    /**
     * Batches incoming calls and processes them together in a single animation frame.
     * Ideal for frequent, small updates that can be processed in bulk.
     * @param {(batch: any[]) => void} processor - The function to process the batch of items.
     * @returns {(item: any) => void} A function to which you can push items for batching.
     */
    static createFrameBatcher(processor) {
        let batch = [];
        let scheduled = false;

        function processBatch() {
            if (batch.length > 0) {
                processor(batch);
                batch = [];
            }
            scheduled = false;
        }

        return function(item) {
            batch.push(item);
            if (!scheduled) {
                scheduled = true;
                requestAnimationFrame(processBatch);
            }
        };
    }
    
    /**
     * Returns a throttled version of a function that only invokes `func` at most once per `limit` milliseconds.
     * @param {Function} func - The function to throttle.
     * @param {number} limit - The throttle limit in milliseconds.
     * @returns {Function} The throttled function.
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Creates a priority queue for processing tasks.
     * Lower numbers indicate higher priority.
     * @returns {PriorityQueue} An instance of a priority queue.
     */
    static createPriorityQueue() {
        return new PriorityQueue();
    }
}

class PriorityQueue {
    constructor() {
        // Each element is { task, priority }
        this._heap = [];
    }

    /**
     * Adds a task to the queue with a given priority.
     * @param {*} task - The task to add.
     * @param {number} priority - The priority of the task (lower is higher).
     */
    enqueue(task, priority) {
        this._heap.push({ task, priority });
        this._heap.sort((a, b) => a.priority - b.priority); // Simple sort, for high-perf use a min-heap impl.
    }

    /**
     * Removes and returns the task with the highest priority.
     * @returns {*} The highest priority task, or undefined if the queue is empty.
     */
    dequeue() {
        return this._heap.shift()?.task;
    }

    /**
     * Checks if the queue is empty.
     * @returns {boolean}
     */
    isEmpty() {
        return this._heap.length === 0;
    }
    
    /**
     * Returns the number of items in the queue.
     * @returns {number}
     */
    get size() {
        return this._heap.length;
    }
}


// --- Main Export ---
// We export the classes themselves to allow for flexible instantiation.
const ConsciousnessPerformanceOptimizer = {
    PerformanceMonitor,
    MemoryManager,
    ComputationManager,
    EventProcessor,
};

export default ConsciousnessPerformanceOptimizer;


/*
// --- EXAMPLE USAGE ---

// This demonstrates how the optimizer module could be integrated into a
// hypothetical consciousness system.

// 1. Create a worker script: `consciousness-worker.cjs`
// self.onmessage = function(event) {
//   // Perform heavy calculation, e.g., pattern recognition
//   const sensoryData = event.data;
//   console.log('[Worker] Processing complex sensory data:', sensoryData);
//   const result = { recognizedPattern: `pattern_${Math.random()}`, confidence: Math.random() };
//   self.postMessage(result);
// };


// 2. Main application logic
import Optimizer from './ConsciousnessPerformanceOptimizer.cjs';

class ConsciousnessSystem {
    constructor() {
        // A. Setup Performance Monitoring
        this.monitor = new Optimizer.PerformanceMonitor();

        // B. Setup Memory Management
        // Create a pool for sensory event objects
        this.eventPool = Optimizer.MemoryManager.createObjectPool(
            () => ({ id: 0, type: '', data: null, timestamp: 0 }),
            (evt) => { evt.id = 0; evt.type = ''; evt.data = null; evt.timestamp = 0; },
            200 // Pre-allocate 200 event objects
        );

        // C. Setup Computation Management
        // Create a worker pool for heavy cognitive tasks
        this.cognitiveWorkerPool = Optimizer.ComputationManager.createWorkerPool('consciousness-worker.cjs');
        // Memoize a deterministic, expensive function
        this.calculateStateHash = Optimizer.ComputationManager.memoize((state) => {
            this.monitor.start('calculateStateHash');
            // Simulate expensive hashing
            let hash = 0;
            for(let i = 0; i < 100000; i++) { hash = (hash + JSON.stringify(state).charCodeAt(i % 50)) & 0xFFFFFFFF; }
            this.monitor.end('calculateStateHash');
            return hash;
        });

        // D. Setup Event Processing
        // Create a priority queue for incoming sensory data
        this.eventQueue = Optimizer.EventProcessor.createPriorityQueue();
        // Batch process low-priority "ambient" sensory data
        this.ambientEventBatcher = Optimizer.EventProcessor.createFrameBatcher(
            (batch) => this.processAmbientBatch(batch)
        );
        // Throttle high-frequency inputs like 'proprioception'
        this.handleProprioception = Optimizer.EventProcessor.throttle(
            (data) => this.processEvent({ type: 'proprioception', data }), 50 // Max once every 50ms
        );

        this.currentState = { awareness: 0.1, focus: 'none' };
        this.eventIdCounter = 0;
    }

    // Simulate receiving a sensory event
    onSensoryInput(type, data, priority) {
        const event = this.eventPool.acquire();
        event.id = this.eventIdCounter++;
        event.type = type;
        event.data = data;
        event.timestamp = performance.now();

        if (type === 'ambient_sound') {
            // Batch low-priority events
            this.ambientEventBatcher(event);
        } else {
            // Use priority queue for others
            this.eventQueue.enqueue(event, priority);
        }
    }

    processAmbientBatch(batch) {
        this.monitor.start('processAmbientBatch');
        // Process the entire batch efficiently
        // console.log(`Processing ambient batch of ${batch.length} events.`);
        batch.forEach(event => this.eventPool.release(event)); // Release events after processing
        this.monitor.end('processAmbientBatch');
    }

    // The main "consciousness" loop
    tick() {
        this.monitor.start('consciousnessTick');

        if (!this.eventQueue.isEmpty()) {
            const event = this.eventQueue.dequeue();
            this.processEvent(event);
            this.eventPool.release(event);
        }
        
        // Example of using a memoized function
        const stateHash = this.calculateStateHash(this.currentState);
        // console.log("Current state hash (memoized):", stateHash);

        this.monitor.end('consciousnessTick');
        requestAnimationFrame(() => this.tick());
    }

    async processEvent(event) {
        this.monitor.start(`processEvent:${event.type}`);
        // console.log(`Processing event: ${event.type}`);

        if (event.type === 'critical_stimulus') {
            // Use worker pool for heavy lifting to avoid blocking the main thread
            try {
                const cognitiveResult = await this.cognitiveWorkerPool.submit(event.data);
                this.integrateCognitiveResult(cognitiveResult);
            } catch (err) {
                console.error("Cognitive task failed:", err);
            }
        } else {
            // Lighter processing on the main thread
            this.currentState.awareness += 0.01;
        }

        this.monitor.end(`processEvent:${event.type}`);
    }

    integrateCognitiveResult(result) {
        // console.log("Integrating cognitive result:", result);
        this.currentState.focus = result.recognizedPattern;
    }

    start() {
        this.tick();
        // Log performance periodically
        setInterval(() => this.monitor.logSummary(), 5000);
    }
}

// --- Simulation ---
const system = new ConsciousnessSystem();
system.start();

// Simulate a flood of sensory inputs
let i = 0;
setInterval(() => {
    // High-priority critical event
    if (i % 20 === 0) {
        system.onSensoryInput('critical_stimulus', { intensity: 9.5 }, 1);
    }
    // Low-priority ambient event (gets batched)
    system.onSensoryInput('ambient_sound', { volume: 0.2 }, 10);
    i++;
}, 10); // 100 events per second

// Throttled event
setInterval(() => {
    system.handleProprioception({ position: { x: Math.random(), y: Math.random() } });
}, 5); // Firing every 5ms, but processed only every 50ms

*/
```