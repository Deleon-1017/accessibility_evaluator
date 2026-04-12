# WCAG Database Migration - Complete Guide

## Overview

The WCAG guidelines have been successfully migrated from JavaScript (`wcag-data.js`) to a MySQL database. The application now fetches guidelines dynamically from the database via a REST API.

## What Changed

### Before
- WCAG data stored in `wcag-data.js` (static JavaScript file)
- Data loaded directly in the browser
- ~7000+ lines of JavaScript code
- No server-side filtering

### After
- WCAG data stored in MySQL database (`wcag_db`)
- Data fetched via REST API (`api/get-wcag-guidelines.php`)
- Dynamic server-side filtering by level and principle
- Improved performance and maintainability

## Files Created/Modified

### New Files

1. **`wcag.php`** - Main WCAG guidelines page (replaces wcag.html)
   - Fetches data from database via API
   - Supports URL parameters for filtering
   - Shows loading indicator while fetching data

2. **`api/get-wcag-guidelines.php`** - REST API endpoint
   - Returns WCAG guidelines as JSON
   - Supports filtering by level and principle
   - Includes all related data (techniques, examples, user groups, etc.)

3. **`database/migrate-wcag-data.php`** - Migration script
   - Migrates data from JavaScript to database
   - Handles all relationships between tables

4. **`database/verify-migration.php`** - Verification script
   - Checks migration success
   - Shows statistics about migrated data

5. **`database/convert-js-to-json.js`** - Node.js converter
   - Converts wcag-data.js to JSON format

6. **`database/prepare-for-export.js`** - Export preparation
   - Adds module.exports to wcag-data.js

7. **`database/MIGRATION-README.md`** - Migration documentation

### Modified Files

1. **`wcag.html`** - Now redirects to wcag.php
   - Maintains backward compatibility
   - Preserves query parameters

2. **`wcag-data.js`** - Modified for Node.js compatibility
   - Added module.exports
   - Commented out window assignment

## Database Structure

### Tables Created

```
wcag_criteria (39 records)
├── id (VARCHAR) - Primary key (e.g., "1.1.1")
├── principle (ENUM) - Perceivable, Operable, Understandable, Robust
├── title (VARCHAR) - Criterion title
├── level (ENUM) - A, AA, AAA
├── description (TEXT) - Full description
└── explanation (TEXT) - Additional context

wcag_techniques (131 records)
├── id (INT) - Auto-increment primary key
├── criterion_id (VARCHAR) - Foreign key to wcag_criteria
└── technique_code (VARCHAR) - e.g., "G94", "ARIA6"

wcag_examples (78 records - 39 before + 39 after)
├── id (INT) - Auto-increment primary key
├── criterion_id (VARCHAR) - Foreign key
├── state (ENUM) - 'before' or 'after'
├── html_code (TEXT) - HTML example
├── css_code (TEXT) - CSS example
├── js_code (TEXT) - JavaScript example
└── context (TEXT) - Explanation

wcag_user_groups (150 records)
├── id (INT) - Auto-increment primary key
├── criterion_id (VARCHAR) - Foreign key
└── user_group (VARCHAR) - Affected user group

wcag_key_summaries (190 records)
├── id (INT) - Auto-increment primary key
├── criterion_id (VARCHAR) - Foreign key
├── summary_text (TEXT) - Summary point
└── display_order (INT) - Display order

wcag_interactive_config (39 records)
├── criterion_id (VARCHAR) - Primary key and foreign key
└── enabled (BOOLEAN) - Interactive examples enabled
```

## API Usage

### Endpoint

```
GET /api/get-wcag-guidelines.php
```

### Query Parameters

- `level` - Filter by conformance level (A, AA, AAA)
- `principle` - Filter by principle (Perceivable, Operable, Understandable, Robust)

### Examples

