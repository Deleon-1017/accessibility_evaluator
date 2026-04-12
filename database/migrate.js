/**
 * WCAG Database Migration Script
 * Migrates WCAG data from wcag-data.js to MySQL database
 * 
 * Requirements: 2.1, 2.4, 10.3
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * WCAGMigration class handles the migration of WCAG data from JavaScript to MySQL
 */
class WCAGMigration {
  /**
   * Initialize migration with database configuration
   * @param {Object} dbConfig - Database configuration object
   */
  constructor(dbConfig = null) {
    // Load configuration from environment variables or use provided config
    this.dbConfig = dbConfig || {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'wcag_user',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'wcag_db',
      charset: process.env.DB_CHARSET || 'utf8mb4'
    };

    this.connection = null;

    // Initialize migration statistics tracking
    this.stats = {
      criteria: 0,
      techniques: 0,
      examples: 0,
      userGroups: 0,
      keySummaries: 0,
      errors: []
    };
  }

  /**
   * Establish database connection
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      console.log('Connecting to database...');
      console.log(`Host: ${this.dbConfig.host}:${this.dbConfig.port}`);
      console.log(`Database: ${this.dbConfig.database}`);
      console.log(`User: ${this.dbConfig.user}`);

      this.connection = await mysql.createConnection(this.dbConfig);
      
      console.log('✓ Database connection established successfully');
    } catch (error) {
      console.error('✗ Failed to connect to database:', error.message);
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  /**
   * Close database connection
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      console.log('✓ Database connection closed');
    }
  }

  /**
   * Get current database connection
   * @returns {Object} MySQL connection object
   */
  getConnection() {
    if (!this.connection) {
      throw new Error('Database connection not established. Call connect() first.');
    }
    return this.connection;
  }

  /**
   * Get migration statistics
   * @returns {Object} Statistics object with counts and errors
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Reset migration statistics
   */
  resetStats() {
    this.stats = {
      criteria: 0,
      techniques: 0,
      examples: 0,
      userGroups: 0,
      keySummaries: 0,
      errors: []
    };
  }

  /**
   * Print migration statistics to console
   */
  printStats() {
    console.log('\n' + '='.repeat(50));
    console.log('Migration Statistics:');
    console.log('='.repeat(50));
    console.log(`✓ Criteria migrated:      ${this.stats.criteria}`);
    console.log(`✓ Techniques inserted:    ${this.stats.techniques}`);
    console.log(`✓ Examples inserted:      ${this.stats.examples}`);
    console.log(`✓ User groups inserted:   ${this.stats.userGroups}`);
    console.log(`✓ Key summaries inserted: ${this.stats.keySummaries}`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n✗ Errors encountered:     ${this.stats.errors.length}`);
      console.log('\nError Details:');
      this.stats.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n✓ No errors encountered');
    }
    console.log('='.repeat(50) + '\n');
  }

  /**
   * Validate database configuration
   * @throws {Error} If configuration is invalid
   */
  validateConfig() {
    const required = ['host', 'port', 'user', 'database'];
    const missing = required.filter(key => !this.dbConfig[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required database configuration: ${missing.join(', ')}`);
    }

