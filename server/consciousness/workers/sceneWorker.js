import eventBus from '../ConsciousnessEventBus.cjs';
import { PostgresStore } from '../persistence/PostgresStore.cjs';

const store = new PostgresStore();

// Listen for reality generation requests
// payload: { id, realityRequest, consciousnessState }
eventBus.on('reality.gen.request', async (payload = {}) => {
  const {
    id = Date.now().toString(),
    realityRequest = {},
    consciousnessState = {},
  } = payload;

  try {
    const { default: holographicConsciousnessRealityGenerator } = await import('../instance.cjs');

    const scene = await holographicConsciousnessRealityGenerator.generateHolographicConsciousnessReality(
      realityRequest,
      consciousnessState
    );

    await store.set(`scene:${id}`, scene);

    eventBus.emit('reality.gen.result', { id, scene });
  } catch (error) {
    eventBus.emit('reality.gen.result', { id, error: error.message });
  }
});

export {};
