import { PostgresStore } from '../../server/consciousness/persistence/PostgresStore.js';

const DATABASE_URL = process.env.DATABASE_URL;

(DATABASE_URL ? describe : describe.skip)('PostgresStore', () => {
  let store;
  beforeAll(() => {
    store = new PostgresStore();
  });

  it('should set and get a value', async () => {
    await store.set('foo', { bar: 42 });
    const val = await store.get('foo');
    expect(val).toEqual({ bar: 42 });
  });

  it('should return undefined for missing key', async () => {
    const val = await store.get('missing');
    expect(val).toBeUndefined();
  });

  it('should delete a value', async () => {
    await store.set('x', { y: 1 });
    await store.delete('x');
    const val = await store.get('x');
    expect(val).toBeUndefined();
  });

  it('should has() work', async () => {
    await store.set('a', 1);
    expect(await store.has('a')).toBe(true);
    expect(await store.has('notfound')).toBe(false);
  });

  it('should all() return all values', async () => {
    await store.set('k1', 1);
    await store.set('k2', 2);
    const all = await store.all();
    expect(all).toContain(1);
    expect(all).toContain(2);
  });
});