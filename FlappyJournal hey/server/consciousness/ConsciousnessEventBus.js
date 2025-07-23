import { EventEmitter } from 'events';

/**
 * Consciousness Event Bus
 * A singleton event emitter to serve as the central nervous system for the
 * entire consciousness platform. All modules will communicate through this bus.
 */
class ConsciousnessEventBus extends EventEmitter {}

const eventBus = new ConsciousnessEventBus();

export default eventBus;
