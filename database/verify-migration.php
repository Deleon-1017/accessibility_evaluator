<?php
/**
 * Verify WCAG Data Migration
 * 
 * This script verifies that the migration was successful by checking
 * the data in all tables.
 */

echo "=================================================================\n";
echo "WCAG Data Migration Verification\n";
echo "=================================================================\n\n";

// Get database connection
$config = require __DIR__ . '/../config/db-config.php';
$dbConfig = $config['default'];

$conn = new mysqli(
    $dbConfig['host'],
    $dbConfig['username'],
    $dbConfig['password'],
    $dbConfig['database'],
    $dbConfig['port']
);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error . "\n");
}

// Check criteria count
echo "1. WCAG Criteria Count:\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_criteria");
$row = $result->fetch_assoc();
echo "   Total criteria: " . $row['count'] . "\n\n";

// Check by principle
echo "2. Criteria by Principle:\n";
$result = $conn->query("SELECT principle, COUNT(*) as count FROM wcag_criteria GROUP BY principle ORDER BY principle");
while ($row = $result->fetch_assoc()) {
    echo "   " . $row['principle'] . ": " . $row['count'] . "\n";
}
echo "\n";

// Check by level
echo "3. Criteria by Level:\n";
$result = $conn->query("SELECT level, COUNT(*) as count FROM wcag_criteria GROUP BY level ORDER BY level");
while ($row = $result->fetch_assoc()) {
    echo "   Level " . $row['level'] . ": " . $row['count'] . "\n";
}
echo "\n";

// Check techniques
echo "4. Techniques:\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_techniques");
$row = $result->fetch_assoc();
echo "   Total techniques: " . $row['count'] . "\n\n";

// Check examples
echo "5. Examples:\n";
$result = $conn->query("SELECT state, COUNT(*) as count FROM wcag_examples GROUP BY state");
while ($row = $result->fetch_assoc()) {
    echo "   " . ucfirst($row['state']) . " examples: " . $row['count'] . "\n";
}
echo "\n";

// Check user groups
echo "6. User Groups:\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_user_groups");
$row = $result->fetch_assoc();
echo "   Total user group entries: " . $row['count'] . "\n\n";

// Check key summaries
echo "7. Key Summaries:\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_key_summaries");
$row = $result->fetch_assoc();
echo "   Total key summary entries: " . $row['count'] . "\n\n";

// Check interactive config
echo "8. Interactive Configuration:\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_interactive_config");
$row = $result->fetch_assoc();
echo "   Total interactive configs: " . $row['count'] . "\n";
$result = $conn->query("SELECT COUNT(*) as count FROM wcag_interactive_config WHERE enabled = 1");
$row = $result->fetch_assoc();
echo "   Enabled interactive examples: " . $row['count'] . "\n\n";

// Sample data check
echo "9. Sample Criterion (1.1.1):\n";
$result = $conn->query("
    SELECT 
        c.id,
        c.title,
        c.principle,
        c.level,
        COUNT(DISTINCT t.id) as techniques,
        COUNT(DISTINCT e.id) as examples,
        COUNT(DISTINCT u.id) as user_groups,
        COUNT(DISTINCT k.id) as summaries
    FROM wcag_criteria c
    LEFT JOIN wcag_techniques t ON c.id = t.criterion_id
    LEFT JOIN wcag_examples e ON c.id = e.criterion_id
    LEFT JOIN wcag_user_groups u ON c.id = u.criterion_id
    LEFT JOIN wcag_key_summaries k ON c.id = k.criterion_id
    WHERE c.id = '1.1.1'
    GROUP BY c.id
");

if ($row = $result->fetch_assoc()) {
    echo "   ID: " . $row['id'] . "\n";
    echo "   Title: " . $row['title'] . "\n";
    echo "   Principle: " . $row['principle'] . "\n";
    echo "   Level: " . $row['level'] . "\n";
    echo "   Techniques: " . $row['techniques'] . "\n";
    echo "   Examples: " . $row['examples'] . "\n";
    echo "   User Groups: " . $row['user_groups'] . "\n";
    echo "   Key Summaries: " . $row['summaries'] . "\n";
}

echo "\n=================================================================\n";
echo "Verification Complete!\n";
echo "=================================================================\n";

$conn->close();
