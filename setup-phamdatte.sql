-- ============================================================
-- ERP Demo — bootstrap admin account "phamdatte" / "anhdat123"
-- Run this script in your preferred SQL tool against: erpdb
-- (target schema: public)
-- ============================================================

-- 1) Base admin tables (from V1) ----------------------------------------
CREATE TABLE IF NOT EXISTS adm_role (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    code          VARCHAR(60) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    description   VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS adm_user (
    id            UUID PRIMARY KEY,
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at    TIMESTAMP WITH TIME ZONE,
    created_by    VARCHAR(120),
    is_deleted    BOOLEAN NOT NULL DEFAULT FALSE,
    username      VARCHAR(80) NOT NULL UNIQUE,
    email         VARCHAR(160) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(160),
    active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS adm_user_role (
    user_id UUID NOT NULL REFERENCES adm_user(id),
    role_id UUID NOT NULL REFERENCES adm_role(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_adm_user_role_role ON adm_user_role(role_id);

-- 2) Roles (from V2) ----------------------------------------------------
INSERT INTO adm_role (id, created_at, code, name, description)
VALUES
    (gen_random_uuid(), NOW(), 'ROLE_ADMIN', 'Administrator', 'Full system access'),
    (gen_random_uuid(), NOW(), 'ROLE_MANAGER', 'Manager', 'Module manager'),
    (gen_random_uuid(), NOW(), 'ROLE_USER', 'User', 'Default user role')
ON CONFLICT (code) DO NOTHING;

-- 3) Admin user "phamdatte" --------------------------------------------
INSERT INTO adm_user (id, created_at, username, email, password_hash, full_name, active)
VALUES (
    gen_random_uuid(),
    NOW(),
    'phamdatte',
    'phamdatte@phamdatte.com',
    '$2a$10$HzNVv5/oB7L7TVzoNUT0D.KlonQh2L1w0A5/6fHD4spoEH/vnIgV2',
    'Pham Dat (Admin)',
    TRUE
)
ON CONFLICT (username) DO NOTHING;

-- 4) Grant ROLE_ADMIN to phamdatte -------------------------------------
INSERT INTO adm_user_role (user_id, role_id)
SELECT u.id, r.id
FROM adm_user u
JOIN adm_role r ON r.code = 'ROLE_ADMIN'
WHERE u.username = 'phamdatte'
  AND NOT EXISTS (
      SELECT 1 FROM adm_user_role ur
      WHERE ur.user_id = u.id AND ur.role_id = r.id
  );
