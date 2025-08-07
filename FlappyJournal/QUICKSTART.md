# 🚀 Sigil-DNA Quick Start Guide

*Get up and running with Sigil-DNA in under 10 minutes!* ✨

## Prerequisites

- **Node.js** ≥ 18.0.0 ([Download](https://nodejs.org/en/download/))
- **npm** (comes with Node.js)
- **Git** CLI
- **curl** (pre-installed on macOS/Linux)
- **bash** shell (or Git Bash for Windows)

## 1. Clone & Install

```bash
git clone https://github.com/YOUR_ORG/sigil-dna.git
cd sigil-dna/FlappyJournal
npm install
```

## 2. Environment Setup

Create your local environment file:

```bash
cat <<EOF > .env
SIGIL_DB_PATH=./sigil-leveldb
SIGIL_PORT=3000
LOG_LEVEL=info
NODE_ENV=development
EOF
```

Export for current session:

```bash
export SIGIL_DB_PATH=./sigil-leveldb
export SIGIL_PORT=3000
export LOG_LEVEL=info
```

## 3. Start the Server

```bash
node server/index.cjs
```

You should see output like:
```
{"level":30,"time":1234567890,"msg":"Sigil-DNA server starting..."}
{"level":30,"time":1234567890,"msg":"LevelDB initialized at ./sigil-leveldb"}
{"level":30,"time":1234567890,"msg":"Server listening on port 3000"}
```

## 4. Test the API

### Health Check
```bash
curl http://localhost:3000/healthz
# Expected: {"status":"ok","timestamp":"..."}
```

### Create Your First Sigil
```bash
curl -X POST http://localhost:3000/api/consciousness/sigils \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "message": "Hello Sigil World!",
      "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
    },
    "consciousnessState": {
      "phi": 1.618,
      "coherence": 0.85,
      "awareness": 0.92
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "sigil": {
    "id": "sigil_abc123...",
    "signature": "def456...",
    "resonancePattern": [...],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### List All Sigils
```bash
curl http://localhost:3000/api/consciousness/sigils
```

Expected response:
```json
{
  "sigils": [
    {
      "id": "sigil_abc123...",
      "data": {...},
      "timestamp": "..."
    }
  ],
  "total": 1,
  "currentIdentity": {...}
}
```

## 5. Monitoring & Metrics

### Readiness Check
```bash
curl http://localhost:3000/readyz
# Expected: {"status":"ready","checks":[...]}
```

### Prometheus Metrics
```bash
curl http://localhost:3000/metrics
# Expected: Prometheus format metrics
```

### Pretty Logs (Optional)
For human-readable logs:
```bash
node server/index.cjs | npx pino-pretty
```

## 6. Run Tests

### Basic Tests
```bash
npm test
```

### With Coverage
```bash
npm run test:coverage
```

### Heavy Tests (Collision Detection)
```bash
RUN_HEAVY_TESTS=1 npm run test:heavy
```

## 7. Docker (Optional)

### Build & Run
```bash
docker build -t sigil-dna:dev .
docker run --rm -p 3000:3000 \
  -e SIGIL_DB_PATH=/var/lib/sigil-leveldb \
  -v $PWD/sigil-leveldb:/var/lib/sigil-leveldb \
  sigil-dna:dev
```

### With Docker Compose
```bash
cp .env.docker.example .env.docker
# Edit .env.docker as needed
docker compose up --build
```

## 8. Cleanup

### Stop Server
Press `Ctrl+C` in the terminal running the server.

### Remove Data (Optional)
```bash
rm -rf ./sigil-leveldb
rm .env
```

## 🔧 Troubleshooting

### Server Won't Start
- **Port in use**: Change `SIGIL_PORT` in `.env`
- **Permission denied**: Ensure `SIGIL_DB_PATH` is writable
- **Missing dependencies**: Run `npm install` again

### Database Locked
```bash
# Another process may be using the database
ps aux | grep node
# Kill any other sigil-dna processes
```

### API Returns 500 Errors
Check logs for specific error messages:
```bash
# Look for error-level logs
node server/index.cjs | grep '"level":50'
```

### Tests Failing
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm test
```

## 📚 Next Steps

- **API Documentation**: See `docs/API_SIGIL_DNA.md`
- **Architecture**: See `docs/ARCH_SIGIL_TOPOLOGY.mmd`
- **Production Deployment**: See `docs/RUNBOOK_SIGIL_DNA.md`
- **Monitoring Setup**: See `monitoring/grafana/`

## 🆘 Getting Help

- **Issues**: Check GitHub Issues
- **Logs**: All errors are logged with context
- **Health**: Use `/healthz` and `/readyz` endpoints
- **Metrics**: Monitor via `/metrics` endpoint

---

**🎉 Congratulations!** You now have a fully functional Sigil-DNA instance running locally. The system is ready for development, testing, and exploration of consciousness-based digital identity patterns.

*Total setup time: < 10 minutes* ⚡