import { InMemoryStore } from '../../server/consciousness/persistence/InMemoryStore.js';
import fs from 'fs';

describe('store-migrator CLI', () => {
  const dumpFile = 'test-dump.json';
  afterEach(() => { if (fs.existsSync(dumpFile)) fs.unlinkSync(dumpFile); });

  it('exports and imports objects', async () => {
    // Fill first store
    const s1 = new InMemoryStore();
    await s1.set('a', { id: 'a', foo: 1 });
    await s1.set('b', { id: 'b', bar: 2 });

    // Simulate export
    const all = await s1.all();
    fs.writeFileSync(dumpFile, JSON.stringify(all, null, 2));

    // Import into new store
    const s2 = new InMemoryStore();
    const arr = JSON.parse(fs.readFileSync(dumpFile, 'utf8'));
    for (const obj of arr) await s2.set(obj.id, obj);

    // Compare counts and values
    const arr2 = await s2.all();
    expect(arr2.length).toBe(2);
    expect(arr2.find(o => o.id === 'a').foo).toBe(1);
    expect(arr2.find(o => o.id === 'b').bar).toBe(2);
  });
});