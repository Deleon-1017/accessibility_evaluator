# Task 1.3 Summary: Create wcag_techniques Table

## Overview

Created the `wcag_techniques` table to store WCAG technique identifiers and descriptions associated with success criteria.

## What Was Created

### Migration File
- **File:** `database/migrations/002_create_wcag_techniques_table.sql`
- **Purpose:** Creates wcag_techniques table with foreign key relationship to wcag_criteria

### Table Structure

```sql
CREATE TABLE wcag_techniques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criterion_id VARCHAR(10) NOT NULL,
    technique_code VARCHAR(20) NOT NULL,
    technique_description TEXT,
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    INDEX idx_criterion (criterion_id)
)
```

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | AUTO_INCREMENT, PRIMARY KEY | Unique identifier for each technique record |
| criterion_id | VARCHAR(10) | NOT NULL, FOREIGN KEY | References wcag_criteria.id |
| technique_code | VARCHAR(20) | NOT NULL | WCAG technique identifier (e.g., "G94", "ARIA6") |
| technique_description | TEXT | NULL | Optional description of the technique |

### Constraints

1. **Primary Key:** `id` (auto-incrementing integer)
2. **Foreign Key:** `criterion_id` references `wcag_criteria(id)`
   - ON DELETE CASCADE: When a criterion is deleted, all associated techniques are automatically deleted
3. **Index:** `idx_criterion` on `criterion_id` for efficient lookups and joins

### Design Decisions

1. **INT AUTO_INCREMENT for id**: Allows multiple techniques per criterion with unique identifiers
2. **VARCHAR(10) for criterion_id**: Matches the wcag_criteria.id type exactly
3. **VARCHAR(20) for technique_code**: Sufficient for WCAG technique codes (e.g., "G94", "ARIA6", "SCR21")
4. **TEXT for technique_description**: Allows detailed descriptions of variable length
5. **ON DELETE CASCADE**: Maintains referential integrity - when a criterion is deleted, its techniques are automatically removed
6. **Index on criterion_id**: Optimizes queries that filter or join by criterion

## Requirements Satisfied

- **Requirement 1.1:** Normalized schema with separate table for techniques
- **Requirement 1.2:** Foreign key constraint enforces referential integrity
- **Requirement 1.3:** Supports techniques array from wcag-data.js
- **Requirement 1.5:** Index on criterion_id for performance

## How to Run

### Option 1: Direct MySQL (Recommended)

**Windows (XAMPP):**
```cmd
C:\xampp\mysql\bin\mysql -u wcag_user -p wcag_db < database\migrations\002_create_wcag_techniques_table.sql
```

**Linux/Mac:**
```bash
mysql -u wcag_user -p wcag_db < database/migrations/002_create_wcag_techniques_table.sql
```

### Option 2: Using PHP Migration Runner

```bash
php database/migrations/run-migration.php 002_create_wcag_techniques_table.sql
```

### Option 3: MySQL Client

```bash
# Connect to database
mysql -u wcag_user -p wcag_db

# Copy and paste the CREATE TABLE statement from the migration file
```

## Verification

After running the migration, verify the table:

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

### Expected Results

1. **Table Structure:**
   - 4 columns: id, criterion_id, technique_code, technique_description
   - id is AUTO_INCREMENT PRIMARY KEY
   - criterion_id is NOT NULL

2. **Indexes:**
   - PRIMARY KEY on id
   - idx_criterion on criterion_id

3. **Foreign Key:**
   - criterion_id references wcag_criteria(id)
   - DELETE_RULE: CASCADE

## Example Data

Once the table is created, it will store data like:

```sql
-- Example: Techniques for criterion 1.1.1
INSERT INTO wcag_techniques (criterion_id, technique_code, technique_description) VALUES
('1.1.1', 'G94', 'Providing short text alternative for non-text content'),
('1.1.1', 'G95', 'Providing short text alternatives that provide a brief description'),
('1.1.1', 'ARIA6', 'Using aria-label to provide labels for objects');
```

## Testing Foreign Key Constraint

To verify the CASCADE delete works:

```sql
-- Insert a test criterion
INSERT INTO wcag_criteria (id, principle, title, level, description) 
VALUES ('9.9.9', 'Perceivable', 'Test Criterion', 'A', 'Test description');

-- Insert techniques for the test criterion
INSERT INTO wcag_techniques (criterion_id, technique_code) 
VALUES ('9.9.9', 'TEST1'), ('9.9.9', 'TEST2');

-- Verify techniques were inserted
SELECT * FROM wcag_techniques WHERE criterion_id = '9.9.9';

-- Delete the criterion
DELETE FROM wcag_criteria WHERE id = '9.9.9';

-- Verify techniques were automatically deleted (should return 0 rows)
SELECT * FROM wcag_techniques WHERE criterion_id = '9.9.9';
```

## Troubleshooting

### Foreign Key Constraint Fails

**Error:** `Cannot add foreign key constraint`

**Causes:**
1. wcag_criteria table doesn't exist
2. criterion_id type doesn't match wcag_criteria.id type
3. InnoDB engine not used

**Solution:**
```bash
# Run Task 1.2 first to create wcag_criteria table
mysql -u wcag_user -p wcag_db < database/migrations/001_create_wcag_criteria_table.sql

# Then run this migration
mysql -u wcag_user -p wcag_db < database/migrations/002_create_wcag_techniques_table.sql
```

### Table Already Exists

**Error:** `Table 'wcag_techniques' already exists`

**Solution:** The migration uses `IF NOT EXISTS`, so this shouldn't happen. To recreate:
```sql
DROP TABLE IF EXISTS wcag_techniques;
```
Then re-run the migration.

## Next Steps

After Task 1.3 is complete:
1. **Task 1.4:** Create wcag_examples table
2. **Task 1.5:** Create wcag_user_groups table
3. **Task 1.6:** Create wcag_key_summaries table
4. **Task 1.7:** Create wcag_interactive_config table

## Files Created

- `database/migrations/002_create_wcag_techniques_table.sql` - Migration SQL file
- `database/TASK-1.3-SUMMARY.md` - This documentation file

## Related Files

- `database/migrations/001_create_wcag_criteria_table.sql` - Parent table migration
- `database/migrations/run-migration.php` - PHP migration runner
- `.kiro/specs/wcag-db-migration/design.md` - Design specification
- `.kiro/specs/wcag-db-migration/requirements.md` - Requirements document
