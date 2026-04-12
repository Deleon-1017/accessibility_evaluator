-- ============================================================================
-- Migration: Create wcag_interactive_config table
-- Task: 1.7 - Create wcag_interactive_config table with foreign key
-- Requirements: 1.1, 1.2, 1.3
-- ============================================================================

USE wcag_db;

-- Create wcag_interactive_config table
CREATE TABLE IF NOT EXISTS wcag_interactive_config (
    criterion_id VARCHAR(10) PRIMARY KEY COMMENT 'Primary key and foreign key to wcag_criteria.id',
    enabled BOOLEAN DEFAULT FALSE COMMENT 'Whether interactive examples are enabled for this criterion',
    
    -- Foreign key constraint with CASCADE delete
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Interactive example configuration for WCAG success criteria';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_interactive_config;

-- Show indexes
SHOW INDEX FROM wcag_interactive_config;

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
    AND TABLE_NAME = 'wcag_interactive_config'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. criterion_id VARCHAR(10) serves as both PRIMARY KEY and FOREIGN KEY
-- 2. No separate auto-incrementing id needed (criterion_id is unique identifier)
-- 3. enabled BOOLEAN DEFAULT FALSE indicates if interactive examples are available
-- 4. Foreign key with ON DELETE CASCADE ensures referential integrity
-- 5. No additional indexes needed (criterion_id is already primary key)
-- 6. InnoDB engine required for foreign key support
-- 7. utf8mb4 charset supports full Unicode
-- 8. One-to-one relationship with wcag_criteria (optional configuration)
-- ============================================================================
