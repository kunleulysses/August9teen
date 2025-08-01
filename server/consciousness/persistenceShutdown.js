import { shutdown } from './utils/persistence.js';
['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, async () => { await shutdown(); process.exit(0); }));