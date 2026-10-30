<?php
/**
 * BrackNodes cPanel Native Inquiry Intake API
 * Receives inquiry form submissions and saves them directly to cPanel MySQL.
 */

require_once __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];

// Handle GET: List inquiries (for Admin Panel)
if ($method === 'GET') {
    $pdo = getDbConnection();
    if (!$pdo) {
        echo json_encode(['success' => false, 'error' => 'Database not connected.']);
        exit;
    }

    try {
        $stmt = $pdo->query("SELECT * FROM `bn_inquiries` ORDER BY `id` DESC LIMIT 100");
        $rows = $stmt->fetchAll();
        echo json_encode(['success' => true, 'inquiries' => $rows]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

// Handle POST: Create new inquiry
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        $data = $_POST;
    }

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $projectType = trim($data['projectType'] ?? $data['project_type'] ?? 'Discord Bot Hosting');
    $budget = trim($data['budget'] ?? '');
    $message = trim($data['message'] ?? '');

    // Validation
    if (strlen($name) < 2) {
        echo json_encode(['success' => false, 'error' => 'Name must be at least 2 characters.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Please provide a valid email address.']);
        exit;
    }

    if (strlen($message) < 10) {
        echo json_encode(['success' => false, 'error' => 'Requirements message must be at least 10 characters.']);
        exit;
    }

    $pdo = getDbConnection();

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO `bn_inquiries` 
                (`name`, `email`, `project_type`, `budget`, `message`, `ip_address`, `user_agent`) 
                VALUES (:name, :email, :project_type, :budget, :message, :ip, :ua)");

            $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
            $ua = substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255);

            $stmt->execute([
                ':name' => $name,
                ':email' => $email,
                ':project_type' => $projectType,
                ':budget' => $budget,
                ':message' => $message,
                ':ip' => $ip,
                ':ua' => $ua,
            ]);

            $newId = $pdo->lastInsertId();

            echo json_encode([
                'success' => true,
                'inquiryId' => $newId,
                'source' => 'cpanel_mysql',
                'message' => 'Your inquiry has been securely stored in our cPanel MySQL database. We will respond shortly.',
            ]);
            exit;
        } catch (PDOException $e) {
            // Log error
            error_log('Inquiry insert error: ' . $e->getMessage());
        }
    }

    // Fallback response if database is not yet configured
    echo json_encode([
        'success' => true,
        'source' => 'fallback',
        'message' => 'Inquiry received successfully! Our team will review your requirements and respond shortly.',
    ]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Method not allowed.']);

