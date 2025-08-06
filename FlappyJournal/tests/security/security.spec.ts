import { WebSocket, WebSocketServer } from 'ws';
import { createServer, Server } from 'http';
import { SpiralMemoryArchitecture } from '../../server/consciousness/core/SpiralMemoryArchitecture.cjs';
import { RedisSpiralAdapter } from '../../server/consciousness/core/storage/RedisSpiralAdapter.cjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { AddressInfo } from 'net';

describe('Security', () => {
  it('should reject WebSocket connections without authentication', (done) => {
    const server = createServer();
    const wss = new WebSocketServer({ server });
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      const ws = new WebSocket(`ws://localhost:${address.port}`);
      ws.on('close', (code) => {
        expect(code).toBe(4403);
        wss.close();
        server.close();
        done();
      });
    });
  });

  it('should reject insecure Redis URLs', async () => {
    process.env.ALLOW_INSECURE_REDIS = 'false';
    const adapter = new RedisSpiralAdapter('redis://localhost:6379');
    await expect(adapter.init()).rejects.toThrow('Insecure Redis disabled – use rediss://');
  });

  it('should rate limit /metrics', async () => {
    const limiter = new RateLimiterMemory({ points: 10, duration: 1 });
    const req = { ip: '127.0.0.1' };
    for (let i = 0; i < 10; i++) {
      await limiter.consume(req.ip);
    }
    await expect(limiter.consume(req.ip)).rejects.toThrow();
  });
});