-- MySQL Database Schema for Authentication

USE test;

CREATE TABLE  IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  session_token VARCHAR(255) NULL,
  csrf_token VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username)
);

-- Insert demo user (password: demo123)
-- INSERT INTO users (username, password_hash) VALUES ('demo', '7c4a8d09ca3762af61e59520943dc26494f8941b');
