CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_management.users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), 
    username VARCHAR(50) UNIQUE NOT NULL, 
    password_hash TEXT NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    is_active BOOLEAN DEFAULT TRUE, 
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);