<?php
/**
 * API: Get Accessibility Checks
 * Returns all enabled accessibility checks from the database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Configure error reporting
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../logs/php-errors.log');

try {
    // Include database configuration
    require_once __DIR__ . '/../config/database.php';
    
    // Get database connection
    $db = getDatabaseConnection();
    
    // Get optional filters from query parameters
    $principle = $_GET['principle'] ?? null;
    $enabled = isset($_GET['enabled']) ? filter_var($_GET['enabled'], FILTER_VALIDATE_BOOLEAN) : true;
    $checkKey = $_GET['check_key'] ?? null;
    
    // Build query
    $sql = "SELECT 
                id,
                check_key,
                wcag_code,
                principle,
                title,
                description,
                recommendation,
                severity,
                issue_type,
                selector,
                check_logic,
                enabled,
                priority
            FROM accessibility_checks
            WHERE 1=1";
    
    $params = [];
    
    if ($enabled !== null) {
        $sql .= " AND enabled = ?";
        $params[] = $enabled ? 1 : 0;
    }
    
    if ($principle) {
        $sql .= " AND principle = ?";
        $params[] = $principle;
    }
    
    if ($checkKey) {
        $sql .= " AND check_key = ?";
        $params[] = $checkKey;
    }
    
    $sql .= " ORDER BY priority ASC, id ASC";
    
    // Execute query
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $checks = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Convert enabled to boolean
    foreach ($checks as &$check) {
        $check['enabled'] = (bool)$check['enabled'];
        $check['id'] = (int)$check['id'];
        $check['priority'] = (int)$check['priority'];
    }
    
    // Return response
    echo json_encode([
        'success' => true,
        'count' => count($checks),
        'checks' => $checks
    ], JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    error_log("Database error in get-accessibility-checks.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error occurred',
        'message' => $e->getMessage()
    ]);
    
} catch (Exception $e) {
    error_log("Error in get-accessibility-checks.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'An error occurred',
        'message' => $e->getMessage()
    ]);
}
