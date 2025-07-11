-- Seed data for Grievance Management System
-- This file contains sample data for testing and development

USE grievance_management_system;

-- Insert sample grievance categories
INSERT INTO grievance_categories (name, description) VALUES
('Technical Issues', 'Problems related to technical infrastructure, software, or hardware'),
('HR Issues', 'Human resources related grievances including workplace policies'),
('Administrative', 'Administrative and procedural issues'),
('Facilities', 'Issues related to workplace facilities and environment'),
('Financial', 'Financial and payment related grievances'),
('General', 'General complaints and suggestions');

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (username, email, password_hash, first_name, last_name, role, phone, department) VALUES
('admin', 'admin@company.com', '$2b$10$K2E7HaKQOa4NJULrOZzIQuGxKiQnQyRDpzJ1wGXfmwPvz4LBMRhL6', 'System', 'Administrator', 'admin', '555-0001', 'IT'),
('john.doe', 'john.doe@company.com', '$2b$10$K2E7HaKQOa4NJULrOZzIQuGxKiQnQyRDpzJ1wGXfmwPvz4LBMRhL6', 'John', 'Doe', 'user', '555-0002', 'Sales'),
('jane.smith', 'jane.smith@company.com', '$2b$10$K2E7HaKQOa4NJULrOZzIQuGxKiQnQyRDpzJ1wGXfmwPvz4LBMRhL6', 'Jane', 'Smith', 'staff', '555-0003', 'HR'),
('bob.johnson', 'bob.johnson@company.com', '$2b$10$K2E7HaKQOa4NJULrOZzIQuGxKiQnQyRDpzJ1wGXfmwPvz4LBMRhL6', 'Bob', 'Johnson', 'user', '555-0004', 'Finance'),
('alice.brown', 'alice.brown@company.com', '$2b$10$K2E7HaKQOa4NJULrOZzIQuGxKiQnQyRDpzJ1wGXfmwPvz4LBMRhL6', 'Alice', 'Brown', 'staff', '555-0005', 'Operations');

-- Insert sample grievances
INSERT INTO grievances (title, description, category_id, user_id, assigned_to, priority, status, submission_date, due_date) VALUES
('Email System Down', 'The company email system has been down for 2 hours affecting productivity', 1, 2, 1, 'urgent', 'in_progress', '2024-01-15 09:00:00', '2024-01-15'),
('Payroll Discrepancy', 'My last paycheck amount does not match the expected calculation', 5, 4, 3, 'high', 'pending', '2024-01-14 14:30:00', '2024-01-21'),
('Office Temperature', 'The office temperature is consistently too cold in the morning', 4, 2, 5, 'medium', 'pending', '2024-01-13 10:15:00', '2024-01-20'),
('Parking Space Assignment', 'Requesting a designated parking space closer to the building entrance', 6, 4, 5, 'low', 'resolved', '2024-01-12 16:45:00', '2024-01-19'),
('Software License Issue', 'Unable to access required software due to license expiration', 1, 2, 1, 'high', 'in_progress', '2024-01-11 11:20:00', '2024-01-18'),
('Workplace Harassment', 'Experiencing inappropriate behavior from a colleague', 2, 4, 3, 'urgent', 'in_progress', '2024-01-10 13:30:00', '2024-01-17'),
('Equipment Malfunction', 'Office printer is constantly jamming and needs replacement', 4, 2, 5, 'medium', 'pending', '2024-01-09 08:45:00', '2024-01-16'),
('Training Request', 'Requesting additional training for new software implementation', 6, 4, 3, 'low', 'closed', '2024-01-08 15:00:00', '2024-01-15'),
('Internet Connectivity', 'Frequent internet disconnections affecting work quality', 1, 2, 1, 'high', 'resolved', '2024-01-07 12:10:00', '2024-01-14'),
('Lunch Menu Options', 'Requesting more vegetarian options in the cafeteria menu', 6, 4, 5, 'low', 'pending', '2024-01-06 17:20:00', '2024-01-13');

-- Insert sample grievance comments
INSERT INTO grievance_comments (grievance_id, user_id, comment, is_internal) VALUES
(1, 1, 'We are investigating the email server issue. Initial diagnosis shows database connection problems.', FALSE),
(1, 1, 'Email system has been restored. Root cause was a database timeout issue.', FALSE),
(2, 3, 'We have reviewed your payroll calculation and will contact you within 24 hours.', FALSE),
(4, 5, 'Parking space P-15 has been assigned to you. Please collect your new parking pass from reception.', FALSE),
(5, 1, 'Software licenses have been renewed. Please try accessing the application again.', FALSE),
(6, 3, 'We take this matter very seriously. A formal investigation has been initiated.', TRUE),
(8, 3, 'Training session has been scheduled for next week. Calendar invite sent.', FALSE),
(9, 1, 'Internet connectivity issue has been resolved. New router installed.', FALSE);

-- Insert sample grievance status history
INSERT INTO grievance_status_history (grievance_id, old_status, new_status, changed_by, change_reason) VALUES
(1, 'pending', 'in_progress', 1, 'Started investigating the email server issue'),
(4, 'pending', 'in_progress', 5, 'Reviewing available parking spaces'),
(4, 'in_progress', 'resolved', 5, 'Parking space assigned successfully'),
(5, 'pending', 'in_progress', 1, 'Contacting software vendor for license renewal'),
(6, 'pending', 'in_progress', 3, 'Formal investigation initiated'),
(8, 'pending', 'in_progress', 3, 'Training schedule being prepared'),
(8, 'in_progress', 'resolved', 3, 'Training session scheduled'),
(8, 'resolved', 'closed', 3, 'Training completed successfully'),
(9, 'pending', 'in_progress', 1, 'Network diagnostics in progress'),
(9, 'in_progress', 'resolved', 1, 'New router installed and tested');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, grievance_id, is_read) VALUES
(2, 'Grievance Status Update', 'Your grievance "Email System Down" is now in progress.', 'info', 1, TRUE),
(2, 'Grievance Resolved', 'Your grievance "Internet Connectivity" has been resolved.', 'success', 9, FALSE),
(4, 'Grievance Status Update', 'Your grievance "Parking Space Assignment" has been resolved.', 'success', 4, TRUE),
(4, 'New Comment', 'A new comment has been added to your grievance "Payroll Discrepancy".', 'info', 2, FALSE),
(1, 'New Grievance Assigned', 'A new urgent grievance has been assigned to you.', 'warning', 1, TRUE),
(3, 'New Grievance Assigned', 'A new high priority grievance has been assigned to you.', 'warning', 2, FALSE);
