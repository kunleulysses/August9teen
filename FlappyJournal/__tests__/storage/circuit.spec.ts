import { SpiralStorageAdapter } from '../../server/consciousness/core/storage/SpiralStorageAdapter.cjs';
import { withCircuitBreaker } from '../../server/utils/circuitBreaker.cjs';

describe('Circuit Breaker', () => {
  let adapter: SpiralStorageAdapter;

  beforeEach(() => {
    adapter = new SpiralStorageAdapter();
  });

  it('should open the circuit after 5 failures', async () => {
    adapter.get = () => Promise.reject(new Error('test error'));
    adapter.get = withCircuitBreaker(adapter.get, { failureThreshold: 5, resetTimeout: 1000 });

    for (let i = 0; i < 5; i++) {
      await expect(adapter.get('test')).rejects.toThrow('test error');
    }

    await expect(adapter.get('test')).rejects.toThrow('CircuitBreaker open');
  });

  it('should close the circuit after a successful call', async () => {
    let fail = true;
    adapter.get = () => {
      if (fail) {
        return Promise.reject(new Error('test error'));
      } else {
        return Promise.resolve('test value');
      }
    };
    adapter.get = withCircuitBreaker(adapter.get, { failureThreshold: 1, resetTimeout: 100 });

    await expect(adapter.get('test')).rejects.toThrow('test error');
    await expect(adapter.get('test')).rejects.toThrow('CircuitBreaker open');

    await new Promise(resolve => setTimeout(resolve, 100));

    fail = false;
    await expect(adapter.get('test')).resolves.toBe('test value');
    await expect(adapter.get('test')).resolves.toBe('test value');
  });
});