# Ticket A12 – README-QuickStart

## Goal
Provide a crystal-clear, zero-dependency quick-start guide for developers to spin up Sigil-DNA locally with LevelDB persistence and interact with the API using curl and basic CLI tools.

## Context

Onboarding friction is a major bottleneck for new contributors and SREs. The current README is either missing, outdated, or buried under complex architecture docs, making it difficult for anyone to get the Sigil-DNA stack running, mint a sigil, or run basic tests. Many developers do not know:
- How to set up the LevelDB persistence layer.
- What environment variables are required for a minimal boot.
- How to run the server and verify endpoints.
- How to create, list, and verify sigils via curl or HTTPie.
- How to check logs, metrics, and health endpoints locally.

A streamlined, copy-paste-verified quick-start greatly increases onboarding velocity, reduces support burden, and prevents subtle misconfigurations. It should be the single source of truth for spinning up the local stack, with explicit sections for API usage, troubleshooting, and teardown.

## Prerequisites

- Node.js v18.x or higher (https://nodejs.org/en/download/)
- npm (comes with Node.js)
- Git CLI
- curl (pre-installed on macOS/Linux, or [download](https://curl.se/))
- bash shell (or Git Bash for Windows)
- Docker (optional, for running with containers)
- ENV: `SIGIL_DB_PATH`, `SIGIL_PORT` (defaults provided)
- No elevated privileges required (non-root)

## Step-by-Step Implementation

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_ORG/sigil-dna.git
cd sigil-dna/FlappyJournal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env` in the root:
```bash
cat <<EOF > .env
SIGIL_DB_PATH=./sigil-leveldb
SIGIL_PORT=3000
LOG_LEVEL=info
EOF
```

Export variables for this session:
```bash
export SIGIL_DB_PATH=./sigil-leveldb
export SIGIL_PORT=3000
export LOG_LEVEL=info
```

### 4. Start the Sigil-DNA Server

```bash
node server/index.cjs
```
You should see log output indicating the server is listening on port 3000 and LevelDB is initialized.

### 5. Mint a New Sigil via API

```bash
curl -X POST http://localhost:3000/sigil/api/consciousness/sigils \
  -H "Content-Type: application/json" \
  -d '{"data":{"hello":"sigil world"}}'
```
Expected response:
```json
{"success":true,"sigil":{ ... }}
```

### 6. List Recent Sigils

```bash
curl http://localhost:3000/sigil/api/consciousness/sigils
```
Expected response:
```json
{
  "sigils": [ ... ],
  "total": 1,
  "currentIdentity": { ... }
}
```

### 7. Health and Metrics Endpoints

Check server health:
```bash
curl http://localhost:3000/healthz
```
Check readiness:
```bash
curl http://localhost:3000/readyz
```
Check Prometheus metrics:
```bash
curl http://localhost:3000/metrics
```

### 8. Logs & Troubleshooting

Logs are written to stdout in JSON format (see pino logger).
To pretty-print:
```bash
node server/index.cjs | npx pino-pretty
```
If you see permission or database errors, verify `SIGIL_DB_PATH` is writable and not locked by another process.

### 9. Stopping and Cleaning Up

- To stop the server: `Ctrl+C`
- To delete all sigil data:
  ```
  rm -rf ./sigil-leveldb
  ```

### 10. Using Docker (Optional)

Build and run with Docker:
```bash
docker build -t sigil-dna:dev .
docker run --rm -p 3000:3000 -e SIGIL_DB_PATH=/var/lib/sigil-leveldb -v $PWD/sigil-leveldb:/var/lib/sigil-leveldb sigil-dna:dev
```

### 11. Running Tests

```bash
npm test
```
For heavy collision tests:
```bash
RUN_HEAVY_TESTS=1 npm run test:heavy
```

---

## Verification

- Follow the steps above on a clean checkout and verify:
  - Server starts with no errors.
  - You can POST and GET sigils with curl.
  - Health and metrics endpoints respond with 200.
  - Logs are present and parseable.
  - Tests pass.

- Have a new team member run the quick-start and confirm timing (should take <10 min).

---

## Rollback

- Remove all files/dirs created:
  ```
  rm -rf ./sigil-leveldb .env
  ```
- No system-level changes made.

---

## Acceptance Criteria

- Any developer can clone, configure, and start the service in <10 minutes.
- All basic API, health, and metrics endpoints work as documented.
- No root/sudo required.
- README is up to date and copy-paste verified.

---

## Time Estimate & Assignee

- Estimate: 0.5 dev day
- Assignee: _______________________

---

## References / Further Reading

- [Node.js download](https://nodejs.org/en/download/)
- [curl manual](https://curl.se/docs/manpage.html)
- [LevelDB npm](https://www.npmjs.com/package/level)
- [Docker Compose quick start](https://docs.docker.com/compose/gettingstarted/)
- [Pino logger docs](https://getpino.io/)