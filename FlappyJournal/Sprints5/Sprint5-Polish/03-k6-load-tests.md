> Status: Complete

# 03 – k6 Load Tests

**Objective:**  
Simulate heavy WebSocket and API usage against the quantum stack, using k6 for repeatable, scriptable load and 
SLO validation.

**Why it matters:**  
Only high-throughput simulation reveals real-world bugs: deadlocks, memory leaks, and latency spikes.

---

## Preconditions

- On feature branch or staging.
- Install k6:
  ```sh
  brew install k6
  # or
  choco install k6
  ```
- WebSocket server must be running and reachable (e.g., `wss://quantum.example.com/ws`).

---

## Procedure

### 1. Create k6 Test Script

**File:** `benchmarks/quantum-ws-load.js`

```js
import ws from 'k6/ws';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 2000 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    ws_connecting: ['p(99)<200'],
    ws_msgs_sent: ['count>10000'],
  },
};

export default function () {
  const params = { tags: { test: 'quantum-ws' } };
  const url = __ENV.QUANTUM_WS_URL || 'wss://quantum.example.com/ws';

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      for (let i = 0; i < 100; i++) {
        socket.send(JSON.stringify({ op: 'test', payload: i }));
      }
    });
    socket.on('message', function (msg) {
      // Optionally assert reply
    });
    socket.on('close', function () {
      // Graceful close
    });
    sleep(1);
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
}
```

### 2. Run the Test

```sh
QUANTUM_WS_URL=wss://quantum.example.com/ws k6 run benchmarks/quantum-ws-load.js
```

### 3. Analyze Results

- k6 will print:
  ```
  ws_connecting..................: avg=xxms min=xxms max=xxms p(99)=xxxms
  ws_msgs_sent..................: count=200000
  ```

---

## Verification

- p99 latency < 200 ms for connection and messaging.
- No server errors or memory leaks in logs after ramp.
- Clients can reconnect even after ramp down.

---

## Rollback / Troubleshooting

- Lower `target` in `stages` if server OOMs.
- Use `k6 run --out json=out.json ...` and analyze with Grafana k6 plugin.
- Tail server logs for connection drops.

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: SRE
- JIRA: Q5-5.3