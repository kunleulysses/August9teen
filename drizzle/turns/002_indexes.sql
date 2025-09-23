-- Drizzle SQL migration: indexes and constraints
CREATE INDEX IF NOT EXISTS idx_turns_session_created ON turns (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_turns_fingerprint ON turns (fingerprint);
CREATE INDEX IF NOT EXISTS idx_turns_turn_id ON turns (turn_id);

CREATE INDEX IF NOT EXISTS idx_moments_session_created ON moments (session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moments_fingerprint ON moments (fingerprint);
CREATE UNIQUE INDEX IF NOT EXISTS uq_moments_fingerprint ON moments (fingerprint);

