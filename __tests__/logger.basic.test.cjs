const { logger, child } = require('../server/consciousness/utils/logger.cjs');

describe('Logger basic', () => {
  test('child logger logs without error', () => {
    const log = child({ traceId: 'test-trace' });
    expect(() => log.info('child logger works')).not.toThrow();
  });
});