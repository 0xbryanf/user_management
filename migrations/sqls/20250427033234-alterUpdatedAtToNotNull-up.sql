ALTER TABLE user_management.users
ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE user_management.user_roles
ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE user_management.roles
ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE user_management.oauth_providers
ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE user_management.credentials
ALTER COLUMN updated_at DROP NOT NULL;