import logger from '../../server/common/logger.cjs';

describe('logger', () => {
  it('should have info and debug methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('should not throw on info/debug', () => {
    expect(() => logger.info('test info')).not.toThrow();
    expect(() => logger.debug('test debug')).not.toThrow();
  });
});