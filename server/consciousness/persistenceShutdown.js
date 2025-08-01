import { shutdown } from './utils/persistence.js';
import { realityWorker } from './utils/queue.js';
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, async () => {
  await shutdown();
  if (realityWorker && realityWorker.close) await realityWorker.close();
  process.exit(0);
}));