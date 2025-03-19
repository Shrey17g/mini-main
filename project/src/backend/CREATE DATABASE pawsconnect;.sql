CREATE DATABASE pawsconnect;


USE pawsconnect;

CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_found_pets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type ENUM('lost', 'found') NOT NULL,
    pet_name VARCHAR(100),
    description TEXT,
    location VARCHAR(255),
    date DATE,
    image_url VARCHAR(255),
    contact_name VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    last_seen_details TEXT,
    additional_info TEXT,
    status ENUM('active', 'resolved', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ye prooceed

DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url MEDIUMBLOB,
    status ENUM('active', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url MEDIUMBLOB,
    status ENUM('active', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

CREATE TABLE post_likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id),
    FOREIGN KEY (user_id) REFERENCES admin_users(id),
    UNIQUE KEY unique_like (post_id, user_id)
);

CREATE TABLE post_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    status ENUM('active', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id),
    FOREIGN KEY (user_id) REFERENCES admin_users(id)
);

DROP TABLE IF EXISTS post_likes;
DROP TABLE IF EXISTS community_posts;

// Remove these tables:
DROP TABLE IF EXISTS post_comments;
DROP TABLE IF EXISTS post_categories;
DROP TABLE IF EXISTS user_activity;
DROP TABLE IF EXISTS reported_content;

-- Clear the table first
TRUNCATE TABLE admin_users;

-- Insert admin with the hash you copied
INSERT INTO admin_users (email, password) VALUES 
('admin@pawsconnect.com', '$2y$10$JkpVaE6A/pZnw8Do0xGtzO5msnB51pQ4u2mf4kp5FxIl.ngITIHb2');
