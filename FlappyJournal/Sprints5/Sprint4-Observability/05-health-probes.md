# 05 – Health Probes

**Objective:**  
Add `/health` endpoints and container healthchecks.

**Why it matters:**  
Enables orchestration, auto-healing, and SRE visibility.

---

## Preconditions

- HTTP server running (Express, Fastify, etc.)
- Deployment in container or on K8s

---

## Procedure

### 1. Add health endpoint

```js
fastify.get('/health', async (req, reply) => {
  return { status: 'ok', uptime: process.uptime() };
});
```

### 2. Add Docker HEALTHCHECK

```dockerfile
HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1
```

---

## Verification

- `curl http://localhost:3000/health` returns status ok.
- Docker/K8s marks pod as healthy.

---

## Rollback / Troubleshooting

- Remove endpoint if breaking, comment out healthcheck in Dockerfile.

---

## Time Estimate

00:20

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-4.5