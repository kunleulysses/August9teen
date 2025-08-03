import request from 'supertest';
import app from '../../server/api/server.cjs';

describe('Rate limiting', () => {
  it('should return 429 after exceeding the rate limit', async () => {
    let lastStatus = 200;
    let hit429 = false;
    for (let i = 0; i < 105; ++i) {
      const res = await request(app).get('/health');
      lastStatus = res.status;
      if (res.status === 429) {
        hit429 = true;
        break;
      }
    }
    expect(hit429).toBe(true);
  });
});