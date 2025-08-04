import eventBus from './ConsciousnessEventBus.cjs';
const interval = parseInt(process.env.SYSTEM_TICK_MS || 1000, 10);
const timer = setInterval(() => eventBus.emit('system_tick'), interval);
export function shutdown() {
    clearInterval(timer);
}