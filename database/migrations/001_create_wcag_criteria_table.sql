-- ============================================================================
-- Migration: Create wcag_criteria table
-- Task: 1.2 - Create wcag_criteria table with indexes
-- Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7
-- ============================================================================

USE wcag_db;

-- Create wcag_criteria table
CREATE TABLE IF NOT EXISTS wcag_criteria (
    id VARCHAR(10) PRIMARY KEY COMMENT 'WCAG criterion ID (e.g., "1.1.1")',
    principle ENUM('Perceivable', 'Operable', 'Understandable', 'Robust') NOT NULL COMMENT 'WCAG principle category',
    title VARCHAR(255) NOT NULL COMMENT 'Criterion title',
    level ENUM('A', 'AA', 'AAA') NOT NULL COMMENT 'WCAG conformance level',
    description TEXT NOT NULL COMMENT 'Full description of the criterion',
    explanation TEXT COMMENT 'Additional explanation and context',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Record creation timestamp',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Record last update timestamp',
    
    -- Indexes for performance
    INDEX idx_principle (principle),
    INDEX idx_level (level),
    INDEX idx_principle_level (principle, level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='WCAG 2.1 success criteria with core information';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Verify table structure
DESCRIBE wcag_criteria;

-- Show indexes
SHOW INDEX FROM wcag_criteria;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Primary key on id field ensures unique criterion identifiers
-- 2. ENUM types enforce valid principle and level values
-- 3. Indexes on principle and level support efficient filtering
-- 4. Composite index on (principle, level) optimizes combined filters
-- 5. InnoDB engine provides ACID compliance and foreign key support
-- 6. utf8mb4 charset supports full Unicode including emojis
-- 7. Timestamps track record creation and modification
-- ============================================================================
