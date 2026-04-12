-- ============================================================================
-- Migration 007: Create Scan Results Tables
-- ============================================================================
-- This migration creates tables to store accessibility scan results
-- instead of using JSON files for better performance and querying.
-- ============================================================================

USE wcag_db;

-- ============================================================================
-- Scan Results Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS scan_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id VARCHAR(50) UNIQUE NOT NULL,
    scan_type ENUM('url', 'html') NOT NULL,
    source_url TEXT,
    html_content LONGTEXT,
    timestamp DATETIME NOT NULL,
    total_issues INT DEFAULT 0,
    error_count INT DEFAULT 0,
    warning_count INT DEFAULT 0,
    info_count INT DEFAULT 0,
    perceivable_count INT DEFAULT 0,
    operable_count INT DEFAULT 0,
    understandable_count INT DEFAULT 0,
    robust_count INT DEFAULT 0,
    accessibility_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_scan_id (scan_id),
    INDEX idx_timestamp (timestamp),
    INDEX idx_scan_type (scan_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Scan Issues Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS scan_issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scan_id VARCHAR(50) NOT NULL,
    code VARCHAR(20) NOT NULL,
    principle ENUM('Perceivable', 'Operable', 'Understandable', 'Robust') NOT NULL,
    type ENUM('error', 'warning', 'info') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    element TEXT,
    selector VARCHAR(255),
    recommendation TEXT,
    severity ENUM('low', 'medium', 'high') NOT NULL,
    line_number INT,
    context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scan_id) REFERENCES scan_results(scan_id) ON DELETE CASCADE,
    INDEX idx_scan_id (scan_id),
    INDEX idx_code (code),
    INDEX idx_type (type),
    INDEX idx_principle (principle)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Verification
-- ============================================================================
SHOW TABLES LIKE 'scan_%';
DESCRIBE scan_results;
DESCRIBE scan_issues;