```bash
# Get all guidelines
GET /api/get-wcag-guidelines.php

# Get only Level A guidelines
GET /api/get-wcag-guidelines.php?level=A

# Get only Perceivable guidelines
GET /api/get-wcag-guidelines.php?principle=Perceivable

# Get Level AA Operable guidelines
GET /api/get-wcag-guidelines.php?level=AA&principle=Operable
```

### Response Format

```json
{
  "success": true,
  "count": 39,
  "data": [
    {
      "id": "1.1.1",
      "principle": "Perceivable",
      "title": "Non-text Content",
      "level": "A",
      "description": "All non-text content...",
      "explanation": "Images must have...",
      "techniques": ["G94", "G95", "ARIA6", "ARIA10"],
      "examples": {
        "before": {
          "html": "...",
          "css": "...",
          "js": "...",
          "context": "..."
        },
        "after": {
          "html": "...",
          "css": "...",
          "js": "...",
          "context": "..."
        },
        "userGroups": ["screen reader users", "..."],
        "keySummary": ["Point 1", "Point 2", "..."],
        "interactive": {
          "enabled": false
        },
        "principle": "Perceivable"
      }
    }
  ]
}
```

## How to Use

### Accessing the Page

1. **Direct URL**: `http://localhost/trial/wcag.php`
2. **With filters**: 
   - `wcag.php?level=A`
   - `wcag.php?principle=Operable`
   - `wcag.php?level=AA&principle=Perceivable`

### Old URLs Still Work

- `wcag.html` automatically redirects to `wcag.php`
- Query parameters are preserved during redirect

## Testing

### Test API Endpoint

```bash
php test-api.php
```

Expected output:
```
Testing WCAG Guidelines API...

✓ API Test Successful!
  Guidelines loaded: 39

  Sample Guideline:
    ID: 1.1.1
    Title: Non-text Content
    Principle: Perceivable
    Level: A
    Techniques: 4
    Has Examples: Yes
```

### Verify Migration

```bash
php database/verify-migration.php
```

## Migration Statistics

- **Total Criteria**: 39
  - Perceivable: 11
  - Operable: 14
  - Understandable: 11
  - Robust: 3

- **By Level**:
  - Level A: 25
  - Level AA: 12
  - Level AAA: 2

- **Related Data**:
  - Techniques: 131
  - Examples: 78 (39 before + 39 after)
  - User Groups: 150
  - Key Summaries: 190
  - Interactive Configs: 39 (14 enabled)

## Benefits

1. **Performance**: Server-side filtering reduces data transfer
2. **Maintainability**: Easier to update guidelines in database
3. **Scalability**: Can add more guidelines without modifying code
4. **Flexibility**: Can create multiple views and filters
5. **Data Integrity**: Database constraints ensure data consistency
6. **API Access**: Other applications can consume the API

## Future Enhancements

1. Add caching layer (Redis/Memcached) for better performance
2. Create admin interface for managing guidelines
3. Add search functionality
4. Implement pagination for large result sets
5. Add API authentication for write operations
6. Create additional API endpoints (single guideline, search, etc.)

## Troubleshooting

### API Returns Empty Data

Check database connection in `config/db-config.php` and `.env` file.

### Page Shows Loading Forever

1. Check browser console for JavaScript errors
2. Verify API endpoint is accessible
3. Check database connection

### Old wcag.html Not Redirecting

Clear browser cache or use Ctrl+F5 to hard refresh.

## Rollback Plan

If you need to revert to the JavaScript version:

1. Rename `wcag.html.backup` to `wcag.html` (if you created a backup)
2. Update navigation links to point to `wcag.html`
3. The JavaScript files (`wcag-data.js`, `wcag-script.js`) are still present

## Support

For issues or questions:
1. Check database connection settings
2. Verify all migrations ran successfully
3. Test API endpoint directly
4. Check PHP error logs

## Credits

- Migration completed: 2026
- Database: MySQL 5.7+
- PHP Version: 7.4+
- Framework: Bootstrap 5.3.8
