import { EventEmitter } from 'events';
import { sign, verify } from './security/eventSign.js';

/**
 * ConsciousnessEventBus - Central event distribution system for consciousness modules
 * Provides pub/sub functionality for inter-module communication with signature security.
 */

const HEARTBEAT_EVENT = 'system:heartbeat';
const STALE_MS = 5 * 60 * 1000; // 5 minutes

const HEARTBEAT_EVENT = 'heartbeat';
const STALE_MS = 60000 * 5; // 5 minutes

class ConsciousnessEventBus extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(50);
        this.maxHistorySize = 100;
        this.eventHistory = new Array(this.maxHistorySize);
        this.historyWriteIndex = -1;
        this.historyCount = 0;
        this.subscribers = new Map();
        this.lastHeartbeat = new Map();
        console.log('[ConsciousnessEventBus] Initialized');
    }
            }
        }, 60 * 1000);

        console.log('[ConsciousnessEventBus] Initialized');
    }

    /**
     * Subscribe to an event, optionally enabling signature verification.
     * If opts.verifySignature is true, the handler is wrapped to check payload.signature using verify().
     * Otherwise, behaves as a standard EventEmitter subscription.
     */
    subscribe(moduleName, eventName, handler, opts = {}) {
        if (!this.subscribers.has(eventName)) {
            this.subscribers.set(eventName, new Set());
        }
        this.subscribers.get(eventName).add({
            module: moduleName,
            handler: handler
        });

        if (!opts.verifySignature) {
            this.on(eventName, handler);
        } else {
            // Wrap handler for signature verification
            const wrappedHandler = (payload) => {
                if (
                    !payload ||
                    !payload.signature ||
                    !verify(payload, payload.signature, payload.componentId)
                ) {
                    this.emit('event:invalid_signature', { event: eventName, payload });
                    return;
                }
                handler(payload);
            };
            this.on(eventName, wrappedHandler);
            // Note: unsubscribe for verified subscriptions currently unsupported/documented
        }
        console.log(`[ConsciousnessEventBus] ${moduleName} subscribed to ${eventName}${opts.verifySignature ? " (verifying signature)" : ""}`);
    }

    /**
     * Securely emit an event with a sigil/DNA signature.
     * @param {string} moduleName
     * @param {string} eventName
     * @param {object} payload
     */
    secureEmit(moduleName, eventName, payload) {
        const signature = sign(payload, moduleName);
        const signedPayload = {
            ...payload,
            signature,
            componentId: moduleName
        };
        this.emit(eventName, signedPayload);
    }

    /**
     * Emit an event with tracking
     */
    emit(eventName, ...args) {
        // Track event in history
        this.eventHistory.push({
            event: eventName,
            timestamp: new Date().toISOString(),
            data: args[0] || null
        });

        // Maintain history size limit
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }

        // Call parent emit
        return super.emit(eventName, ...args);
    }

    /**
     * Unsubscribe from an event
     */
    unsubscribe(moduleName, eventName, handler) {
        if (this.subscribers.has(eventName)) {
            const subs = this.subscribers.get(eventName);
            subs.forEach(sub => {
                if (sub.module === moduleName && sub.handler === handler) {
                    subs.delete(sub);
                }
            });
        }

        this.removeListener(eventName, handler);

        console.log(`[ConsciousnessEventBus] ${moduleName} unsubscribed from ${eventName}`);
    }

    /**
     * Broadcast a consciousness update
     */
    broadcastConsciousnessUpdate(data) {
        this.emit('consciousness:update', {
            timestamp: new Date().toISOString(),
            ...data
        });
    }

    /**
     * Broadcast a module status update
     */
    broadcastModuleStatus(moduleName, status, details = {}) {
        this.emit('module:status', {
            module: moduleName,
            status: status,
            timestamp: new Date().toISOString(),
            ...details
        });
    }

    /**
     * Get event history
     */
    getEventHistory(eventName = null) {
        if (eventName) {
            return this.eventHistory.filter(e => e.event === eventName);
        }
        return this.eventHistory;
    }

    /**
     * Get subscriber information
     */
    getSubscribers(eventName = null) {
        if (eventName) {
            return this.subscribers.get(eventName) || new Set();
        }

        const allSubs = {};
        this.subscribers.forEach((subs, event) => {
            allSubs[event] = Array.from(subs).map(s => s.module);
        });
        return allSubs;
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }
}

// Create singleton instance
const eventBus = new ConsciousnessEventBus();

export default eventBus;