<?php
/**
 * Debug Script - Check why scans aren't saving to database
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Scan Database Debug</h2>";
echo "<pre>";

// Step 1: Check if migration was run
echo "=== Step 1: Checking Database Tables ===\n";
try {
    require_once __DIR__ . '/config/database.php';
    $db = getDatabaseConnection();
    echo "✓ Database connection successful\n\n";
    
    // Check if tables exist
    $stmt = $db->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "Tables in database:\n";
    foreach ($tables as $table) {
        echo "  - $table\n";
    }
    
    $hasScanResults = in_array('scan_results', $tables);
    $hasScanIssues = in_array('scan_issues', $tables);
    
    echo "\n";
    if ($hasScanResults) {
        echo "✓ scan_results table exists\n";
    } else {
        echo "✗ scan_results table MISSING - Run migration!\n";
        echo "  Command: cd database && mysql -u root -p wcag_db < migrations/007_create_scan_results_table.sql\n";
    }
    
    if ($hasScanIssues) {
        echo "✓ scan_issues table exists\n";
    } else {
        echo "✗ scan_issues table MISSING - Run migration!\n";
    }
    
    if (!$hasScanResults || !$hasScanIssues) {
        echo "\n❌ MIGRATION NOT RUN - Please run the migration first!\n";
        exit;
    }
    
} catch (Exception $e) {
    echo "✗ Database error: " . $e->getMessage() . "\n";
    echo "\nCheck your database configuration in config/database.php\n";
    exit;
}

// Step 2: Check scan-results-db.php
echo "\n=== Step 2: Checking ScanResultsDB Class ===\n";
if (!file_exists(__DIR__ . '/scan-results-db.php')) {
    echo "✗ scan-results-db.php NOT FOUND\n";
    exit;
}
echo "✓ scan-results-db.php exists\n";

require_once __DIR__ . '/scan-results-db.php';
try {
    $scanDB = new ScanResultsDB($db);
    echo "✓ ScanResultsDB class loaded\n";
} catch (Exception $e) {
    echo "✗ Error loading ScanResultsDB: " . $e->getMessage() . "\n";
    exit;
}

// Step 3: Test saving a scan
echo "\n=== Step 3: Testing Save Operation ===\n";
$testScan = [
    'scan_id' => 'debug_test_' . time(),
    'scan_type' => 'html',
    'source_url' => '',
    'html_content' => '<html><body><h1>Debug Test</h1></body></html>',
    'timestamp' => date('Y-m-d H:i:s'),
    'issues' => [
        [
            'code' => '1.1.1',
            'principle' => 'Perceivable',
            'type' => 'error',
            'title' => 'Debug Test Issue',
            'description' => 'This is a debug test',
            'element' => '<img src="test.jpg">',
            'selector' => 'img',
            'recommendation' => 'Add alt text',
            'severity' => 'high',
            'line' => 1,
            'context' => 'Debug context'
        ]
    ],
    'summary' => [
        'total_issues' => 1,
        'error_count' => 1,
        'warning_count' => 0,
        'info_count' => 0,
        'principles' => [
            'Perceivable' => 1,
            'Operable' => 0,
            'Understandable' => 0,
            'Robust' => 0
        ]
    ]
];

try {
    $result = $scanDB->saveScanResults($testScan);
    if ($result) {
        echo "✓ Test scan saved successfully!\n";
        echo "  Scan ID: " . $testScan['scan_id'] . "\n";
        
        // Try to retrieve it
        $retrieved = $scanDB->getScanResults($testScan['scan_id']);
        if ($retrieved) {
            echo "✓ Test scan retrieved successfully!\n";
            echo "  Issues count: " . count($retrieved['issues']) . "\n";
            
            // Clean up
            $db->prepare("DELETE FROM scan_results WHERE scan_id = ?")->execute([$testScan['scan_id']]);
            echo "✓ Test scan cleaned up\n";
        } else {
            echo "✗ Failed to retrieve test scan\n";
        }
    } else {
        echo "✗ Failed to save test scan\n";
    }
} catch (Exception $e) {
    echo "✗ Error during save test: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

// Step 4: Check recent scans
echo "\n=== Step 4: Checking Existing Scans ===\n";
try {
    $stmt = $db->query("SELECT COUNT(*) as count FROM scan_results");
    $count = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total scans in database: " . $count['count'] . "\n";
    
    if ($count['count'] > 0) {
        $stmt = $db->query("SELECT scan_id, timestamp, total_issues FROM scan_results ORDER BY timestamp DESC LIMIT 5");
        $recent = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "\nRecent scans:\n";
        foreach ($recent as $scan) {
            echo "  - " . $scan['scan_id'] . " (" . $scan['timestamp'] . ") - " . $scan['total_issues'] . " issues\n";
        }
    }
} catch (Exception $e) {
    echo "Error checking scans: " . $e->getMessage() . "\n";
}

// Step 5: Check scan.php integration
echo "\n=== Step 5: Checking scan.php Integration ===\n";
$scanPhpContent = file_get_contents(__DIR__ . '/scan.php');

if (strpos($scanPhpContent, 'scan-results-db.php') !== false) {
    echo "✓ scan.php includes scan-results-db.php\n";
} else {
    echo "✗ scan.php does NOT include scan-results-db.php\n";
}

if (strpos($scanPhpContent, 'saveScanResults') !== false) {
    echo "✓ scan.php calls saveScanResults()\n";
} else {
    echo "✗ scan.php does NOT call saveScanResults()\n";
}

if (strpos($scanPhpContent, 'getDatabaseConnection') !== false) {
    echo "✓ scan.php calls getDatabaseConnection()\n";
} else {
    echo "✗ scan.php does NOT call getDatabaseConnection()\n";
}

// Step 6: Check PHP error log
echo "\n=== Step 6: Checking Recent PHP Errors ===\n";
$errorLog = __DIR__ . '/logs/php-errors.log';
if (file_exists($errorLog)) {
    $errors = file($errorLog);
    $recentErrors = array_slice($errors, -10);
    
    if (count($recentErrors) > 0) {
        echo "Last 10 errors:\n";
        foreach ($recentErrors as $error) {
            echo "  " . trim($error) . "\n";
        }
    } else {
        echo "No recent errors\n";
    }
} else {
    echo "Error log not found\n";
}

echo "\n=== Summary ===\n";
echo "If all checks passed above, the database integration is working.\n";
echo "Try running a new scan and check if it appears in the database.\n";
echo "\nTo verify manually:\n";
echo "  mysql -u root -p wcag_db\n";
echo "  SELECT * FROM scan_results ORDER BY timestamp DESC LIMIT 5;\n";

echo "</pre>";
?>
