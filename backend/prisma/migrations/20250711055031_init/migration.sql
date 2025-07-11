-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `role` ENUM('admin', 'user', 'staff') NOT NULL DEFAULT 'user',
    `phone` VARCHAR(20) NULL,
    `department` VARCHAR(100) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_username_idx`(`username`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grievance_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grievances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `assigned_to` INTEGER NULL,
    `priority` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
    `status` ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected') NOT NULL DEFAULT 'pending',
    `submission_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `due_date` DATETIME(3) NULL,
    `resolution_date` DATETIME(3) NULL,
    `resolution_notes` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `grievances_status_idx`(`status`),
    INDEX `grievances_priority_idx`(`priority`),
    INDEX `grievances_user_id_idx`(`user_id`),
    INDEX `grievances_assigned_to_idx`(`assigned_to`),
    INDEX `grievances_category_id_idx`(`category_id`),
    INDEX `grievances_submission_date_idx`(`submission_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grievance_attachments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grievance_id` INTEGER NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `file_size` INTEGER NULL,
    `file_type` VARCHAR(100) NULL,
    `uploaded_by` INTEGER NOT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `grievance_attachments_grievance_id_idx`(`grievance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grievance_comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grievance_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `is_internal` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `grievance_comments_grievance_id_idx`(`grievance_id`),
    INDEX `grievance_comments_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grievance_status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grievance_id` INTEGER NOT NULL,
    `old_status` ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected') NULL,
    `new_status` ENUM('pending', 'in_progress', 'resolved', 'closed', 'rejected') NOT NULL,
    `changed_by` INTEGER NOT NULL,
    `change_reason` TEXT NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `grievance_status_history_grievance_id_idx`(`grievance_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('info', 'warning', 'error', 'success') NOT NULL DEFAULT 'info',
    `grievance_id` INTEGER NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `notifications_user_id_idx`(`user_id`),
    INDEX `notifications_is_read_idx`(`is_read`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `grievances` ADD CONSTRAINT `grievances_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `grievance_categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievances` ADD CONSTRAINT `grievances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievances` ADD CONSTRAINT `grievances_assigned_to_fkey` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_attachments` ADD CONSTRAINT `grievance_attachments_grievance_id_fkey` FOREIGN KEY (`grievance_id`) REFERENCES `grievances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_attachments` ADD CONSTRAINT `grievance_attachments_uploaded_by_fkey` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_comments` ADD CONSTRAINT `grievance_comments_grievance_id_fkey` FOREIGN KEY (`grievance_id`) REFERENCES `grievances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_comments` ADD CONSTRAINT `grievance_comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_status_history` ADD CONSTRAINT `grievance_status_history_grievance_id_fkey` FOREIGN KEY (`grievance_id`) REFERENCES `grievances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grievance_status_history` ADD CONSTRAINT `grievance_status_history_changed_by_fkey` FOREIGN KEY (`changed_by`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_grievance_id_fkey` FOREIGN KEY (`grievance_id`) REFERENCES `grievances`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
