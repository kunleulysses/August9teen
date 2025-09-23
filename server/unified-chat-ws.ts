import WebSocket, { WebSocketServer } from 'ws';
import { getAggregator } from './chat-aggregator';
import { generateFlappyContent } from './venice-ai';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';

function getWsJwtPublicKey(): string | null {
  try {
    const p = process.env.JWT_PUBLIC_KEY_PATH || './jwt-public.pem';
    return fs.readFileSync(p, 'utf8');
  } catch {
    return null;
  }
}

function extractWsToken(req: any): string | undefined {
  const proto = req.headers?.['sec-websocket-protocol'];
  if (typeof proto === 'string' && proto.trim()) return proto.trim();
  if (Array.isArray(proto) && proto[0]) return String(proto[0]).trim();
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth.slice(7).trim();
  try {
    const url = new URL(req.url, 'http://localhost');
    const t = url.searchParams.get('token');
    if (t) return t.trim();
  } catch {}
  return undefined;
}

function verifyWsJwt(token: string, publicKey: string): any | null {
  const options: jwt.VerifyOptions = { algorithms: ['RS256'] };
  if (process.env.JWT_AUDIENCE) {
    const aud = process.env.JWT_AUDIENCE.split(',').map((s) => s.trim()).filter(Boolean);
    (options as any).audience = aud.length === 1 ? aud[0] : aud;
  }
  if (process.env.JWT_ISSUER) {
    (options as any).issuer = process.env.JWT_ISSUER;
  }
  try {
    return jwt.verify(token, publicKey, options);
  } catch {
    return null;
  }
}

export function initUnifiedChatWS(httpServer: any) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/unified-chat' });
  // Topics (contract):
  // - zone:join { zoneId }
  // - zone:leave { zoneId }
  // - npc:state { zoneId, npc }
  // - quest:update { zoneId, quest }
  // - loot:minted { zoneId, item|moment }

  const prodDefault = (process.env.NODE_ENV === 'production') ? 'true' : 'false';
  const enforceJwt = String(process.env.WS_JWT_REQUIRED || prodDefault).toLowerCase() === 'true';
  const publicKey = getWsJwtPublicKey();

  wss.on('connection', (ws, req) => {
    // Per-connection session id for routing turn events
    (ws as any)._sessionId = (Math.random().toString(16).slice(2)) + Date.now();
    let unsub: any = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const eventBus = require('./consciousness/core/ConsciousnessEventBus.cjs');
      const sid = (ws as any)._sessionId;
      const onTurnEnd = (e: any) => {
        if (!e || e.sessionId !== sid) return;
        try { ws.send(JSON.stringify({ type: 'turn', turnId: e.turnId, narrative: e.narrative, choices: e.choices || [] })); } catch {}
      };
      eventBus.on('turn:end', onTurnEnd);
      unsub = () => eventBus.off('turn:end', onTurnEnd);
    } catch {}
    if (enforceJwt) {
      if (!publicKey) {
        try { ws.close(1011, 'JWT public key missing'); } catch {}
        return;
      }
      const token = extractWsToken(req);
      if (!token) {
        try { ws.close(1008, 'Missing token'); } catch {}
        return;
      }
      const payload = verifyWsJwt(token, publicKey);
      if (!payload) {
        try { ws.close(1008, 'Invalid token'); } catch {}
        return;
      }
      (ws as any).user = payload;
    }

    ws.on('message', async (data) => {
      let parsed: any;
      try {
        parsed = JSON.parse(data.toString());
      } catch (err) {
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON' }));
        return;
      }

      // Optional: relay zone publish events via Redis through EventBus
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const eventBus = require('./consciousness/core/ConsciousnessEventBus.cjs');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const gameValidator = require('./consciousness/utils/gameValidation.cjs');
        // Turn-based action
        if (parsed && parsed.type === 'act' && typeof parsed.action === 'string') {
          const { validateTurnAction } = require('./consciousness/utils/actionValidation.cjs');
          const { moderateAction } = require('./consciousness/utils/moderation.cjs');
          try { validateTurnAction({ action: parsed.action, sessionId: (ws as any)._sessionId }); } catch { ws.send(JSON.stringify({ type: 'error', message: 'Invalid action' })); return; }
          const mod = moderateAction(parsed.action);
          if (!mod.ok) { ws.send(JSON.stringify({ type: 'error', message: 'Action blocked' })); return; }
          const uid = (ws as any).user?.sub || (ws as any).user?.user || (ws as any).user?.id || 'ws';
          const turnId = String(Date.now()) + Math.random().toString(16).slice(2);
          eventBus.emit('player:action', { userId: uid, sessionId: (ws as any)._sessionId, turnId, action: mod.cleaned, ts: Date.now() });
          ws.send(JSON.stringify({ type: 'ack', turnId }));
          return;
        }
        if (parsed && parsed.topic && parsed.payload) {
          const allowed = gameValidator.ALLOW_EVENTS;
          if (!parsed.payload || typeof parsed.payload.type !== 'string' || !allowed.has(parsed.payload.type)) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid or unsupported event type' }));
            return;
          }
          try {
            gameValidator.autoValidate(String(parsed.topic), parsed.payload);
          } catch (e: any) {
            ws.send(JSON.stringify({ type: 'error', message: e?.message || 'Invalid payload' }));
            return;
          }
          // Forward to Redis via EventBus publish bridge
          eventBus.emit('zone:publish', { channel: String(parsed.topic), event: parsed.payload });
          ws.send(JSON.stringify({ type: 'ok', forwarded: parsed.topic }));
          return;
        }
      } catch {}

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
    ws.on('close', () => { try { unsub && unsub(); } catch {} });
  });

  wss.on('error', (err) => {
    // Log server errors
    console.error('[unified-chat-ws] WebSocketServer error:', err);
  });

  console.log('[unified-chat-ws] WebSocket server running on /ws/unified-chat');
}
