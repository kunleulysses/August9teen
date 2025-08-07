import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const encodeTrend = new Trend('encode_duration');
const verifyTrend = new Trend('verify_duration');

export let options = {
  vus: parseInt(__ENV.SOAK_VUS) || 50,
  duration: __ENV.SOAK_DURATION || '4h',
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests under 1.5s
    http_req_failed: ['rate<0.01'],    // Error rate under 1%
    errors: ['rate<0.01'],             // Custom error rate under 1%
    encode_duration: ['p(95)<1000'],   // 95% of encodes under 1s
    verify_duration: ['p(95)<500']     // 95% of verifies under 500ms
  },
  ext: {
    loadimpact: {
      distribution: {
        'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 }
      }
    }
  }
};

const BASE_URL = __ENV.SIGIL_API_URL || 'http://localhost:3000';
const JWT_TOKEN = __ENV.SIGIL_TOKEN;

if (!JWT_TOKEN) {
  throw new Error('SIGIL_TOKEN environment variable is required');
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${JWT_TOKEN}`
};

// Test scenarios
const scenarios = [
  'encode_heavy',
  'verify_heavy', 
  'mixed_operations',
  'error_injection'
];

export default function () {
  const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  switch (scenario) {
    case 'encode_heavy':
      testEncode();
      break;
    case 'verify_heavy':
      testVerify();
      break;
    case 'mixed_operations':
      testMixedOperations();
      break;
    case 'error_injection':
      testErrorHandling();
      break;
  }
  
  // Random sleep between 0.1-0.5 seconds
  sleep(0.1 + Math.random() * 0.4);
}

function testEncode() {
  const payload = {
    data: {
      content: `Soak test content ${Math.random()}`,
      timestamp: Date.now(),
      iteration: __ITER,
      vu: __VU
    },
    metadata: {
      test: 'soak',
      scenario: 'encode_heavy'
    }
  };
  
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/api/consciousness/sigils`, JSON.stringify(payload), { headers });
  const duration = Date.now() - startTime;
  
  const success = check(response, {
    'encode status is 200': (r) => r.status === 200,
    'encode response has sigil': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && (body.sigil || body.id);
      } catch (e) {
        return false;
      }
    },
    'encode response time < 2s': (r) => r.timings.duration < 2000
  });
  
  encodeTrend.add(duration);
  errorRate.add(!success);
}

function testVerify() {
  // First create a sigil to verify
  const createPayload = {
    data: { content: `Verify test ${Math.random()}` }
  };
  
  const createResponse = http.post(`${BASE_URL}/api/consciousness/sigils`, JSON.stringify(createPayload), { headers });
  
  if (createResponse.status === 200) {
    // Now test verification by fetching
    const startTime = Date.now();
    const verifyResponse = http.get(`${BASE_URL}/api/consciousness/sigils`, { headers });
    const duration = Date.now() - startTime;
    
    const success = check(verifyResponse, {
      'verify status is 200': (r) => r.status === 200,
      'verify response has data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body) || (body && body.sigils);
        } catch (e) {
          return false;
        }
      },
      'verify response time < 1s': (r) => r.timings.duration < 1000
    });
    
    verifyTrend.add(duration);
    errorRate.add(!success);
  }
}

function testMixedOperations() {
  // Randomly choose between encode and verify
  if (Math.random() < 0.7) {
    testEncode();
  } else {
    testVerify();
  }
}

function testErrorHandling() {
  // Test with invalid data to ensure proper error handling
  const invalidPayload = {
    invalid: 'data',
    missing: 'required_fields'
  };
  
  const response = http.post(`${BASE_URL}/api/consciousness/sigils`, JSON.stringify(invalidPayload), { headers });
  
  const success = check(response, {
    'error handling returns proper status': (r) => r.status >= 400 && r.status < 500,
    'error response has error message': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body && body.error;
      } catch (e) {
        return false;
      }
    }
  });
  
  // Don't count expected errors as failures
  if (response.status < 400 || response.status >= 500) {
    errorRate.add(true);
  }
}

export function handleSummary(data) {
  const summary = {
    timestamp: new Date().toISOString(),
    test_duration: options.duration,
    virtual_users: options.vus,
    total_requests: data.metrics.http_reqs.values.count,
    error_rate: data.metrics.http_req_failed.values.rate,
    avg_response_time: data.metrics.http_req_duration.values.avg,
    p95_response_time: data.metrics.http_req_duration.values['p(95)'],
    p99_response_time: data.metrics.http_req_duration.values['p(99)'],
    custom_metrics: {
      encode_p95: data.metrics.encode_duration?.values['p(95)'] || 0,
      verify_p95: data.metrics.verify_duration?.values['p(95)'] || 0,
      custom_error_rate: data.metrics.errors?.values.rate || 0
    },
    thresholds_passed: Object.keys(data.thresholds).every(key => data.thresholds[key].ok)
  };
  
  return {
    'soak-test-summary.json': JSON.stringify(summary, null, 2),
    stdout: `
🚀 Soak Test Summary
==================
Duration: ${options.duration}
VUs: ${options.vus}
Total Requests: ${summary.total_requests}
Error Rate: ${(summary.error_rate * 100).toFixed(2)}%
Avg Response Time: ${summary.avg_response_time.toFixed(2)}ms
P95 Response Time: ${summary.p95_response_time.toFixed(2)}ms
P99 Response Time: ${summary.p99_response_time.toFixed(2)}ms
Thresholds Passed: ${summary.thresholds_passed ? '✅' : '❌'}
    `
  };
}