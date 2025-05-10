ALTER TABLE user_management.password_history 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_by UUID;
