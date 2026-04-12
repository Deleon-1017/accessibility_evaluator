<?php
/**
 * Database Connection Manager
 * 
 * Provides PDO database connections with connection pooling support.
 * Supports both read-write and read-only connections for security.
 * 
 * Requirements: 1.1, 5.6, 8.4, 10.6
 */

class Database {
    private static $connections = [];
    private static $config = null;
    
    /**
     * Get database configuration
     */
    private static function getConfig(): array {
        if (self::$config === null) {
            self::$config = require __DIR__ . '/db-config.php';
        }
        return self::$config;
    }
    
    /**
     * Get database connection
     * 
     * @param string $connection Connection name ('default' or 'readonly')
     * @return PDO Database connection
     * @throws PDOException If connection fails
     */
    public static function getConnection(string $connection = 'default'): PDO {
        // Return existing connection if available (connection pooling)
        if (isset(self::$connections[$connection])) {
            return self::$connections[$connection];
        }
        
        $config = self::getConfig();
        
        if (!isset($config[$connection])) {
            throw new InvalidArgumentException("Unknown connection: $connection");
        }
        
        $conn = $config[$connection];
        
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%d;dbname=%s;charset=%s',
                $conn['host'],
                $conn['port'],
                $conn['database'],
                $conn['charset']
            );
            
            $pdo = new PDO(
                $dsn,
                $conn['username'],
                $conn['password'],
                $conn['options']
            );
            
            // Store connection for reuse
            self::$connections[$connection] = $pdo;
            
            return $pdo;
            
        } catch (PDOException $e) {
            error_log("Database connection error ($connection): " . $e->getMessage());
            throw new PDOException("Failed to connect to database: " . $e->getMessage());
        }
    }
    
    /**
     * Get read-write connection
     */
    public static function getWriteConnection(): PDO {
        return self::getConnection('default');
    }
    
    /**
     * Get read-only connection
     */
    public static function getReadConnection(): PDO {
        return self::getConnection('readonly');
    }
    
    /**
     * Test database connection
     * 
     * @param string $connection Connection name
     * @return bool True if connection successful
     */
    public static function testConnection(string $connection = 'default'): bool {
        try {
            $pdo = self::getConnection($connection);
            $pdo->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            error_log("Database connection test failed ($connection): " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Close all connections
     */
    public static function closeAll(): void {
        self::$connections = [];
    }
    
    /**
     * Get database info
     * 
     * @return array Database information
     */
    public static function getInfo(): array {
        try {
            $pdo = self::getReadConnection();
            
            $stmt = $pdo->query("
                SELECT 
                    DATABASE() as db_name,
                    @@character_set_database as charset,
                    @@collation_database as collation,
                    VERSION() as version
            ");
            
            return $stmt->fetch();
            
        } catch (PDOException $e) {
            error_log("Failed to get database info: " . $e->getMessage());
            return [];
        }
    }
}

/**
 * Helper function for backward compatibility
 * Returns a PDO connection for general use
 * 
 * @return PDO Database connection
 */
function getDatabaseConnection(): PDO {
    return Database::getWriteConnection();
}
