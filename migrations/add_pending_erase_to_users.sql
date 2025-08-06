ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_erase boolean DEFAULT false NOT NULL;
