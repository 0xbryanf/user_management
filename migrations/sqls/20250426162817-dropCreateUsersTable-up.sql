-- 1) Drop the existing users table (and any dependent constraints)  
DROP TABLE IF EXISTS user_management.users CASCADE;

-- 2) Recreate the users table to match our updated schema  
CREATE TABLE IF NOT EXISTS user_management.users
(
    user_id     UUID            NOT NULL DEFAULT uuid_generate_v4(),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login  TIMESTAMPTZ     NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  UUID            NULL,
    deleted_at  TIMESTAMPTZ     NULL,
    deleted_by  UUID            NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)
TABLESPACE pg_default;

-- 3) Re-assign ownership  
ALTER TABLE IF EXISTS user_management.users
    OWNER TO postgres;
