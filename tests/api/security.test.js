import request from 'supertest';
import app from '../../server/api/server.js';

describe('Security rate limits', () => {
  it('should 429 after 11 login attempts', async () => {
    let lastStatus = 200;
    for (let i = 0; i < 12; ++i) {
      const res = await request(app).post('/login').send({ user: 'user' + i });
      lastStatus = res.status;
      if (res.status === 429) break;
    }
    expect(lastStatus).toBe(429);
  });
});