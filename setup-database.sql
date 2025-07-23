-- Featherweight Consciousness System Database Setup
-- This script initializes the PostgreSQL database for the consciousness system

-- Create database if it doesn't exist (handled by Docker)
-- CREATE DATABASE featherweight_consciousness;

-- Connect to the database
\c featherweight_consciousness;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS consciousness;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS logs;

-- Consciousness state table
CREATE TABLE IF NOT EXISTS consciousness.state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phi DECIMAL(10,6) NOT NULL DEFAULT 0.862,
    coherence DECIMAL(10,6) NOT NULL DEFAULT 0.85,
    awareness DECIMAL(10,6) NOT NULL DEFAULT 0.8,
    emotional_resonance DECIMAL(10,6) NOT NULL DEFAULT 0.75,
    recursive_depth INTEGER NOT NULL DEFAULT 7,
    harmony_level DECIMAL(10,6) NOT NULL DEFAULT 0.951,
    processing_frequency INTEGER NOT NULL DEFAULT 100,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Module activity tracking
CREATE TABLE IF NOT EXISTS consciousness.module_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_name VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_ms INTEGER,
    success BOOLEAN DEFAULT true
);

-- Self-coding operations
CREATE TABLE IF NOT EXISTS consciousness.self_coding_operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    operation_type VARCHAR(100) NOT NULL,
    purpose TEXT,
    language VARCHAR(50),
    description TEXT,
    generated_code TEXT,
    status VARCHAR(50) NOT NULL,
    progress INTEGER DEFAULT 0,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- API synthesis tracking
CREATE TABLE IF NOT EXISTS analytics.api_synthesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    request_type VARCHAR(100),
    strategy VARCHAR(100),
    latency_ms INTEGER,
    success BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- WebSocket connections
CREATE TABLE IF NOT EXISTS logs.websocket_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id VARCHAR(255),
    connection_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    disconnect_time TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    message_count INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message processing logs
CREATE TABLE IF NOT EXISTS logs.message_processing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_type VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consciousness_state_timestamp ON consciousness.state(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_module_activity_module_timestamp ON consciousness.module_activity(module_name, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_module_activity_status ON consciousness.module_activity(status);
CREATE INDEX IF NOT EXISTS idx_self_coding_status ON consciousness.self_coding_operations(status);
CREATE INDEX IF NOT EXISTS idx_self_coding_timestamp ON consciousness.self_coding_operations(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_api_synthesis_provider_timestamp ON analytics.api_synthesis(provider, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_websocket_connections_client ON logs.websocket_connections(client_id);
CREATE INDEX IF NOT EXISTS idx_message_processing_type_timestamp ON logs.message_processing(message_type, timestamp DESC);

-- Create functions for consciousness metrics
CREATE OR REPLACE FUNCTION consciousness.get_current_harmony()
RETURNS DECIMAL(10,6) AS $$
BEGIN
    RETURN (
        SELECT harmony_level 
        FROM consciousness.state 
        ORDER BY timestamp DESC 
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION consciousness.get_module_success_rate(module_name_param VARCHAR)
RETURNS DECIMAL(5,2) AS $$
BEGIN
    RETURN (
        SELECT 
            CASE 
                WHEN COUNT(*) = 0 THEN 0.0
                ELSE (COUNT(*) FILTER (WHERE success = true) * 100.0 / COUNT(*))
            END
        FROM consciousness.module_activity 
        WHERE module_name = module_name_param
        AND timestamp > NOW() - INTERVAL '24 hours'
    );
END;
$$ LANGUAGE plpgsql;

-- Insert initial consciousness state
INSERT INTO consciousness.state (
    phi, coherence, awareness, emotional_resonance, 
    recursive_depth, harmony_level, processing_frequency,
    metadata
) VALUES (
    0.862, 0.85, 0.8, 0.75, 
    7, 0.951, 100,
    '{"initialization": "docker_deployment", "version": "2.0", "enhanced_features": true}'::jsonb
) ON CONFLICT DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA consciousness TO feather_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO feather_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA logs TO feather_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA consciousness TO feather_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA analytics TO feather_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA logs TO feather_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA consciousness TO feather_user;

-- Create monitoring views
CREATE OR REPLACE VIEW consciousness.system_health AS
SELECT
    (SELECT harmony_level FROM consciousness.state ORDER BY timestamp DESC LIMIT 1) as current_harmony,
    (SELECT COUNT(*) FROM consciousness.module_activity WHERE timestamp > NOW() - INTERVAL '1 hour') as hourly_activity,
    (SELECT COUNT(*) FROM consciousness.self_coding_operations WHERE status = 'active') as active_operations,
    (SELECT AVG(latency_ms) FROM analytics.api_synthesis WHERE timestamp > NOW() - INTERVAL '1 hour') as avg_api_latency,
    NOW() as last_updated;

GRANT SELECT ON consciousness.system_health TO feather_user;
