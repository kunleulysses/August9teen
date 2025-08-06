-- Create reality_access_log table for tracking scene access
CREATE SCHEMA IF NOT EXISTS postgres;

CREATE TABLE IF NOT EXISTS postgres.reality_access_log (
    id BIGSERIAL PRIMARY KEY,
    scene_id TEXT NOT NULL,
    user_id INTEGER,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    action TEXT NOT NULL
);

-- Prevent updates or deletes on reality_access_log
CREATE OR REPLACE FUNCTION postgres.reality_access_log_immutable()
RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'reality_access_log is immutable';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reality_access_log_immutable
    BEFORE UPDATE OR DELETE ON postgres.reality_access_log
    FOR EACH ROW EXECUTE FUNCTION postgres.reality_access_log_immutable();
