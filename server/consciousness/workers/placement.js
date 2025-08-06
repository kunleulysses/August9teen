import eventBus from '../ConsciousnessEventBus.cjs';

function calculateSpiralScore(memory) {
  const content = typeof memory.content === 'string' ? memory.content : '';
  const depth = typeof memory.depth === 'number' ? memory.depth : 0;
  const lengthScore = Math.min(1, content.length / 1000);
  const depthScore = Math.min(1, depth / 10);
  return Number((0.7 * lengthScore + 0.3 * depthScore).toFixed(3));
}

eventBus.on('memory.store', (payload = {}) => {
  const score = calculateSpiralScore(payload);
  eventBus.emit('memory.stored', {
    ...payload,
    score,
    timestamp: Date.now(),
  });
});

export { calculateSpiralScore };
