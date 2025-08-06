/**
 * Priority-Based Event Bus - Gap 4 Solution
 * High-performance event routing with priority queuing and load balancing
 * Additive enhancement to existing event bus without breaking compatibility
 */

const { EventEmitter  } = require('events');
const { Pool } = require('pg');
const brokerBus = require('./BrokerBus.cjs');

class PriorityEventBus extends EventEmitter {
    constructor() {
        super();
        this.name = 'PriorityEventBus';
        
        // Priority queues for different event types
        this.priorityQueues = {
            CRITICAL: [],
            HIGH: [],
            MEDIUM: [],
            LOW: []
        };
        
        // Processing state
        this.isProcessing = false;
        this.processingStats = {
            totalProcessed: 0,
            averageLatency: 0,
            queueSizes: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
        };
        
        // Load balancing
        this.loadBalancer = new EventLoadBalancer();
        this.messageRouter = new MessageRouter();
        
        // Performance monitoring
        this.performanceMonitor = new PerformanceMonitor();
        
        // Increase max listeners for 42-module system
        this.setMaxListeners(1000);

        // Audit log connection
        if (process.env.DATABASE_URL) {
            try {
                this.auditPool = new Pool({ connectionString: process.env.DATABASE_URL });
            } catch (err) {
                console.warn('Audit logging disabled:', err.message);
                this.auditPool = null;
            }
        } else {
            this.auditPool = null;
        }

        console.log('⚡ Priority Event Bus initialized with load balancing');

        // Start processing queue
        this.startQueueProcessor();
    }

    /**
     * Enhanced emit with priority support - maintains backward compatibility
     */
    emit(event, data, priority = 'MEDIUM') {
        // For backward compatibility, if priority is not a string, treat as data
        if (typeof priority !== 'string') {
            return super.emit(event, data, priority);
        }
        
        return this.emitWithPriority(event, data, priority);
    }

    /**
     * Emit event with explicit priority
     */
    emitWithPriority(event, data, priority = 'MEDIUM') {
        const requiredScope = data?.requiredScope;
        const userScopes = data?.ctx?.user?.scopes || [];

        if (requiredScope && (!Array.isArray(userScopes) || !userScopes.includes(requiredScope))) {
            this.logScopeDrop(event, data?.ctx?.user?.id, requiredScope, userScopes);
            return false;
        }

        if (process.env.BROKER_MODE === 'nats') {
            brokerBus.publish(event, { data, priority });
            return true;
        }

        const eventData = {
            event,
            data,
            priority,
            timestamp: Date.now(),
            id: this.generateEventId()
        };

        // Add to appropriate priority queue
        if (this.priorityQueues[priority]) {
            this.priorityQueues[priority].push(eventData);
            this.updateQueueStats();
        } else {
            // Fallback to standard emit for unknown priorities
            return super.emit(event, data);
        }

        // Start processing if not already running
        if (!this.isProcessing) {
            this.processQueue();
        }

        return true;
    }

    logScopeDrop(event, userId, requiredScope, userScopes) {
        if (!this.auditPool) return;
        const query = `INSERT INTO audit_log (event_name, user_id, required_scope, user_scopes, dropped_at)
                       VALUES ($1, $2, $3, $4, NOW())`;
        this.auditPool
            .query(query, [event, userId, requiredScope, JSON.stringify(userScopes)])
            .catch(err => console.error('Failed to log audit entry:', err.message));
    }

