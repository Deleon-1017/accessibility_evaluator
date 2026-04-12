@echo off
REM Run scan results migration
echo Running scan results migration...
mysql -u root -p wcag_db < migrations/007_create_scan_results_table.sql
echo Migration complete!
pause
