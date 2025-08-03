import config from './config.cjs';
import logger from './logger.cjs';
import { InMemoryStore } from '../consciousness/persistence/InMemoryStore.cjs';
import { PostgresStore } from '../consciousness/persistence/PostgresStore.cjs';

let singleton = null;

function getStore() {
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
const storeFactory = getStore;

// Graceful close
async function closeStore() {
  if (singleton && typeof singleton.close === 'function') {
    await singleton.close();
  }
}

module.exports = { getStore, storeFactory, closeStore };