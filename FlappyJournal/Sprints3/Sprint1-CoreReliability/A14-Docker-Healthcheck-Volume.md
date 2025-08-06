# Ticket A14 – DockerCopyFix-Healthcheck-Volume

## Goal
Fix all Docker COPY paths to ensure only canonical, production-ready sigil files are included in container images, add robust HEALTHCHECK instructions for orchestrator readiness, and ensure persistent storage volumes are mounted with correct permissions.

## Context

The Sigil-DNA project originally had several Dockerfiles (`Dockerfile`, `Dockerfile.consciousness`, etc.) that:
- Used ambiguous or incorrect COPY commands (e.g., `COPY FlappyJournal/sigil-identity.js ./` instead of the canonical file in `FlappyJournal/server/`)
- Did not include a HEALTHCHECK, making container liveness opaque to Docker, Kubernetes, or Swarm.
- Did not explicitly mount volumes for persistent data (LevelDB, Postgres, secrets), risking data loss on container restart or pod eviction.

These issues can manifest as:
- Containers starting with missing or outdated sigil logic, leading to production outages.
- Orchestrators being unable to detect and replace crashed/locked containers.
- Data loss or corruption if the LevelDB path is not persisted across restarts.
- Security vulnerabilities if Docker context allows copying in backup/test files.

This ticket will address:
- Canonical COPY paths for all relevant files.
- A HEALTHCHECK that validates `/healthz`.
- Volume mounts (in Docker Compose, Helm, or k8s manifests) for LevelDB and secrets.
- Documentation of all changes for developers and SRE.

## Prerequisites

- Docker Engine ≥ 20.x, Docker Compose (optional)
- Access to update Dockerfile(s) and build images
- Helm or k8s cluster for testing readiness/liveness
- LevelDB or Postgres configured as backend
- ENV: `SIGIL_DB_PATH`, `SIGIL_PORT`
- Permissions to create named volumes/PVCs
- Container registry for build/test (optional)

## Step-by-Step Implementation

### 1. Fix Docker COPY Paths

1. In Dockerfile, replace any ambiguous or legacy COPYs:
   ```dockerfile
   # Old/broken
   # COPY FlappyJournal/sigil-identity.js ./
   # Good:
   COPY FlappyJournal/server/sigil-identity.cjs ./server/sigil-identity.cjs
   COPY FlappyJournal/server/sigil-api.cjs ./server/sigil-api.cjs
   COPY FlappyJournal/server/consciousness/sigil-based-code-authenticator.cjs ./server/consciousness/sigil-based-code-authenticator.cjs
   ```

2. Remove any lines copying from `FlappyJournal hey/`, `system-backups/`, or `.bak` files.

3. Add a `.dockerignore` to exclude test, backup, and non-canonical files:
   ```
   FlappyJournal hey/
   system-backups/
   *.bak
   __tests__/
   ```

### 2. Add HEALTHCHECK

1. In Dockerfile, after exposing port:
   ```dockerfile
   EXPOSE 3000
   HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
     CMD curl -f http://localhost:${SIGIL_PORT:-3000}/healthz || exit 1
   ```

2. Ensure `/healthz` endpoint is implemented and always returns 200 if process is healthy.

### 3. Mount Volumes for Persistence

1. For LevelDB, in Docker Compose:
   ```yaml
   services:
     sigil:
       image: sigil-dna:latest
       volumes:
         - sigil-data:/var/lib/sigil-leveldb
   volumes:
     sigil-data:
   ```
2. In Kubernetes, use a PersistentVolumeClaim (PVC) for `/var/lib/sigil-leveldb`:
   ```yaml
   volumeMounts:
     - name: sigil-db
       mountPath: /var/lib/sigil-leveldb
   volumes:
     - name: sigil-db
       persistentVolumeClaim:
         claimName: sigil-db-pvc
   ```

3. In Dockerfile, set default `SIGIL_DB_PATH` in ENV and ensure non-root user owns the volume:
   ```dockerfile
   ENV SIGIL_DB_PATH=/var/lib/sigil-leveldb
   RUN chown -R sigiluser:sigil /var/lib/sigil-leveldb
   ```

### 4. Document Volume and Healthcheck Usage

1. In README and runbooks, add:
   - How to verify container health via `docker inspect` or `kubectl get pods`.
   - How to mount/restore LevelDB data locally.

### 5. Test Build and Run

1. Build:
   ```
   docker build -t sigil-dna:dev .
   ```
2. Run:
   ```
   docker run --rm -p 3000:3000 -v $PWD/sigil-leveldb:/var/lib/sigil-leveldb sigil-dna:dev
   ```

3. Verify health:
   ```
   docker inspect --format='{{json .State.Health}}' <container_id>
   ```

---

## Verification

### Automated Build/Test

- `docker build` succeeds with canonical files only.
- `docker run` starts container, healthcheck passes.
- Data persists in LevelDB volume after restart.
- No test/backup/bak files in image (`docker run ... ls`).

### CI/CD

- Pipeline builds image, runs container, and passes healthcheck on all environments.

### Manual

- Remove volume, restart, verify new data directory is created and owned by non-root user.

---

## Rollback

- Restore previous Dockerfile, Compose, and manifests:
  ```
  git checkout HEAD~1 -- Dockerfile .dockerignore docker-compose.yml
  ```
- Remove HEALTHCHECK and volume mounts.

---

## Acceptance Criteria

- Only canonical sigil files included in image.
- HEALTHCHECK is present, validates /healthz.
- LevelDB data persists across restarts via volume.
- No test, backup, or .bak files in image.
- All documentation up to date.

---

## Time Estimate & Assignee

- Estimate: 0.75 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker HEALTHCHECK](https://docs.docker.com/engine/reference/builder/#healthcheck)
- [Kubernetes Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Docker .dockerignore](https://docs.docker.com/engine/reference/builder/#dockerignore-file)
- [Securing container builds](https://snyk.io/blog/10-docker-image-security-best-practices/)