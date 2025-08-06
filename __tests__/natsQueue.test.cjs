/**
 * Minimal NATS queue test (mock).
 */
const events = require('events');
const { v4: uuidv4 } = require('uuid');

describe('NATS Queue Wiring', () => {
  it('should publish jobId and handle result', async (done) => {
    // Mock NATS
    class MockNats extends events.EventEmitter {
      publish(subj, data) {
        setTimeout(() => {
          // Echo back as result
          if (subj === 'reality.gen.request') {
            const req = JSON.parse(data.toString());
            this.emit('msg', 'reality.gen.result', Buffer.from(JSON.stringify({
              jobId: req.jobId,
              success: true,
              sceneId: uuidv4(),
              result: { ok: true },
              ts: Date.now()
            })));
          }
        }, 10);
      }
      subscribe(subj) {
        // Return async iterator for .on('msg')
        const self = this;
        return {
          async *[Symbol.asyncIterator]() {
            self.on('msg', (topic, data) => {
              if (topic === subj) {
                this.next?.({ data });
              }
            });
            // Wait for test to finish
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        };
      }
    }
    // Create "service"
    const nats = new MockNats();
    const pending = new Map();
    // Fake HTTP
    const jobId = uuidv4();
    nats.publish('reality.gen.request', Buffer.from(JSON.stringify({ jobId })));
    pending.set(jobId, (result) => {
      expect(result.jobId).toBe(jobId);
      expect(result.success).toBe(true);
      done();
    });
    // Subscribe to result
    (async () => {
      for await (const m of nats.subscribe('reality.gen.result')) {
        const result = JSON.parse(m.data.toString());
        if (pending.has(result.jobId)) {
          pending.get(result.jobId)(result);
          pending.delete(result.jobId);
        }
      }
    })();
  });
});