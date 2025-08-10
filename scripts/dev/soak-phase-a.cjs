#!/usr/bin/env node
const fs = require('fs');
const http = require('http');
const https = require('https');
const { spawnSync } = require('child_process');
const WebSocket = require('ws');

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:3001';
const WS_URL = process.env.WS_URL || 'ws://127.0.0.1:3005';
const RS256_PATH = process.env.RS256_PATH || '/tmp/jwt_rs256.txt';
const HS256_PATH = process.env.HS256_PATH || '/tmp/jwt_hs256.txt';
const INTERVAL_MS = parseInt(process.env.SOAK_INTERVAL_MS || '15000', 10);
const TOKEN_ROTATE_MS = parseInt(process.env.TOKEN_ROTATE_MS || String(8 * 60 * 1000), 10); // default 8m

function read(path) {
  try { return fs.readFileSync(path, 'utf8').trim(); } catch { return ''; }
}

function get(url, token) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(u, { method: 'GET', headers: token ? { Authorization: `Bearer ${token}` } : {} }, (res) => {
      res.resume();
      resolve({ status: res.statusCode });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.end();
  });
}

function post(url, token, body) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const payload = Buffer.from(JSON.stringify(body || {}));
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': String(payload.length), Authorization: `Bearer ${token}` } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') });
      });
    });
    req.on('error', () => resolve({ status: 0 }));
    req.write(payload);
    req.end();
  });
}

let currentWebSocket = null;
let wsHeartbeatInterval = null;

function startWs(token) {
  if (!token) return;

  try { if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) currentWebSocket.close(); } catch {}

  const ws = new WebSocket(WS_URL, token);
  currentWebSocket = ws;

  ws.on('open', () => {
    console.log(`[WS] connected → ${WS_URL}`);
  });

  ws.on('message', (m) => {
    try {
      const msg = JSON.parse(m.toString());
      if (msg && msg.type) console.log(`[WS] ${msg.type}`);
    } catch {}
  });

  ws.on('error', (e) => console.log(`[WS] error: ${e.message}`));

  ws.on('close', () => {
    console.log('[WS] closed');
    // Backoff reconnect with latest token
    setTimeout(() => {
      const fresh = read(HS256_PATH);
      if (fresh) startWs(fresh);
    }, 2000);
  });

  // Emit a heartbeat line periodically so the monitor can mark WS as UP
  if (!wsHeartbeatInterval) {
    wsHeartbeatInterval = setInterval(() => {
      if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
        console.log(`[WS] connected → ${WS_URL}`);
      }
    }, 60 * 1000);
  }

  return ws;
}

function refreshRsToken() {
  try {
    spawnSync('node', ['/opt/featherweight/scripts/dev/gen-jwks-and-token.cjs'], { stdio: 'ignore' });
  } catch {}
}

function refreshHsToken() {
  try {
    spawnSync('node', ['/opt/featherweight/scripts/dev/gen-ws-hs256-token.cjs'], { stdio: 'ignore' });
  } catch {}
}

(async () => {
  // Ensure fresh tokens at start
  refreshRsToken();
  refreshHsToken();
  const hsToken = read(HS256_PATH);
  startWs(hsToken);

  // Proactively rotate tokens to avoid 401 gaps and WS expirations
  setInterval(() => {
    refreshRsToken();
    refreshHsToken();
    const latest = read(HS256_PATH);
    if (latest) startWs(latest);
  }, TOKEN_ROTATE_MS);

  setInterval(async () => {
    let t = read(RS256_PATH);
    const health = await get(`${API_BASE}/healthz`);
    let qStats = await get(`${API_BASE}/api/consciousness/quantum/stats`, t);
    if (qStats.status === 401) { refreshRsToken(); t = read(RS256_PATH); qStats = await get(`${API_BASE}/api/consciousness/quantum/stats`, t); }
    let rStats = await get(`${API_BASE}/api/consciousness/resonance/stats`, t);
    if (rStats.status === 401) { refreshRsToken(); t = read(RS256_PATH); rStats = await get(`${API_BASE}/api/consciousness/resonance/stats`, t); }
    let os = await get(`${API_BASE}/api/os/status`, t);
    if (os.status === 401) { refreshRsToken(); t = read(RS256_PATH); os = await get(`${API_BASE}/api/os/status`, t); }
    let ucip = await post(`${API_BASE}/api/universal/route`, t, { input: { message: 'hello', meta: { test: true } }, budget: { steps: 3 } });
    if (ucip.status === 401) { refreshRsToken(); t = read(RS256_PATH); ucip = await post(`${API_BASE}/api/universal/route`, t, { input: { message: 'hello', meta: { test: true } }, budget: { steps: 3 } }); }
    let trans = await post(`${API_BASE}/api/transcendent/synthesize`, t, { message: 'seek transcendent synthesis', context: { mode: 'test' } });
    if (trans.status === 401) { refreshRsToken(); t = read(RS256_PATH); trans = await post(`${API_BASE}/api/transcendent/synthesize`, t, { message: 'seek transcendent synthesis', context: { mode: 'test' } }); }
    console.log(`[SOAK] health:${health.status} q:${qStats.status} r:${rStats.status} os:${os.status} u:${ucip.status} tr:${trans.status}`);
  }, INTERVAL_MS);
})();