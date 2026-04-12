@echo off
REM ============================================================================
REM WCAG Database Setup Script for Windows (XAMPP)
REM ============================================================================
REM This script sets up the database for XAMPP users on Windows
REM ============================================================================

echo ============================================================
echo WCAG Database Setup for Windows/XAMPP
echo ============================================================
echo.

REM Check if MySQL is accessible
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: MySQL command not found in PATH
    echo.
    echo For XAMPP users, try:
    echo   C:\xampp\mysql\bin\mysql -u root -p ^< database\setup.sql
    echo.
    pause
    exit /b 1
)

echo This script will:
echo 1. Create the wcag_db database
echo 2. Create database users (wcag_reader and wcag_user)
echo 3. Set up appropriate privileges
echo.
echo You will be prompted for the MySQL root password.
echo.
pause

REM Run the setup SQL script
mysql -u root -p < database\setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================================
    echo Database setup completed successfully!
    echo ============================================================
    echo.
    echo IMPORTANT: Change default passwords before production use!
    echo.
    echo Next steps:
    echo 1. Copy .env.example to .env
    echo 2. Update database credentials in .env
    echo 3. Run: php test-db-connection.php
    echo.
) else (
    echo.
    echo ============================================================
    echo Database setup failed!
    echo ============================================================
    echo.
    echo Please check:
    echo 1. MySQL service is running
    echo 2. Root password is correct
    echo 3. You have administrative privileges
    echo.
)

pause
