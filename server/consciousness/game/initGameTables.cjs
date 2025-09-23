const { pool } = require('../../db');

async function ensure() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS turns (
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
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_turns_session_created ON turns (session_id, created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_turns_fingerprint ON turns (fingerprint)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_turns_turn_id ON turns (turn_id)`);
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS moments (
      id SERIAL PRIMARY KEY,
      turn_id TEXT,
      session_id TEXT NOT NULL,
      text TEXT NOT NULL,
      tags JSON,
      fingerprint TEXT,
      sigil TEXT,
      mintable BOOLEAN DEFAULT false NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_moments_session_created ON moments (session_id, created_at DESC)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_moments_fingerprint ON moments (fingerprint)`);
    await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS uq_moments_fingerprint ON moments (fingerprint)`);
  } catch {}
  try {
    // Players and companions for mobile game
    await pool.query(`CREATE TABLE IF NOT EXISTS game_players (
      id TEXT PRIMARY KEY,
      username TEXT,
      level INTEGER DEFAULT 1 NOT NULL,
      coins INTEGER DEFAULT 0 NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS game_companions (
      id TEXT PRIMARY KEY,
      player_id TEXT REFERENCES game_players(id) ON DELETE CASCADE,
      name TEXT,
      level INTEGER DEFAULT 1 NOT NULL,
      experience INTEGER DEFAULT 0 NOT NULL,
      mood TEXT,
      hunger INTEGER DEFAULT 0 NOT NULL,
      energy INTEGER DEFAULT 0 NOT NULL,
      happiness INTEGER DEFAULT 0 NOT NULL,
      personality JSONB,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS game_events (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL,
      event_id TEXT NOT NULL UNIQUE,
      event_type TEXT NOT NULL,
      data JSONB NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_game_events_session_created ON game_events (session_id, created_at)`);
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_sanctuaries (
      id TEXT PRIMARY KEY,
      player_id TEXT REFERENCES game_players(id) ON DELETE CASCADE,
      level INTEGER DEFAULT 1 NOT NULL,
      xp INTEGER DEFAULT 0 NOT NULL,
      ascended BOOLEAN DEFAULT false NOT NULL,
      legendary BOOLEAN DEFAULT false NOT NULL,
      legendary_at TIMESTAMP,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS game_battles (
      id SERIAL PRIMARY KEY,
      p1_session TEXT NOT NULL,
      p2_session TEXT NOT NULL,
      winner_session TEXT,
      loser_session TEXT,
      xp_transferred INTEGER DEFAULT 0 NOT NULL,
      result JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_game_battles_created ON game_battles (created_at DESC)`);
    // Add player columns for profile queries if missing
    await pool.query('ALTER TABLE game_battles ADD COLUMN IF NOT EXISTS p1_player TEXT');
    await pool.query('ALTER TABLE game_battles ADD COLUMN IF NOT EXISTS p2_player TEXT');
    await pool.query('ALTER TABLE game_battles ADD COLUMN IF NOT EXISTS winner_player TEXT');
    await pool.query('ALTER TABLE game_battles ADD COLUMN IF NOT EXISTS loser_player TEXT');
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_inventory (
      id SERIAL PRIMARY KEY,
      player_id TEXT REFERENCES game_players(id) ON DELETE CASCADE,
      item_id TEXT NOT NULL,
      name TEXT,
      type TEXT,
      quantity INTEGER DEFAULT 1 NOT NULL,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_inventory_player ON game_inventory (player_id)`);
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS push_tokens (
      id SERIAL PRIMARY KEY,
      session_id TEXT UNIQUE,
      token TEXT NOT NULL,
      platform TEXT,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_push_tokens_session ON push_tokens (session_id)`);
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_flags_history (
      id SERIAL PRIMARY KEY,
      flags JSONB NOT NULL,
      applied_by TEXT,
      note TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_flags_created ON game_flags_history (created_at DESC)`);
  } catch {}
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS game_code_proposals (
      id SERIAL PRIMARY KEY,
      ability_id TEXT NOT NULL,
      before JSONB,
      after JSONB,
      reason TEXT,
      status TEXT DEFAULT 'proposed' NOT NULL,
      applied_by TEXT,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    )`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_code_props_created ON game_code_proposals (created_at DESC)`);
  } catch {}
}

ensure().catch(() => {});

module.exports = {};
