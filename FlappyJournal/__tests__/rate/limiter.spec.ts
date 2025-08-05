import { consume } from '../../server/rate/spiralLimiter.cjs';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Reset the limiter before each test
    jest.resetModules();
  });

  it('should allow requests under the rate limit', async () => {
    for (let i = 0; i < 100; i++) {
      await expect(consume('test-user')).resolves.toBeUndefined();
    }
  });

  it('should reject requests over the rate limit', async () => {
    for (let i = 0; i < 100; i++) {
      await consume('test-user');
    }
    await expect(consume('test-user')).rejects.toThrow();
  });

  it('should reset the rate limit after the duration', async () => {
    for (let i = 0; i < 100; i++) {
      await consume('test-user');
    }
    await expect(consume('test-user')).rejects.toThrow();

    // Wait for the duration to pass
    await new Promise(resolve => setTimeout(resolve, 10000));

    await expect(consume('test-user')).resolves.toBeUndefined();
  });
});