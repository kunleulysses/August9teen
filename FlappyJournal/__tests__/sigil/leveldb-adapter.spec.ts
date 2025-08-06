import { LevelDBSigilAdapter } from '../../server/consciousness/persistence/LevelDBSigilAdapter.cjs';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs-extra';

describe('LevelDBSigilAdapter', () => {
  let dbPath: string;
  let adapter: any;

  beforeEach(async () => {
    dbPath = path.join(os.tmpdir(), `sigil-db-test-${Date.now()}`);
    adapter = new LevelDBSigilAdapter(dbPath);
  });

  afterEach(async () => {
    await adapter.close();
    await fs.remove(dbPath);
  });

  it('should set and get a sigil record', async () => {
    const symbol = 'test-symbol';
    const authHash = 'test-auth-hash';
    const record = { data: 'test-data' };

    await adapter.setSigilRecord(symbol, authHash, record);
    const retrieved = await adapter.getSigilRecord(symbol, authHash);

    expect(retrieved).toEqual(record);
  });

  it('should return undefined for a non-existent record', async () => {
    const retrieved = await adapter.getSigilRecord('non-existent', 'non-existent');
    expect(retrieved).toBeUndefined();
  });

  it('should retrieve all sigil records', async () => {
    const record1 = { sigil: { symbol: 'symbol1' }, authHash: 'hash1', data: 'data1' };
    const record2 = { sigil: { symbol: 'symbol2' }, authHash: 'hash2', data: 'data2' };

    await adapter.setSigilRecord(record1.sigil.symbol, record1.authHash, record1);
    await adapter.setSigilRecord(record2.sigil.symbol, record2.authHash, record2);

    const allRecords = await adapter.allSigilRecords();
    expect(allRecords).toHaveLength(2);
    expect(allRecords).toContainEqual(record1);
    expect(allRecords).toContainEqual(record2);
  });

  it('should handle concurrent writes', async () => {
    const promises = [];
    for (let i = 0; i < 100; i++) {
      promises.push(adapter.setSigilRecord(`symbol${i}`, `hash${i}`, { data: `data${i}` }));
    }
    await Promise.all(promises);

    const allRecords = await adapter.allSigilRecords();
    expect(allRecords).toHaveLength(100);
  });
});