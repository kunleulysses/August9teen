# 04 – WSS Termination via Caddy

**Objective:**  
Enforce encrypted WSS for all WS endpoints using Caddy as reverse proxy.

**Why it matters:**  
Protects user data and credentials over the wire; enables modern browser support.

---

## Preconditions

- Caddy installed (`caddy version`)
- Domain pointed to your server
- TLS certs (auto via Let's Encrypt or provided)
- ENV: `ALLOW_INSECURE_QUANTUM_WS=false`

---

## Procedure

### 1. Update Caddyfile

Sample Caddyfile snippet:

```
quantum.example.com {
    reverse_proxy /ws* localhost:5050
    tls you@example.com
}
```

### 2. Restart Caddy

```sh
sudo systemctl reload caddy
```

### 3. Update WS client URLs

```js
const ws = new WebSocket('wss://quantum.example.com/ws');
```

---

## Verification

- Connect to WS over `wss://` — succeeds.
- Connect via `ws://` — fails (as expected).
- Test with browser DevTools: "Secure" flag present.

---

## Rollback / Troubleshooting

- Restore previous Caddy config.
- Check Caddy logs: `journalctl -u caddy`
- Temporarily enable `ALLOW_INSECURE_QUANTUM_WS=true` (not recommended).

---

## Time Estimate

00:45

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-1.4