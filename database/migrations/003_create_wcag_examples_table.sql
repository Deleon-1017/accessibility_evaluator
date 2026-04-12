-- ============================================================================
-- Migration: Create wcag_examples table
-- Task: 1.4 - Create wcag_examples table with foreign key
-- Requirements: 1.1, 1.2, 1.3, 1.6
-- ============================================================================

USE wcag_db;

-- Create wcag_examples table
CREATE TABLE IF NOT EXISTS wcag_examples (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Auto-incrementing primary key',
    criterion_id VARCHAR(10) NOT NULL COMMENT 'Foreign key to wcag_criteria.id',
    state ENUM('before', 'after') NOT NULL COMMENT 'Example state: before (non-compliant) or after (compliant)',
    html_code TEXT COMMENT 'HTML code example',
    css_code TEXT COMMENT 'CSS code example',
    js_code TEXT COMMENT 'JavaScript code example',
    context TEXT COMMENT 'Explanation and context for the example',
    
    -- Foreign key constraint with CASCADE delete
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    
    -- Composite index for performance
    INDEX idx_criterion_state (criterion_id, state)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Before/after code examples demonstrating WCAG compliance';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_examples;

-- Show indexes
SHOW INDEX FROM wcag_examples;

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
    AND TABLE_NAME = 'wcag_examples'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Auto-incrementing INT primary key for unique example records
-- 2. criterion_id VARCHAR(10) matches wcag_criteria.id type
-- 3. state ENUM('before', 'after') enforces valid example states
-- 4. TEXT fields for html_code, css_code, js_code support large code snippets
-- 5. context TEXT provides explanation for each example
-- 6. Foreign key with ON DELETE CASCADE ensures referential integrity
-- 7. Composite index on (criterion_id, state) optimizes queries filtering by both fields
-- 8. InnoDB engine required for foreign key support
-- 9. utf8mb4 charset supports full Unicode including special characters in code
-- ============================================================================
