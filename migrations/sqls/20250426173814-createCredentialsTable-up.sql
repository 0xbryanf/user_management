CREATE TABLE IF NOT EXISTS user_management.credentials
(
    credential_id   UUID            NOT NULL DEFAULT uuid_generate_v4(),
    user_id         UUID            NOT NULL,
    email           VARCHAR(254)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID            NULL,
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by      UUID            NULL,
    deleted_at      TIMESTAMPTZ     NULL,
    deleted_by      UUID            NULL,

    -- Primary key
    CONSTRAINT credentials_pkey PRIMARY KEY (credential_id),

    -- Enforce one login‐email per system
    CONSTRAINT uq_credentials_email UNIQUE (email),

    -- Link back to users
    CONSTRAINT fk_credentials_user
      FOREIGN KEY (user_id)
      REFERENCES user_management.users (user_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
)
TABLESPACE pg_default;

-- 3) Set ownership
ALTER TABLE IF EXISTS user_management.credentials
    OWNER TO postgres;