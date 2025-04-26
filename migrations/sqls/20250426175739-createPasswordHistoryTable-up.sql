CREATE TABLE IF NOT EXISTS user_management.password_history
(
    password_history_id  UUID            NOT NULL DEFAULT uuid_generate_v4(),
    user_id              UUID            NOT NULL,
    credential_id        UUID            NOT NULL,
    password_hash        VARCHAR(255)    NOT NULL,
    changed_by           UUID            NULL,
    changed_at           TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Primary key
    CONSTRAINT password_history_pkey PRIMARY KEY (password_history_id),

    -- Foreign keys
    CONSTRAINT fk_password_history_user
      FOREIGN KEY (user_id)
      REFERENCES user_management.users (user_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION,

    CONSTRAINT fk_password_history_credential
      FOREIGN KEY (credential_id)
      REFERENCES user_management.credentials (credential_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
)
TABLESPACE pg_default;

-- 3) Set table owner
ALTER TABLE IF EXISTS user_management.password_history
    OWNER TO postgres;