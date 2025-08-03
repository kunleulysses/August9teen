import eventBus from '../core/ConsciousnessEventBus.cjs';
import { realityQueue } from '../utils/queue.cjs';

eventBus.on('generate_reality_request', async payload => {
  await realityQueue.add('gen', payload);
});