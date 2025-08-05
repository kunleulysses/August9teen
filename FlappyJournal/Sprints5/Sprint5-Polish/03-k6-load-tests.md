# 03 – k6 Load Tests

**Objective:**  
Simulate heavy WS/API usage to ensure quantum platform reliability under load.

**Why it matters:**  
Uncovers race conditions, memory leaks, and validates SLOs.

---

## Preconditions

- Install `k6`: `brew install k6` or `choco install k6`
- WS server running on test env

---

## Procedure

### 1. Create k6 script

`k6 quantum-ws-load.js`:

```js
import ws from 'k6/ws';
export default function () {
  ws.connect('wss://quantum.example.com/ws', {}, function (socket) {
    socket.on('open', function () {
      for (let i = 0; i < 100; i++) {
        socket.send(JSON.stringify({ op: 'test', payload: i }));
      }
    });
    socket.on('close', function () {
      socket.close();
    });
  });
}
```

### 2. Run k6

```sh
k6 run quantum-ws-load.js
```

---

## Verification

- p99 latency < 200 ms
- No memory or connection leaks after 10,000 clients

---

## Rollback / Troubleshooting

- Lower load if server crashes
- Analyze logs for errors

---

## Time Estimate

00:40

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-5.3