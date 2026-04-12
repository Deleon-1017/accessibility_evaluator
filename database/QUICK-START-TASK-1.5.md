# Quick Start: Task 1.5 - Create wcag_user_groups Table

## Overview
Create the `wcag_user_groups` table to store user groups affected by each WCAG criterion.

## Prerequisites
- MySQL server running
- Database `wcag_db` created (Task 1.1)
- Table `wcag_criteria` created (Task 1.2)

## Quick Execution

### Option 1: Using Migration Runner (Recommended)
```bash
php database/migrations/run-migration.php 004_create_wcag_user_groups_table.sql
```

### Option 2: Using MySQL Command Line
```bash
mysql -u root -p wcag_db < database/migrations/004_create_wcag_user_groups_table.sql
```

### Option 3: Using phpMyAdmin
1. Open phpMyAdmin
2. Select `wcag_db` database
3. Go to SQL tab
4. Copy and paste the contents of `database/migrations/004_create_wcag_user_groups_table.sql`
5. Click "Go"

## Table Structure

```sql
CREATE TABLE IF NOT EXISTS wcag_user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criterion_id VARCHAR(10) NOT NULL,
    user_group VARCHAR(255) NOT NULL,
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    INDEX idx_criterion (criterion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Key Features

1. **Primary Key**: Auto-incrementing `id` field
2. **Foreign Key**: Links to `wcag_criteria.id` with CASCADE delete
3. **Index**: Optimizes queries on `criterion_id`
4. **Data Type**: VARCHAR(255) for user group descriptions
5. **Character Set**: utf8mb4 for full Unicode support

## Verification

After execution, verify the table was created:

```sql
-- Check table exists
SHOW TABLES LIKE 'wcag_user_groups';

-- View table structure
DESCRIBE wcag_user_groups;

-- Verify foreign key
SHOW CREATE TABLE wcag_user_groups;
```

## Expected Output

```
+---------------+--------------+------+-----+---------+----------------+
| Field         | Type         | Null | Key | Default | Extra          |
+---------------+--------------+------+-----+---------+----------------+
| id            | int          | NO   | PRI | NULL    | auto_increment |
| criterion_id  | varchar(10)  | NO   | MUL | NULL    |                |
| user_group    | varchar(255) | NO   |     | NULL    |                |
+---------------+--------------+------+-----+---------+----------------+
```

## Example Data

Once created, the table will store data like:

```sql
INSERT INTO wcag_user_groups (criterion_id, user_group) VALUES
('1.1.1', 'screen reader users'),
('1.1.1', 'users with images disabled'),
('1.2.1', 'deaf or hard of hearing users'),
('1.4.3', 'users with low vision'),
('2.1.1', 'keyboard-only users');
```

## Troubleshooting

### Error: "Can't create table"
- Ensure MySQL server is running
- Verify `wcag_db` database exists
- Check user has CREATE privileges

### Error: "Foreign key constraint fails"
- Ensure `wcag_criteria` table exists first (Task 1.2)
- Verify `wcag_criteria.id` is VARCHAR(10)

### Error: "Table already exists"
- This is normal if migration was run before
- The `IF NOT EXISTS` clause prevents errors
- No action needed

## Next Steps

After Task 1.5 is complete:
1. Task 1.6: Create wcag_key_summaries table
2. Task 1.7: Create wcag_interactive_config table
3. Task 2: Implement data migration script

## Files Created

- ✅ `database/migrations/004_create_wcag_user_groups_table.sql` - Migration file
- ✅ `database/TASK-1.5-SUMMARY.md` - Detailed summary
- ✅ `database/QUICK-START-TASK-1.5.md` - This quick start guide

## Requirements Satisfied

- ✅ Requirement 1.1: Database schema design
- ✅ Requirement 1.2: Referential integrity
- ✅ Requirement 1.3: Appropriate data types

## Design Compliance

This implementation matches the design specification in:
`.kiro/specs/wcag-db-migration/design.md` (lines 123-130)

## Support

For detailed information, see:
- `database/TASK-1.5-SUMMARY.md` - Complete implementation details
- `.kiro/specs/wcag-db-migration/design.md` - Design specification
- `database/SETUP-GUIDE.md` - Database setup guide
