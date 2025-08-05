# 03 – Dockerfile Refactor

**Objective:**  
Modernize Dockerfile for security, caching, multi-arch, and Node 20.

**Why it matters:**  
Faster builds, smaller images, hardened runtime.

---

## Preconditions

- Docker 20+, BuildKit enabled (`DOCKER_BUILDKIT=1`)
- Node 20 base image

---

## Procedure

### 1. Use multi-stage builds

```dockerfile
FROM node:20-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/index.js"]
```

### 2. Enable healthcheck

```dockerfile
HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1
```

---

## Verification

- `docker build .` succeeds.
- `docker run` passes healthcheck.
- Image size < 200 MB.

---

## Rollback / Troubleshooting

- Use previous Dockerfile from git history if build fails.
- Remove healthcheck for debugging.

---

## Time Estimate

00:35

---

## Owner / JIRA

- Owner: [assign]
- JIRA: Q5-3.3