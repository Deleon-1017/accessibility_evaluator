# Scan Results Database Integration Guide

## Overview
This guide explains how to integrate database storage for scan results instead of JSON files.

## Benefits
- **Faster Performance**: Database queries are much faster than reading JSON files
- **Better Scalability**: Handle thousands of scans without performance degradation
- **Easy Analytics**: Query and analyze scan data efficiently
- **Automatic Cleanup**: Built-in methods to delete old scans
- **Data Integrity**: Foreign key constraints ensure data consistency

## Setup Steps

### 1. Run the Migration
```bash
cd database
mysql -u root -p wcag_db < migrations/007_create_scan_results_table.sql
```

Or use the batch file:
```bash
run-scan-migration.bat
```

### 2. Update scan.php

Replace the file storage section (around line 1720) with database storage:

```php
// OLD CODE (remove this):
// Store results in session
$_SESSION['scan_results'] = $results;

// Create reports directory if it doesn't exist
$reportsDir = __DIR__ . '/reports';
if (!is_dir($reportsDir)) {
    @mkdir($reportsDir, 0755, true);
}

// Store in file for persistence
$reportFile = $reportsDir . '/' . $results['scan_id'] . '.json';
@file_put_contents($reportFile, json_encode($results, JSON_PRETTY_PRINT));

// NEW CODE (add this):
// Include database handler
require_once __DIR__ . '/scan-results-db.php';
require_once __DIR__ . '/config/database.php';

// Save to database
try {
    $db = getDatabaseConnection();
    $scanDB = new ScanResultsDB($db);
    $scanDB->saveScanResults($results);
    
    // Store in session for immediate access
    $_SESSION['scan_results'] = $results;
} catch (Exception $e) {
    error_log("Failed to save scan to database: " . $e->getMessage());
    // Fallback to JSON file if database fails
    $reportsDir = __DIR__ . '/reports';
    if (!is_dir($reportsDir)) {
        @mkdir($reportsDir, 0755, true);
    }
    $reportFile = $reportsDir . '/' . $results['scan_id'] . '.json';
    @file_put_contents($reportFile, json_encode($results, JSON_PRETTY_PRINT));
}
```

### 3. Update results.php

Replace the file loading section (around line 15) with database loading:

```php
// OLD CODE (remove this):
$scanId = sanitizeInput($_GET['scan_id'] ?? '');
if ($scanId !== '' && preg_match('/^[a-zA-Z0-9._-]+$/', $scanId)) {
    $reportFile = __DIR__ . '/reports/' . $scanId . '.json';
    if (is_file($reportFile)) {
        $reportJson = file_get_contents($reportFile);
        $decoded = json_decode($reportJson, true);
        if (is_array($decoded)) {
            $results = $decoded;
            $_SESSION['scan_results'] = $results;
        }
    }
}

// NEW CODE (add this):
require_once __DIR__ . '/scan-results-db.php';
require_once __DIR__ . '/config/database.php';

$scanId = sanitizeInput($_GET['scan_id'] ?? '');
if ($scanId !== '' && preg_match('/^[a-zA-Z0-9._-]+$/', $scanId)) {
    try {
        $db = getDatabaseConnection();
        $scanDB = new ScanResultsDB($db);
        $results = $scanDB->getScanResults($scanId);
        
        if ($results) {
            $_SESSION['scan_results'] = $results;
        }
    } catch (Exception $e) {
        error_log("Failed to load scan from database: " . $e->getMessage());
        // Fallback to JSON file
        $reportFile = __DIR__ . '/reports/' . $scanId . '.json';
        if (is_file($reportFile)) {
            $reportJson = file_get_contents($reportFile);
            $decoded = json_decode($reportJson, true);
            if (is_array($decoded)) {
                $results = $decoded;
                $_SESSION['scan_results'] = $results;
            }
        }
    }
}
```

## Database Schema

### scan_results table
- Stores scan metadata and summary statistics
- Indexed on scan_id, timestamp, and scan_type for fast queries

### scan_issues table
- Stores individual accessibility issues
- Foreign key relationship with scan_results
- Cascade delete ensures cleanup

## API Methods

### ScanResultsDB Class

```php
// Save scan results
$scanDB->saveScanResults($results);

// Get scan by ID
$results = $scanDB->getScanResults($scanId);

// Get recent scans (with pagination)
$recentScans = $scanDB->getRecentScans($limit = 20, $offset = 0);

// Delete old scans (older than 30 days)
$deleted = $scanDB->deleteOldScans($daysOld = 30);

// Get statistics
$stats = $scanDB->getStatistics();
```

## Migration from JSON Files

To migrate existing JSON scan results to the database:

```php
<?php
require_once 'scan-results-db.php';
require_once 'config/database.php';

$db = getDatabaseConnection();
$scanDB = new ScanResultsDB($db);

$reportsDir = __DIR__ . '/reports';
$files = glob($reportsDir . '/*.json');

foreach ($files as $file) {
    $json = file_get_contents($file);
    $results = json_decode($json, true);
    
    if ($results) {
        $scanDB->saveScanResults($results);
        echo "Migrated: " . basename($file) . "\n";
    }
}

echo "Migration complete!\n";
?>
```

## Cleanup Task

Add a cron job or scheduled task to clean up old scans:

```php
<?php
// cleanup-old-scans.php
require_once 'scan-results-db.php';
require_once 'config/database.php';

$db = getDatabaseConnection();
$scanDB = new ScanResultsDB($db);

// Delete scans older than 30 days
$deleted = $scanDB->deleteOldScans(30);
echo "Deleted $deleted old scans\n";
?>
```

## Performance Comparison

### JSON Files
- Read time: ~50-200ms per file
- Search: Must read all files
- Memory: Loads entire file into memory

### Database
- Read time: ~5-20ms per query
- Search: Indexed queries in milliseconds
- Memory: Only loads requested data

## Troubleshooting

### Connection Issues
Check your database credentials in `config/database.php`

### Migration Errors
Ensure you have proper MySQL permissions:
```sql
GRANT ALL PRIVILEGES ON wcag_db.* TO 'wcag_user'@'localhost';
FLUSH PRIVILEGES;
```

### Fallback Behavior
The code includes fallback to JSON files if database operations fail, ensuring reliability.
