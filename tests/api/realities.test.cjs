import request from 'supertest';
import app from '../../server/api/server.cjs';

describe('Realities API', () => {
  let createdId;
  const testReality = { id: 'test-real', data: { foo: 'bar' } };

  it('POST /realities creates an encoded reality', async () => {
    const res = await request(app).post('/realities').send(testReality);
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    createdId = res.body.id;
  });

  it('POST /realities 400 on missing id', async () => {
    const res = await request(app).post('/realities').send({ data: { foo: 'bar' } });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'validation');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  it('GET /realities/:id returns encoded reality', async () => {
    const res = await request(app).get(`/realities/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', createdId);
    expect(res.body).toHaveProperty('originalRealityId', testReality.id);
  });

  it('GET /realities/:id 404 for missing', async () => {
    const res = await request(app).get('/realities/nope-not-real');
    expect(res.status).toBe(404);
  });
});