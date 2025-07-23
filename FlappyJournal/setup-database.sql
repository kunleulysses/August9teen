-- Featherweight Consciousness System Database Setup
\c featherweight_consciousness;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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

-- Insert initial state
INSERT INTO consciousness.state (metadata) VALUES ('{"initialization": "docker_deployment", "version": "2.0"}'::jsonb) ON CONFLICT DO NOTHING;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA consciousness TO feather_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA consciousness TO feather_user;
