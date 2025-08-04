const fs = require('fs');

// Fix index.js
let indexContent = fs.readFileSync('./index.cjs', 'utf8');

// Add WebSocketServer import
indexContent = indexContent.replace(
  "import { setupEnhancedResearchWebSocketServer } from \"./enhanced-dual-consciousness-ws.js\";",
  `const { WebSocketServer  } = require('ws');
const { setupEnhancedResearchWebSocketServer  } = require('./enhanced-dual-consciousness-ws.cjs');`
);

// Replace WebSocket setup
indexContent = indexContent.replace(
  "// Setup WebSocket server for chat\nsetupEnhancedResearchWebSocketServer(server);",
  `// Setup WebSocket server for chat
const wss = new WebSocketServer({ 
  server,
  path: '/ws/chat'
});
setupEnhancedResearchWebSocketServer(wss);
console.log('Enhanced Dual-Consciousness WebSocket server started on /ws/chat');`
);

fs.writeFileSync('./index.cjs', indexContent);
console.log('Fixed WebSocket setup in index.cjs');
