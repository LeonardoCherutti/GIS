CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT NOT NULL UNIQUE,
    name        TEXT,
    picture     TEXT,
    role        TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_hospitals (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, hospital_id)
);

CREATE INDEX IF NOT EXISTS idx_user_hospitals_user ON user_hospitals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_hospitals_hospital ON user_hospitals(hospital_id);
