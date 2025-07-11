-- Grievance Management System Database Schema
-- Created: 2024
-- Database: grievance_management_system

-- Create database
CREATE DATABASE IF NOT EXISTS grievance_management_system;
USE grievance_management_system;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'user', 'staff') DEFAULT 'user',
    phone VARCHAR(20),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_role (role)
);

-- Grievance categories table
CREATE TABLE grievance_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Grievances table
CREATE TABLE grievances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id INT,
    user_id INT NOT NULL,
    assigned_to INT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected') DEFAULT 'pending',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    resolution_date TIMESTAMP NULL,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES grievance_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_category_id (category_id),
    INDEX idx_submission_date (submission_date)
);

-- Grievance attachments table
CREATE TABLE grievance_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(100),
    uploaded_by INT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_grievance_id (grievance_id)
);

-- Grievance comments/updates table
CREATE TABLE grievance_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_grievance_id (grievance_id),
    INDEX idx_user_id (user_id)
);

-- Grievance status history table
CREATE TABLE grievance_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    grievance_id INT NOT NULL,
    old_status ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected'),
    new_status ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected'),
    changed_by INT NOT NULL,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_grievance_id (grievance_id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    grievance_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (grievance_id) REFERENCES grievances(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- Dashboard analytics view
CREATE VIEW dashboard_stats AS
SELECT 
    (SELECT COUNT(*) FROM grievances) as total_grievances,
    (SELECT COUNT(*) FROM grievances WHERE status = 'pending') as pending_grievances,
    (SELECT COUNT(*) FROM grievances WHERE status = 'in_progress') as in_progress_grievances,
    (SELECT COUNT(*) FROM grievances WHERE status = 'resolved') as resolved_grievances,
    (SELECT COUNT(*) FROM grievances WHERE status = 'closed') as closed_grievances,
    (SELECT COUNT(*) FROM grievances WHERE priority = 'urgent') as urgent_grievances,
    (SELECT COUNT(*) FROM grievances WHERE priority = 'high') as high_priority_grievances,
    (SELECT COUNT(*) FROM users WHERE is_active = TRUE) as active_users,
    (SELECT COUNT(*) FROM grievances WHERE DATE(submission_date) = CURDATE()) as today_grievances,
    (SELECT COUNT(*) FROM grievances WHERE WEEK(submission_date) = WEEK(CURDATE())) as this_week_grievances,
    (SELECT COUNT(*) FROM grievances WHERE MONTH(submission_date) = MONTH(CURDATE())) as this_month_grievances;
