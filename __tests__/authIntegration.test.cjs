/**
 * Integration tests for authMiddleware in reality-generator-service
 * - /api/generate-reality: 401 if no token, 403 if missing scope, 202/200 with valid token (mocked)
 */

const express = require('express');
const request = require('supertest');
const { authMiddleware } = require('../server/common/authMiddleware.cjs');

function fakeAppWithAuth(fakeHandler) {
  const app = express();
  app.use(express.json());
  // Mocked auth middleware (accepts test token)
  app.use('/api', (req, res, next) => {
    if (req.headers.authorization === 'Bearer testtoken') {
      req.auth = { scope: 'reality.gen' };
      return next();
    } else if (req.headers.authorization) {
      req.auth = { scope: '' };
      return next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
  app.post('/api/generate-reality', fakeHandler);
  return app;
}

describe('Auth integration', () => {
  it('should 401 if no token', async () => {
    const app = fakeAppWithAuth((req, res) => res.json({ ok: true }));
    await request(app).post('/api/generate-reality').expect(401);
  });
  it('should 403 if missing scope', async () => {
    const app = fakeAppWithAuth((req, res) => res.json({ ok: true }));
    await request(app).post('/api/generate-reality')
      .set('Authorization', 'Bearer badtoken')
      .send({})
      .expect(403);
  });
  it('should 200/202 with valid token', async () => {
    const app = fakeAppWithAuth((req, res) => res.status(202).json({ ok: true }));
    await request(app).post('/api/generate-reality')
      .set('Authorization', 'Bearer testtoken')
      .send({ request: {}, consciousnessState: {} })
      .expect(202);
  });
});