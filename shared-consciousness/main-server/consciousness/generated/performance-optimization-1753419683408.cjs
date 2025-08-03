```javascript
/**
 * @module ConsciousnessOptimizer
 * @description A highly optimized performance module for a hypothetical JavaScript-based consciousness system.
 * This module provides tools to manage the high-throughput, low-latency demands of processing
 * sensory data, cognitive models, and memory access, which are analogous to the challenges
 * in real-time data processing, game engines, and complex simulations.
 *
 * Features:
 * 1.  Event Processing: Prioritized, batched event queue to handle "sensory inputs" and "internal stimuli" efficiently.
 * 2.  Memory Management: Object pooling to reduce garbage collection pauses for frequently created/destroyed "thought particles".
 * 3.  Computational Efficiency: Memoization for "cognitive models" and a Web Worker pool for "subconscious processing".
 * 4.  Latency Reduction: A core processing loop synchronized with the environment's refresh rate (e.g., requestAnimationFrame).
 * 5.  Performance Monitoring: Tools to measure and report on the system's health and performance.
 */
const ConsciousnessOptimizer = (() => {
    'use strict';

    // --- Private State ---

    let isInitialized = false;
    const workerPool = [];
    const taskQueue = [];
    let nextTaskId = 0;
    const pendingTasks = new Map();

    // --- 5. Performance Monitoring ---

    const monitor = {
        metrics: {
            eventsProcessed: 0,
            tasksOffloaded: 0,
            objectsReused: 0,
            highPriorityQueueMax: 0,
            lowPriorityQueueMax: 0,
            lastTickDuration: 0,
            avgTickDuration: 0,
            tickCount: 0,
        },
        timers: new Map(),
        
        /**
         * Starts a performance timer for a specific key.
         * @param {string} key - A unique identifier for the operation being timed.
         */
        start: (key) => {
            monitor.timers.set(key, performance.now());
        },

        /**
         * Stops a performance timer and returns the elapsed time.
         * @param {string} key - The identifier for the timer to stop.
         * @returns {number} The elapsed time in milliseconds.
         */
        stop: (key) => {
            const startTime = monitor.timers.get(key);
            if (startTime) {
                const elapsed = performance.now() - startTime;
                monitor.timers.delete(key);
                return elapsed;
            }
            return 0;
        },

        /**
         * Resets all performance metrics.
         */
        reset: () => {
            for (const key in monitor.metrics) {
                monitor.metrics[key] = 0;
            }
            monitor.timers.clear();
        },

        /**
         * Generates and logs a performance report to the console.
         */
        report: () => {
            console.group("--- Consciousness Performance Report ---");
            console.log(`Core Tick Duration (Last): ${monitor.metrics.lastTickDuration.toFixed(2)}ms`);
            console.log(`Core Tick Duration (Avg): ${monitor.metrics.avgTickDuration.toFixed(2)}ms`);
            console.log(`Total Events Processed: ${monitor.metrics.eventsProcessed}`);
            console.log(`Subconscious Tasks Offloaded: ${monitor.metrics.tasksOffloaded}`);
            console.log(`Memory Particles Reused: ${monitor.metrics.objectsReused}`);
            console.log(`Peak High-Priority Queue: ${monitor.metrics.highPriorityQueueMax}`);
            console.log(`Peak Low-Priority Queue: ${monitor.metrics.lowPriorityQueueMax}`);
            console.groupEnd();
        }
    };


    // --- 2. Memory Management: Object Pooling ---

    /**
     * Creates a pool of reusable objects to reduce garbage collection overhead.
     * Ideal for temporary, frequently used objects like "ThoughtParticles" or "SensoryData".
     * @param {function} factory - A function that creates a new object instance.
     * @param {function} resetter - A function that resets an object to its initial state.
     * @param {number} initialSize - The number of objects to pre-allocate.
     * @returns {object} An object pool with `get` and `release` methods.
     */
    const createObjectPool = (factory, resetter, initialSize = 100) => {
        const pool = [];

        // Pre-populate the pool
        for (let i = 0; i < initialSize; i++) {
            pool.push(factory());
        }

        return {
            /**
             * Retrieve an object from the pool. Creates a new one if the pool is empty.
             */
            get: () => {
                if (pool.length > 0) {
                    monitor.metrics.objectsReused++;
                    return pool.pop();
                }
                // Pool is empty, create a new object on demand
                return factory();
            },
            /**
             * Return an object to the pool for reuse.
             * @param {object} obj - The object to release back into the pool.
             */
            release: (obj) => {
                resetter(obj);
                pool.push(obj);
            },
            /**
             * Gets the current size of the pool.
             */
            get size() {
                return pool.length;
            }
        };
    };

    // --- 1. Event Processing: Prioritized Event Queue ---

    const eventQueue = {
        // Higher number = higher priority. 0 for low priority.
        highPriority: [], // For critical events: "pain", "danger"
        lowPriority: [],  // For background events: "ambient noise", "subtle thoughts"

        /**
         * Adds an event ("stimulus") to the processing queue.
         * @param {function} task - The function to execute for this event.
         * @param {number} [priority=0] - The priority of the event. Higher numbers are processed first.
         */
        enqueue: (task, priority = 0) => {
            if (priority > 0) {
                eventQueue.highPriority.push(task);
                 if (eventQueue.highPriority.length > monitor.metrics.highPriorityQueueMax) {
                    monitor.metrics.highPriorityQueueMax = eventQueue.highPriority.length;
                }
            } else {
                eventQueue.lowPriority.push(task);
                if (eventQueue.lowPriority.length > monitor.metrics.lowPriorityQueueMax) {
                    monitor.metrics.lowPriorityQueueMax = eventQueue.lowPriority.length;
                }
            }
        },

        /**
         * Processes a batch of events from the queue, prioritizing critical ones.
         * @param {number} timeBudget - The maximum time in ms to spend processing events this tick.
         */
        processBatch: (timeBudget) => {
            const startTime = performance.now();
            
            // Process high-priority events first
            while (performance.now() - startTime < timeBudget && eventQueue.highPriority.length > 0) {
                const task = eventQueue.highPriority.shift();
                task();
                monitor.metrics.eventsProcessed++;
            }

            // If time remains, process low-priority events
            while (performance.now() - startTime < timeBudget && eventQueue.lowPriority.length > 0) {
                const task = eventQueue.lowPriority.shift();
                task();
                monitor.metrics.eventsProcessed++;
            }
        }
    };


    // --- 3. Computational Efficiency: Web Worker for Subconscious Processing ---

    /**
     * Creates the Web Worker responsible for heavy computations.
     * This represents the "subconscious" mind, performing tasks without blocking the main "stream of consciousness".
     */
    const createWorker = () => {
        const workerCode = `
            self.onmessage = (e) => {
                const { id, task, args } = e.data;
                try {
                    // In a real scenario, task would be a string identifier
                    // mapped to a function inside the worker. For this example,
                    // we use eval for simplicity, but DO NOT use eval in production.
                    // Instead, use a switch statement or a map of functions.
                    // const taskFn = new Function('return ' + task)();
                    // const result = taskFn(...args);

                    // A safer approach:
                    const taskFn = new Function('...args', \`return (\${task})(...args)\`);
                    const result = taskFn(...args);
                    self.postMessage({ id, status: 'success', result });
                } catch (error) {
                    self.postMessage({ id, status: 'error', error: error.message });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        return new Worker(URL.createObjectURL(blob));
    };

    /**
     * Offloads a computationally expensive task to the subconscious (Web Worker pool).
     * @param {function} taskFn - The function to execute. Must be self-contained.
     * @param {Array} args - Arguments to pass to the task function.
     * @returns {Promise} A promise that resolves with the result of the task.
     */
    const offloadTask = (taskFn, args = []) => {
        if (workerPool.length === 0) {
            console.warn("No workers available. Task will run on the main thread.");
            return Promise.resolve(taskFn(...args));
        }

        return new Promise((resolve, reject) => {
            const id = nextTaskId++;
            const worker = workerPool[id % workerPool.length]; // Round-robin assignment
            
            pendingTasks.set(id, { resolve, reject });
            monitor.metrics.tasksOffloaded++;

            worker.postMessage({
                id,
                task: taskFn.toString(), // Serialize function for the worker
                args
            });
        });
    };

    // --- 4. Latency Reduction: The Core Processing Loop ---

    let isRunning = false;
    let lastFrameTime = 0;

    /**
     * The main loop of the consciousness system. Synchronized to the environment's repaint cycle.
     * This is the "stream of consciousness" where all inputs are integrated.
     * @param {number} currentTime - The timestamp provided by requestAnimationFrame.
     */
    function coreLoop(currentTime) {
        if (!isRunning) return;

        monitor.start('tick');
        
        const deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;

        // Define a time budget for this frame to avoid jank (e.g., 10ms to stay under 16.67ms for 60fps)
        const timeBudget = 10;
        
        // 1. Process all queued sensory inputs and internal stimuli
        eventQueue.processBatch(timeBudget);

        // 2. Placeholder for other synchronous "conscious" work
        // e.g., updating focus, short-term memory decay, etc.
        // This work should be very fast.

        const tickDuration = monitor.stop('tick');
        monitor.metrics.lastTickDuration = tickDuration;
        monitor.metrics.tickCount++;
        monitor.metrics.avgTickDuration = ((monitor.metrics.avgTickDuration * (monitor.metrics.tickCount - 1)) + tickDuration) / monitor.metrics.tickCount;

        requestAnimationFrame(coreLoop);
    }


    // --- Public API ---

    return {
        /**
         * Initializes the Consciousness Optimizer and starts the core processing loop.
         * @param {object} config
         * @param {number} [config.workerCount=navigator.hardwareConcurrency/2] - Number of "subconscious" workers to spawn.
         */
        init: (config = {}) => {
            if (isInitialized) {
                console.warn("ConsciousnessOptimizer is already initialized.");
                return;
            }

            const workerCount = config.workerCount || Math.max(1, Math.floor(navigator.hardwareConcurrency / 2));
            console.log(`Initializing consciousness with ${workerCount} subconscious processors.`);

            for (let i = 0; i < workerCount; i++) {
                const worker = createWorker();
                worker.onmessage = (e) => {
                    const { id, status, result, error } = e.data;
                    const task = pendingTasks.get(id);
                    if (task) {
                        if (status === 'success') {
                            task.resolve(result);
                        } else {
                            task.reject(new Error(error));
                        }
                        pendingTasks.delete(id);
                    }
                };
                workerPool.push(worker);
            }

            isInitialized = true;
            isRunning = true;
            lastFrameTime = performance.now();
            requestAnimationFrame(coreLoop);
            console.log("Consciousness stream is now active.");
        },

        /**
         * Shuts down the system, terminates workers, and stops the loop.
         */
        shutdown: () => {
            isRunning = false;
            workerPool.forEach(worker => worker.terminate());
            workerPool.length = 0;
            pendingTasks.clear();
            isInitialized = false;
            console.log("Consciousness stream has been terminated.");
        },

        // Expose sub-modules
        eventQueue,
        createObjectPool,
        offloadTask,
        monitor,

        /**
         * A higher-order function that caches the results of expensive, pure "cognitive models".
         * @param {function} fn - The expensive function to memoize.
         * @param {function} [keyResolver] - Optional function to generate a cache key from arguments.
         * @returns {function} The new, memoized function.
         */
        memoize: (fn, keyResolver) => {
            const cache = new Map();
            return function(...args) {
                const key = keyResolver ? keyResolver(...args) : JSON.stringify(args);
                if (cache.has(key)) {
                    return cache.get(key);
                }
                const result = fn.apply(this, args);
                cache.set(key, result);
                return result;
            };
        },
    };
})();

// --- Example Usage ---
/*

// 1. Initialize the system
ConsciousnessOptimizer.init({ workerCount: 2 });

// 2. Create a memory pool for "ThoughtParticles"
const thoughtParticleFactory = () => ({ id: 0, energy: 1.0, data: null, processed: false });
const thoughtParticleResetter = (p) => {
    p.id = 0;
    p.energy = 1.0;
    p.data = null;
    p.processed = false;
};
const thoughtPool = ConsciousnessOptimizer.createObjectPool(thoughtParticleFactory, thoughtParticleResetter, 1000);

// 3. Define an expensive "cognitive model" and memoize it
const complexPatternRecognition = (input) => {
    // Simulate heavy computation
    let sum = 0;
    for (let i = 0; i < input.length * 100000; i++) { sum += Math.sqrt(i); }
    return `Pattern recognized for [${input.join(', ')}] with complexity ${sum}`;
};
const memoizedPatternRecognition = ConsciousnessOptimizer.memoize(complexPatternRecognition);


// 4. Simulate receiving sensory data (events)
function onSensoryInput(data, isCritical = false) {
    ConsciousnessOptimizer.eventQueue.enqueue(() => {
        const thought = thoughtPool.get(); // Get a recycled object
        thought.id = Math.random();
        thought.data = data;
        
        // Process the thought...
        // console.log(`Processing thought ${thought.id} with data:`, data);
        thought.processed = true;

        thoughtPool.release(thought); // Release it back to the pool
    }, isCritical ? 1 : 0);
}

// Simulate a flood of sensory inputs
let eventCount = 0;
const sensoryInterval = setInterval(() => {
    onSensoryInput({ type: 'ambient_sound', value: Math.random() });
    eventCount++;
    if (eventCount % 10 === 0) {
        // A critical event that needs immediate attention
        onSensoryInput({ type: 'sudden_movement', value: 1.0 }, true);
    }
    if (eventCount > 100) clearInterval(sensoryInterval);
}, 10);


// 5. Offload a heavy task to the "subconscious"
console.log("Offloading a heavy cognitive task...");
ConsciousnessOptimizer.offloadTask(complexPatternRecognition, [[1, 2, 3, 4, 5]])
    .then(result => {
        console.log("Subconscious task complete:", result);
    })
    .catch(console.error);
    
// Run the memoized version on the main thread (will be slow first time, fast second time)
console.log("Running memoized task on main thread (1st time)...");
console.time("memoized_1");
memoizedPatternRecognition([5,4,3,2,1]);
console.timeEnd("memoized_1");

console.log("Running memoized task on main thread (2nd time)...");
console.time("memoized_2");
memoizedPatternRecognition([5,4,3,2,1]);
console.timeEnd("memoized_2");


// 6. Monitor performance
setTimeout(() => {
    ConsciousnessOptimizer.monitor.report();
    
    // 7. Shutdown the system
    // ConsciousnessOptimizer.shutdown();
}, 2000);

*/
```