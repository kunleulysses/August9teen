```javascript
/**
 * @module ConsciousnessPerformanceOptimizer
 * @description A highly optimized module for a conceptual "consciousness system".
 * This module integrates several performance optimization techniques to ensure
 * efficient event processing, memory management, and low-latency computations,
 * crucial for a system handling a high throughput of sensory data and cognitive tasks.
 *
 * Features:
 * 1.  Event Processing: A priority-based, batched event queue to handle sensory inputs.
 * 2.  Memory Management: Object pooling to reduce garbage collection pressure and WeakMap for caching.
 * 3.  Computational Efficiency: Offloads heavy cognitive tasks to a Web Worker to prevent blocking the main thread.
 * 4.  Latency Reduction: Prioritizes critical tasks and uses asynchronous processing.
 * 5.  Performance Monitoring: In-built monitor to track key performance metrics.
 */

/**
 * Creates a Web Worker from a string by creating a Blob and a local URL.
 * This allows the entire module to be self-contained in a single file.
 * @param {Function} workerFunction - The function defining the worker's behavior.
 * @returns {Worker} A new Web Worker instance.
 */
function createWorker(workerFunction) {
    const workerCode = `(${workerFunction.toString()})();`;
    const blob = new Blob([workerCode], {
        type: 'application/javascript'
    });
    return new Worker(URL.createObjectURL(blob));
}

/**
 * The Web Worker responsible for heavy "cognitive" computations.
 * This runs in a separate thread, not blocking the main UI/event loop.
 */
const cognitiveWorkerLogic = () => {
    self.onmessage = (event) => {
        const {
            type,
            payload,
            taskId
        } = event.data;

        // Start performance measurement inside the worker
        const startTime = self.performance.now();

        let result;

        switch (type) {
            case 'COMPUTE_PATTERN_RECOGNITION':
                // Simulate a complex, CPU-intensive task.
                // Example: A simplified simulation of neural network layer computation.
                const matrix = payload.data;
                const weights = Array.from({ length: matrix.length }, () => Math.random());
                let sum = 0;
                for (let i = 0; i < matrix.length; i++) {
                    // This loop represents the heavy computation
                    for (let j = 0; j < matrix.length; j++) {
                         sum += matrix[i] * weights[j] * Math.sin(i) * Math.cos(j);
                    }
                }
                result = {
                    recognized: sum > 0,
                    confidence: Math.random()
                };
                break;

            default:
                result = {
                    error: `Unknown task type: ${type}`
                };
        }

        const duration = self.performance.now() - startTime;

        // Post the result back to the main thread
        self.postMessage({
            taskId,
            result,
            duration,
        });
    };
};


/**
 * @class PerformanceMonitor
 * @description A singleton class to monitor and report performance metrics.
 */
class PerformanceMonitor {
    constructor() {
        if (PerformanceMonitor.instance) {
            return PerformanceMonitor.instance;
        }
        this.metrics = {
            eventQueueLength: 0,
            processedEvents: 0,
            cognitiveTasksSent: 0,
            perceptsInPool: 0,
            totalEventProcessingTime: 0,
            totalCognitiveWorkerTime: 0,
            timers: new Map(),
        };
        PerformanceMonitor.instance = this;
    }

    /**
     * Starts a high-resolution timer for a specific operation.
     * @param {string} label - A unique name for the timer.
     */
    start(label) {
        this.metrics.timers.set(label, performance.now());
    }

    /**
     * Stops a timer and records the duration.
     * @param {string} label - The name of the timer to stop.
     * @param {string} totalTimeKey - The key in `metrics` to add the duration to.
     */
    end(label, totalTimeKey) {
        const startTime = this.metrics.timers.get(label);
        if (startTime) {
            const duration = performance.now() - startTime;
            if (this.metrics[totalTimeKey] !== undefined) {
                this.metrics[totalTimeKey] += duration;
            }
            this.metrics.timers.delete(label);
            return duration;
        }
        return 0;
    }

    /**
     * Increments a counter metric.
     * @param {string} key - The metric key to increment.
     * @param {number} [value=1] - The value to add.
     */
    increment(key, value = 1) {
        if (this.metrics[key] !== undefined) {
            this.metrics[key] += value;
        }
    }

    /**
     * Sets a gauge metric to a specific value.
     * @param {string} key - The metric key to set.
     * @param {number} value - The value to set.
     */
    set(key, value) {
        if (this.metrics[key] !== undefined) {
            this.metrics[key] = value;
        }
    }

    /**
     * Generates a summary report of all collected metrics.
     * @returns {object} An object containing performance statistics.
     */
    getReport() {
        const avgEventProcessingTime = this.metrics.processedEvents > 0 ?
            (this.metrics.totalEventProcessingTime / this.metrics.processedEvents).toFixed(4) : 0;

        const avgCognitiveWorkerTime = this.metrics.cognitiveTasksSent > 0 ?
            (this.metrics.totalCognitiveWorkerTime / this.metrics.cognitiveTasksSent).toFixed(4) : 0;

        return {
            timestamp: new Date().toISOString(),
            ...this.metrics,
            avgEventProcessingTime_ms: parseFloat(avgEventProcessingTime),
            avgCognitiveWorkerTime_ms: parseFloat(avgCognitiveWorkerTime),
            memory: performance.memory ? { // Note: `performance.memory` is non-standard
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                usedJSHeapSize: performance.memory.usedJSHeapSize,
            } : 'N/A',
        };
    }
}


/**
 * @class ConsciousnessCore
 * @description The main class for the consciousness system, orchestrating all optimizations.
 */
class ConsciousnessCore {
    constructor({
        eventBatchSize = 50,
        processInterval = 16 // roughly 60fps
    } = {}) {
        this.config = {
            eventBatchSize,
            processInterval
        };
        this.isRunning = false;
        this.monitor = new PerformanceMonitor();

        // 1. Event Processing Optimization: Priority queue and batching
        this.eventQueue = []; // A simple array used as a priority queue: [ { event, priority } ]
        this.lastProcessTime = 0;

        // 2. Memory Management Optimization: Object pooling for "Percept" objects
        this.perceptPool = [];
        this.monitor.set('perceptsInPool', 0);

        // 3. Computational Efficiency: Web Worker for cognitive tasks
        this.cognitiveWorker = createWorker(cognitiveWorkerLogic);
        this.cognitiveWorker.onmessage = this._handleWorkerResult.bind(this);
        this.pendingCognitiveTasks = new Map(); // taskId -> { resolve, reject }
        this.nextTaskId = 0;
        
        // 4. Latency Reduction & Caching: Memoization cache for repetitive simple tasks
        this.memoizationCache = new WeakMap(); // Use WeakMap to avoid memory leaks
    }

    /**
     * Starts the main processing loop of the consciousness system.
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this._mainLoop();
        console.log("ConsciousnessCore started.");
    }

    /**
     * Stops the system and cleans up resources.
     */
    shutdown() {
        this.isRunning = false;
        this.cognitiveWorker.terminate();
        this.eventQueue = [];
        this.perceptPool = [];
        this.pendingCognitiveTasks.clear();
        console.log("ConsciousnessCore shut down. Resources released.");
    }

    /**
     * Public method to feed sensory input into the system.
     * @param {object} sensoryData - The raw data from a sensor.
     * @param {number} [priority=1] - The priority of the event (0 = highest).
     */
    processSensoryInput(sensoryData, priority = 1) {
        if (!this.isRunning) return;
        
        // Use an object from the pool to avoid new object allocation
        const percept = this._acquirePercept();
        percept.timestamp = performance.now();
        percept.data = sensoryData;
        
        this.eventQueue.push({ event: percept, priority });

        // Sort queue by priority (a more performant priority queue could be used for very high loads)
        this.eventQueue.sort((a, b) => a.priority - b.priority);
        this.monitor.set('eventQueueLength', this.eventQueue.length);
    }

    /**
     * The main processing loop, driven by requestAnimationFrame for smooth, non-blocking execution.
     */
    _mainLoop() {
        if (!this.isRunning) return;

        const now = performance.now();
        const delta = now - this.lastProcessTime;

        // Process events at a controlled interval
        if (delta >= this.config.processInterval) {
            this.lastProcessTime = now;
            this.monitor.start('eventBatchProcessing');
            this._processEventQueue();
            this.monitor.end('eventBatchProcessing', 'totalEventProcessingTime');
        }

        requestAnimationFrame(this._mainLoop.bind(this));
    }

    /**
     * Processes a batch of events from the queue.
     */
    _processEventQueue() {
        const batch = this.eventQueue.splice(0, this.config.eventBatchSize);
        if (batch.length === 0) return;

        for (const item of batch) {
            this._handleEvent(item.event);
            this._releasePercept(item.event); // Release the percept back to the pool
        }

        this.monitor.increment('processedEvents', batch.length);
        this.monitor.set('eventQueueLength', this.eventQueue.length);
    }
    
    /**
     * Handles a single event, deciding whether to process it locally or offload it.
     * @param {object} percept - The percept object to handle.
     */
    _handleEvent(percept) {
        const { data } = percept;
        
        // Example logic: small, simple tasks are handled immediately and memoized.
        if (data.type === 'SIMPLE_REFLECTION') {
            const result = this._memoizedSimpleTask(data.value);
            // ... do something with the result
        }
        
        // Example logic: large, complex tasks are offloaded to the worker.
        if (data.type === 'COMPLEX_ANALYSIS') {
            this._offloadToCognitiveWorker('COMPUTE_PATTERN_RECOGNITION', { data: data.matrix })
                .then(result => {
                    // console.log('Cognitive task completed:', result);
                })
                .catch(error => {
                    console.error('Cognitive task failed:', error);
                });
        }
    }

    /**
     * A simple, memoized task to demonstrate caching.
     * @param {any} input - The input for the task.
     * @returns {any} The computed result.
     */
    _memoizedSimpleTask(input) {
        // Use a complex object as a key to demonstrate WeakMap's strength
        const key = { input }; 
        if (this.memoizationCache.has(key)) {
            return this.memoizationCache.get(key);
        }
        
        // Simulate a moderately expensive synchronous calculation
        const result = input * Math.random() * 100;
        this.memoizationCache.set(key, result);
        return result;
    }

    /**
     * Offloads a task to the cognitive worker.
     * @param {string} type - The type of task for the worker.
     * @param {object} payload - The data needed for the computation.
     * @returns {Promise<any>} A promise that resolves with the worker's result.
     */
    _offloadToCognitiveWorker(type, payload) {
        return new Promise((resolve, reject) => {
            const taskId = this.nextTaskId++;
            this.pendingCognitiveTasks.set(taskId, { resolve, reject });
            this.monitor.increment('cognitiveTasksSent');
            
            this.cognitiveWorker.postMessage({ type, payload, taskId });
        });
    }

    /**
     * Handles results coming back from the cognitive worker.
     * @param {MessageEvent} event - The message event from the worker.
     */
    _handleWorkerResult(event) {
        const { taskId, result, duration } = event.data;
        if (this.pendingCognitiveTasks.has(taskId)) {
            const { resolve } = this.pendingCognitiveTasks.get(taskId);
            resolve(result);
            this.pendingCognitiveTasks.delete(taskId);
            
            this.monitor.increment('totalCognitiveWorkerTime', duration);
        }
    }

    // --- Memory Management: Object Pool Methods ---

    _acquirePercept() {
        if (this.perceptPool.length > 0) {
            this.monitor.set('perceptsInPool', this.perceptPool.length - 1);
            return this.perceptPool.pop();
        }
        // Pool is empty, create a new object.
        return {};
    }

    _releasePercept(percept) {
        // Reset object state before returning to the pool
        percept.timestamp = null;
        percept.data = null;
        this.perceptPool.push(percept);
        this.monitor.set('perceptsInPool', this.perceptPool.length);
    }
    
    /**
     * Retrieves the latest performance report.
     * @returns {object} The performance report object.
     */
    getPerformanceReport() {
        return this.monitor.getReport();
    }
}
```