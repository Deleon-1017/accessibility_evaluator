/**
 * Test script for WCAGMigration class
 * Demonstrates basic usage and connection testing
 */

const WCAGMigration = require('./migrate.js');

async function testMigration() {
  console.log('Testing WCAG Migration Script');
  console.log('==============================\n');

  // Create migration instance
  const migration = new WCAGMigration();

  try {
    // Step 1: Validate configuration
    console.log('Step 1: Validating configuration...');
    migration.validateConfig();
    console.log('✓ Configuration is valid\n');

    // Step 2: Display configuration (without password)
    console.log('Step 2: Database configuration:');
    const config = migration.dbConfig;
    console.log(`  Host:     ${config.host}:${config.port}`);
    console.log(`  Database: ${config.database}`);
    console.log(`  User:     ${config.user}`);
    console.log(`  Charset:  ${config.charset}\n`);

    // Step 3: Test connection
    console.log('Step 3: Testing database connection...');
    const connected = await migration.testConnection();
    
    if (connected) {
      console.log('✓ Connection test successful!\n');
    } else {
      console.log('✗ Connection test failed\n');
      console.log('Please check:');
      console.log('  1. MySQL server is running');
      console.log('  2. Database credentials in .env are correct');
      console.log('  3. Database "wcag_db" exists');
      console.log('  4. User has proper permissions\n');
      return;
    }

    // Step 4: Demonstrate statistics tracking
    console.log('Step 4: Statistics tracking demonstration:');
    console.log('Initial statistics:');
    console.log(migration.getStats());
    
    // Simulate some statistics
    migration.stats.criteria = 5;
    migration.stats.techniques = 15;
    migration.stats.examples = 10;
    
    console.log('\nAfter simulated migration:');
    migration.printStats();
    
    // Reset statistics
    migration.resetStats();
    console.log('After reset:');
    console.log(migration.getStats());

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  }
}

// Run the test
testMigration();
