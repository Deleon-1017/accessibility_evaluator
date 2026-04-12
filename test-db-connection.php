<?php
/**
 * Test Database Connection and Scan Results Storage
 * Run this file to verify the database setup is working
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h2>Database Connection Test</h2>";

// Test 1: Check if config file exists
echo "<h3>1. Checking config files...</h3>";
if (file_exists(__DIR__ . '/config/database.php')) {
    echo "✓ config/database.php exists<br>";
    require_once __DIR__ . '/config/database.php';
} else {
    echo "✗ config/database.php NOT FOUND<br>";
    echo "Please create config/database.php with database connection settings<br>";
    exit;
}

// Test 2: Check database connection
echo "<h3>2. Testing database connection...</h3>";
try {
    $db = getDatabaseConnection();
    echo "✓ Database connection successful<br>";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "<br>";
    exit;
}

// Test 3: Check if tables exist
echo "<h3>3. Checking database tables...</h3>";
try {
    $stmt = $db->query("SHOW TABLES LIKE 'scan_results'");
    if ($stmt->rowCount() > 0) {
        echo "✓ scan_results table exists<br>";
    } else {
        echo "✗ scan_results table NOT FOUND<br>";
        echo "Please run: database/run-scan-migration.bat<br>";
        exit;
    }
    
    $stmt = $db->query("SHOW TABLES LIKE 'scan_issues'");
    if ($stmt->rowCount() > 0) {
        echo "✓ scan_issues table exists<br>";
    } else {
        echo "✗ scan_issues table NOT FOUND<br>";
        echo "Please run: database/run-scan-migration.bat<br>";
        exit;
    }
} catch (Exception $e) {
    echo "✗ Error checking tables: " . $e->getMessage() . "<br>";
    exit;
}

// Test 4: Check ScanResultsDB class
echo "<h3>4. Testing ScanResultsDB class...</h3>";
if (file_exists(__DIR__ . '/scan-results-db.php')) {
    echo "✓ scan-results-db.php exists<br>";
    require_once __DIR__ . '/scan-results-db.php';
    
    try {
        $scanDB = new ScanResultsDB($db);
        echo "✓ ScanResultsDB class instantiated<br>";
    } catch (Exception $e) {
        echo "✗ Error creating ScanResultsDB: " . $e->getMessage() . "<br>";
        exit;
    }
} else {
    echo "✗ scan-results-db.php NOT FOUND<br>";
    exit;
}

// Test 5: Test saving and retrieving a sample scan
echo "<h3>5. Testing save and retrieve operations...</h3>";
try {
    $testScan = [
        'scan_id' => 'test_' . uniqid(),
        'scan_type' => 'html',
        'source_url' => '',
        'html_content' => '<html><body><h1>Test</h1></body></html>',
        'timestamp' => date('Y-m-d H:i:s'),
        'issues' => [
            [
                'code' => '1.1.1',
                'principle' => 'Perceivable',
                'type' => 'error',
                'title' => 'Test Issue',
                'description' => 'This is a test issue',
                'element' => '<img src="test.jpg">',
                'selector' => 'img',
                'recommendation' => 'Add alt text',
                'severity' => 'high',
                'line' => 10,
                'context' => 'Test context'
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
    
    // Save test scan
    if ($scanDB->saveScanResults($testScan)) {
        echo "✓ Test scan saved successfully<br>";
    } else {
        echo "✗ Failed to save test scan<br>";
        exit;
    }
    
    // Retrieve test scan
    $retrieved = $scanDB->getScanResults($testScan['scan_id']);
    if ($retrieved && $retrieved['scan_id'] === $testScan['scan_id']) {
        echo "✓ Test scan retrieved successfully<br>";
        echo "  - Scan ID: " . $retrieved['scan_id'] . "<br>";
        echo "  - Total Issues: " . $retrieved['summary']['total_issues'] . "<br>";
    } else {
        echo "✗ Failed to retrieve test scan<br>";
        exit;
    }
    
    // Clean up test scan
    $db->prepare("DELETE FROM scan_results WHERE scan_id = ?")->execute([$testScan['scan_id']]);
    echo "✓ Test scan cleaned up<br>";
    
} catch (Exception $e) {
    echo "✗ Error during save/retrieve test: " . $e->getMessage() . "<br>";
    exit;
}

// Test 6: Check existing scans
echo "<h3>6. Checking existing scans...</h3>";
try {
    $recentScans = $scanDB->getRecentScans(5);
    echo "✓ Found " . count($recentScans) . " recent scans in database<br>";
    
    if (count($recentScans) > 0) {
        echo "<ul>";
        foreach ($recentScans as $scan) {
            echo "<li>" . htmlspecialchars($scan['scan_id']) . " - " . 
                 htmlspecialchars($scan['timestamp']) . " - " . 
                 $scan['total_issues'] . " issues</li>";
        }
        echo "</ul>";
    }
} catch (Exception $e) {
    echo "✗ Error getting recent scans: " . $e->getMessage() . "<br>";
}

// Test 7: Get statistics
echo "<h3>7. Database statistics...</h3>";
try {
    $stats = $scanDB->getStatistics();
    if ($stats) {
        echo "✓ Statistics retrieved:<br>";
        echo "  - Total scans: " . $stats['total_scans'] . "<br>";
        echo "  - Average score: " . round($stats['avg_score'], 2) . "<br>";
        echo "  - Total issues: " . $stats['total_issues'] . "<br>";
        echo "  - Total errors: " . $stats['total_errors'] . "<br>";
        echo "  - Total warnings: " . $stats['total_warnings'] . "<br>";
    }
} catch (Exception $e) {
    echo "✗ Error getting statistics: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<h2 style='color: green;'>✓ All tests passed! Database is ready to use.</h2>";
echo "<p>You can now run scans and they will be stored in the database.</p>";
echo "<p>New scans will be saved to the database instead of JSON files.</p>";
?>
