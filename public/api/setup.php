<?php
/**
 * BrackNodes 1-Click cPanel Database Table Installer
 * Creates the required MySQL tables with proper utf8mb4 indexes.
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if (!$pdo) {
    echo json_encode([
        'success' => false,
        'message' => 'Unable to connect to MySQL database. Please verify credentials in api/config.php first.',
    ]);
    exit;
}

try {
    // 1. Inquiries Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `bn_inquiries` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `project_type` VARCHAR(150) DEFAULT 'Discord Bot Hosting',
        `budget` VARCHAR(100) DEFAULT NULL,
        `message` TEXT NOT NULL,
        `status` ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
        `ip_address` VARCHAR(45) DEFAULT NULL,
        `user_agent` VARCHAR(255) DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX `idx_email` (`email`),
        INDEX `idx_status` (`status`),
        INDEX `idx_created` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. CMS Dynamic Content Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `bn_cms_content` (
        `setting_key` VARCHAR(100) PRIMARY KEY,
        `setting_value` LONGTEXT NOT NULL,
        `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Admin Authentication / Activity Log Table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `bn_audit_log` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `action` VARCHAR(100) NOT NULL,
        `details` TEXT DEFAULT NULL,
        `ip_address` VARCHAR(45) DEFAULT NULL,
        `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    echo json_encode([
        'success' => true,
        'message' => 'All cPanel MySQL tables created successfully! Ready for production.',
        'tables_created' => [
            'bn_inquiries' => 'Stores incoming customer inquiries and project briefs',
            'bn_cms_content' => 'Stores website settings and content backups',
            'bn_audit_log' => 'Tracks administrative activity and security events',
        ],
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Table creation failed: ' . $e->getMessage(),
    ]);
}

