-- Down Migration: remove the UNIQUE constraint on role_name

ALTER TABLE user_management.roles
  DROP CONSTRAINT IF EXISTS uq_roles_name;
