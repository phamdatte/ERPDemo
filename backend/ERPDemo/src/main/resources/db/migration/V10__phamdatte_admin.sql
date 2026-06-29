-- V10: add a dedicated ADMIN account for the developer.
-- Password hash is a BCrypt (strength 10) hash of "anhdat123".

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

-- Assign ROLE_ADMIN to phamdatte (idempotent).
INSERT INTO adm_user_role (user_id, role_id)
SELECT u.id, r.id
FROM adm_user u
JOIN adm_role r ON r.code = 'ROLE_ADMIN'
WHERE u.username = 'phamdatte'
  AND NOT EXISTS (
      SELECT 1 FROM adm_user_role ur
      WHERE ur.user_id = u.id AND ur.role_id = r.id
  );
