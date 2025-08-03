import { EventEmitter } from 'events';
import { sign, verify } from './security/eventSign.js';

// --- Configuration constants ---
const MAX_HISTORY = 100;
const HEARTBEAT_EVENT = 'system:heartbeat';
const STALE_MS = 5 * 60 * 1000; // 5 min

class ConsciousnessEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);

    // fixed-size ring buffer for last MAX_HISTORY events
    this.history = new Array(MAX_HISTORY);
    this.writeIdx = -1;
    this.count = 0;

    this.subscribers = new Map(); // eventName -> Set({module,handler})
    this.lastHeartbeat = new Map(); // moduleName -> timestamp

    // Sweep stale modules every minute
    setInterval(() => this._cleanupStaleModules(), 60_000);
  }

  // ---------------- Subscription -----------------
  subscribe(moduleName, eventName, handler, opts = {}) {
    if (!this.subscribers.has(eventName)) this.subscribers.set(eventName, new Set());
    this.subscribers.get(eventName).add({ module: moduleName, handler });
    this.lastHeartbeat.set(moduleName, Date.now());

    if (!opts.verifySignature) {
      this.on(eventName, handler);
    } else {
      const wrapped = (payload) => {
        if (!payload?.signature || !verify(payload, payload.signature, payload.componentId)) {
          this.emit('event:invalid_signature', { event: eventName, payload });
          return;
        }
        handler(payload);
      };
      this.on(eventName, wrapped);
    }
  }

  unsubscribeModule(moduleName) {
    for (const [evt, set] of this.subscribers.entries()) {
      for (const sub of Array.from(set)) {
        if (sub.module === moduleName) {
          this.removeListener(evt, sub.handler);
          set.delete(sub);
        }
      }
    }
    console.log(`[ConsciousnessEventBus] cleaned stale module ${moduleName}`);
  }

  unsubscribe(moduleName, eventName, handler) {
    if (this.subscribers.has(eventName)) {
      const set = this.subscribers.get(eventName);
      for (const sub of Array.from(set)) {
        if (sub.module === moduleName && sub.handler === handler) {
          set.delete(sub);
        }
      }
    }
    this.removeListener(eventName, handler);
  }

  // --------------- Emitting ------------------
  secureEmit(moduleName, eventName, payload = {}) {
    if (eventName === HEARTBEAT_EVENT) {
      this.lastHeartbeat.set(moduleName, Date.now());
    }
    const signature = sign(payload, moduleName);
    const signed = { ...payload, signature, componentId: moduleName };
    this.emit(eventName, signed);
  }

  emit(eventName, ...args) {
    // Ring buffer write
    this.writeIdx = (this.writeIdx + 1) % MAX_HISTORY;
    this.history[this.writeIdx] = {
      event: eventName,
      timestamp: new Date().toISOString(),
      data: args[0] ?? null,
    };
    if (this.count < MAX_HISTORY) this.count++;

    return super.emit(eventName, ...args);
  }

  emitHeartbeat(moduleName) {
    this.secureEmit(moduleName, HEARTBEAT_EVENT, {});
  }

  // -------------- Utilities ----------------
  getEventHistory(filter = null) {
    const out = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.writeIdx - this.count + 1 + i + MAX_HISTORY) % MAX_HISTORY;
      const evt = this.history[idx];
      if (!evt) continue;
      if (!filter || evt.event === filter) out.push(evt);
    }
    return out;
  }

  clearHistory() {
    this.history = new Array(MAX_HISTORY);
    this.writeIdx = -1;
    this.count = 0;
  }

  _cleanupStaleModules() {
    const now = Date.now();
    for (const [module, ts] of this.lastHeartbeat.entries()) {
      if (now - ts > STALE_MS) {
        this.unsubscribeModule(module);
        this.lastHeartbeat.delete(module);
      }
    }
  }
}

export default new ConsciousnessEventBus();