CREATE TABLE IF NOT EXISTS dashboard_configs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    name        TEXT NOT NULL DEFAULT 'Principal',
    embed_url   TEXT NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_configs_hospital ON dashboard_configs(hospital_id);
