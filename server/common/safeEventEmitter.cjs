const { EventEmitter } = require('events');

class SafeEventEmitter extends EventEmitter {
  constructor(...args) {
    super(...args);
    this.setMaxListeners(50);
  }
}

module.exports = { SafeEventEmitter };