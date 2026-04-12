# Quick Start: Task 1.3 - Create wcag_techniques Table

## Prerequisites

1. ✓ MySQL service must be running
2. ✓ Database `wcag_db` must exist (created in Task 1.1)
3. ✓ Table `wcag_criteria` must exist (created in Task 1.2)
4. ✓ User `wcag_user` must have CREATE privileges
5. ✓ `.env` file must be configured with correct credentials

## Option 1: Using SQL File (Recommended)

### Windows (XAMPP)
```cmd
C:\xampp\mysql\bin\mysql -u wcag_user -p wcag_db < database\migrations\002_create_wcag_techniques_table.sql
```

### Linux/Mac
```bash
mysql -u wcag_user -p wcag_db < database/migrations/002_create_wcag_techniques_table.sql
```

## Option 2: Using PHP Migration Runner

```bash
php database/migrations/run-migration.php 002_create_wcag_techniques_table.sql
```

## Option 3: Using MySQL Client

```bash
# Connect to MySQL
mysql -u wcag_user -p wcag_db

# Copy and paste the CREATE TABLE statement from:
# database/migrations/002_create_wcag_techniques_table.sql
```

## Verification

After running the migration, verify the table was created:

```sql
-- Show table exists
SHOW TABLES LIKE 'wcag_techniques';

-- Show table structure
DESCRIBE wcag_techniques;

-- Show indexes
SHOW INDEX FROM wcag_techniques;

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
    AND TABLE_NAME = 'wcag_techniques'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

## Expected Result

You should see:
- ✓ Table `wcag_techniques` created
- ✓ 4 columns (id, criterion_id, technique_code, technique_description)
- ✓ Primary key on `id` (AUTO_INCREMENT)
- ✓ Foreign key on `criterion_id` referencing `wcag_criteria(id)`
- ✓ Foreign key DELETE_RULE: CASCADE
- ✓ Index `idx_criterion` on `criterion_id`

## Test Foreign Key Constraint

Verify the CASCADE delete works correctly:

```sql
-- 1. Insert a test criterion
INSERT INTO wcag_criteria (id, principle, title, level, description) 
VALUES ('9.9.9', 'Perceivable', 'Test Criterion', 'A', 'Test description');

-- 2. Insert techniques for the test criterion
INSERT INTO wcag_techniques (criterion_id, technique_code, technique_description) 
VALUES 
    ('9.9.9', 'TEST1', 'Test technique 1'),
    ('9.9.9', 'TEST2', 'Test technique 2');

-- 3. Verify techniques were inserted (should show 2 rows)
SELECT * FROM wcag_techniques WHERE criterion_id = '9.9.9';

-- 4. Delete the criterion
DELETE FROM wcag_criteria WHERE id = '9.9.9';

-- 5. Verify techniques were automatically deleted (should show 0 rows)
SELECT * FROM wcag_techniques WHERE criterion_id = '9.9.9';
```

If the last query returns 0 rows, the CASCADE delete is working correctly! ✓

## Troubleshooting

### Foreign Key Constraint Fails
**Error:** `Cannot add foreign key constraint`

**Cause:** wcag_criteria table doesn't exist

**Solution:** Run Task 1.2 first
```bash
mysql -u wcag_user -p wcag_db < database/migrations/001_create_wcag_criteria_table.sql
```

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
**Error:** `Table 'wcag_techniques' already exists`

**Solution:** This is OK! The migration uses `IF NOT EXISTS` clause. If you want to recreate:
```sql
DROP TABLE IF EXISTS wcag_techniques;
```
Then re-run the migration.

## Next Steps

After Task 1.3 is complete:
1. Task 1.4: Create wcag_examples table
2. Task 1.5: Create wcag_user_groups table
3. Task 1.6: Create wcag_key_summaries table
4. Task 1.7: Create wcag_interactive_config table

## Files Reference

- **Migration SQL:** `database/migrations/002_create_wcag_techniques_table.sql`
- **Documentation:** `database/TASK-1.3-SUMMARY.md`
- **Quick Start:** `database/QUICK-START-TASK-1.3.md` (this file)
- **Configuration:** `.env` (database credentials)
