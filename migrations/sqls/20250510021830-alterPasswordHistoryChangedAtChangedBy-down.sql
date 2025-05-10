ALTER TABLE user_management.password_history 
RENAME COLUMN created_at TO changed_at,
RENAME COLUMN created_by TO changed_by;
