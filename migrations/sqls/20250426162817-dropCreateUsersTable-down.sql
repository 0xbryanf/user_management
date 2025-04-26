-- Down migration: drop the existing users table

DROP TABLE IF EXISTS user_management.users CASCADE;
