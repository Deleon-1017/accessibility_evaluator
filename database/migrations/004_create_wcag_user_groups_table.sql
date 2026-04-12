-- ============================================================================
-- Migration: Create wcag_user_groups table
-- Task: 1.5 - Create wcag_user_groups table with foreign key
-- Requirements: 1.1, 1.2, 1.3
-- ============================================================================

USE wcag_db;

-- Create wcag_user_groups table
CREATE TABLE IF NOT EXISTS wcag_user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-incrementing primary key',
    criterion_id VARCHAR(10) NOT NULL COMMENT 'Foreign key to wcag_criteria.id',
    user_group VARCHAR(255) NOT NULL COMMENT 'User group affected by this criterion (e.g., "screen reader users", "users with images disabled")',
    
    -- Foreign key constraint with CASCADE delete
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    
    -- Index for performance
    INDEX idx_criterion (criterion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='User groups affected by WCAG success criteria';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_user_groups;

-- Show indexes
SHOW INDEX FROM wcag_user_groups;

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
    AND TABLE_NAME = 'wcag_user_groups'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Auto-incrementing INT primary key for unique user group records
-- 2. criterion_id VARCHAR(10) matches wcag_criteria.id type
-- 3. user_group VARCHAR(255) stores affected user group descriptions
-- 4. Foreign key with ON DELETE CASCADE ensures referential integrity
-- 5. Index on criterion_id optimizes joins and lookups
-- 6. InnoDB engine required for foreign key support
-- 7. utf8mb4 charset supports full Unicode
-- 8. Each criterion can have multiple user groups (one-to-many relationship)
-- ============================================================================
