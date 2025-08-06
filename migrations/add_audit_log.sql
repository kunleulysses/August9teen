-- Create audit_log parent table with pg_partman managed monthly partitions
CREATE SCHEMA IF NOT EXISTS postgres;
CREATE EXTENSION IF NOT EXISTS pg_partman;

CREATE TABLE IF NOT EXISTS postgres.audit_log (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    actor TEXT,
    action TEXT NOT NULL,
    details JSONB
) PARTITION BY RANGE (created_at);

-- Configure pg_partman for monthly partitions
SELECT partman.create_parent('postgres.audit_log', 'created_at', 'native', 'monthly');

-- Prevent updates or deletes on audit_log
CREATE OR REPLACE FUNCTION postgres.audit_log_immutable()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'audit_log is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutable
    BEFORE UPDATE OR DELETE ON postgres.audit_log
    FOR EACH ROW EXECUTE FUNCTION postgres.audit_log_immutable();

