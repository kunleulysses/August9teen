# 🏗️ Sigil-DNA System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        CLI[CLI Tools]
        WEB[Web Interface]
        API_CLIENT[API Clients]
    end
    
    subgraph "API Gateway"
        JWT[JWT Auth]
        RATE[Rate Limiter]
        SCHEMA[Schema Validator]
    end
    
    subgraph "Core Services"
        SIGIL_ENGINE[SigilEngine]
        RESONANCE[HyperResonance Engine]
        GRAPH[Graph Index]
    end
    
    subgraph "Storage Layer"
        LEVELDB[(LevelDB)]
        POSTGRES[(PostgreSQL)]
        MEMORY[(In-Memory)]
    end
    
    subgraph "Security"
        HMAC[HMAC Signing]
        TLS[TLS/mTLS]
        SECRETS[Secret Manager]
    end
    
    subgraph "Monitoring"
        PROMETHEUS[Prometheus]
        GRAFANA[Grafana]
        ALERTS[AlertManager]
    end
    
    CLI --> JWT
    WEB --> JWT
    API_CLIENT --> JWT
    
    JWT --> RATE
    RATE --> SCHEMA
    SCHEMA --> SIGIL_ENGINE
    
    SIGIL_ENGINE --> RESONANCE
    SIGIL_ENGINE --> GRAPH
    SIGIL_ENGINE --> LEVELDB
    SIGIL_ENGINE --> POSTGRES
    SIGIL_ENGINE --> MEMORY
    
    SIGIL_ENGINE --> HMAC
    SIGIL_ENGINE --> TLS
    
    SIGIL_ENGINE --> PROMETHEUS
    PROMETHEUS --> GRAFANA
    GRAFANA --> ALERTS
    
    SECRETS --> HMAC
    SECRETS --> TLS
```

## Key Components

### **SigilEngine** - Unified Core
- Encode/decode/verify/revoke operations
- Dependency injection for storage and crypto
- Tenant isolation and RBAC enforcement

### **Storage Abstraction**
- LevelDB for high-performance local storage
- PostgreSQL for enterprise deployments  
- In-memory for testing and development

### **Security Layers**
- JWT authentication with JWKS validation
- Per-tenant rate limiting with Redis clustering
- TLS/mTLS for all external communications
- HMAC signing with automated secret rotation

### **Advanced Features**
- HyperResonance matching for similarity queries
- Graph indexing for relationship traversal
- Comprehensive monitoring with Prometheus/Grafana
- Chaos engineering for resilience testing

## Data Flow

1. **Request** → JWT Auth → Rate Limiting → Schema Validation
2. **Processing** → SigilEngine → Storage Driver → Persistence
3. **Response** → Metrics Collection → Client
4. **Monitoring** → Prometheus → Grafana → Alerts