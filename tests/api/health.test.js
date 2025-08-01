import request from 'supertest';
import app from '../../server/api/server.js';

describe('GET /health', () => {
  it('should return 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.backend).toBeDefined();
  });
});