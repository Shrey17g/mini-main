CREATE DATABASE pawsconnect;


USE pawsconnect;

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clear the table first
TRUNCATE TABLE admin_users;

-- Insert admin with the hash you copied
INSERT INTO admin_users (email, password) VALUES 
('admin@pawsconnect.com', '$2y$10$JkpVaE6A/pZnw8Do0xGtzO5msnB51pQ4u2mf4kp5FxIl.ngITIHb2');