    /**
     * Process priority queues in order
     */
    async processQueue() {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        
        try {
            while (this.hasEvents()) {
                const event = this.getNextEvent();
                if (event) {
                    await this.processEvent(event);
                }
            }
        } catch (error) {
            console.error('Error processing event queue:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Get next event from highest priority queue
     */
    getNextEvent() {
        const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        
        for (const priority of priorities) {
            if (this.priorityQueues[priority].length > 0) {
                return this.priorityQueues[priority].shift();
            }
        }
        
        return null;
    }

    /**
     * Process individual event
     */
    async processEvent(eventData) {
        const startTime = Date.now();
        
        try {
            // Route through load balancer for optimal distribution
            const routingStrategy = this.messageRouter.selectRoutingStrategy(eventData);
            
            if (routingStrategy === 'distributed') {
                await this.loadBalancer.distributeEvent(eventData);
            } else {
                // Standard event emission
                super.emit(eventData.event, eventData.data);
            }
            
            // Update performance metrics
            const latency = Date.now() - startTime;
            this.performanceMonitor.recordEvent(eventData, latency);
            this.updateProcessingStats(latency);
            
        } catch (error) {
            console.error(`Error processing event ${eventData.event}:`, error);
            
            // Emit error event for monitoring
            super.emit('event:processing:error', {
                originalEvent: eventData,
                error: error.message,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Check if there are events to process
     */
    hasEvents() {
        return Object.values(this.priorityQueues).some(queue => queue.length > 0);
    }

    /**
     * Start continuous queue processing
     */
    startQueueProcessor() {
        setInterval(() => {
            if (!this.isProcessing && this.hasEvents()) {
                this.processQueue();
            }
        }, 10); // Process every 10ms for low latency
    }

    /**
     * Update queue statistics
     */
    updateQueueStats() {
        for (const [priority, queue] of Object.entries(this.priorityQueues)) {
            this.processingStats.queueSizes[priority] = queue.length;
        }
    }

    /**
     * Update processing statistics
     */
    updateProcessingStats(latency) {
        this.processingStats.totalProcessed++;
        
        // Calculate rolling average latency
        const alpha = 0.1; // Smoothing factor
        this.processingStats.averageLatency = 
            (1 - alpha) * this.processingStats.averageLatency + alpha * latency;
    }

    /**
     * Generate unique event ID
     */
    generateEventId() {
        return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.processingStats,
            isProcessing: this.isProcessing,
            loadBalancerStats: this.loadBalancer.getStats(),
            routerStats: this.messageRouter.getStats(),
            timestamp: Date.now()
        };
    }

    /**
     * Clear all queues (for testing/reset)
     */
    clearQueues() {
        for (const priority of Object.keys(this.priorityQueues)) {
            this.priorityQueues[priority] = [];
        }
        this.updateQueueStats();
    }
}

/**
 * Event Load Balancer for distributed processing
 */
class EventLoadBalancer {
    constructor() {
        this.channels = new Map();
        this.channelStats = new Map();
        this.roundRobinIndex = 0;
    }

    /**
     * Distribute event across available channels
     */
    async distributeEvent(eventData) {
        const availableChannels = this.getAvailableChannels();
        
        if (availableChannels.length === 0) {
            // No channels available, process directly
            return this.processDirectly(eventData);
        }
        
        const selectedChannel = this.selectChannel(availableChannels, eventData);
        return this.sendToChannel(selectedChannel, eventData);
    }

    /**
     * Get available processing channels
     */
    getAvailableChannels() {
        return Array.from(this.channels.keys()).filter(channel => {
            const stats = this.channelStats.get(channel);
            return stats && stats.available && stats.load < 0.8; // 80% capacity threshold
        });
    }

    /**
     * Select optimal channel for event
     */
    selectChannel(channels, eventData) {
        // Round-robin selection with load consideration
        const sortedChannels = channels.sort((a, b) => {
            const loadA = this.channelStats.get(a)?.load || 0;
            const loadB = this.channelStats.get(b)?.load || 0;
            return loadA - loadB;
        });
        
        return sortedChannels[0];
    }

    /**
     * Send event to specific channel
     */
    async sendToChannel(channel, eventData) {
        try {
            const channelHandler = this.channels.get(channel);
            if (channelHandler) {
                await channelHandler(eventData);
                this.updateChannelStats(channel, true);
            }
        } catch (error) {
            this.updateChannelStats(channel, false);
            throw error;
        }
    }

    /**
     * Process event directly when no channels available
     */
    async processDirectly(eventData) {
        // Fallback to direct processing
        console.log(`Processing event ${eventData.event} directly`);
    }

    /**
     * Register processing channel
     */
    registerChannel(channelId, handler) {
        this.channels.set(channelId, handler);
        this.channelStats.set(channelId, {
            available: true,
            load: 0,
            successCount: 0,
            errorCount: 0
        });
    }

    /**
     * Update channel statistics
     */
    updateChannelStats(channelId, success) {
        const stats = this.channelStats.get(channelId);
        if (stats) {
            if (success) {
                stats.successCount++;
            } else {
                stats.errorCount++;
            }
            
            // Update load based on success rate
            const total = stats.successCount + stats.errorCount;
            stats.load = total > 0 ? stats.errorCount / total : 0;
        }
    }

    /**
     * Get load balancer statistics
     */
    getStats() {
        return {
            totalChannels: this.channels.size,
            availableChannels: this.getAvailableChannels().length,
            channelStats: Object.fromEntries(this.channelStats)
        };
    }
}

/**
 * Message Router for intelligent event routing
 */
class MessageRouter {
    constructor() {
        this.routingRules = new Map();
        this.routingStats = {
            totalRouted: 0,
            routingStrategies: {
                direct: 0,
                distributed: 0,
                clustered: 0
            }
        };
    }

    /**
     * Select optimal routing strategy for event
     */
    selectRoutingStrategy(eventData) {
        const { event, priority, data } = eventData;
        
        // Critical events always go direct
        if (priority === 'CRITICAL') {
            this.routingStats.routingStrategies.direct++;
            return 'direct';
        }
        
        // High-volume events use distributed routing
        if (this.isHighVolumeEvent(event)) {
            this.routingStats.routingStrategies.distributed++;
            return 'distributed';
        }
        
        // Module-specific events may use clustering
        if (this.isModuleEvent(event)) {
            this.routingStats.routingStrategies.clustered++;
            return 'clustered';
        }
        
        // Default to direct routing
        this.routingStats.routingStrategies.direct++;
        return 'direct';
    }

    /**
     * Check if event is high-volume
     */
    isHighVolumeEvent(event) {
        const highVolumeEvents = [
            'consciousness:heartbeat',
            'module_activity',
            'consciousness_state_update'
        ];
        return highVolumeEvents.includes(event);
    }

    /**
     * Check if event is module-specific
     */
    isModuleEvent(event) {
        return event.includes('module:') || event.includes('consciousness:');
    }

    /**
     * Get routing statistics
     */
    getStats() {
        return {
            ...this.routingStats,
            totalRouted: this.routingStats.totalRouted
        };
    }
}

/**
 * Performance Monitor for event processing
 */
class PerformanceMonitor {
    constructor() {
        this.eventMetrics = new Map();
        this.performanceHistory = [];
        this.alertThresholds = {
            latency: 100, // ms
            queueSize: 1000,
            errorRate: 0.05 // 5%
        };
    }

    /**
     * Record event processing metrics
     */
    recordEvent(eventData, latency) {
        const eventType = eventData.event;
        
        if (!this.eventMetrics.has(eventType)) {
            this.eventMetrics.set(eventType, {
                count: 0,
                totalLatency: 0,
                averageLatency: 0,
                maxLatency: 0,
                errors: 0
            });
        }
        
        const metrics = this.eventMetrics.get(eventType);
        metrics.count++;
        metrics.totalLatency += latency;
        metrics.averageLatency = metrics.totalLatency / metrics.count;
        metrics.maxLatency = Math.max(metrics.maxLatency, latency);
        
        // Check for performance alerts
        this.checkPerformanceAlerts(eventType, metrics);
    }

    /**
     * Check for performance issues and emit alerts
     */
    checkPerformanceAlerts(eventType, metrics) {
        if (metrics.averageLatency > this.alertThresholds.latency) {
            console.warn(`⚠️ High latency detected for ${eventType}: ${metrics.averageLatency}ms`);
        }
        
        const errorRate = metrics.errors / metrics.count;
        if (errorRate > this.alertThresholds.errorRate) {
            console.warn(`⚠️ High error rate for ${eventType}: ${(errorRate * 100).toFixed(2)}%`);
        }
    }

    /**
     * Get performance summary
     */
    getPerformanceSummary() {
        const summary = {
            totalEvents: 0,
            averageLatency: 0,
            totalErrors: 0,
            eventTypes: {}
        };
        
        for (const [eventType, metrics] of this.eventMetrics) {
            summary.totalEvents += metrics.count;
            summary.totalErrors += metrics.errors;
            summary.eventTypes[eventType] = { ...metrics };
        }
        
        if (summary.totalEvents > 0) {
            summary.averageLatency = Array.from(this.eventMetrics.values())
                .reduce((sum, m) => sum + m.averageLatency, 0) / this.eventMetrics.size;
        }
        
        return summary;
    }
}

module.exports = PriorityEventBus;
