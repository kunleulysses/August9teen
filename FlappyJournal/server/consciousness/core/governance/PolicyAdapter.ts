import eventBus from '../ConsciousnessEventBus.js';
import SpiralMemoryArchitecture from '../SpiralMemoryArchitecture';
import logger from '../utils/logger';

function parsePolicy(option: string) {
  // E.g. "gc_budget=60" or "max_active=200"
  if (/gc_budget=(\d+)/.test(option)) return { type: 'gc_budget', value: Number(RegExp.$1) };
  if (/max_active=(\d+)/.test(option)) return { type: 'max_active', value: Number(RegExp.$1) };
  return null;
}

// Automatically update policies at runtime based on voted proposals
export function installPolicyAdapter(arch: SpiralMemoryArchitecture) {
  eventBus.on('governance:proposal_closed', ({ id, winningOption }) => {
    const policy = parsePolicy(winningOption);
    if (policy) {
      if (policy.type === 'gc_budget') {
        arch.memoryConfig.garbageCollectionInterval = policy.value * 1000;
        logger.info({ id, policy }, 'GC budget updated by governance');
      }
      if (policy.type === 'max_active') {
        arch.memoryConfig.maxActiveMemories = policy.value;
        logger.info({ id, policy }, 'Max active memories updated by governance');
      }
    }
  });
}