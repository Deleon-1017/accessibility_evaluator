<?php
/**
 * Migrate Existing JSON Scan Results to Database
 * This script imports all JSON files from reports/ folder into the database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(300); // 5 minutes

echo "<h2>JSON to Database Migration</h2>";

// Load dependencies
require_once __DIR__ . '/scan-results-db.php';
require_once __DIR__ . '/config/database.php';

try {
    $db = getDatabaseConnection();
    $scanDB = new ScanResultsDB($db);
    echo "✓ Database connection established<br><br>";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "<br>";
    exit;
}

// Get all JSON files
$reportsDir = __DIR__ . '/reports';
if (!is_dir($reportsDir)) {
    echo "✗ Reports directory not found: $reportsDir<br>";
    exit;
}

$files = glob($reportsDir . '/*.json');
$totalFiles = count($files);

if ($totalFiles === 0) {
    echo "No JSON files found in reports/ directory.<br>";
    exit;
}

echo "<h3>Found $totalFiles JSON file(s) to migrate</h3>";
echo "<hr>";

$migrated = 0;
$skipped = 0;
$errors = 0;

foreach ($files as $file) {
    $filename = basename($file);
    echo "Processing: $filename ... ";
    
    try {
        // Read JSON file
        $json = file_get_contents($file);
        $results = json_decode($json, true);
        
        if (!$results || !is_array($results)) {
            echo "<span style='color: orange;'>SKIPPED (invalid JSON)</span><br>";
            $skipped++;
            continue;
        }
        
        // Check if already exists in database
        $existing = $scanDB->getScanResults($results['scan_id']);
        if ($existing) {
            echo "<span style='color: gray;'>SKIPPED (already in database)</span><br>";
            $skipped++;
            continue;
        }
        
        // Save to database
        if ($scanDB->saveScanResults($results)) {
            echo "<span style='color: green;'>✓ MIGRATED</span><br>";
            $migrated++;
        } else {
            echo "<span style='color: red;'>✗ FAILED</span><br>";
            $errors++;
        }
        
    } catch (Exception $e) {
        echo "<span style='color: red;'>✗ ERROR: " . $e->getMessage() . "</span><br>";
        $errors++;
    }
}

echo "<hr>";
echo "<h3>Migration Summary</h3>";
echo "<ul>";
echo "<li><strong>Total files:</strong> $totalFiles</li>";
echo "<li style='color: green;'><strong>Migrated:</strong> $migrated</li>";
echo "<li style='color: gray;'><strong>Skipped:</strong> $skipped</li>";
echo "<li style='color: red;'><strong>Errors:</strong> $errors</li>";
echo "</ul>";

if ($migrated > 0) {
    echo "<p style='color: green;'><strong>✓ Migration completed successfully!</strong></p>";
    echo "<p>You can now safely delete the JSON files in the reports/ folder if you want to save disk space.</p>";
    echo "<p><em>Note: The system will still fall back to JSON files if database is unavailable.</em></p>";
} else {
    echo "<p>No new scans were migrated.</p>";
}

// Show database statistics
try {
    $stats = $scanDB->getStatistics();
    if ($stats) {
        echo "<hr>";
        echo "<h3>Database Statistics</h3>";
        echo "<ul>";
        echo "<li><strong>Total scans in database:</strong> " . $stats['total_scans'] . "</li>";
        echo "<li><strong>Average accessibility score:</strong> " . round($stats['avg_score'], 2) . "</li>";
        echo "<li><strong>Total issues found:</strong> " . $stats['total_issues'] . "</li>";
        echo "</ul>";
    }
} catch (Exception $e) {
    // Ignore statistics errors
}
?>
