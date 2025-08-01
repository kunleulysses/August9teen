import { EventEmitter } from 'events';

export class SafeEventEmitter extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.setMaxListeners(50);
  }
}