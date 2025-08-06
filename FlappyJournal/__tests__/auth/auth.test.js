import { WebSocket } from 'ws';
import { createServer } from 'http';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { execSync } from 'child_process';

// Test configuration
const TEST_PORT = 3003; // Different port for testing
const TEST_WS_PORT = 3004; // Different WebSocket port for testing
const JWT_SECRET = 'test-secret';
const TEST_USER = { sub: 'test-user', roles: ['user'] };

// Generate a test JWT
function generateTestJWT(payload = TEST_USER, secret = JWT_SECRET) {
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

describe('Authentication and Rate Limiting', () => {
  let httpServer;
  let wsServer;
  let testToken;

  beforeAll(async () => {
    // Set test environment variables
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.ALLOW_ANONYMOUS_WS = 'false';
    process.env.WS_RATE_LIMIT = '5'; // 5 requests per window
    process.env.WS_RATE_WINDOW = '10'; // 10 second window
    
    // Import the servers after setting env vars
    const metricsApp = (await import('../../server/consciousness/core/secure-metrics-server')).default;
    const wsApp = await import('../../server/websocket-server.cjs');

    // Start test servers
    httpServer = metricsApp.listen(TEST_PORT);
    wsServer = wsApp.listen(TEST_WS_PORT);
    
    // Generate test token
    testToken = generateTestJWT();
  });

  afterAll((done) => {
    // Close servers
    httpServer.close(() => {
      wsServer.close(done);
    });
  });

  describe('JWT Authentication', () => {
    test('should reject unauthenticated requests to /metrics', async () => {
      const response = await request(httpServer).get('/metrics');
      expect(response.status).toBe(401);
    });

    test('should accept authenticated requests to /metrics with valid JWT', async () => {
      const response = await request(httpServer)
        .get('/metrics')
        .set('Authorization', `Bearer ${testToken}`);
      expect(response.status).toBe(200);
    });

    test('should reject WebSocket connections without authentication with close code 4403', (done) => {
      const ws = new WebSocket(`ws://localhost:${TEST_WS_PORT}`);
      
      ws.on('close', (code) => {
        expect(code).toBe(4403);
        done();
      });
    });

    test('should accept WebSocket connections with valid JWT', (done) => {
      const ws = new WebSocket(`ws://localhost:${TEST_WS_PORT}`, {
        headers: { 'Authorization': `Bearer ${testToken}` }
      });
      
      ws.on('open', () => {
        ws.close();
        done();
      });
      
      ws.on('error', (error) => {
        done.fail(`WebSocket connection failed: ${error.message}`);
      });
    });
  });

  describe('Rate Limiting', () => {
    test('should close WebSocket connection with code 4408 when rate limit is exceeded', (done) => {
      const ws = new WebSocket(`ws://localhost:${TEST_WS_PORT}`, {
        headers: { 'Authorization': `Bearer ${testToken}` }
      });

      ws.on('open', () => {
        // Send 6 messages to exceed the rate limit of 5
        for (let i = 0; i < 6; i++) {
          ws.send(`test message ${i}`);
        }
      });

      ws.on('close', (code) => {
        expect(code).toBe(4408);
        done();
      });
    });
  });

  describe('Anonymous Access', () => {
    beforeAll(() => {
      // Enable anonymous access for these tests
      process.env.ALLOW_ANONYMOUS_WS = 'true';
    });

    afterAll(() => {
      // Reset to default
      process.env.ALLOW_ANONYMOUS_WS = 'false';
    });

    test('should allow unauthenticated requests when ALLOW_ANONYMOUS_WS is true', async () => {
      const response = await request(httpServer).get('/metrics');
      expect(response.status).toBe(200);
    });

    test('should allow WebSocket connections without authentication when ALLOW_ANONYMOUS_WS is true', (done) => {
      const ws = new WebSocket(`ws://localhost:${TEST_WS_PORT}`);
      
      ws.on('open', () => {
        ws.close();
        done();
      });
      
      ws.on('error', (error) => {
        done.fail(`WebSocket connection failed: ${error.message}`);
      });
    });
  });

  describe('Metrics Collection', () => {
    test('should increment rate limit exceeded counter when rate limit is hit', async () => {
      const testToken = generateTestJWT({ ...TEST_USER, sub: `test-rate-limit-${Date.now()}` });
      
      // Make 5 requests (rate limit)
      const requests = Array(5).fill().map(() =>
        request(httpServer)
          .get('/metrics')
          .set('Authorization', `Bearer ${testToken}`)
      );
      await Promise.all(requests);

      // 6th request should be rate limited
      await request(httpServer)
        .get('/metrics')
        .set('Authorization', `Bearer ${testToken}`);

      // Check metrics
      const metricsResponse = await request(httpServer)
        .get('/metrics')
        .set('Authorization', `Bearer ${testToken}`);
      const metrics = metricsResponse.text;
      
      // Check if rate limit exceeded counter was incremented
      expect(metrics).toMatch(/spiral_ws_rate_limit_exceeded_total{endpoint="consciousness-ws"} 1/);
    });
  });
});

// Helper function to fetch metrics
async function fetchMetrics() {
  const response = await request(httpServer).get('/metrics');
  return response.text;
}
