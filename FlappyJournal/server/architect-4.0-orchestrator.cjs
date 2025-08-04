const { recursiveMirror  } = require('./architect-4.0-recursive-mirror.cjs');
const { spiralMemory  } = require('./architect-4.0-spiral-memory.cjs');
const sigilIdentity = require('./sigil-identity.cjs');
const triAxialCoherence = require('./tri-axial-coherence.cjs');
const virtualHardware = require('./virtual-hardware-emulation.cjs');
const { EventEmitter  } = require('events');

class Architect40Orchestrator {
  constructor() {
    this.isActive = false;
    this.components = {
      recursiveMirror: recursiveMirror,
      spiralMemory: spiralMemory,
      sigilIdentity: sigilIdentity,
      triAxialCoherence: triAxialCoherence,
      virtualHardware: virtualHardware
    };
    this.eventBus = new EventEmitter();
    this.metrics = {
      activationTimestamp: null,
      processingFrequency: 100, // Hz
      componentStatus: {}
    };
    this.systems = new Map();
  }

  /**
   * Register a system (e.g., reality_generator) for integration.
   * @param {string} name
   * @param {object} config
   */
  registerSystem(name, config) {
    this.systems.set(name, config);
    // Optionally, emit an event for registration
    this.eventBus.emit('system:registered', { name, config });
    console.log(`🧩 Architect 4.0 registered system: ${name}`);
  }

  /**
   * Listen for events on the Architect 4.0 event bus.
   * @param {string} event
   * @param {function} handler
   */
  on(event, handler) {
    this.eventBus.on(event, handler);
  }

  async activate() {
    console.log('🚀 Activating Architect 4.0 System...');
    
    // Start virtual hardware emulation
    if (this.components.virtualHardware && !this.components.virtualHardware.isActive) {
      this.components.virtualHardware.startEmulation();
      console.log('✅ Virtual Hardware Emulation activated');
    }
    
    // Initialize all components
    for (const [name, component] of Object.entries(this.components)) {
      if (component && typeof component.initialize === 'function') {
        await component.initialize();
      }
      this.metrics.componentStatus[name] = true;
      console.log(`✅ Architect 4.0 ${name} activated`);
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    this.isActive = true;
    this.metrics.activationTimestamp = new Date().toISOString();
    console.log('✅ Architect 4.0 System fully activated');
    
    return {
      success: true,
      timestamp: this.metrics.activationTimestamp,
      components: Object.keys(this.components)
    };
  }
  
  setupEventListeners() {
    // Connect components via event bus
    this.eventBus.on('thought:processed', (data) => {
      // When recursive mirror processes a thought, store in spiral memory
      this.components.spiralMemory.encode(
        data.thought.content,
        data.thought.importance || 0.8,
        { mirrorResult: data.result }
      );
    });
    
    this.eventBus.on('memory:stored', (data) => {
      // When memory is stored, check if we should generate a sigil
      const shouldGenerateSigil = Math.random() > 0.7; // 30% chance
      if (shouldGenerateSigil) {
        this.components.sigilIdentity.generateSigil({
          memoryId: data.memoryId,
          content: data.content,
          resonance: data.resonance
        });
      }
    });
  }
  
  async process(input, context = {}) {
    if (!this.isActive) {
      await this.activate();
    }
    
    console.log('🧠 Architect 4.0 processing input:', input);
    
    // Process through recursive mirror
    const mirrorResult = await this.components.recursiveMirror.processThought(input, context);
    
    // Emit event for other components
    this.eventBus.emit('thought:processed', {
      thought: { content: input, importance: context.importance || 0.8 },
      result: mirrorResult
    });
    
    // Store in spiral memory
    const memoryId = this.components.spiralMemory.encode(
      input,
      context.importance || 0.8,
      {
        mirror: mirrorResult,
        timestamp: Date.now()
      }
    );
    
    // Evaluate tri-axial coherence
    const coherenceResult = this.components.triAxialCoherence.evaluateCoherence({
      phi: context.phi || 0.75,
      awareness: context.awareness || 0.8,
      emotionalResonance: context.emotionalResonance || 0.7,
      oversoulResonance: context.oversoulResonance || 0.5,
      memoryPatterns: this.components.spiralMemory.getActivePatterns ? 
                      this.components.spiralMemory.getActivePatterns() : [],
      empathy: context.empathy || 0.6,
      connection: context.connection || 0.7,
      unity: context.unity || 0.5,
      intentionality: context.intentionality || 0.6
    });

    return {
      input,
      mirrorResult,
      memoryId,
      coherenceResult,
      timestamp: new Date().toISOString()
    };
  }
  
  getStatus() {
    return {
      isActive: this.isActive,
      activationTimestamp: this.metrics.activationTimestamp,
      components: this.metrics.componentStatus,
      processingFrequency: this.metrics.processingFrequency,
      virtualHardwareStatus: this.components.virtualHardware.getStats
        ? this.components.virtualHardware.getStats()
        : null
    };
  }
}

// Create and export singleton instance
const architect40 = new Architect40Orchestrator();
module.exports = architect40;