#!/bin/bash
# ============================================================================
# WCAG Database Setup Script for Linux/Mac
# ============================================================================
# This script sets up the MySQL database for the WCAG system
# ============================================================================

set -e

echo "============================================================"
echo "WCAG Database Setup for Linux/Mac"
echo "============================================================"
echo ""

# Check if MySQL is accessible
if ! command -v mysql &> /dev/null; then
    echo "ERROR: MySQL command not found in PATH"
    echo ""
    echo "Please install MySQL client or add it to your PATH"
    exit 1
fi

echo "This script will:"
echo "1. Create the wcag_db database"
echo "2. Create database users (wcag_reader and wcag_user)"
echo "3. Set up appropriate privileges"
echo ""
echo "You will be prompted for the MySQL root password."
echo ""
read -p "Press Enter to continue..."

# Run the setup SQL script
mysql -u root -p < database/setup.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================================"
    echo "Database setup completed successfully!"
    echo "============================================================"
    echo ""
    echo "IMPORTANT: Change default passwords before production use!"
    echo ""
    echo "Next steps:"
    echo "1. Copy .env.example to .env"
    echo "2. Update database credentials in .env"
    echo "3. Run: php test-db-connection.php"
    echo ""
else
    echo ""
    echo "============================================================"
    echo "Database setup failed!"
    echo "============================================================"
    echo ""
    echo "Please check:"
    echo "1. MySQL service is running"
    echo "2. Root password is correct"
    echo "3. You have administrative privileges"
    echo ""
    exit 1
fi
