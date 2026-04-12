<?php
// Enable all error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>PHP Error Check</h1>";

// Check if error log exists
$errorLogPath = __DIR__ . '/logs/php-errors.log';
if (file_exists($errorLogPath)) {
    echo "<h2>Recent PHP Errors:</h2>";
    $errors = file_get_contents($errorLogPath);
    if (empty(trim($errors))) {
        echo "<p style='color: green;'>No errors in log file</p>";
    } else {
        // Get last 50 lines
        $lines = explode("\n", $errors);
        $recentLines = array_slice($lines, -50);
        echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
        echo htmlspecialchars(implode("\n", $recentLines));
        echo "</pre>";
    }
} else {
    echo "<p style='color: orange;'>Error log file not found at: $errorLogPath</p>";
}

// Test API directly
echo "<h2>Direct API Test:</h2>";
ob_start();
include __DIR__ . '/api/get-wcag-guidelines.php';
$apiOutput = ob_get_clean();

echo "<h3>API Output:</h3>";
echo "<pre style='background: #f5f5f5; padding: 10px; border: 1px solid #ddd;'>";
echo htmlspecialchars(substr($apiOutput, 0, 1000));
echo "</pre>";

// Check if it's valid JSON
$jsonData = json_decode($apiOutput, true);
if ($jsonData) {
    echo "<p style='color: green;'>✓ Valid JSON</p>";
    echo "<p><strong>Success:</strong> " . ($jsonData['success'] ? 'true' : 'false') . "</p>";
    echo "<p><strong>Count:</strong> " . ($jsonData['count'] ?? 'N/A') . "</p>";
} else {
    echo "<p style='color: red;'>✗ Invalid JSON</p>";
    echo "<p><strong>JSON Error:</strong> " . json_last_error_msg() . "</p>";
}
