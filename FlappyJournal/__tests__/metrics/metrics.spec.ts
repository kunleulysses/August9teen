import { ConsciousnessEventBus } from '../../server/consciousness/core/ConsciousnessEventBus.cjs';
import { broadcast } from '../../server/websocket-server.cjs';
import { register } from '../../server/consciousness/core/secure-metrics-server.ts';

describe('Metrics', () => {
  it('should increment the eventbus_backlog gauge', async () => {
    const eventBus = new ConsciousnessEventBus();
    eventBus.emit('test');
    const metrics = await register.getMetricsAsJSON();
    const backlog = metrics.find(m => m.name === 'eventbus_backlog');
    expect(backlog.values[0].value).toBe(1);
  });

  it('should increment the ws_messages_out_total counter', async () => {
    broadcast({ test: 'test' });
    const metrics = await register.getMetricsAsJSON();
    const counter = metrics.find(m => m.name === 'ws_messages_out_total');
    expect(counter.values[0].value).toBe(1);
  });
});