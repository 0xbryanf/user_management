-- Ensure role_id is the PK on roles so it can be referenced
ALTER TABLE user_management.roles
  ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);

-- Drop old table if it exists
DROP TABLE IF EXISTS user_management.user_roles CASCADE;

-- Create new user_roles table
CREATE TABLE IF NOT EXISTS user_management.user_roles
(
    user_role_id   UUID            NOT NULL DEFAULT uuid_generate_v4(),
    user_id        UUID            NOT NULL,
    role_id        UUID            NOT NULL,
    created_at     TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at     TIMESTAMPTZ     NULL,
    created_by     UUID            NULL,
    updated_by     UUID            NULL,
    deleted_by     UUID            NULL,
    CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id),
    CONSTRAINT uq_user_roles_user_role UNIQUE (user_id, role_id),
    CONSTRAINT fk_user_roles_user
      FOREIGN KEY (user_id)
      REFERENCES user_management.users (user_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION,
    CONSTRAINT fk_user_roles_role
      FOREIGN KEY (role_id)
      REFERENCES user_management.roles (role_id)
      ON UPDATE NO ACTION
      ON DELETE NO ACTION
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS user_management.user_roles
    OWNER TO postgres;
