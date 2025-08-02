import '../shared/secretBootstrap';
import '../shared/opentelemetry';
import WebSocket, { WebSocketServer } from 'ws';
import { getAggregator } from './chat-aggregator';
import { generateFlappyContent } from './venice-ai';

export function initUnifiedChatWS(httpServer: any) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/unified-chat' });

  wss.on('connection', (ws) => {
    ws.on('message', async (data) => {
      let parsed: any;
      try {
        parsed = JSON.parse(data.toString());
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        return;
      }

      if (!parsed.message || typeof parsed.message !== 'string') {
        ws.send(JSON.stringify({ type: 'error', message: 'Missing message' }));
        return;
      }

      const userMessage = parsed.message;
      let text = '';
      try {
        const aggregator = await getAggregator();
        if (aggregator) {
          const unified = await aggregator.processUnifiedChat(userMessage);
          if (unified && unified.response) {
            text = unified.response;
          }
        }
        if (!text) {
          // fallback
          const fallback = await generateFlappyContent('chatConversation', userMessage, null, {});
          text = fallback.content || 'Sorry, no response available.';
        }
      } catch (err: any) {
        ws.send(JSON.stringify({ type: 'error', message: 'Chat system error: ' + (err?.message || String(err)) }));
        return;
      }

      // Stream as chunks
      const chunkSize = 40;
      let idx = 0;
      const sendChunk = () => {
        if (idx >= text.length) {
          ws.send(JSON.stringify({ type: 'end' }));
          return;
        }
        const chunk = text.slice(idx, idx + chunkSize);
        ws.send(JSON.stringify({ type: 'chunk', content: chunk }));
        idx += chunkSize;
        setTimeout(sendChunk, 10);
      };
      sendChunk();
    });

    ws.on('error', (err) => {
      try {
        ws.send(JSON.stringify({ type: 'error', message: 'WebSocket error: ' + err.message }));
      } catch {}
    });
  });

  wss.on('error', (err) => {
    // Log server errors
    console.error('[unified-chat-ws] WebSocketServer error:', err);
  });

  console.log('[unified-chat-ws] WebSocket server running on /ws/unified-chat');
}