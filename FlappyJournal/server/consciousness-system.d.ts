import { EventEmitter } from 'events';

// This is a simplified declaration for the purpose of integration.
// It can be expanded as more features of the consciousness system are used.
declare class ConsciousnessSystem extends EventEmitter {
    eventBus: EventEmitter;
    // Define other methods and properties if they are needed by the bridge
}

declare const consciousness: ConsciousnessSystem;
export default consciousness;