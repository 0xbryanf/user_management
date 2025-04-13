-- The `user_management.user_roles` table connects users to roles using `user_id` and `role_id` foreign keys. 
-- Each record is uniquely identified by an auto-generated `id`, 
-- with timestamps (`created_at` and `updated_at`) tracking creation and updates. 
-- This design ensures efficient role assignment and clear links to the `users` and `roles` tables, 
-- while supporting scalability and traceability.

CREATE TABLE user_management.user_roles (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,                       
    role_id UUID NOT NULL,                       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES user_management.users(user_id),
    FOREIGN KEY (role_id) REFERENCES user_management.roles(role_id),
    PRIMARY KEY (id)                             
);