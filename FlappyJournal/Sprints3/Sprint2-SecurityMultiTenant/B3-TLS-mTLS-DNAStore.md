# Ticket B3 – TLS/mTLS Enforcement for DNAStore

## Goal
Enforce HTTPS on all outbound DNAStore requests, add optional mutual TLS (mTLS) support, and block cleartext HTTP to ensure all communications are fully encrypted and authenticated between Sigil-DNA and external dependency services.

## Context

Currently, DNAStore integration points in the Sigil-DNA stack (see [`FlappyJournal/server/consciousness/dna-sigil-reality-encoding.cjs`](../../server/consciousness/dna-sigil-reality-encoding.cjs)) use plain HTTP for all calls. This means:
- Data in transit (e.g., sigil payloads, HMACs, user/tenant IDs) is exposed to passive or active attackers.
- No guarantees of server authenticity—requests could be hijacked or redirected.
- No way to ensure only approved clients can communicate with DNAStore (lack of client certs).
- Fails compliance for regulated environments (HIPAA, GDPR, SOC2, etc.).

Modern cloud and zero-trust security require:
- All outbound HTTP(S) must use TLS (https://).
- Certificates must be validated (no `rejectUnauthorized: false`).
- Optionally, client certificates (mTLS) should be used to authenticate Sigil-DNA as a caller.

All configuration should be via ENV, and failures to negotiate HTTPS/mTLS must be fatal (fail-fast).

## Prerequisites

- Node.js ≥ 18.x
- DNAStore endpoint supporting HTTPS (and mTLS if required)
- `node-fetch` or `axios` npm packages supporting TLS/mTLS
- ENV:
  - `DNASTORE_URL` (must be https://)
  - `DNASTORE_CLIENT_CERT`
  - `DNASTORE_CLIENT_KEY`
  - `DNASTORE_CA_CERT`
  - `DNASTORE_REJECT_UNAUTHORIZED` (default true)
- Ability to update all HTTP client code
- Access to DNAStore CA and client credentials

## Step-by-Step Implementation

### 1. Enforce HTTPS URLs

1. In DNAStore config loader:
   ```js
   if (!process.env.DNASTORE_URL.startsWith('https://')) {
     throw new Error('DNASTORE_URL must use https://');
   }
   ```

### 2. Update HTTP Client for TLS/mTLS

1. If using `node-fetch`:
   ```js
   const fetch = require('node-fetch');
   const fs = require('fs');
   const https = require('https');
   const agent = new https.Agent({
     cert: process.env.DNASTORE_CLIENT_CERT ? fs.readFileSync(process.env.DNASTORE_CLIENT_CERT) : undefined,
     key: process.env.DNASTORE_CLIENT_KEY ? fs.readFileSync(process.env.DNASTORE_CLIENT_KEY) : undefined,
     ca: process.env.DNASTORE_CA_CERT ? fs.readFileSync(process.env.DNASTORE_CA_CERT) : undefined,
     rejectUnauthorized: process.env.DNASTORE_REJECT_UNAUTHORIZED !== 'false'
   });
   fetch(process.env.DNASTORE_URL, { agent });
   ```

2. If using `axios`:
   ```js
   const axios = require('axios');
   const https = require('https');
   const agent = new https.Agent({ ... });
   axios.get(process.env.DNASTORE_URL, { httpsAgent: agent });
   ```

### 3. Add Certificate Management

1. Store all certs/keys in `/run/secrets` or `/etc/sigil/certs`.
2. Update Docker Compose/k8s manifests:
   ```yaml
   volumes:
     - ./certs:/etc/sigil/certs:ro
   env:
     DNASTORE_CLIENT_CERT: /etc/sigil/certs/client.crt
     DNASTORE_CLIENT_KEY: /etc/sigil/certs/client.key
     DNASTORE_CA_CERT: /etc/sigil/certs/ca.crt
   ```

### 4. Expose ENV and Document Config

- In `.env.example`:
  ```
  DNASTORE_URL=https://dnastore.example.com
  DNASTORE_CLIENT_CERT=/etc/sigil/certs/client.crt
  DNASTORE_CLIENT_KEY=/etc/sigil/certs/client.key
  DNASTORE_CA_CERT=/etc/sigil/certs/ca.crt
  DNASTORE_REJECT_UNAUTHORIZED=true
  ```

### 5. Refuse to Start on Misconfig

- At startup, verify that all cert paths exist and are readable.
- Fail with descriptive error if not.

### 6. Integration with Circuit Breaker

- Ensure all TLS errors propagate to circuit breaker (see A4).

---

## Verification

### Automated

- Unit tests: attempt to call DNAStore with/without certs, expect failures.
- Integration: misconfigure URL to http://, expect process to die.
- Write tests for expired/invalid certs.

### Manual

- Use `curl` with `--cert`, `--key`, `--cacert` to DNAStore endpoint.
- Run service with valid and invalid certs, verify behavior.

### Security

- Run with `DNASTORE_REJECT_UNAUTHORIZED=false` and verify warning logs.
- Run nmap or wireshark to confirm all traffic is TLS.

---

## Rollback

- Restore HTTP client code to accept http:// URLs.
- Remove TLS/mTLS ENV and cert mounts.

---

## Acceptance Criteria

- All outbound DNAStore requests use HTTPS/mTLS.
- Service refuses to start with http:// URL.
- Client/server certs validated and used as configured.
- No plaintext data in transit.
- Tests and logs confirm correct operation.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Node.js HTTPS agent](https://nodejs.org/api/https.html#class-httpsagent)
- [Mutual TLS explained](https://smallstep.com/blog/mutual-tls-explained/)
- [axios mTLS config](https://axios-http.com/docs/req_config)
- [API Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [Docker secrets/certs](https://docs.docker.com/engine/swarm/secrets/)