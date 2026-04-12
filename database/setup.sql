-- ============================================================================
-- WCAG Database Setup Script
-- ============================================================================
-- This script creates the wcag_db database with UTF-8 encoding and sets up
-- database users with appropriate privileges for read and write operations.
--
-- Usage:
--   mysql -u root -p < database/setup.sql
-- ============================================================================

-- Create database with UTF-8 encoding
CREATE DATABASE IF NOT EXISTS wcag_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE wcag_db;

-- ============================================================================
-- User Management
-- ============================================================================

-- Create read-only user for GET operations
CREATE USER IF NOT EXISTS 'wcag_reader'@'localhost' IDENTIFIED BY 'reader_password_change_me';
CREATE USER IF NOT EXISTS 'wcag_reader'@'%' IDENTIFIED BY 'reader_password_change_me';

-- Create read-write user for all operations
CREATE USER IF NOT EXISTS 'wcag_user'@'localhost' IDENTIFIED BY 'user_password_change_me';
CREATE USER IF NOT EXISTS 'wcag_user'@'%' IDENTIFIED BY 'user_password_change_me';

-- Grant read-only privileges to reader user
GRANT SELECT ON wcag_db.* TO 'wcag_reader'@'localhost';
GRANT SELECT ON wcag_db.* TO 'wcag_reader'@'%';

-- Grant full privileges to main user (except GRANT)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON wcag_db.* TO 'wcag_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON wcag_db.* TO 'wcag_user'@'%';

-- Apply privilege changes
FLUSH PRIVILEGES;

-- ============================================================================
-- Verification
-- ============================================================================

-- Show database info
SELECT 
    SCHEMA_NAME as 'Database',
    DEFAULT_CHARACTER_SET_NAME as 'Character Set',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'wcag_db';

-- Show created users
SELECT 
    User,
    Host,
    plugin as 'Auth Plugin'
FROM mysql.user
WHERE User LIKE 'wcag_%'
ORDER BY User, Host;

-- ============================================================================
-- Notes
-- ============================================================================
-- 1. Change default passwords before deploying to production
-- 2. For production, restrict users to specific hosts instead of '%'
-- 3. Use environment variables to store credentials securely
-- 4. Consider using SSL/TLS for database connections in production
-- ============================================================================
