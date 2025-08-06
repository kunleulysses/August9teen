const Redis = require('ioredis-mock');
const RedisSpiralAdapter = require('../../server/consciousness/core/storage/RedisSpiralAdapter.cjs');

jest.mock('ioredis', () => require('ioredis-mock'));

describe('RedisSpiralAdapter', () => {
    let adapter;
    let redis;

    beforeEach(async () => {
        redis = new Redis();
        adapter = new RedisSpiralAdapter();
        adapter.redis = redis; // Inject mock
    });

    afterEach(() => {
        redis.flushall();
    });

    it('should initialize correctly', async () => {
        const localAdapter = new RedisSpiralAdapter('redis://localhost:6379');
        localAdapter.redis = new Redis();
        await localAdapter.init();
        expect(localAdapter.redis.status).toBe('ready');
    });

    it('should set and get a value', async () => {
        const key = 'test_key';
        const value = { a: 1, b: 'hello' };
        await adapter.set(key, value);
        const result = await adapter.get(key);
        expect(result).toEqual(value);
    });

    it('should delete a value', async () => {
        const key = 'test_key';
        const value = { a: 1 };
        await adapter.set(key, value);
        await adapter.del(key);
        const result = await adapter.get(key);
        expect(result).toBeUndefined();
    });

    it('should list keys with a prefix', async () => {
        await adapter.set('prefix:key1', { a: 1 });
        await adapter.set('prefix:key2', { b: 2 });
        await adapter.set('other:key3', { c: 3 });
        const keys = await adapter.keys('prefix:');
        expect(keys).toHaveLength(2);
        expect(keys).toContain('prefix:key1');
        expect(keys).toContain('prefix:key2');
    });

    it('should handle atomic increments', async () => {
        const key = 'counter';
        const result1 = await adapter.atomicIncr(key);
        expect(result1).toBe(1);
        const result2 = await adapter.atomicIncr(key, 5);
        expect(result2).toBe(6);
    });

    it('should handle roundtrip serialization and compression', async () => {
        const key = 'complex_key';
        const value = {
            str: 'hello world',
            num: 123.456,
            bool: true,
            arr: [1, 'two', { three: 3 }],
            nested: {
                a: { b: { c: 'deep' } }
            }
        };
        await adapter.set(key, value);
        const result = await adapter.get(key);
        expect(result).toEqual(value);
    });

    it('should return undefined for non-existent keys', async () => {
        const result = await adapter.get('non_existent_key');
        expect(result).toBeUndefined();
    });
});