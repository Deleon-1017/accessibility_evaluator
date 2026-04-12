<?php
/**
 * WCAG Data Migration Script
 * 
 * This script migrates WCAG data from wcag-data.js to the MySQL database.
 * It parses the JavaScript file, extracts the data, and inserts it into
 * the appropriate tables with proper relationships.
 * 
 * Usage: php database/migrate-wcag-data.php
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "=================================================================\n";
echo "WCAG Data Migration Script\n";
echo "=================================================================\n\n";

/**
 * Get database connection using MySQLi
 */
function getDbConnection() {
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
    
    $conn->set_charset($dbConfig['charset']);
    
    return $conn;
}

/**
 * Load WCAG data from JSON file
 * Note: You need to create wcag-data.json from wcag-data.js first
 */
function loadWcagData($filePath) {
    echo "Reading data file: $filePath\n";
    
    if (!file_exists($filePath)) {
        die("ERROR: File not found: $filePath\n\nPlease create wcag-data.json by:\n1. Opening wcag-data.js\n2. Copying the wcagGuidelines array content\n3. Saving it as valid JSON in wcag-data.json\n");
    }
    
    $content = file_get_contents($filePath);
    $data = json_decode($content, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        die("ERROR: JSON parsing failed: " . json_last_error_msg() . "\n");
    }
    
    echo "Successfully loaded " . count($data) . " WCAG criteria\n\n";
    
    return $data;
}

/**
 * Clear existing data from all tables
 */
function clearExistingData($conn) {
    echo "Clearing existing data...\n";
    
    $tables = [
        'wcag_interactive_config',
        'wcag_key_summaries',
        'wcag_user_groups',
        'wcag_examples',
        'wcag_techniques',
        'wcag_criteria'
    ];
    
    foreach ($tables as $table) {
        $sql = "DELETE FROM $table";
        if ($conn->query($sql)) {
            echo "  ✓ Cleared $table\n";
        } else {
            echo "  ✗ Error clearing $table: " . $conn->error . "\n";
        }
    }
    
    echo "\n";
}

/**
 * Insert WCAG criterion into database
 */
function insertCriterion($conn, $criterion) {
    $stmt = $conn->prepare("
        INSERT INTO wcag_criteria (id, principle, title, level, description, explanation)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->bind_param(
        "ssssss",
        $criterion['id'],
        $criterion['principle'],
        $criterion['title'],
        $criterion['level'],
        $criterion['description'],
        $criterion['explanation']
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error inserting criterion {$criterion['id']}: " . $stmt->error);
    }
    
    $stmt->close();
}

/**
 * Insert techniques for a criterion
 */
function insertTechniques($conn, $criterionId, $techniques) {
    if (empty($techniques)) {
        return;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO wcag_techniques (criterion_id, technique_code)
        VALUES (?, ?)
    ");
    
    foreach ($techniques as $techniqueCode) {
        $stmt->bind_param("ss", $criterionId, $techniqueCode);
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting technique $techniqueCode for criterion $criterionId: " . $stmt->error);
        }
    }
    
    $stmt->close();
}

/**
 * Insert examples for a criterion
 */
function insertExamples($conn, $criterionId, $examples) {
    if (empty($examples)) {
        return;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO wcag_examples (criterion_id, state, html_code, css_code, js_code, context)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    // Insert 'before' example
    if (isset($examples['before'])) {
        $state = 'before';
        $html = $examples['before']['html'] ?? null;
        $css = $examples['before']['css'] ?? null;
        $js = $examples['before']['js'] ?? null;
        $context = $examples['before']['context'] ?? null;
        
        $stmt->bind_param("ssssss", $criterionId, $state, $html, $css, $js, $context);
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting 'before' example for criterion $criterionId: " . $stmt->error);
        }
    }
    
    // Insert 'after' example
    if (isset($examples['after'])) {
        $state = 'after';
        $html = $examples['after']['html'] ?? null;
        $css = $examples['after']['css'] ?? null;
        $js = $examples['after']['js'] ?? null;
        $context = $examples['after']['context'] ?? null;
        
        $stmt->bind_param("ssssss", $criterionId, $state, $html, $css, $js, $context);
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting 'after' example for criterion $criterionId: " . $stmt->error);
        }
    }
    
    $stmt->close();
}

