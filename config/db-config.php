<?php
/**
 * Database Configuration
 * 
 * Returns database connection configuration arrays for different connection types.
 * Loads credentials from environment variables for security.
 * 
 * Requirements: 8.7, 10.4
 */

// Load environment variables from .env file if it exists
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // Skip comments
        }
        
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
    }
}

// Helper function to get environment variable with default
function env(string $key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }
    return $value;
}

// Database configuration
return [
    // Default (read-write) connection
    'default' => [
        'host' => env('DB_HOST', 'localhost'),
        'port' => (int) env('DB_PORT', 3306),
        'database' => env('DB_NAME', 'wcag_db'),
        'username' => env('DB_USER', 'wcag_user'),
        'password' => env('DB_PASSWORD', ''),
        'charset' => env('DB_CHARSET', 'utf8mb4'),
        'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => false,
        ],
    ],
    
    // Read-only connection
    'readonly' => [
        'host' => env('DB_HOST', 'localhost'),
        'port' => (int) env('DB_PORT', 3306),
        'database' => env('DB_NAME', 'wcag_db'),
        'username' => env('DB_READER_USER', 'wcag_reader'),
        'password' => env('DB_READER_PASSWORD', ''),
        'charset' => env('DB_CHARSET', 'utf8mb4'),
        'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
        'options' => [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => false,
        ],
    ],
];
