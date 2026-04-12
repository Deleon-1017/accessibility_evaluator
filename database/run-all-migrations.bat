@echo off
echo ============================================
echo WCAG Database Migration - Create All Tables
echo ============================================
echo.

REM Set MySQL path
set MYSQL=C:\xampp\mysql\bin\mysql

REM Check if MySQL is running
echo Checking MySQL connection...
%MYSQL% -u root -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to MySQL!
    echo Please start MySQL in XAMPP Control Panel first.
    pause
    exit /b 1
)
echo MySQL is running!
echo.

REM Create database and users
echo Step 1: Creating database and users...
%MYSQL% -u root < database\setup.sql
if errorlevel 1 (
    echo ERROR: Failed to create database!
    pause
    exit /b 1
)
echo Database created successfully!
echo.

REM Run migrations
echo Step 2: Creating tables...
echo.

echo [1/6] Creating wcag_criteria table...
%MYSQL% -u root wcag_db < database\migrations\001_create_wcag_criteria_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_criteria table!
    pause
    exit /b 1
)
echo Done!

echo [2/6] Creating wcag_techniques table...
%MYSQL% -u root wcag_db < database\migrations\002_create_wcag_techniques_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_techniques table!
    pause
    exit /b 1
)
echo Done!

echo [3/6] Creating wcag_examples table...
%MYSQL% -u root wcag_db < database\migrations\003_create_wcag_examples_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_examples table!
    pause
    exit /b 1
)
echo Done!

echo [4/6] Creating wcag_user_groups table...
%MYSQL% -u root wcag_db < database\migrations\004_create_wcag_user_groups_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_user_groups table!
    pause
    exit /b 1
)
echo Done!

echo [5/6] Creating wcag_key_summaries table...
%MYSQL% -u root wcag_db < database\migrations\005_create_wcag_key_summaries_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_key_summaries table!
    pause
    exit /b 1
)
echo Done!

echo [6/6] Creating wcag_interactive_config table...
%MYSQL% -u root wcag_db < database\migrations\006_create_wcag_interactive_config_table.sql
if errorlevel 1 (
    echo ERROR: Failed to create wcag_interactive_config table!
    pause
    exit /b 1
)
echo Done!

echo.
echo ============================================
echo SUCCESS! All tables created successfully!
echo ============================================
echo.
echo Database: wcag_db
echo Tables created: 6
echo   - wcag_criteria
echo   - wcag_techniques
echo   - wcag_examples
echo   - wcag_user_groups
echo   - wcag_key_summaries
echo   - wcag_interactive_config
echo.
echo You can now verify in phpMyAdmin:
echo http://localhost/phpmyadmin
echo.
pause
