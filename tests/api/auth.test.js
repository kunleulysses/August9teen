import request from 'supertest';
import app from '../../server/api/server.js';

describe('Auth API', () => {
  it('POST /realities without token returns 401', async () => {
    const res = await request(app).post('/realities').send({ id: 'foo' });
    expect(res.status).toBe(401);
  });

  it('POST /login returns RS256 token; token works for POST /realities', async () => {
    const login = await request(app).post('/login').send({ user: 'test' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    // RS256 JWT tokens have 3 parts
    const token = login.body.token;
    expect(token.split('.').length).toBe(3);

    const res = await request(app)
      .post('/realities')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 'bar' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });
});