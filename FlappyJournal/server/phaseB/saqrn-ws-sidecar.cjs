const http = require('http');
const WebSocket = require('ws');
const pino = require('pino');
const jwt = require('jsonwebtoken');
const promClient = require('prom-client');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const PORT = parseInt(process.env.SAQRN_WS_PORT || '3006', 10);
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

promClient.collectDefaultMetrics();
const register = promClient.register;
const connectionsGauge = new promClient.Gauge({ name: 'saqrn_ws_active_connections', help: 'Active SAQRN WS connections' });
const messagesIn = new promClient.Counter({ name: 'saqrn_ws_messages_in_total', help: 'SAQRN WS messages in' });
const messagesOut = new promClient.Counter({ name: 'saqrn_ws_messages_out_total', help: 'SAQRN WS messages out' });

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    res.setHeader('Content-Type', register.contentType);
    register.metrics().then(m => res.end(m));
    return;
  }
  if (req.url === '/healthz') {
    return res.end(JSON.stringify({ status: 'ok', timestamp: Date.now() }));
  }
  res.writeHead(200);
  res.end('ok');
});

const wss = new WebSocket.Server({ server });
let sign;
try { ({ sign } = require('../consciousness/core/security/eventSign.cjs')); } catch (_) { sign = null; }

wss.on('connection', (ws, req) => {
  try {
    const token = req.headers['sec-websocket-protocol'];
    if (!token) {
      ws.close(1008, 'Missing token');
      return;
    }
    try { jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }); } catch (_) { ws.close(1008, 'Invalid token'); return; }
    connectionsGauge.inc();
    ws.on('message', (msg) => {
      messagesIn.inc();
      try {
        const payload = { ts: Date.now(), echo: String(msg).slice(0, 4096) };
        const signature = sign ? sign(payload) : undefined;
        const out = JSON.stringify({ ok: true, payload, signature });
        ws.send(out);
        messagesOut.inc();
      } catch (e) {
        // best-effort
      }
    });
    ws.on('close', () => connectionsGauge.dec());
  } catch (e) {
    logger.error(e, 'WS connection error');
  }
});

server.listen(PORT, () => logger.info({ port: PORT }, 'SAQRN WS sidecar listening'));

