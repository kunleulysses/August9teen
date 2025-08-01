import config from './config.js';
import logger from './logger.js';
import { InMemoryStore } from '../consciousness/persistence/InMemoryStore.js';
import { PostgresStore } from '../consciousness/persistence/PostgresStore.js';

let singleton = null;

export function getStore() {
  if (singleton) return singleton;
  if (config.STORE_BACKEND === 'postgres') {
    if (config.DATABASE_URL) {
      singleton = new PostgresStore();
      logger.info('Using PostgresStore for persistence');
      return singleton;
    } else {
      logger.warn('STORE_BACKEND=postgres but DATABASE_URL missing; falling back to InMemoryStore');
    }
  }
  singleton = new InMemoryStore();
  logger.info('Using InMemoryStore for persistence');
  return singleton;
}

// Alias for backward compatibility
export const storeFactory = getStore;

// Graceful close
export async function closeStore() {
  if (singleton && typeof singleton.close === 'function') {
    await singleton.close();
  }
}