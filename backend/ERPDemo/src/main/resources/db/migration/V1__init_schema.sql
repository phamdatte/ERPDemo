-- V1: Base schema — admin module (user, role, join table)
-- Conventions: table prefix adm_, snake_case columns, audit cols match BaseEntity.

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
