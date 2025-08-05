import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

export let options = {
  stages: [
    { duration: '10s', target: 150 }, // Ramp up to 150 users
    { duration: '20s', target: 150 }, // Stay at 150 users for 20 seconds
    { duration: '10s', target: 0 },   // Ramp down
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'], // < 1% errors
    'http_req_duration': ['p(95)<500'], // 95% of requests under 500ms
  },
};

const BASE_URL = 'http://localhost:3001';
const JWT_TOKEN = __ENV.TEST_JWT;

export default function () {
  const params = {
    headers: {
      'Authorization': `Bearer ${JWT_TOKEN}`,
    },
  };

  const res = http.post(`${BASE_URL}/api/v1/memory`, JSON.stringify({ content: 'test' }), params);

  check(res, {
    'status is 200 or 429': (r) => r.status === 200 || r.status === 429,
  }) || errorRate.add(1);

  sleep(1);
}