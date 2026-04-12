# Database Setup Guide

This guide explains how to set up the MySQL database for the WCAG Database Migration System.

## Prerequisites

- MySQL 5.7 or higher
- MySQL command-line client or phpMyAdmin
- Root or administrative access to MySQL server

## Quick Setup

### Option 1: Using MySQL Command Line

1. **Create the database and users:**
   ```bash
   mysql -u root -p < database/setup.sql
   ```

2. **Update passwords** (IMPORTANT for production):
   ```sql
   mysql -u root -p
   ALTER USER 'wcag_reader'@'localhost' IDENTIFIED BY 'your_secure_reader_password';
   ALTER USER 'wcag_user'@'localhost' IDENTIFIED BY 'your_secure_user_password';
   FLUSH PRIVILEGES;
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file** with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=wcag_db
   DB_USER=wcag_user
   DB_PASSWORD=your_secure_user_password
   DB_READER_USER=wcag_reader
   DB_READER_PASSWORD=your_secure_reader_password
   ```

### Option 2: Using phpMyAdmin

1. **Create database:**
   - Open phpMyAdmin
   - Click "New" to create a database
   - Database name: `wcag_db`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

2. **Create users:**
   - Go to "User accounts" tab
   - Click "Add user account"
   - Create two users:
     - `wcag_reader` with SELECT privileges on `wcag_db`
     - `wcag_user` with all privileges on `wcag_db` (except GRANT)

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`

## Database Configuration

### Character Set and Collation

The database uses:
- **Character Set:** `utf8mb4` (full Unicode support including emojis)
- **Collation:** `utf8mb4_unicode_ci` (case-insensitive Unicode sorting)

This ensures proper storage of international characters and special symbols.

### Database Users

Two users are created for security:

1. **wcag_reader** (Read-only)
   - Used for GET API endpoints
   - Has SELECT privileges only
   - Minimizes security risk for read operations

2. **wcag_user** (Read-write)
   - Used for POST, PUT, DELETE API endpoints
   - Has full CRUD privileges
   - Used for data migration

### Connection Pooling

The PHP Database class implements connection pooling:
- Connections are reused across requests
- Reduces connection overhead
- Improves performance

## Verification

### Test Database Connection

Create a test file `test-db-connection.php`:

```php
<?php
require_once 'config/Database.php';

echo "Testing database connection...\n\n";

// Test read connection
if (Database::testConnection('readonly')) {
    echo "✓ Read-only connection: SUCCESS\n";
    $info = Database::getInfo();
    echo "  Database: {$info['db_name']}\n";
    echo "  Charset: {$info['charset']}\n";
    echo "  Collation: {$info['collation']}\n";
    echo "  Version: {$info['version']}\n";
} else {
    echo "✗ Read-only connection: FAILED\n";
}

echo "\n";

// Test write connection
if (Database::testConnection('default')) {
    echo "✓ Read-write connection: SUCCESS\n";
} else {
    echo "✗ Read-write connection: FAILED\n";
}
```

Run the test:
```bash
php test-db-connection.php
```

### Verify Database Structure

```sql
-- Show database info
SELECT 
    SCHEMA_NAME as 'Database',
    DEFAULT_CHARACTER_SET_NAME as 'Character Set',
    DEFAULT_COLLATION_NAME as 'Collation'
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'wcag_db';

-- Show users and privileges
SHOW GRANTS FOR 'wcag_reader'@'localhost';
SHOW GRANTS FOR 'wcag_user'@'localhost';
```

## Troubleshooting

### Connection Failed

**Error:** `Failed to connect to database`

**Solutions:**
1. Verify MySQL service is running
2. Check database credentials in `.env`
3. Verify users exist: `SELECT User, Host FROM mysql.user WHERE User LIKE 'wcag_%';`
4. Check user privileges: `SHOW GRANTS FOR 'wcag_user'@'localhost';`

### Access Denied

**Error:** `Access denied for user 'wcag_user'@'localhost'`

**Solutions:**
1. Verify password in `.env` matches database
2. Check user exists and has correct privileges
3. Run `FLUSH PRIVILEGES;` in MySQL

### Character Set Issues

**Error:** Incorrect string value or encoding errors

**Solutions:**
1. Verify database charset: `SHOW VARIABLES LIKE 'character_set_database';`
2. Verify connection charset in `config/database.php`
3. Ensure `utf8mb4` is used throughout

### Connection Timeout

**Error:** Connection timeout or too many connections

**Solutions:**
1. Check MySQL max_connections: `SHOW VARIABLES LIKE 'max_connections';`
2. Increase max_connections if needed
3. Verify connection pooling is working

## Security Best Practices

1. **Change default passwords** before deploying to production
2. **Use strong passwords** (minimum 16 characters, mixed case, numbers, symbols)
3. **Restrict user hosts** in production (use specific IPs instead of '%')
4. **Use SSL/TLS** for database connections in production
5. **Store credentials** in environment variables, never in code
6. **Rotate passwords** regularly
7. **Monitor access logs** for suspicious activity
8. **Use read-only user** for GET operations to minimize risk

## Next Steps

After setting up the database:

1. Run the schema creation script (Task 1.2-1.7)
2. Run the data migration script (Task 2)
3. Test API endpoints (Task 4)

## References

- [MySQL 8.0 Reference Manual](https://dev.mysql.com/doc/refman/8.0/en/)
- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [WCAG Database Migration Design Document](../.kiro/specs/wcag-db-migration/design.md)
