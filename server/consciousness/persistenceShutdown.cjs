import { shutdown } from './utils/persistence.cjs';
import { realityWorker } from './utils/queue.cjs';
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, async () => {
  await shutdown();
  if (realityWorker && realityWorker.close) await realityWorker.close();
  process.exit(0);
}));