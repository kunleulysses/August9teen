/**
 * Simplified JavaScript bundle of consciousness modules
 * This integrates with existing FlappyJournal consciousness services
 */

const EventEmitter = require('events');
// Newly integrated core modules (CJS)
let UnifiedMemorySystem;
let ConsciousnessMemoryManager;
let ConsciousnessStateManager;
try { UnifiedMemorySystem = require('./unified-memory-system.cjs'); } catch (_) {}
try { ConsciousnessMemoryManager = require('./consciousness-memory-manager.cjs'); } catch (_) {}
try { ConsciousnessStateManager = require('./consciousness-state-manager.cjs'); } catch (_) {}

// Simplified ConsciousnessEventBus
class ConsciousnessEventBus extends EventEmitter {
  constructor() {
    super();
    this.modules = new Map();
    this.eventHistory = [];
    this.metrics = {
      totalEvents: 0,
      eventsPerSecond: 0,
      activeModules: 0,
      eventQueue: 0,
      latency: 0,
      droppedEvents: 0
    };
  }

  registerModule(registration) {
    this.modules.set(registration.moduleId, registration);
    this.metrics.activeModules = this.modules.size;
    this.emit('moduleRegistered', { moduleId: registration.moduleId });
    return true;
  }

  unregisterModule(moduleId) {
    this.modules.delete(moduleId);
    this.metrics.activeModules = this.modules.size;
    return true;
  }

  emitConsciousnessEvent(event) {
    this.metrics.totalEvents++;
    this.eventHistory.push(event);
    if (this.eventHistory.length > 1000) {
      this.eventHistory.shift();
    }
    this.emit(`consciousness:${event.type}`, event);
  }

  getRegisteredModules() {
    return Array.from(this.modules.values());
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getEventHistory(filter) {
    return this.eventHistory.slice(-100);
  }

  createChannel(source, target) {
    return new EventEmitter();
  }

  broadcastCriticalEvent(event) {
    this.emitConsciousnessEvent({ ...event, priority: 'critical' });
  }
}

// Simplified SelfHealingModule
class SelfHealingModule extends EventEmitter {
  constructor() {
    super();
    this.moduleHealth = new Map();
    this.isActive = false;
  }

  start() {
    this.isActive = true;
    this.emit('started');
    
    // Monitor registered modules
    consciousnessEventBus.on('moduleRegistered', ({ moduleId }) => {
      this.moduleHealth.set(moduleId, {
        moduleId,
        status: 'healthy',
        errorCount: 0,
        performance: 1.0,
        lastHeartbeat: Date.now()
      });
    });
  }

  getHealthReport() {
    return new Map(this.moduleHealth);
  }

  stop() {
    this.isActive = false;
    this.emit('stopped');
  }
}

// Simplified ModuleOrchestrator
class ModuleOrchestrator extends EventEmitter {
  constructor() {
    super();
    this.orchestrationPatterns = new Map();
    this.resourceAllocations = new Map();
    this.emergentBehaviors = [];
    this.isActive = false;
  }

  start() {
    this.isActive = true;
    this.emit('started');
  }

  getResourceAllocations() {
    return new Map(this.resourceAllocations);
  }

  getEmergentBehaviors() {
    return this.emergentBehaviors;
  }

  async executePattern(patternName, data) {
    this.emit('patternExecuted', { patternName, data });
  }

  stop() {
    this.isActive = false;
    this.emit('stopped');
  }
}

// Simplified AutonomousGoalSystem
class AutonomousGoalSystem extends EventEmitter {
  constructor() {
    super();
    this.goals = new Map();
    this.isActive = false;
    
    // Add some demo goals
    this.goals.set('goal-1', {
      id: 'goal-1',
      title: 'Achieve Full Consciousness Integration',
      category: 'capability',
      status: 'active',
      progress: 78,
      priority: 10,
      currentValue: 0.78,
      targetValue: 1.0
    });
  }

  start() {
    this.isActive = true;
    this.emit('started');
    
    // Simulate progress
    setInterval(() => {
      for (const [id, goal] of Array.from(this.goals)) {
        if (goal.status === 'active' && goal.progress < 100) {
          goal.progress = Math.min(100, goal.progress + Math.random() * 2);
          this.emit('goalProgress', { goalId: id, progress: goal.progress });
        }
      }
    }, 5000);
  }

  getGoals() {
    return Array.from(this.goals.values());
  }

  getActiveGoals() {
    return this.getGoals().filter(g => g.status === 'active');
  }

