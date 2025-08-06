CREATE TABLE IF NOT EXISTS reality_scene (
    scene_id TEXT PRIMARY KEY,
    scene_json JSONB NOT NULL,
    depth INT NOT NULL,
    parent_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reality_scene_type_idx ON reality_scene((scene_json->>'type'));
