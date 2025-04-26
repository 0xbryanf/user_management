CREATE TABLE IF NOT EXISTS user_management.oauth_providers
(
    oauth_provider_id  UUID            NOT NULL DEFAULT uuid_generate_v4(),
    user_id            UUID            NOT NULL,
    email              VARCHAR(254)    NOT NULL,
    provider           VARCHAR(50)     NOT NULL,
    provider_user_id   VARCHAR(255)    NOT NULL,
    email_verified     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by         UUID            NULL,
    updated_by         UUID            NULL,
    deleted_at         TIMESTAMPTZ     NULL,
    deleted_by         UUID            NULL,

    -- Primary key
    CONSTRAINT oauth_providers_pkey PRIMARY KEY (oauth_provider_id),

    -- No two records for the same provider + provider_user_id
    CONSTRAINT uq_oauth_providers_provider_user UNIQUE (provider, provider_user_id),

    -- Link back to users
    CONSTRAINT fk_oauth_providers_user
      FOREIGN KEY (user_id)
      REFERENCES user_management.users (user_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
)
TABLESPACE pg_default;

-- 3) Set table owner
ALTER TABLE IF EXISTS user_management.oauth_providers
    OWNER TO postgres;