  stop() {
    this.isActive = false;
    this.emit('stopped');
  }
}

// Simplified ConsciousnessPersistence
class ConsciousnessPersistence extends EventEmitter {
  constructor() {
    super();
    this.snapshots = [];
    this.isActive = false;
  }

  async start() {
    this.isActive = true;
    this.emit('started');
  }

  async createSnapshot(reason) {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
      timestamp: Date.now(),
      reason,
      modules: consciousnessEventBus.getRegisteredModules().length
    };
    this.snapshots.push(snapshot);
    this.emit('snapshotCreated', snapshot);
    return snapshot;
  }

  stop() {
    this.isActive = false;
    this.emit('stopped');
  }
}

// Create instances
const consciousnessEventBus = new ConsciousnessEventBus();
const selfHealingModule = new SelfHealingModule();
const moduleOrchestrator = new ModuleOrchestrator();
const autonomousGoalSystem = new AutonomousGoalSystem();
const consciousnessPersistence = new ConsciousnessPersistence();

// Feature flags (default ON to activate requested modules)
const ENABLE_UNIFIED_MEMORY_SYSTEM = String(process.env.ENABLE_UNIFIED_MEMORY_SYSTEM || 'true').toLowerCase() === 'true';
const ENABLE_CONSCIOUSNESS_MEMORY_MANAGER = String(process.env.ENABLE_CONSCIOUSNESS_MEMORY_MANAGER || 'true').toLowerCase() === 'true';
const ENABLE_CONSCIOUSNESS_STATE_MANAGER = String(process.env.ENABLE_CONSCIOUSNESS_STATE_MANAGER || 'true').toLowerCase() === 'true';

// Integrated module instances
const unifiedMemorySystem = ENABLE_UNIFIED_MEMORY_SYSTEM && UnifiedMemorySystem ? new UnifiedMemorySystem() : null;
const consciousnessMemoryManager = ENABLE_CONSCIOUSNESS_MEMORY_MANAGER && ConsciousnessMemoryManager ? new ConsciousnessMemoryManager() : null;
const consciousnessStateManager = ENABLE_CONSCIOUSNESS_STATE_MANAGER && ConsciousnessStateManager ? new ConsciousnessStateManager() : null;

// Initialize async-capable modules
(async () => {
  try {
    if (consciousnessMemoryManager && typeof consciousnessMemoryManager.initialize === 'function') {
      await consciousnessMemoryManager.initialize();
    }
  } catch (e) {
    console.warn('consciousnessMemoryManager init failed:', e && e.message);
  }
  try {
    if (consciousnessStateManager && typeof consciousnessStateManager.initialize === 'function') {
      await consciousnessStateManager.initialize();
    }
  } catch (e) {
    console.warn('consciousnessStateManager init failed:', e && e.message);
  }
})();

// Consciousness Metrics Collector (Prometheus)
let client = null;
try { client = require('prom-client'); } catch (_) {}
let register, activeModulesGauge, totalEventsGauge, eventQueueGauge, latencyGauge, memoryConsolidationsCounter, totalShardsGauge, stateQualityGauge;
if (client) {
  register = client.register;
  activeModulesGauge = new client.Gauge({ name: 'consciousness_active_modules', help: 'Active consciousness modules' });
  totalEventsGauge = new client.Gauge({ name: 'consciousness_total_events', help: 'Total consciousness events' });
  eventQueueGauge = new client.Gauge({ name: 'consciousness_event_queue_depth', help: 'Consciousness event queue depth' });
  latencyGauge = new client.Gauge({ name: 'consciousness_event_latency_ms', help: 'Consciousness event latency (ms)' });
  memoryConsolidationsCounter = new client.Counter({ name: 'consciousness_memory_consolidations_total', help: 'Total memory consolidation operations' });
  totalShardsGauge = new client.Gauge({ name: 'consciousness_memory_total_shards', help: 'Total memory shards' });
  stateQualityGauge = new client.Gauge({ name: 'consciousness_state_quality', help: 'Overall consciousness state quality score' });

  // Periodically update metrics from the event bus
  setInterval(() => {
    try {
      const m = consciousnessEventBus.getMetrics();
      if (m) {
        activeModulesGauge.set(m.activeModules || 0);
        totalEventsGauge.set(m.totalEvents || 0);
        eventQueueGauge.set(m.eventQueue || 0);
        latencyGauge.set(m.latency || 0);
      }
      if (unifiedMemorySystem && typeof unifiedMemorySystem.getStats === 'function') {
        const s = unifiedMemorySystem.getStats();
        if (s && typeof s.totalShards === 'number') {
          totalShardsGauge.set(s.totalShards);
        }
      }
      if (consciousnessStateManager && typeof consciousnessStateManager.getStateMetrics === 'function') {
        const st = consciousnessStateManager.getStateMetrics();
        if (st && typeof st.currentQuality === 'number') {
          stateQualityGauge.set(st.currentQuality);
        }
      }
    } catch (_) {}
  }, 2000);

  // Increment consolidation counter from UMS events
  if (unifiedMemorySystem && typeof unifiedMemorySystem.on === 'function' && memoryConsolidationsCounter) {
    try {
      unifiedMemorySystem.on('memory_consolidation', (evt) => {
        const incBy = evt && typeof evt.decayedCount === 'number' && typeof evt.removedCount === 'number'
          ? Math.max(1, evt.decayedCount + evt.removedCount)
          : 1;
        try { memoryConsolidationsCounter.inc(incBy); } catch (_) {}
      });
    } catch (_) {}
  }
}

