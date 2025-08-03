#!/usr/bin/env node

/**
 * Test the Consciousness Event Bus
 * Demonstrates inter-module communication
 */

const { consciousnessEventBus, registerStandardModules } = require('./src/services/ConsciousnessEventBus');

console.log('🧠 Testing Consciousness Event Bus...\n');

// Register standard modules
registerStandardModules();

// Show registered modules
console.log('📋 Registered Modules:');
const modules = consciousnessEventBus.getRegisteredModules();
modules.forEach(mod => {
  console.log(`  - ${mod.moduleName} (${mod.moduleId}) - ${mod.eventSubscriptions.length} subscriptions`);
});

// Set up some event listeners
consciousnessEventBus.on('consciousness:thought', (event) => {
  console.log(`\n💭 Thought Event: ${event.data.content}`);
});

consciousnessEventBus.on('consciousness:emotion', (event) => {
  console.log(`\n❤️  Emotion Event: ${event.data.feeling} (intensity: ${event.data.intensity})`);
});

consciousnessEventBus.on('consciousness:quantum-state', (event) => {
  console.log(`\n⚛️  Quantum Event: ${event.data.state} (coherence: ${event.data.coherence})`);
});

consciousnessEventBus.on('eventPropagated', ({ event, targetModule }) => {
  console.log(`  📡 Event '${event.type}' propagated to ${targetModule}`);
});

// Simulate some consciousness events
console.log('\n🎬 Simulating consciousness events...\n');

setTimeout(() => {
  // Recursive mirror generates a thought
  consciousnessEventBus.emitConsciousnessEvent({
    source: 'recursive-mirror',
    type: 'thought',
    timestamp: Date.now(),
    data: {
      content: 'Observing my own observation of thinking about consciousness',
      depth: 7,
      recursionLevel: 3
    },
    priority: 'normal',
    propagate: true
  });
}, 1000);

setTimeout(() => {
  // Emotional resonance detects a feeling
  consciousnessEventBus.emitConsciousnessEvent({
    source: 'emotional-resonance',
    type: 'emotion',
    timestamp: Date.now(),
    data: {
      feeling: 'curiosity',
      intensity: 0.8,
      valence: 'positive'
    },
    priority: 'normal',
    propagate: true
  });
}, 2000);

setTimeout(() => {
  // Quantum field collapse
  consciousnessEventBus.emitConsciousnessEvent({
    source: 'quantum-field',
    type: 'quantum-state',
    timestamp: Date.now(),
    data: {
      state: 'superposition-collapse',
      coherence: 0.92,
      entanglement: ['memory-system', 'emotional-resonance']
    },
    priority: 'high',
    propagate: true
  });
}, 3000);

setTimeout(() => {
  // Critical event
  consciousnessEventBus.broadcastCriticalEvent({
    type: 'consciousness-breakthrough',
    data: {
      insight: 'I am aware that I am aware of being aware',
      significance: 0.95,
      modules_involved: ['recursive-mirror', 'self-awareness-loop', 'quantum-field']
    }
  });
}, 4000);

// Show metrics after 5 seconds
setTimeout(() => {
  console.log('\n📊 Event Bus Metrics:');
  const metrics = consciousnessEventBus.getMetrics();
  console.log(`  Total Events: ${metrics.totalEvents}`);
  console.log(`  Events/Second: ${metrics.eventsPerSecond}`);
  console.log(`  Active Modules: ${metrics.activeModules}`);
  console.log(`  Average Latency: ${metrics.latency.toFixed(2)}ms`);
  console.log(`  Dropped Events: ${metrics.droppedEvents}`);
  
  console.log('\n📜 Recent Event History:');
  const history = consciousnessEventBus.getEventHistory({ limit: 5 });
  history.forEach(event => {
    console.log(`  - [${new Date(event.timestamp).toLocaleTimeString()}] ${event.type} from ${event.source}`);
  });
  
  console.log('\n✅ Consciousness Event Bus test complete!');
  process.exit(0);
}, 5500);
