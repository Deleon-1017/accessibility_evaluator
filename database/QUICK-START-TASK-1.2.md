# Quick Start: Task 1.2 - Create wcag_criteria Table

## Prerequisites

1. MySQL service must be running
2. Database `wcag_db` must exist (created in Task 1.1)
3. User `wcag_user` must have CREATE privileges
4. `.env` file must be configured with correct credentials

## Option 1: Using SQL File (Recommended)

### Windows (XAMPP)
```cmd
C:\xampp\mysql\bin\mysql -u wcag_user -p wcag_db < database\migrations\001_create_wcag_criteria_table.sql
```

### Linux/Mac
```bash
mysql -u wcag_user -p wcag_db < database/migrations/001_create_wcag_criteria_table.sql
```

## Option 2: Using PHP Script

```bash
php database/create-wcag-criteria-table.php
```

This script will:
- Create the wcag_criteria table
- Display the table structure
- Show all indexes
- Provide a summary of what was created

## Option 3: Using MySQL Client

```bash
# Connect to MySQL
mysql -u wcag_user -p wcag_db

# Copy and paste the CREATE TABLE statement from:
# database/migrations/001_create_wcag_criteria_table.sql
```

## Verification

After running the migration, verify the table was created:

```sql
-- Show table exists
SHOW TABLES LIKE 'wcag_criteria';

-- Show table structure
DESCRIBE wcag_criteria;

-- Show indexes
SHOW INDEX FROM wcag_criteria;
```

## Expected Result

You should see:
- ✓ Table `wcag_criteria` created
- ✓ 8 columns (id, principle, title, level, description, explanation, created_at, updated_at)
- ✓ Primary key on `id`
- ✓ 3 indexes (idx_principle, idx_level, idx_principle_level)

## Troubleshooting

### MySQL Not Running
**Error:** `Can't connect to MySQL server`

**Solution:** Start MySQL service
- XAMPP: Open Control Panel → Start MySQL
- Windows: `net start MySQL`
- Linux: `sudo systemctl start mysql`

### Database Not Found
**Error:** `Unknown database 'wcag_db'`

**Solution:** Run Task 1.1 setup first
```bash
mysql -u root -p < database/setup.sql
```

### Permission Denied
**Error:** `Access denied for user 'wcag_user'`

**Solution:** Check credentials in `.env` file or grant privileges
```sql
GRANT CREATE ON wcag_db.* TO 'wcag_user'@'localhost';
FLUSH PRIVILEGES;
```

### Table Already Exists
**Error:** `Table 'wcag_criteria' already exists`

**Solution:** This is OK! The migration uses `IF NOT EXISTS` clause. If you want to recreate:
```sql
DROP TABLE IF EXISTS wcag_criteria;
```
Then re-run the migration.

## Next Steps

After Task 1.2 is complete:
1. Task 1.3: Create wcag_techniques table
2. Task 1.4: Create wcag_examples table
3. Task 1.5: Create wcag_user_groups table
4. Task 1.6: Create wcag_key_summaries table
5. Task 1.7: Create wcag_interactive_config table

## Files Reference

- **Migration SQL:** `database/migrations/001_create_wcag_criteria_table.sql`
- **PHP Script:** `database/create-wcag-criteria-table.php`
- **Documentation:** `database/TASK-1.2-SUMMARY.md`
- **Configuration:** `.env` (database credentials)
