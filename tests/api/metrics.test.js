import request from 'supertest';
import app from '../../server/api/server.js';

describe('Prometheus metrics endpoint', () => {
  it('GET /metrics with token returns metrics', async () => {
    const login = await request(app).post('/login').send({ user: 'test' });
    const token = login.body.token;
    const res = await request(app)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.text).toContain('process_cpu_user_seconds_total');
    expect(res.text).toContain('realities_created_total');
  });
});