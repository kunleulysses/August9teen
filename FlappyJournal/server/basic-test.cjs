console.log('Basic Node.js test working');
console.log('Current directory:', process.cwd());
console.log('Node version:', process.version);

// Test file system
const fs = require('fs');
try {
    const files = fs.readdirSync('./consciousness');
    console.log('Consciousness directory files:', files.length);
} catch (error) {
    console.error('Error reading consciousness directory:', error.message);
}

console.log('Test completed successfully');