/**
 * Insert user groups for a criterion
 */
function insertUserGroups($conn, $criterionId, $userGroups) {
    if (empty($userGroups)) {
        return;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO wcag_user_groups (criterion_id, user_group)
        VALUES (?, ?)
    ");
    
    foreach ($userGroups as $userGroup) {
        $stmt->bind_param("ss", $criterionId, $userGroup);
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting user group '$userGroup' for criterion $criterionId: " . $stmt->error);
        }
    }
    
    $stmt->close();
}

/**
 * Insert key summaries for a criterion
 */
function insertKeySummaries($conn, $criterionId, $keySummaries) {
    if (empty($keySummaries)) {
        return;
    }
    
    $stmt = $conn->prepare("
        INSERT INTO wcag_key_summaries (criterion_id, summary_text, display_order)
        VALUES (?, ?, ?)
    ");
    
    $order = 0;
    foreach ($keySummaries as $summary) {
        $stmt->bind_param("ssi", $criterionId, $summary, $order);
        
        if (!$stmt->execute()) {
            throw new Exception("Error inserting key summary for criterion $criterionId: " . $stmt->error);
        }
        
        $order++;
    }
    
    $stmt->close();
}

/**
 * Insert interactive configuration for a criterion
 */
function insertInteractiveConfig($conn, $criterionId, $interactive) {
    if (empty($interactive)) {
        return;
    }
    
    $enabled = isset($interactive['enabled']) && $interactive['enabled'] ? 1 : 0;
    
    $stmt = $conn->prepare("
        INSERT INTO wcag_interactive_config (criterion_id, enabled)
        VALUES (?, ?)
    ");
    
    $stmt->bind_param("si", $criterionId, $enabled);
    
    if (!$stmt->execute()) {
        throw new Exception("Error inserting interactive config for criterion $criterionId: " . $stmt->error);
    }
    
    $stmt->close();
}

/**
 * Main migration function
 */
function migrateData($conn, $data) {
    echo "Starting data migration...\n\n";
    
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($data as $criterion) {
        try {
            $criterionId = $criterion['id'];
            echo "Migrating criterion $criterionId - {$criterion['title']}...\n";
            
            // Insert main criterion
            insertCriterion($conn, $criterion);
            
            // Insert techniques
            if (isset($criterion['techniques'])) {
                insertTechniques($conn, $criterionId, $criterion['techniques']);
            }
            
            // Insert examples
            if (isset($criterion['examples'])) {
                insertExamples($conn, $criterionId, $criterion['examples']);
            }
            
            // Insert user groups
            if (isset($criterion['examples']['userGroups'])) {
                insertUserGroups($conn, $criterionId, $criterion['examples']['userGroups']);
            }
            
            // Insert key summaries
            if (isset($criterion['examples']['keySummary'])) {
                insertKeySummaries($conn, $criterionId, $criterion['examples']['keySummary']);
            }
            
            // Insert interactive configuration
            if (isset($criterion['examples']['interactive'])) {
                insertInteractiveConfig($conn, $criterionId, $criterion['examples']['interactive']);
            }
            
            echo "  ✓ Successfully migrated criterion $criterionId\n\n";
            $successCount++;
            
        } catch (Exception $e) {
            echo "  ✗ Error: " . $e->getMessage() . "\n\n";
            $errorCount++;
        }
    }
    
    echo "=================================================================\n";
    echo "Migration Summary\n";
    echo "=================================================================\n";
    echo "Total criteria: " . count($data) . "\n";
    echo "Successfully migrated: $successCount\n";
    echo "Errors: $errorCount\n";
    echo "=================================================================\n";
}

// Main execution
try {
    // Connect to database
    $conn = getDbConnection();
    
    // Load WCAG data
    $jsonFilePath = __DIR__ . '/../wcag-data.json';
    $data = loadWcagData($jsonFilePath);
    
    // Clear existing data
    clearExistingData($conn);
    
    // Migrate data
    migrateData($conn, $data);
    
    // Close connection
    $conn->close();
    
    echo "\nMigration completed successfully!\n";
    
} catch (Exception $e) {
    echo "\nFATAL ERROR: " . $e->getMessage() . "\n";
    exit(1);
}
