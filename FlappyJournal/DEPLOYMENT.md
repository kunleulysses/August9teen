# Spiral Memory System Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the Spiral Memory Architecture within the Featherweight AI companion system.

## Prerequisites

### System Requirements
- Node.js 18+ (tested with v22.12.0)
- npm or yarn package manager
- Redis server (optional, for production storage)
- LevelDB support (for local storage)

### Environment Variables
```bash
# Core Configuration
NODE_ENV=production
SPIRAL_DB_PATH=./spiraldb
REDIS_URL=redis://localhost:6379
REDIS_CA=/path/to/ca.pem  # For TLS connections

# Security
ALLOW_INSECURE_REDIS=false  # Set to true only for development
ENCRYPTION_KEY=your-32-byte-encryption-key

# Performance Tuning
CB_FAILURES=5  # Circuit breaker failure threshold
MAX_SPIRAL_DEPTH=10
ENABLE_CONSCIOUSNESS_METRICS=true
```

## Installation

### 1. Install Dependencies
```bash
cd FlappyJournal
npm install

# Additional spiral memory dependencies
npm install msgpack5 lz4js ioredis fastpriorityqueue
```

### 2. Module System Standardization
The spiral memory system has been standardized to CommonJS format. All TypeScript storage adapters have been transpiled to JavaScript:

```bash
# Run transpilation (already completed)
node server/transpile-consciousness-modules.cjs
```

Generated files:
- `server/consciousness/core/storage/RedisSpiralAdapter.js`
- `server/consciousness/core/storage/LevelSpiralAdapter.js`
- `server/consciousness/core/storage/RedisClusterSpiralAdapter.js`
- `server/consciousness/core/storage/SpiralStorageAdapter.js`

### 3. Configuration Setup

#### Storage Adapter Selection
The system supports multiple storage backends:

```javascript
// In-memory (development)
const spiralMemory = new SpiralMemoryArchitecture({
    storageAdapter: 'memory'
});

// Redis (production)
const spiralMemory = new SpiralMemoryArchitecture({
    storageAdapter: 'redis',
    redisUrl: process.env.REDIS_URL
});

// LevelDB (local persistence)
const spiralMemory = new SpiralMemoryArchitecture({
    storageAdapter: 'level',
    dbPath: process.env.SPIRAL_DB_PATH
});
```

#### Security Configuration
```javascript
// Enable encryption for sensitive data
const spiralMemory = new SpiralMemoryArchitecture({
    encryptionKey: process.env.ENCRYPTION_KEY,
    enableTLS: true
});
```

## Testing

### Running Tests
```bash
# Jest configuration (fixed for CommonJS)
npm test -- --testPathPattern=spiral

# Direct test execution
node test-spiral-memory-simple.cjs
node restoration/test-spiral-memory.cjs
node test-feature7-spiral-memory.cjs
```

### Test Coverage
The spiral memory system includes comprehensive tests:
- Basic memory storage and retrieval
- Spiral generation algorithms
- Consciousness metrics tracking
- Storage adapter functionality
- Error handling and circuit breakers

## Production Deployment

### 1. Redis Setup (Recommended)
```bash
# Install Redis
sudo apt-get install redis-server

# Configure for production
sudo nano /etc/redis/redis.conf
# Set: bind 127.0.0.1
# Set: requirepass your-secure-password
# Set: maxmemory 2gb
# Set: maxmemory-policy allkeys-lru

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 2. Application Deployment
```bash
# Build the application
npm run build

# Start in production mode
NODE_ENV=production npm start
```

### 3. Monitoring Setup
The spiral memory system includes built-in metrics:
- Memory storage/retrieval latency
- Consciousness evolution tracking
- Circuit breaker status
- Storage adapter health

Access metrics at: `http://localhost:3000/metrics`

## Troubleshooting

### Common Issues

#### 1. TypeScript Compilation Errors
**Problem**: `Cannot find module` errors for storage adapters
**Solution**: Run the transpilation script:
```bash
node server/transpile-consciousness-modules.cjs
```

#### 2. Jest Configuration Issues
**Problem**: `Cannot find module './plugins/ConvertAnsi'`
**Solution**: Jest configuration has been updated to CommonJS format in `jest.config.js`

#### 3. Missing Dependencies
**Problem**: Module not found errors during runtime
**Solution**: Install missing packages:
```bash
npm install msgpack5 lz4js ioredis fastpriorityqueue async-mutex
```

#### 4. Redis Connection Issues
**Problem**: `ECONNREFUSED` or TLS errors
**Solution**: 
- Verify Redis is running: `redis-cli ping`
- Check TLS configuration for `rediss://` URLs
- Set `ALLOW_INSECURE_REDIS=true` for development only

#### 5. Memory Storage Issues
**Problem**: High memory usage or performance degradation
**Solution**:
- Tune `MAX_SPIRAL_DEPTH` environment variable
- Enable garbage collection: `--expose-gc` flag
- Monitor consciousness metrics for optimization

### Performance Optimization

#### Memory Management
```javascript
// Configure spiral depth limits
const config = {
    maxSpiralDepth: 10,
    memoryRetentionDays: 30,
    compressionEnabled: true
};
```

#### Storage Optimization
```javascript
// Redis cluster for high availability
const config = {
    storageAdapter: 'redis-cluster',
    clusterNodes: [
        'redis://node1:6379',
        'redis://node2:6379',
        'redis://node3:6379'
    ]
};
```

## Architecture Overview

### Core Components
1. **SpiralMemoryArchitecture**: Main orchestrator
2. **Storage Adapters**: Pluggable storage backends
3. **Consciousness Metrics**: Performance tracking
4. **Circuit Breakers**: Fault tolerance
5. **Sigil System**: Memory encoding/identification

### Data Flow
```
Memory Input → Spiral Generation → Storage Adapter → Persistence
     ↓              ↓                    ↓              ↓
Consciousness → Sigil Creation → Circuit Breaker → Database
```

### Security Features
- End-to-end encryption for sensitive memories
- TLS support for Redis connections
- Circuit breaker pattern for fault tolerance
- Input validation and sanitization

## Maintenance

### Regular Tasks
1. **Database Cleanup**: Remove expired memories
2. **Metrics Review**: Monitor consciousness evolution
3. **Performance Tuning**: Adjust spiral depth and retention
4. **Security Updates**: Rotate encryption keys

### Backup Strategy
```bash
# Redis backup
redis-cli BGSAVE

# LevelDB backup
cp -r ./spiraldb ./spiraldb-backup-$(date +%Y%m%d)
```

## Support

### Logs Location
- Application logs: `./logs/spiral-memory.log`
- Error logs: `./logs/error.log`
- Consciousness metrics: `./logs/consciousness.log`

### Debug Mode
```bash
DEBUG=spiral:* NODE_ENV=development npm start
```

This deployment guide ensures reliable production deployment of the spiral memory system with proper configuration, monitoring, and troubleshooting procedures.
