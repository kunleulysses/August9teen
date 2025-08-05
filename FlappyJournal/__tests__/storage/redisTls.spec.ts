const { RedisSpiralAdapter } = require('../../server/consciousness/core/storage/RedisSpiralAdapter.cjs');

describe('Redis TLS', () => {
  it('should connect to Redis with TLS', async () => {
    const adapter = new RedisSpiralAdapter('rediss://localhost:6379');
    await adapter.init();
    const pong = await adapter.redis.ping();
    expect(pong).toBe('PONG');
  });
});