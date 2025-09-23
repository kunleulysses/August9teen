jest.mock('ioredis', () => {
  class FakeRedis {
    constructor() {
      this.handlers = { pmessage: [] };
      this.patterns = new Set();
    }
    publish(channel, msg) {
      // trigger all matching patterns
      for (const pattern of this.patterns) {
        // naive glob: only supports prefix*
        const prefix = pattern.endsWith('*') ? pattern.slice(0, -1) : pattern;
        if (channel.startsWith(prefix)) {
          this.handlers.pmessage.forEach(h => h(pattern, channel, msg));
        }
      }
      return Promise.resolve(1);
    }
    psubscribe(pattern, cb) {
      this.patterns.add(pattern);
      if (cb) cb();
    }
    on(event, handler) {
      if (event === 'pmessage') this.handlers.pmessage.push(handler);
    }
    quit() { return Promise.resolve(); }
  }
  return FakeRedis;
});

describe('redisBus', () => {
  test('psubscribe receives published message', async () => {
    const bus = require('../../realtime/redisBus.cjs');
    const received = [];
    bus.psubscribe('zone:*', (channel, msg) => received.push({ channel, msg }));
    await bus.publish('zone:forest-01', { hello: 'world' });
    expect(received.length).toBe(1);
    expect(received[0].channel).toBe('zone:forest-01');
    expect(received[0].msg).toEqual({ hello: 'world' });
  });
});

