import bus from './core/ConsciousnessEventBus.js';

export function startHeartbeat(moduleName) {
  setInterval(() => {
    bus.emitHeartbeat(moduleName);
  }, 60_000);
  console.log(`[Heartbeat] Started for ${moduleName}`);
}