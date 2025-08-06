import { shutdown } from './utils/persistence.cjs';
import { realityWorker } from './utils/queue.cjs';
import S3Snapshotter from './persistence/S3Snapshotter.cjs';

const s3Snapshotter = new S3Snapshotter();
s3Snapshotter.start();

['SIGINT', 'SIGTERM'].forEach(sig =>
  process.on(sig, async () => {
    await s3Snapshotter.stop();
    await shutdown();
    if (realityWorker && realityWorker.close) await realityWorker.close();
    process.exit(0);
  })
);
