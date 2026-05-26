<?php
/**
 * Update WCAG 2.1.2 inaccessible example CSS width
 */
$config = require __DIR__ . '/../../config/db-config.php';
$dbConfig = $config['default'];

$conn = new mysqli($dbConfig['host'], $dbConfig['username'], $dbConfig['password'], $dbConfig['database'], $dbConfig['port']);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$criterionId = '2.1.2';

// Fetch current CSS
$stmt = $conn->prepare("SELECT css_code FROM wcag_examples WHERE criterion_id = ? AND state = 'before'");
$stmt->bind_param("s", $criterionId);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();
$css = $row['css_code'];

// Replace width: 100% with width: 250px for .form-group input
// Using a slightly more robust replacement
$newCss = preg_replace('/(\.form-group\s+input\s*\{[^}]*?width:\s*)100%/', '$1250px', $css);

if ($newCss !== $css) {
    $updateStmt = $conn->prepare("UPDATE wcag_examples SET css_code = ? WHERE criterion_id = ? AND state = 'before'");
    $updateStmt->bind_param("ss", $newCss, $criterionId);
    $updateStmt->execute();
    echo "Updated CSS width for WCAG 2.1.2 inaccessible example in database.\n";
} else {
    echo "CSS width already updated or pattern not found in database.\n";
}

$conn->close();
