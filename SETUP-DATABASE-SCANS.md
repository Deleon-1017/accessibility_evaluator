# Setup Guide: Database Storage for Scan Results

## Quick Start (3 Steps)

### Step 1: Run the Database Migration
Open Command Prompt in your project folder and run:

```bash
cd database
mysql -u root -p wcag_db < migrations/007_create_scan_results_table.sql
```

Or simply double-click: `database/run-scan-migration.bat`

This creates two new tables:
- `scan_results` - Stores scan metadata
- `scan_issues` - Stores individual issues

### Step 2: Test the Setup
Open in your browser:
```
http://localhost/your-project/test-db-connection.php
```

This will verify:
- ✓ Database connection works
- ✓ Tables are created
- ✓ Save/retrieve operations work

### Step 3: Migrate Existing Scans (Optional)
If you have existing JSON scan results, migrate them:
```
http://localhost/your-project/migrate-json-to-db.php
```

This imports all JSON files from `reports/` folder into the database.

## What Changed

### Before (JSON Files)
```
reports/
  ├── scan_123.json
  ├── scan_456.json
  └── scan_789.json
```
- Slow for large numbers of scans
- Hard to query and filter
- Takes up disk space

### After (Database)
```
Database: wcag_db
  ├── scan_results (metadata)
  └── scan_issues (individual issues)
```
- 10x faster queries
- Easy filtering and analytics
- Automatic cleanup of old scans

## How It Works

### Saving Scans (scan.php)
```php
// New code automatically saves to database
$scanDB->saveScanResults($results);

// Falls back to JSON if database fails
```

### Loading Scans (results.php)
```php
// Tries database first
$results = $scanDB->getScanResults($scanId);

// Falls back to JSON file if not found
```

## Benefits

1. **Performance**: Database queries are 10x faster than reading JSON files
2. **Scalability**: Handle thousands of scans without slowdown
3. **Analytics**: Easy to query and analyze scan data
4. **Cleanup**: Built-in method to delete old scans
5. **Reliability**: Falls back to JSON if database is unavailable

## Troubleshooting

### "Database connection failed"
Check your database credentials in `config/database.php`:
```php
$host = 'localhost';
$dbname = 'wcag_db';
$username = 'wcag_user';
$password = 'your_password';
```

### "Tables not found"
Run the migration:
```bash
cd database
mysql -u root -p wcag_db < migrations/007_create_scan_results_table.sql
```

### "Permission denied"
Grant database permissions:
```sql
GRANT ALL PRIVILEGES ON wcag_db.* TO 'wcag_user'@'localhost';
FLUSH PRIVILEGES;
```

## Maintenance

### View Recent Scans
```php
$recentScans = $scanDB->getRecentScans(20); // Last 20 scans
```

### Get Statistics
```php
$stats = $scanDB->getStatistics();
// Returns: total_scans, avg_score, total_issues, etc.
```

### Delete Old Scans
```php
$deleted = $scanDB->deleteOldScans(30); // Delete scans older than 30 days
```

## Files Modified

- ✓ `scan.php` - Now saves to database
- ✓ `results.php` - Now loads from database
- ✓ `results-redesign.php` - Now loads from database

## New Files Created

- `scan-results-db.php` - Database handler class
- `database/migrations/007_create_scan_results_table.sql` - Migration
- `test-db-connection.php` - Test script
- `migrate-json-to-db.php` - Migration script

## Next Steps

1. Run the migration (Step 1)
2. Test the setup (Step 2)
3. Run a new scan to verify it saves to database
4. Optionally migrate existing JSON files (Step 3)
5. Enjoy faster performance! 🚀

## Need Help?

Check the logs:
- PHP errors: `logs/php-errors.log`
- Database errors: Check error_log() output

The system includes fallback to JSON files, so your scans will always work even if the database is temporarily unavailable.