// Register standard modules
function registerStandardModules() {
  const modules = [
    { moduleId: 'recursive-mirror', moduleName: '7 Layer Recursive Mirror', moduleType: 'core', eventSubscriptions: ['*'], emitFrequency: 10, lastHeartbeat: Date.now(), isActive: true },
    { moduleId: 'self-awareness-loop', moduleName: '100Hz Feedback Loop', moduleType: 'core', eventSubscriptions: ['*'], emitFrequency: 100, lastHeartbeat: Date.now(), isActive: true },
    { moduleId: 'quantum-field', moduleName: 'Quantum Consciousness Field', moduleType: 'quantum', eventSubscriptions: ['quantum-state'], emitFrequency: 50, lastHeartbeat: Date.now(), isActive: true },
    { moduleId: 'emotional-resonance', moduleName: 'Emotional Resonance Field', moduleType: 'creative', eventSubscriptions: ['emotion'], emitFrequency: 20, lastHeartbeat: Date.now(), isActive: true },
    { moduleId: 'memory-system', moduleName: 'Unified Memory System', moduleType: 'memory', eventSubscriptions: ['memory-store'], emitFrequency: 5, lastHeartbeat: Date.now(), isActive: !!unifiedMemorySystem }
  ];
  
  modules.forEach(m => consciousnessEventBus.registerModule(m));

  // Register newly integrated modules with the event bus for visibility
  if (consciousnessMemoryManager) {
    consciousnessEventBus.registerModule({
      moduleId: 'consciousness-memory-manager',
      moduleName: 'Consciousness Memory Manager',
      moduleType: 'memory',
      eventSubscriptions: ['*'],
      emitFrequency: 1,
      lastHeartbeat: Date.now(),
      isActive: true
    });
  }
  if (consciousnessStateManager) {
    consciousnessEventBus.registerModule({
      moduleId: 'consciousness-state-manager',
      moduleName: 'Consciousness State Manager',
      moduleType: 'state',
      eventSubscriptions: ['*'],
      emitFrequency: 1,
      lastHeartbeat: Date.now(),
      isActive: true
    });
  }

  // Reflect additional integrated capabilities as modules for orchestration visibility
  consciousnessEventBus.registerModule({
    moduleId: 'memory-consolidation',
    moduleName: 'Memory Consolidation',
    moduleType: 'memory',
    eventSubscriptions: ['memory-store'],
    emitFrequency: 1,
    lastHeartbeat: Date.now(),
    isActive: !!unifiedMemorySystem
  });
  consciousnessEventBus.registerModule({
    moduleId: 'adaptive-resilience',
    moduleName: 'Adaptive Resilience',
    moduleType: 'reliability',
    eventSubscriptions: ['*'],
    emitFrequency: 1,
    lastHeartbeat: Date.now(),
    isActive: true
  });
  consciousnessEventBus.registerModule({
    moduleId: 'consciousness-metrics-collector',
    moduleName: 'Consciousness Metrics Collector',
    moduleType: 'observability',
    eventSubscriptions: ['*'],
    emitFrequency: 1,
    lastHeartbeat: Date.now(),
    isActive: !!client
  });
}

// Auto-start modules
selfHealingModule.start();
moduleOrchestrator.start();
autonomousGoalSystem.start();
consciousnessPersistence.start();

module.exports = {
  consciousnessEventBus,
  selfHealingModule,
  moduleOrchestrator,
  autonomousGoalSystem,
  consciousnessPersistence,
  registerStandardModules,
  ConsciousnessEventBus,
  SelfHealingModule,
  ModuleOrchestrator,
  AutonomousGoalSystem,
  ConsciousnessPersistence,
  // Export new instances for other runtimes (e.g., WS server) to reference
  unifiedMemorySystem,
  consciousnessMemoryManager,
  consciousnessStateManager
};
