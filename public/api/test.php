<?php
/**
 * BrackNodes cPanel Database Connection Tester
 * Returns JSON status indicating if MySQL is connected or needs configuration.
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$pdo = getDbConnection();

if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT VERSION() as version, DATABASE() as dbname");
        $info = $stmt->fetch();
        
        // Check if tables are installed
        $tablesStmt = $pdo->query("SHOW TABLES LIKE 'bn_%'");
        $tables = $tablesStmt->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            'success' => true,
            'status' => 'connected',
            'message' => 'Successfully connected to cPanel MySQL Database!',
            'database' => $info['dbname'] ?? DB_NAME,
            'mysql_version' => $info['version'] ?? 'Unknown',
            'tables_installed' => count($tables) > 0,
            'tables' => $tables,
            'server_time' => date('Y-m-d H:i:s'),
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'status' => 'query_failed',
            'message' => 'Connected to MySQL but query failed: ' . $e->getMessage(),
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'status' => 'not_configured',
        'message' => 'Could not connect to MySQL. Please update DB_NAME, DB_USER, and DB_PASS in public/api/config.php with your cPanel database details.',
        'help' => 'cPanel > MySQL Databases > Create Database & User > Assign all privileges to User.',
    ]);
}