    if (typeof this.dbConfig.port !== 'number' || this.dbConfig.port < 1 || this.dbConfig.port > 65535) {
      throw new Error('Invalid database port number');
    }
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      await this.connect();
      const [rows] = await this.connection.query('SELECT 1 as test');
      await this.disconnect();
      return rows[0].test === 1;
    } catch (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
  }

  /**
   * Load and parse source data from wcag-data.js file
   * Requirements: 2.1
   * 
   * @param {string} sourceFile - Path to wcag-data.js file
   * @returns {Array} Array of WCAG criteria objects
   * @throws {Error} If file cannot be read or parsed
   */
  loadSourceData(sourceFile) {
    console.log(`Loading source data from: ${sourceFile}`);
    
    try {
      // Read file content
      const content = fs.readFileSync(sourceFile, 'utf8');
      
      // Find the start of the wcagGuidelines array
      const startMatch = content.match(/const\s+wcagGuidelines\s*=\s*\[/);
      
      if (!startMatch) {
        throw new Error('Could not find wcagGuidelines array in source file');
      }
      
      // Find the position where the array starts
      const startPos = startMatch.index + startMatch[0].length - 1; // Include the opening bracket
      
      // Find the matching closing bracket
      let bracketCount = 0;
      let endPos = startPos;
      
      for (let i = startPos; i < content.length; i++) {
        if (content[i] === '[' || content[i] === '{') {
          bracketCount++;
        } else if (content[i] === ']' || content[i] === '}') {
          bracketCount--;
          if (bracketCount === 0 && content[i] === ']') {
            endPos = i + 1;
            break;
          }
        }
      }
      
      if (endPos === startPos) {
        throw new Error('Could not find closing bracket for wcagGuidelines array');
      }
      
      // Extract the array string
      const arrayString = content.substring(startPos, endPos);
      
      // Parse the JavaScript array
      let data;
      
      try {
        // Try parsing as JSON first (for test files with quoted keys)
        data = JSON.parse(arrayString);
      } catch (jsonError) {
        // If JSON parsing fails, evaluate as JavaScript
        // This is safe because we control the source file
        data = eval(`(${arrayString})`);
      }
      
      console.log(`✓ Successfully loaded ${data.length} criteria from source file`);
      
      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Source file not found: ${sourceFile}`);
      }
      if (error instanceof SyntaxError) {
        throw new Error(`Failed to parse source file: ${error.message}`);
      }
      throw new Error(`Failed to load source data: ${error.message}`);
    }
  }

  /**
   * Validate all WCAG criteria data
   * Requirements: 2.2, 2.5
   * 
   * @param {Array} data - Array of WCAG criteria objects
   * @throws {Error} If validation fails with details about invalid data
   */
  validateData(data) {
    console.log('Validating source data...');
    
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }
    
    if (data.length === 0) {
      throw new Error('Data array is empty');
    }
    
    const errors = [];
    const seenIds = new Set();
    
    // Validate each criterion
    for (let i = 0; i < data.length; i++) {
      const criterion = data[i];
      
      try {
        this.validateCriterion(criterion);
        
        // Check for duplicate IDs
        if (seenIds.has(criterion.id)) {
          errors.push(`Duplicate criterion ID found: ${criterion.id}`);
        }
        seenIds.add(criterion.id);
        
      } catch (error) {
        errors.push(`Criterion at index ${i} (ID: ${criterion.id || 'unknown'}): ${error.message}`);
      }
    }
    
    if (errors.length > 0) {
      const errorMessage = `Validation failed with ${errors.length} error(s):\n  - ${errors.join('\n  - ')}`;
      throw new Error(errorMessage);
    }
    
    console.log(`✓ All ${data.length} criteria validated successfully`);
  }

  /**
   * Validate a single WCAG criterion
   * Requirements: 2.2, 2.5
   * 
   * @param {Object} criterion - WCAG criterion object
   * @throws {Error} If criterion is invalid with specific field details
   */
  validateCriterion(criterion) {
    const validPrinciples = ['Perceivable', 'Operable', 'Understandable', 'Robust'];
    const validLevels = ['A', 'AA', 'AAA'];
    
    // Validate required fields exist
    if (!criterion.id) {
      throw new Error('Missing required field: id');
    }
    if (!criterion.principle) {
      throw new Error('Missing required field: principle');
    }
    if (!criterion.title) {
      throw new Error('Missing required field: title');
    }
    if (!criterion.level) {
      throw new Error('Missing required field: level');
    }
    if (!criterion.description) {
      throw new Error('Missing required field: description');
    }
    
    // Validate criterion ID format (X.X.X pattern)
    const idPattern = /^\d+\.\d+\.\d+$/;
    if (!idPattern.test(criterion.id)) {
      throw new Error(`Invalid criterion ID format: ${criterion.id} (expected X.X.X pattern)`);
    }
    
    // Validate principle value
    if (!validPrinciples.includes(criterion.principle)) {
      throw new Error(`Invalid principle: ${criterion.principle} (must be one of: ${validPrinciples.join(', ')})`);
    }
    
    // Validate level value
    if (!validLevels.includes(criterion.level)) {
      throw new Error(`Invalid level: ${criterion.level} (must be one of: ${validLevels.join(', ')})`);
    }
    
    // Validate field types
    if (typeof criterion.id !== 'string') {
      throw new Error('Field "id" must be a string');
    }
    if (typeof criterion.principle !== 'string') {
      throw new Error('Field "principle" must be a string');
    }
    if (typeof criterion.title !== 'string') {
      throw new Error('Field "title" must be a string');
    }
    if (typeof criterion.level !== 'string') {
      throw new Error('Field "level" must be a string');
    }
    if (typeof criterion.description !== 'string') {
      throw new Error('Field "description" must be a string');
    }
    
    // Validate optional fields if present
    if (criterion.explanation !== undefined && typeof criterion.explanation !== 'string') {
      throw new Error('Field "explanation" must be a string');
    }
    if (criterion.techniques !== undefined && !Array.isArray(criterion.techniques)) {
      throw new Error('Field "techniques" must be an array');
    }
  }
}

// Export the class
module.exports = WCAGMigration;

// If running directly (not imported as module)
if (require.main === module) {
  console.log('WCAG Database Migration Tool');
  console.log('============================\n');
  
  // Create migration instance
  const migration = new WCAGMigration();
  
  // Validate configuration
  try {
    migration.validateConfig();
    console.log('✓ Configuration validated');
  } catch (error) {
    console.error('✗ Configuration error:', error.message);
    process.exit(1);
  }
  
  // Test connection
  migration.testConnection()
    .then(success => {
      if (success) {
        console.log('✓ Database connection test successful');
        console.log('\nMigration script is ready to use.');
        console.log('Import this module to run migrations programmatically.');
      } else {
        console.error('✗ Database connection test failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('✗ Unexpected error:', error.message);
      process.exit(1);
    });
}
