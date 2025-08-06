declare module './LevelDBSigilAdapter.cjs' {
  export class LevelDBSigilAdapter {
    constructor(dbPath?: string);
    setSigilRecord(symbol: string, authHash: string, record: any): Promise<void>;
    getSigilRecord(symbol: string, authHash: string): Promise<any | undefined>;
    allSigilRecords(): Promise<any[]>;
    close(): Promise<void>;
  }
}