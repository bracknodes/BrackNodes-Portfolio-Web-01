<?php
/**
 * BrackNodes Native cPanel MySQL Database Configuration
 * No external SaaS or third-party service required.
 * 100% self-hosted on your own cPanel / Web Hosting server.
 */

// Allow cross-origin requests from the frontend domain
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ─────────────────────────────────────────────────────────────────────────────
// CPANEL MYSQL CREDENTIALS
// Fill in your cPanel database details below or configure via Admin Panel.
// In cPanel: MySQL Databases > Create Database > Create User > Add User to DB
// ─────────────────────────────────────────────────────────────────────────────

define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'bracknodes_db');      // e.g. cpaneluser_bracknodes
define('DB_USER', 'bracknodes_user');    // e.g. cpaneluser_dbuser
define('DB_PASS', 'ChangeThisPassword'); // Your cPanel MySQL User Password

// Secret token for admin API operations (change this to your own private key)
define('API_SECRET_KEY', 'bn_sec_' . md5(DB_NAME . 'bracknodes_secret_salt'));

/**
 * Returns a configured PDO database connection instance.
 */
function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    try {
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

