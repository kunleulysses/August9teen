const { isReady } = require('../FlappyJournal/server/reality-generator-service.cjs');
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    $queryRaw: jest.fn().mockResolvedValue(1),
    $disconnect: jest.fn()
  }))
}));

describe('Readiness', () => {
  it('should return ready:true when all pass', async () => {
    global.nats = { info: true, isClosed: () => false };
    const status = await isReady();
    expect(status.ready).toBe(true);
  });
  it('should fail if heap > 85%', async () => {
    const orig = process.memoryUsage;
    process.memoryUsage = () => ({ heapUsed: 9, heapTotal: 10 });
    global.nats = { info: true, isClosed: () => false };
    const status = await isReady();
    expect(status.ready).toBe(false);
    expect(status.failures).toContain('heap');
    process.memoryUsage = orig;
  });
  it('should fail if nats not connected', async () => {
    global.nats = null;
    const status = await isReady();
    expect(status.ready).toBe(false);
    expect(status.failures).toContain('nats');
  });
});