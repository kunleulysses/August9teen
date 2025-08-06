# Ticket A7 – DockerHardening-NonRoot

## Goal
Refactor and secure the Docker build and runtime environment for Sigil-DNA services, ensuring the container runs as a non-root user, all sensitive volumes are properly mounted, and comprehensive health checks are implemented.

## Context

The initial Dockerfile(s) for the Sigil-DNA stack (see [`Dockerfile`](../../../Dockerfile), [`Dockerfile.consciousness`](../../../Dockerfile.consciousness)) run the Node.js service as root, lack proper volume mounts for persistent data (e.g., LevelDB, Postgres creds), and do not include a HEALTHCHECK instruction. Running as root is a critical security anti-pattern in production, as any breach or vulnerability allows full container and potentially host access. Additionally, without a healthcheck, orchestrators like Kubernetes or Docker Swarm cannot reliably restart or replace unhealthy pods/containers.

Key files:
- [`Dockerfile`](../../../Dockerfile)
- [`Dockerfile.consciousness`](../../../Dockerfile.consciousness)
- Data directories for LevelDB: `/var/lib/sigil-leveldb`
- Entry point: `server/index.cjs` or `server/start-consciousness-server.cjs`

Best practices dictate:
- Always use a non-root user (e.g., `node` or custom UID/GID).
- Explicitly mount volumes for persistent storage and secrets.
- Add a HEALTHCHECK instruction that verifies `/healthz` endpoint.
- Use `USER` directive in Dockerfile and chown volumes as needed.
- Make all paths and ports configurable by environment variables.

## Prerequisites

- Docker Engine ≥ 20.x
- Access to update and rebuild Dockerfiles
- ENV: `SIGIL_DB_PATH`, `SIGIL_NODE_UID`, `SIGIL_NODE_GID`, `SIGIL_PORT`
- Helm/k8s manifests for production
- Snyk, Trivy, or Docker scan tool for security verification

## Step-by-Step Implementation

### 1. Create a Non-root User and Group

1. In Dockerfile, add before final image build:
   ```dockerfile
   RUN groupadd -r sigil && useradd -r -g sigil sigiluser
   ```
2. Set ownership on all files and directories (especially data):
   ```dockerfile
   RUN mkdir -p /var/lib/sigil-leveldb && chown -R sigiluser:sigil /var/lib/sigil-leveldb
   ```

### 2. Use the Non-root User for Runtime

1. Add before the `CMD` or `ENTRYPOINT`:
   ```dockerfile
   USER sigiluser
   ```
2. Ensure all scripts and node files are readable/executable by this user.

### 3. Add HEALTHCHECK to Dockerfile

1. Add:
   ```dockerfile
   HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
     CMD curl -f http://localhost:${SIGIL_PORT:-3000}/healthz || exit 1
   ```
2. This ensures Docker/k8s will restart the container if `/healthz` fails.

### 4. Mount Data and Secrets Volumes

1. In Docker Compose or Helm chart, ensure:
   - `/var/lib/sigil-leveldb` is mounted as a named volume or PVC.
   - Any secrets (e.g., `.env`, Postgres creds) are mounted in `/run/secrets` or `/etc/sigil`.
2. Docker Compose example:
   ```yaml
   volumes:
     sigil-data:
   services:
     sigil:
       image: sigil-dna:latest
       volumes:
         - sigil-data:/var/lib/sigil-leveldb
         - ./secrets.env:/run/secrets/.env:ro
   ```

### 5. Verify Permissions and Directory Ownership

1. In `server/index.cjs`, on startup:
   ```js
   const fs = require('fs');
   try {
     fs.accessSync(process.env.SIGIL_DB_PATH || '/var/lib/sigil-leveldb', fs.constants.W_OK);
   } catch (e) {
     logger.error({err: e}, 'LevelDB directory not writable');
     process.exit(1);
   }
   ```

### 6. Document and Expose All Port/Path ENV

- Use `SIGIL_PORT` to set listening port in all scripts.
- Use `SIGIL_DB_PATH` for LevelDB path in both Dockerfile and Node.

### 7. Run Security Scans and Image Audits

1. After building, run:
   ```
   docker scan sigil-dna:latest
   snyk container test sigil-dna:latest
   ```
2. Fix any critical vulnerabilities flagged.

---

## Verification

### Container Runtime

- Run container as non-root:
  ```
  docker run --rm -p 3000:3000 sigil-dna:latest
  ```
  Then in another shell:
  ```
  docker exec -it $(docker ps -q -f ancestor=sigil-dna:latest) id
  ```
  Output should show `uid=... sigiluser gid=... sigil`.

- Write to `/var/lib/sigil-leveldb` and verify no permission errors.

### HEALTHCHECK

- Stop API in the container, wait for Docker to mark container as unhealthy:
  ```
  docker inspect --format='{{json .State.Health}}' <container_id>
  ```
- In k8s, pod should be replaced if `/healthz` fails.

### Security

- Scan image; confirm no HIGH or CRITICAL vulns.

---

## Rollback

- Restore Dockerfile to previous version via:
  ```
  git checkout HEAD~1 -- Dockerfile Dockerfile.consciousness
  ```
- Remove non-root user and HEALTHCHECK from Dockerfile.
- Remove volume mounts from compose/helm.

---

## Acceptance Criteria

- Container never runs as root (checked via `id`).
- HEALTHCHECK works and is honored by orchestrator.
- Data writes to `/var/lib/sigil-leveldb` succeed.
- No critical security scan issues.
- All config paths/ports are ENV tunable.

---

## Time Estimate & Assignee

- Estimate: 1 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Node.js non-root container](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
- [Docker HEALTHCHECK docs](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Trivy container scanning](https://aquasecurity.github.io/trivy/)
- [Kubernetes pod security](https://kubernetes.io/docs/concepts/security/pod-security-standards/)