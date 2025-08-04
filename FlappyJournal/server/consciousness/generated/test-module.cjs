
const { EventEmitter  } = require('events');

class TestModule extends EventEmitter {
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

function capitalize(str) {
module.exports.capitalize = capitalize;

    return str.charAt(0).toUpperCase() + str.slice(1);
}

function reverse(str) {
module.exports.reverse = reverse;

    return str.split('').reverse().join('');
}

module.exports = TestModule;
