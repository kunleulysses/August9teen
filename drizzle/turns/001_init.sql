-- Drizzle SQL migration: initialize turns and moments tables
CREATE TABLE IF NOT EXISTS turns (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_sub TEXT,
  session_id TEXT NOT NULL,
  turn_id TEXT NOT NULL,
  action TEXT NOT NULL,
  narrative TEXT NOT NULL,
  choices JSON,
  deltas JSON,
  fingerprint TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS moments (
  id SERIAL PRIMARY KEY,
  turn_id TEXT,
  session_id TEXT NOT NULL,
  text TEXT NOT NULL,
  tags JSON,
  fingerprint TEXT,
  sigil TEXT,
  mintable BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

