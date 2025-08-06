const LRU = require('lru-cache');

describe('LRU purgeStale', () => {
  it('should purge expired items', async () => {
    const cache = new LRU({ max: 10, ttl: 10 });
    cache.set('foo', 'bar');
    expect(cache.size).toBe(1);
    await new Promise(r => setTimeout(r, 20));
    cache.purgeStale();
    expect(cache.size).toBe(0);
  });
});