import { redlock } from './redlockClient.cjs';
export async function withGeneratorLock(fn, { retryDelay = 1000, maxRetries = 5 } = {}) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const lock = await redlock.acquire(["generator_lock"], 30000);
      try {
        return await fn();
      } finally {
        await lock.release().catch(()=>{});
      }
    } catch (err) {
      if (err.name === 'LockError') {
        await new Promise(r => setTimeout(r, retryDelay * (attempt + 1)));
        attempt++;
      } else {
        throw err;
      }
    }
  }
  throw new Error('LOCK_UNAVAILABLE');
}