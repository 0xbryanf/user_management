ALTER TABLE user_management.password_history 
RENAME COLUMN changed_at TO created_at;

ALTER TABLE user_management.password_history 
RENAME COLUMN changed_by TO created_by;
