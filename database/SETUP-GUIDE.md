# WCAG Database Setup Guide

Complete guide for setting up the MySQL database for the WCAG Database Migration System.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)
6. [Security](#security)

## Prerequisites

- **MySQL 5.7+** or **MariaDB 10.2+**
- **PHP 7.4+** with PDO MySQL extension
- MySQL root or administrative access
- Command-line access (Terminal/Command Prompt)

### For XAMPP Users (Windows)

- XAMPP with MySQL/MariaDB installed
- MySQL command-line tools (included with XAMPP)
- Path: `C:\xampp\mysql\bin\`

### For Linux/Mac Users

- MySQL Server installed and running
- MySQL client tools installed

## Quick Start

### Windows (XAMPP)

```batch
REM 1. Run setup script
database\setup-windows.bat

REM 2. Create environment file
copy .env.example .env

REM 3. Edit .env with your credentials
notepad .env

REM 4. Test connection
php test-db-connection.php
```

### Linux/Mac

```bash
# 1. Make setup script executable
chmod +x database/setup.sh

# 2. Run setup script
./database/setup.sh

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your credentials
nano .env  # or vim, code, etc.

# 5. Test connection
php test-db-connection.php
```

## Detailed Setup

### Step 1: Create Database and Users

#### Option A: Using Setup Script (Recommended)

**Windows (XAMPP):**
```batch
C:\xampp\mysql\bin\mysql -u root -p < database\setup.sql
```

**Linux/Mac:**
```bash
mysql -u root -p < database/setup.sql
```

#### Option B: Manual Setup

1. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE wcag_db
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci;
   ```

3. **Create users:**
   ```sql
   -- Read-only user
   CREATE USER 'wcag_reader'@'localhost' IDENTIFIED BY 'reader_password';
   GRANT SELECT ON wcag_db.* TO 'wcag_reader'@'localhost';
   
   -- Read-write user
   CREATE USER 'wcag_user'@'localhost' IDENTIFIED BY 'user_password';
   GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER 
       ON wcag_db.* TO 'wcag_user'@'localhost';
   
   FLUSH PRIVILEGES;
   ```

### Step 2: Configure Environment Variables

1. **Copy example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file:**
   ```ini
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=wcag_db
   DB_USER=wcag_user
   DB_PASSWORD=your_actual_password
   DB_READER_USER=wcag_reader
   DB_READER_PASSWORD=your_actual_reader_password
   DB_CHARSET=utf8mb4
   DB_COLLATION=utf8mb4_unicode_ci
   ```

3. **Important:** Replace placeholder passwords with actual secure passwords!

### Step 3: Update Passwords (Production)

For production environments, change the default passwords:

```sql
mysql -u root -p

ALTER USER 'wcag_reader'@'localhost' IDENTIFIED BY 'strong_reader_password_here';
ALTER USER 'wcag_user'@'localhost' IDENTIFIED BY 'strong_user_password_here';
FLUSH PRIVILEGES;
```

**Password Requirements:**
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- No dictionary words
- Unique (not reused from other systems)

## Verification

### Test Database Connection

Run the test script:

```bash
php test-db-connection.php
```

**Expected output:**
```
=============================================================
WCAG Database Connection Test
=============================================================

Testing read-only connection...
✓ Read-only connection: SUCCESS
  Database: wcag_db
  Charset: utf8mb4
  Collation: utf8mb4_unicode_ci
  MySQL Version: 8.0.x

Testing read-write connection...
✓ Read-write connection: SUCCESS
  Query execution: OK

=============================================================
Test Summary
=============================================================
✓ All connections working correctly!
```

### Verify Database Structure

```sql
-- Check database exists with correct charset
SELECT 
    SCHEMA_NAME,
    DEFAULT_CHARACTER_SET_NAME,
    DEFAULT_COLLATION_NAME
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'wcag_db';

-- Check users exist
SELECT User, Host FROM mysql.user WHERE User LIKE 'wcag_%';

-- Check privileges
SHOW GRANTS FOR 'wcag_reader'@'localhost';
SHOW GRANTS FOR 'wcag_user'@'localhost';
```

## Troubleshooting

### Issue: "Access denied for user"

**Symptoms:**
```
✗ Read-write connection: ERROR
  Error: Access denied for user 'wcag_user'@'localhost'
```

**Solutions:**
1. Verify password in `.env` matches database
2. Check user exists:
   ```sql
   SELECT User, Host FROM mysql.user WHERE User = 'wcag_user';
   ```
3. Verify privileges:
   ```sql
   SHOW GRANTS FOR 'wcag_user'@'localhost';
   ```
4. Run `FLUSH PRIVILEGES;` in MySQL

### Issue: "Unknown database 'wcag_db'"

**Symptoms:**
```
✗ Read-only connection: ERROR
  Error: Unknown database 'wcag_db'
```

**Solutions:**
1. Verify database exists:
   ```sql
   SHOW DATABASES LIKE 'wcag_db';
   ```
2. Create database if missing:
   ```sql
   CREATE DATABASE wcag_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### Issue: "MySQL command not found"

**Symptoms:**
```
ERROR: MySQL command not found in PATH
```

**Solutions:**

**Windows (XAMPP):**
```batch
REM Add to PATH temporarily
set PATH=%PATH%;C:\xampp\mysql\bin

REM Or use full path
C:\xampp\mysql\bin\mysql -u root -p < database\setup.sql
```

**Linux:**
```bash
# Install MySQL client
sudo apt-get install mysql-client  # Ubuntu/Debian
sudo yum install mysql             # CentOS/RHEL
```

**Mac:**
```bash
# Install via Homebrew
brew install mysql-client
```

### Issue: "Can't connect to MySQL server"

**Symptoms:**
```
✗ Read-only connection: ERROR
  Error: Can't connect to MySQL server on 'localhost'
```

**Solutions:**

**Windows (XAMPP):**
1. Open XAMPP Control Panel
2. Start MySQL service
3. Check status shows "Running"

**Linux:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if stopped
sudo systemctl start mysql
```

**Mac:**
```bash
# Check if MySQL is running
brew services list

# Start MySQL if stopped
brew services start mysql
```

### Issue: Character encoding problems

**Symptoms:**
- Incorrect display of special characters
- Emoji not saving correctly

**Solutions:**
1. Verify database charset:
   ```sql
   SHOW VARIABLES LIKE 'character_set_database';
   ```
2. Should show `utf8mb4`
3. If not, recreate database with correct charset
4. Verify connection charset in `config/database.php`

## Security

### Best Practices

1. **Strong Passwords**
   - Minimum 16 characters
   - Use password generator
   - Store securely (password manager)

2. **Restrict User Hosts**
   ```sql
   -- Production: Use specific IP instead of '%'
   CREATE USER 'wcag_user'@'192.168.1.100' IDENTIFIED BY 'password';
   ```

3. **Use SSL/TLS**
   ```php
   // In config/database.php options array
   PDO::MYSQL_ATTR_SSL_CA => '/path/to/ca-cert.pem',
   PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => true
   ```

4. **Environment Variables**
   - Never commit `.env` to version control
   - Add `.env` to `.gitignore`
   - Use different credentials per environment

5. **Principle of Least Privilege**
   - Use `wcag_reader` for GET operations
   - Use `wcag_user` only when write access needed
   - Never use root account in application

6. **Regular Maintenance**
   - Rotate passwords quarterly
   - Review user privileges monthly
   - Monitor access logs
   - Keep MySQL updated

### Security Checklist

- [ ] Changed default passwords
- [ ] Restricted user hosts (production)
- [ ] Enabled SSL/TLS (production)
- [ ] Added `.env` to `.gitignore`
- [ ] Using separate read/write users
- [ ] Monitoring enabled
- [ ] Regular backups configured

## Next Steps

After successful database setup:

1. **Create database schema** (Task 1.2-1.7)
   ```bash
   mysql -u wcag_user -p wcag_db < database/schema.sql
   ```

2. **Run data migration** (Task 2)
   ```bash
   node database/migrate.js
   ```

3. **Test API endpoints** (Task 4)
   ```bash
   php -S localhost:8000
   # Visit http://localhost:8000/wcag-api.php
   ```

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [database/README.md](README.md)
3. Check MySQL error logs
4. Review design document: `.kiro/specs/wcag-db-migration/design.md`

## References

- [MySQL 8.0 Documentation](https://dev.mysql.com/doc/refman/8.0/en/)
- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [XAMPP Documentation](https://www.apachefriends.org/docs/)
- [UTF-8 Best Practices](https://mathiasbynens.be/notes/mysql-utf8mb4)
