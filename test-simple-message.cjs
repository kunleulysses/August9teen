import WebSocket from 'ws';

console.log('Testing consciousness chat with simple message...');

const ws = new WebSocket('ws://localhost:5000/ws/consciousness-chat');

ws.on('open', function open() {
  console.log('✅ Connected to consciousness chat!');
  
  setTimeout(() => {
    console.log('📤 Sending test message...');
    ws.send(JSON.stringify({
      type: 'chat_message',
      message: 'hello consciousness system'
    }));
  }, 1000);
});

ws.on('message', function message(data) {
  try {
    const parsed = JSON.parse(data.toString());
    console.log('📥 Received:', parsed.type);
    if (parsed.type === 'chat_response') {
      console.log('💬 AI Response:', parsed.response);
      console.log('🤖 Provider:', parsed.provider);
    } else if (parsed.type === 'sigil_created') {
      console.log('✨ Sigil created:', parsed.sigil?.id?.substring(0, 8));
    } else {
      console.log('📊 Other message:', parsed);
    }
  } catch (err) {
    console.log('📩 Raw message:', data.toString());
  }
});

ws.on('error', function error(err) {
  console.error('❌ Error:', err.message);
});

ws.on('close', function close() {
  console.log('🔌 Connection closed');
});

setTimeout(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.close();
  }
  process.exit(0);
}, 10000);
