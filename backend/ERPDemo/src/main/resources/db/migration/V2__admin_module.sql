-- V2: admin module — seed default roles and a bootstrap admin user.
-- Password hash is a BCrypt hash of "admin123" (generated for local dev only).

INSERT INTO adm_role (id, created_at, code, name, description)
VALUES
    (gen_random_uuid(), NOW(), 'ROLE_ADMIN', 'Administrator', 'Full system access'),
    (gen_random_uuid(), NOW(), 'ROLE_MANAGER', 'Manager', 'Module manager'),
    (gen_random_uuid(), NOW(), 'ROLE_USER', 'User', 'Default user role')
ON CONFLICT (code) DO NOTHING;

INSERT INTO adm_user (id, created_at, username, email, password_hash, full_name, active)
VALUES (
    gen_random_uuid(),
    NOW(),
    'admin',
    'admin@phamdatte.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Admin',
    TRUE
)
ON CONFLICT (username) DO NOTHING;
