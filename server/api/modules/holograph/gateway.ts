import { WebSocketServer } from 'ws';
import * as yaml from 'js-yaml';
import { wsRateLimiter } from './rateLimit';
import { holo_ws_rate_limited_total, wsConnectionsGauge } from '../../../holograph/metrics.server';
import * as jwt from 'jsonwebtoken';
import fs from 'fs';
import { Server } from 'http';

const publicKey = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH || './jwt-public.pem');
const featureFlags = yaml.load(fs.readFileSync('./config/feature_flags.yaml', 'utf8')) as { [key: string]: any };

export function createWebSocketGateway(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    if (!featureFlags.holograph_reality_enabled.enabled) {
      ws.close(1008, 'Feature not enabled');
      return;
    }
    wsConnectionsGauge.inc();
    ws.on('close', () => {
      wsConnectionsGauge.dec();
    });
    const token = req.headers['sec-websocket-protocol'];
    if (!token) {
      ws.close(1008, 'Missing token');
      return;
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err: any, payload: any) => {
      if (err) {
        ws.close(1008, 'Invalid token');
        return;
      }

      (ws as any).user = payload;

      ws.on('message', async (message) => {
        try {
          await wsRateLimiter.consume((ws as any).user.id);
          console.log(`Received message from user ${payload.user}: ${message}`);
          // Handle WebSocket messages here
        } catch (error) {
          holo_ws_rate_limited_total.inc();
          ws.send(JSON.stringify({ code: 429, error: 'Rate limit exceeded' }));
          ws.close(4008, 'Rate limit');
        }
      });

      ws.send('Welcome to the Holographic Reality Gateway!');
    });
  });

  return wss;
}