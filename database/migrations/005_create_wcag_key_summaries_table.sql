-- ============================================================================
-- Migration: Create wcag_key_summaries table
-- Task: 1.6 - Create wcag_key_summaries table with foreign key
-- Requirements: 1.1, 1.2, 1.3
-- ============================================================================

USE wcag_db;

-- Create wcag_key_summaries table
CREATE TABLE IF NOT EXISTS wcag_key_summaries (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-incrementing primary key',
    criterion_id VARCHAR(10) NOT NULL COMMENT 'Foreign key to wcag_criteria.id',
    summary_text TEXT NOT NULL COMMENT 'Key summary point for the criterion',
    display_order INT DEFAULT 0 COMMENT 'Order in which summaries should be displayed',
    
    -- Foreign key constraint with CASCADE delete
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    
    -- Index for performance
    INDEX idx_criterion (criterion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Key summary points for WCAG success criteria';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_key_summaries;

-- Show indexes
SHOW INDEX FROM wcag_key_summaries;

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
    AND TABLE_NAME = 'wcag_key_summaries'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Auto-incrementing INT primary key for unique key summary records
-- 2. criterion_id VARCHAR(10) matches wcag_criteria.id type
-- 3. summary_text TEXT stores key summary points (NOT NULL ensures data integrity)
-- 4. display_order INT DEFAULT 0 controls the order of summaries in UI
-- 5. Foreign key with ON DELETE CASCADE ensures referential integrity
-- 6. Index on criterion_id optimizes joins and lookups
-- 7. InnoDB engine required for foreign key support
-- 8. utf8mb4 charset supports full Unicode
-- 9. Each criterion can have multiple key summaries (one-to-many relationship)
-- ============================================================================
