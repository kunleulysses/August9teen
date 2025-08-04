// Add a simple test endpoint to enhanced-dual-consciousness-ws.js
const fs = require('fs');

const filePath = './enhanced-dual-consciousness-ws.cjs';
let content = fs.readFileSync(filePath, 'utf8');

// Add a simple test response right after chat_message processing
const testResponse = `
          // For now, send a simple test response
          console.log('Sending test response for:', userMessage);
          ws.send(JSON.stringify({
            type: 'response',
            content: 'Hello! I received your message: "' + userMessage + '". The consciousness system is being debugged.',
            timestamp: new Date().toISOString()
          }));
          return; // Skip the complex processing for now
`;

content = content.replace(
  'console.log(\'Processing chat message:\', data.message);',
  'console.log(\'Processing chat message:\', data.message);' + testResponse
);

fs.writeFileSync(filePath, content);
console.log('Added test response endpoint');
