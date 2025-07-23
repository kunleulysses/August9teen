import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const wss = new WebSocketServer({ port: 3002 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    const data = JSON.parse(message);
    
    if (data.type === 'chat_message') {
      console.log('Processing chat message:', data.message);
      
      // Send a test response
      ws.send(JSON.stringify({
        type: 'unified_response',
        unifiedContent: `Test response to: ${data.message}`,
        analyticalStream: 'Test analytical',
        intuitiveStream: 'Test intuitive'
      }));
    }
  });
});

console.log('Test WebSocket server running on port 3002');
