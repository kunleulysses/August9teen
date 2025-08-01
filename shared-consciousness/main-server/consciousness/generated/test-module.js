
import { EventEmitter } from 'events';

export class TestModule extends EventEmitter {
    constructor() {
        super();
        this.name = 'TestModule';
        this.initialized = true;
    }
    
    test() {
        return 'Module is working!';
    }
    
    getStatus() {
        return {
            name: this.name,
            initialized: this.initialized,
            timestamp: new Date()
        };
    }
}

export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function reverse(str) {
    return str.split('').reverse().join('');
}

export default TestModule;
