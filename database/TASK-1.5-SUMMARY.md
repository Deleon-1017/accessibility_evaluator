# Task 1.5 Summary: Create wcag_user_groups Table

## Completed: ✓

### Migration File Created
- **File**: `database/migrations/004_create_wcag_user_groups_table.sql`
- **Status**: Created and ready for execution

### Table Structure

```sql
CREATE TABLE IF NOT EXISTS wcag_user_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criterion_id VARCHAR(10) NOT NULL,
    user_group VARCHAR(255) NOT NULL,
    FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE,
    INDEX idx_criterion (criterion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Implementation Details

#### Fields
1. **id** (INT AUTO_INCREMENT PRIMARY KEY)
   - Auto-incrementing primary key for unique user group records
   
2. **criterion_id** (VARCHAR(10) NOT NULL)
   - Foreign key to wcag_criteria.id
   - Links user groups to their parent criterion
   
3. **user_group** (VARCHAR(255) NOT NULL)
   - Stores affected user group descriptions
   - Examples: "screen reader users", "users with images disabled", "keyboard-only users"
   - Supports descriptive text up to 255 characters

#### Constraints
1. **Foreign Key with CASCADE Delete**
   - `FOREIGN KEY (criterion_id) REFERENCES wcag_criteria(id) ON DELETE CASCADE`
   - Ensures referential integrity
   - Automatically deletes user groups when parent criterion is deleted
   
2. **NOT NULL Constraints**
   - criterion_id: Required to link to parent criterion
   - user_group: Required to store the user group description

#### Indexes
1. **Index on criterion_id**
   - `INDEX idx_criterion (criterion_id)`
   - Optimizes joins and lookups by criterion
   - Common query pattern: "Get all user groups affected by criterion X"

#### Database Configuration
- **Engine**: InnoDB (required for foreign key support)
- **Character Set**: utf8mb4 (full Unicode support)
- **Collation**: utf8mb4_unicode_ci (case-insensitive Unicode sorting)

### Requirements Satisfied

✅ **Requirement 1.1**: Database schema design
- Normalized table structure with proper data types
- Referential integrity through foreign keys

✅ **Requirement 1.2**: Referential integrity
- Foreign key constraint to wcag_criteria with CASCADE delete
- Ensures data consistency

✅ **Requirement 1.3**: Appropriate data types
- VARCHAR(255) for user_group (supports descriptive text)
- VARCHAR(10) for criterion_id (matches parent table)
- INT AUTO_INCREMENT for primary key

### How to Execute

#### Using Migration Runner
```bash
php database/migrations/run-migration.php 004_create_wcag_user_groups_table.sql
```

#### Using MySQL Command Line
```bash
mysql -u root -p wcag_db < database/migrations/004_create_wcag_user_groups_table.sql
```

#### Using phpMyAdmin
1. Open phpMyAdmin
2. Select `wcag_db` database
3. Go to SQL tab
4. Copy and paste the contents of `004_create_wcag_user_groups_table.sql`
5. Click "Go"

### Verification Queries

The migration file includes verification queries:

```sql
-- Verify table structure
DESCRIBE wcag_user_groups;

-- Show indexes
SHOW INDEX FROM wcag_user_groups;

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
    AND TABLE_NAME = 'wcag_user_groups'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Expected Results

After successful execution:
- Table `wcag_user_groups` created in `wcag_db` database
- Foreign key constraint to `wcag_criteria` table established
- Index on criterion_id created
- Ready to store user group information for each criterion

### Example Data

Once the table is created, it will store data like:

| id | criterion_id | user_group |
|----|--------------|------------|
| 1  | 1.1.1        | screen reader users |
| 2  | 1.1.1        | users with images disabled |
| 3  | 1.2.1        | deaf or hard of hearing users |
| 4  | 1.4.3        | users with low vision |
| 5  | 2.1.1        | keyboard-only users |

### Next Steps

1. Execute this migration (Task 1.5) ✓
2. Create wcag_key_summaries table (Task 1.6)
3. Create wcag_interactive_config table (Task 1.7)
4. Implement data migration script (Task 2)

### Notes

- Migration file follows the same pattern as previous migrations (001, 002, 003)
- Includes comprehensive comments for documentation
- Includes verification queries for testing
- Uses IF NOT EXISTS for idempotent execution
- Ready for production use
- Each criterion can have multiple user groups (one-to-many relationship)
