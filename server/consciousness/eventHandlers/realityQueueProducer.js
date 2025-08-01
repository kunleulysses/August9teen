import eventBus from '../core/ConsciousnessEventBus.js';
import { realityQueue } from '../utils/queue.js';

eventBus.on('generate_reality_request', async payload => {
  await realityQueue.add('gen', payload);
});