-- Table: user_management.roles

DROP TABLE IF EXISTS user_management.roles CASCADE;

CREATE TABLE IF NOT EXISTS user_management.roles
(
    role_id     UUID            NOT NULL DEFAULT uuid_generate_v4(),
    role_name   VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  UUID            NULL,
    updated_by  UUID            NULL,
    deleted_at  TIMESTAMPTZ     NULL,
    deleted_by  UUID            NULL
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS user_management.roles
    OWNER to postgres;
