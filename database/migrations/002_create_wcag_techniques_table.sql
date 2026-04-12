-- ============================================================================
-- Migration: Create wcag_techniques table
-- Task: 1.3 - Create wcag_techniques table with foreign key
-- Requirements: 1.1, 1.2, 1.3
-- ============================================================================

USE wcag_db;

-- Create wcag_techniques table
CREATE TABLE IF NOT EXISTS wcag_techniques (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-incrementing primary key',
    criterion_id VARCHAR(10) NOT NULL COMMENT 'Foreign key to wcag_criteria.id',
    technique_code VARCHAR(20) NOT NULL COMMENT 'WCAG technique identifier (e.g., "G94", "ARIA6")',
    technique_description TEXT COMMENT 'Description of the technique',
    
    -- Foreign key constraint with CASCADE delete
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    
    -- Index for performance
    INDEX idx_criterion (criterion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='WCAG techniques associated with success criteria';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_techniques;

-- Show indexes
SHOW INDEX FROM wcag_techniques;

-- Show foreign key constraints
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'wcag_db'
    AND TABLE_NAME = 'wcag_techniques'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Auto-incrementing INT primary key for unique technique records
-- 2. criterion_id VARCHAR(10) matches wcag_criteria.id type
-- 3. technique_code stores WCAG technique identifiers (e.g., "G94", "ARIA6")
-- 4. technique_description stores optional detailed description
-- 5. Foreign key with ON DELETE CASCADE ensures referential integrity
-- 6. Index on criterion_id optimizes joins and lookups
-- 7. InnoDB engine required for foreign key support
-- 8. utf8mb4 charset supports full Unicode
-- ============================================================================
