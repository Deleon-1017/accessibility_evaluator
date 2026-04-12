<?php
/**
 * Create wcag_criteria Table
 * 
 * Task 1.2: Create wcag_criteria table with indexes
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7
 * 
 * Usage: php database/create-wcag-criteria-table.php
 */

require_once __DIR__ . '/../config/database.php';

echo "=============================================================\n";
echo "Task 1.2: Create wcag_criteria Table\n";
echo "=============================================================\n\n";

try {
    // Get database connection
    $pdo = Database::getWriteConnection();
    
    echo "Creating wcag_criteria table...\n";
    
    // Create wcag_criteria table
    $sql = "
    CREATE TABLE IF NOT EXISTS wcag_criteria (
        id VARCHAR(10) PRIMARY KEY COMMENT 'WCAG criterion ID (e.g., \"1.1.1\")',
        principle ENUM('Perceivable', 'Operable', 'Understandable', 'Robust') NOT NULL COMMENT 'WCAG principle category',
        title VARCHAR(255) NOT NULL COMMENT 'Criterion title',
        level ENUM('A', 'AA', 'AAA') NOT NULL COMMENT 'WCAG conformance level',
        description TEXT NOT NULL COMMENT 'Full description of the criterion',
        explanation TEXT COMMENT 'Additional explanation and context',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update timestamp',
        
        INDEX idx_principle (principle),
        INDEX idx_level (level),
        INDEX idx_principle_level (principle, level)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    COMMENT='WCAG 2.1 success criteria with core information'
    ";
    
    $pdo->exec($sql);
    echo "✓ Table created successfully\n\n";
    
    // Verify table structure
    echo "Verifying table structure...\n";
    $stmt = $pdo->query("DESCRIBE wcag_criteria");
    $columns = $stmt->fetchAll();
    
    echo "\nTable Columns:\n";
    echo str_repeat("-", 80) . "\n";
    printf("%-15s %-30s %-10s %-10s\n", "Field", "Type", "Null", "Key");
    echo str_repeat("-", 80) . "\n";
    
    foreach ($columns as $column) {
        printf(
            "%-15s %-30s %-10s %-10s\n",
            $column['Field'],
            $column['Type'],
            $column['Null'],
            $column['Key']
        );
    }
    
    // Verify indexes
    echo "\n\nTable Indexes:\n";
    echo str_repeat("-", 80) . "\n";
    printf("%-20s %-20s %-15s\n", "Key Name", "Column Name", "Non Unique");
    echo str_repeat("-", 80) . "\n";
    
    $stmt = $pdo->query("SHOW INDEX FROM wcag_criteria");
    $indexes = $stmt->fetchAll();
    
    foreach ($indexes as $index) {
        printf(
            "%-20s %-20s %-15s\n",
            $index['Key_name'],
            $index['Column_name'],
            $index['Non_unique']
        );
    }
    
    echo "\n=============================================================\n";
    echo "Summary\n";
    echo "=============================================================\n";
    echo "✓ wcag_criteria table created successfully\n";
    echo "✓ Primary key on id field\n";
    echo "✓ Index on principle field\n";
    echo "✓ Index on level field\n";
    echo "✓ Composite index on (principle, level)\n";
    echo "✓ InnoDB engine with utf8mb4 charset\n";
    echo "✓ Timestamps for created_at and updated_at\n";
    echo "\n✓ Task 1.2 completed successfully!\n";
    
    exit(0);
    
} catch (PDOException $e) {
    echo "\n✗ Error: " . $e->getMessage() . "\n";
    echo "\nTroubleshooting:\n";
    echo "1. Ensure MySQL service is running\n";
    echo "2. Verify database 'wcag_db' exists\n";
    echo "3. Check credentials in .env file\n";
    echo "4. Verify user 'wcag_user' has CREATE privileges\n";
    exit(1);
}
