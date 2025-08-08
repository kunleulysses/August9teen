#!/usr/bin/env node
const http = require('http');

async function httpRequest(method, path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? Buffer.from(JSON.stringify(body)) : null;
    const req = http.request({ hostname: '127.0.0.1', port: 3001, path, method, headers: {
      'Content-Type': 'application/json',
      ...headers
    }}, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const token = process.env.API_TOKEN || '';
  const hdrs = token ? { Authorization: `Bearer ${token}` } : {};
  // Phase B flags should remain disabled; this script is inert until enabled.
  // Placeholder calls to verify 503 when disabled
  const r1 = await httpRequest('POST', '/api/cnpl/compile', { programmingRequest: { code: 'function main(){return 1}' } }, hdrs);
  const r2 = await httpRequest('POST', '/api/saqrn/publish', { topic: 'alpha', message: 'ping', sigil: 's' }, hdrs);
  console.log(`[PHASE-B SOAK] cnpl=${r1.status} saqrn=${r2.status}`);
}

main().catch(e => { console.error(e); process.exit(1); });

