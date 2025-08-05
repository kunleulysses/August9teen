import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { attachHeartbeat } from '../../server/ws/heartbeat.cjs';
import { attachIdle } from '../../server/ws/idle.cjs';

describe('WebSocket Timeouts', () => {
  let server: ReturnType<typeof createServer>;
  let wss: WebSocketServer;

  beforeEach((done) => {
    server = createServer();
    wss = new WebSocketServer({ server });
    server.listen(0, done);
  });

  afterEach(() => {
    wss.close();
    server.close();
  });

  it('should close the connection after 2 missed pongs', (done) => {
    wss.on('connection', (ws) => {
      attachHeartbeat(ws, { interval: 100, maxMissed: 2 });
    });

    const address = server.address() as AddressInfo;
    const ws = new WebSocket(`ws://localhost:${address.port}`);
    ws.on('close', (code) => {
      expect(code).toBe(4001);
      done();
    });
  }, 300);

  it('should close the connection after 5 minutes of inactivity', (done) => {
    wss.on('connection', (ws) => {
      attachIdle(ws, 100);
    });

    const address = server.address() as AddressInfo;
    const ws = new WebSocket(`ws://localhost:${address.port}`);
    ws.on('close', (code) => {
      expect(code).toBe(4000);
      done();
    });
  }, 200);
});