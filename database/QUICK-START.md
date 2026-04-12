# Quick Start Guide - Database Setup

## For XAMPP Users (Windows)

```batch
REM 1. Run database setup
C:\xampp\mysql\bin\mysql -u root -p < database\setup.sql

REM 2. Create environment file
copy .env.example .env

REM 3. Edit .env and update passwords
notepad .env

REM 4. Test connection
php test-db-connection.php
```

## For Linux/Mac Users

```bash
# 1. Run database setup
mysql -u root -p < database/setup.sql

# 2. Create environment file
cp .env.example .env

# 3. Edit .env and update passwords
nano .env

# 4. Test connection
php test-db-connection.php
```

## What Gets Created

- ✅ Database: `wcag_db` (UTF-8 encoding)
- ✅ User: `wcag_reader` (read-only)
- ✅ User: `wcag_user` (read-write)

## Important: Change Passwords!

Edit `.env` file and replace:
- `your_secure_password_here` → Your actual password
- `your_secure_reader_password_here` → Your actual reader password

## Verify Setup

Run test script:
```bash
php test-db-connection.php
```

Expected output:
```
✓ Read-only connection: SUCCESS
✓ Read-write connection: SUCCESS
✓ All connections working correctly!
```

## Troubleshooting

**Problem:** "Access denied"
- Check passwords in `.env` match database

**Problem:** "MySQL command not found"
- Windows: Use full path `C:\xampp\mysql\bin\mysql`
- Linux: Install mysql-client

**Problem:** "Can't connect to MySQL"
- Start MySQL service (XAMPP Control Panel or systemctl)

## Next Steps

1. Create database schema (Task 1.2-1.7)
2. Run data migration (Task 2)
3. Test API endpoints (Task 4)

## Need Help?

See detailed guides:
- `database/SETUP-GUIDE.md` - Complete setup instructions
- `database/README.md` - Configuration details
