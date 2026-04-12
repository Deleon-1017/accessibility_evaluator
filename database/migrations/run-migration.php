<?php
/**
 * Migration Runner Script
 * 
 * Executes SQL migration files to create database tables.
 * 
 * Usage: php database/migrations/run-migration.php <migration-file>
 */

// Check if migration file is provided
if ($argc < 2) {
    echo "Usage: php run-migration.php <migration-file>\n";
    echo "Example: php run-migration.php 001_create_wcag_criteria_table.sql\n";
    exit(1);
}

$migrationFile = $argv[1];
$migrationPath = __DIR__ . '/' . $migrationFile;

// Check if migration file exists
if (!file_exists($migrationPath)) {
    echo "Error: Migration file not found: $migrationPath\n";
    exit(1);
}

// Load database configuration
require_once __DIR__ . '/../../config/database.php';

echo "=============================================================\n";
echo "Running Migration: $migrationFile\n";
echo "=============================================================\n\n";

try {
    // Get database connection
    $pdo = Database::getWriteConnection();
    
    // Read SQL file
    $sql = file_get_contents($migrationPath);
    
    // Remove comments and split into statements
    $statements = [];
    $lines = explode("\n", $sql);
    $currentStatement = '';
    
    foreach ($lines as $line) {
        $line = trim($line);
        
        // Skip empty lines and comments
        if (empty($line) || strpos($line, '--') === 0) {
            continue;
        }
        
        $currentStatement .= $line . ' ';
        
        // Check if statement is complete (ends with semicolon)
        if (substr(rtrim($line), -1) === ';') {
            $statements[] = trim($currentStatement);
            $currentStatement = '';
        }
    }
    
    // Execute each statement
    $successCount = 0;
    $errorCount = 0;
    
    foreach ($statements as $statement) {
        if (empty($statement)) {
            continue;
        }
        
        try {
            $pdo->exec($statement);
            $successCount++;
            
            // Extract statement type for logging
            $statementType = strtoupper(explode(' ', trim($statement))[0]);
            echo "✓ Executed: $statementType statement\n";
            
        } catch (PDOException $e) {
            $errorCount++;
            echo "✗ Error executing statement: " . $e->getMessage() . "\n";
            echo "  Statement: " . substr($statement, 0, 100) . "...\n";
        }
    }
    
    echo "\n=============================================================\n";
    echo "Migration Summary\n";
    echo "=============================================================\n";
    echo "Successful statements: $successCount\n";
    echo "Failed statements: $errorCount\n";
    
    if ($errorCount === 0) {
        echo "\n✓ Migration completed successfully!\n";
        exit(0);
    } else {
        echo "\n✗ Migration completed with errors.\n";
        exit(1);
    }
    
} catch (Exception $e) {
    echo "\n✗ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
