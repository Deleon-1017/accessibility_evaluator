# WCAG Data Migration Guide

This guide explains how to migrate WCAG data from `wcag-data.js` to the MySQL database.

## Overview

The migration process involves:
1. Converting JavaScript data to JSON format
2. Running database migrations to create tables
3. Importing the JSON data into the database

## Prerequisites

- Node.js installed (for JS to JSON conversion)
- PHP 7.4+ with MySQLi extension
- MySQL 5.7+ or MariaDB 10.2+
- Database configured in `config/db-config.php`

## Step-by-Step Migration

### Step 1: Setup Database

First, create the database and tables:

```bash
# Create database and users
mysql -u root -p < database/setup.sql

# Run all migrations
cd database/migrations
php run-migration.php
```

Or use the batch file on Windows:
```bash
database\run-all-migrations.bat
```

### Step 2: Convert JavaScript to JSON

Convert the `wcag-data.js` file to JSON format:

```bash
node database/convert-js-to-json.js
```

This will create `wcag-data.json` in the root directory.

### Step 3: Run Migration Script

Import the data into the database:

```bash
php database/migrate-wcag-data.php
```

## What Gets Migrated

The migration script imports:

- **WCAG Criteria** (wcag_criteria table)
  - ID, principle, title, level, description, explanation

- **Techniques** (wcag_techniques table)
  - Technique codes (e.g., "G94", "ARIA6")

- **Examples** (wcag_examples table)
  - Before/after HTML, CSS, JavaScript code
  - Context and explanations

- **User Groups** (wcag_user_groups table)
  - Affected user groups (e.g., "screen reader users")

- **Key Summaries** (wcag_key_summaries table)
  - Bullet point summaries for each criterion

- **Interactive Config** (wcag_interactive_config table)
  - Whether interactive examples are enabled

## Database Structure

```
wcag_criteria (parent table)
├── wcag_techniques (many-to-one)
├── wcag_examples (many-to-one)
├── wcag_user_groups (many-to-one)
├── wcag_key_summaries (many-to-one)
└── wcag_interactive_config (one-to-one)
```

## Verification

After migration, verify the data:

```sql
-- Check criteria count
SELECT COUNT(*) FROM wcag_criteria;

-- Check data by principle
SELECT principle, COUNT(*) as count 
FROM wcag_criteria 
GROUP BY principle;

-- Check examples
SELECT criterion_id, state, 
       LENGTH(html_code) as html_size,
       LENGTH(css_code) as css_size,
       LENGTH(js_code) as js_size
FROM wcag_examples
LIMIT 10;

-- Check relationships
SELECT 
    c.id,
    c.title,
    COUNT(DISTINCT t.id) as techniques,
    COUNT(DISTINCT e.id) as examples,
    COUNT(DISTINCT u.id) as user_groups,
    COUNT(DISTINCT k.id) as summaries
FROM wcag_criteria c
LEFT JOIN wcag_techniques t ON c.id = t.criterion_id
LEFT JOIN wcag_examples e ON c.id = e.criterion_id
LEFT JOIN wcag_user_groups u ON c.id = u.criterion_id
LEFT JOIN wcag_key_summaries k ON c.id = k.criterion_id
GROUP BY c.id
LIMIT 10;
```

## Troubleshooting

### Error: "File not found: wcag-data.json"

Run the conversion script first:
```bash
node database/convert-js-to-json.js
```

### Error: "Table doesn't exist"

Run the migrations first:
```bash
cd database/migrations
php run-migration.php
```

### Error: "Access denied for user"

Check your database credentials in `config/db-config.php` and `.env` file.

### Error: "Duplicate entry"

The migration script clears existing data before importing. If you get this error, manually clear the tables:

```sql
USE wcag_db;
DELETE FROM wcag_interactive_config;
DELETE FROM wcag_key_summaries;
DELETE FROM wcag_user_groups;
DELETE FROM wcag_examples;
DELETE FROM wcag_techniques;
DELETE FROM wcag_criteria;
```

## Re-running Migration

To re-run the migration (this will delete existing data):

```bash
# Convert JS to JSON (if wcag-data.js changed)
node database/convert-js-to-json.js

# Run migration
php database/migrate-wcag-data.php
```

The script automatically clears existing data before importing.

## Expected Output

Successful migration output:
```
=================================================================
WCAG Data Migration Script
=================================================================

Reading data file: /path/to/wcag-data.json
Successfully loaded 50 WCAG criteria

Clearing existing data...
  ✓ Cleared wcag_interactive_config
  ✓ Cleared wcag_key_summaries
  ✓ Cleared wcag_user_groups
  ✓ Cleared wcag_examples
  ✓ Cleared wcag_techniques
  ✓ Cleared wcag_criteria

Starting data migration...

Migrating criterion 1.1.1 - Non-text Content...
  ✓ Successfully migrated criterion 1.1.1

Migrating criterion 1.2.1 - Audio-only and Video-only (Prerecorded)...
  ✓ Successfully migrated criterion 1.2.1

...

=================================================================
Migration Summary
=================================================================
Total criteria: 50
Successfully migrated: 50
Errors: 0
=================================================================

Migration completed successfully!
```

## Next Steps

After successful migration:

1. Update your application to fetch data from the database instead of JavaScript
2. Create API endpoints to serve WCAG data
3. Test the application with database-backed data
4. Consider adding caching for better performance

## Files

- `convert-js-to-json.js` - Converts JavaScript to JSON
- `migrate-wcag-data.php` - Main migration script
- `wcag-data.json` - Generated JSON file (not in git)
- `MIGRATION-README.md` - This file
