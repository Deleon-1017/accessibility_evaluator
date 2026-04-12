/**
 * Test script to validate the real wcag-data.js file
 * This tests the implementation with actual production data
 */

const path = require('path');
const WCAGMigration = require('./migrate.js');

async function testRealData() {
  console.log('Testing with real wcag-data.js file\n');
  console.log('='.repeat(50));
  
  const migration = new WCAGMigration();
  const sourceFile = path.join(__dirname, '..', 'wcag-data.js');
  
  try {
    // Test loadSourceData
    console.log('\n1. Testing loadSourceData()...');
    const data = migration.loadSourceData(sourceFile);
    console.log(`   ✓ Loaded ${data.length} criteria`);
    
    // Test validateData
    console.log('\n2. Testing validateData()...');
    migration.validateData(data);
    console.log('   ✓ All criteria validated successfully');
    
    // Show sample of loaded data
    console.log('\n3. Sample of loaded data:');
    console.log('   First criterion:');
    console.log(`   - ID: ${data[0].id}`);
    console.log(`   - Principle: ${data[0].principle}`);
    console.log(`   - Title: ${data[0].title}`);
    console.log(`   - Level: ${data[0].level}`);
    console.log(`   - Techniques: ${data[0].techniques ? data[0].techniques.join(', ') : 'none'}`);
    
    // Show statistics
    console.log('\n4. Data Statistics:');
    const principles = {};
    const levels = {};
    
    data.forEach(criterion => {
      principles[criterion.principle] = (principles[criterion.principle] || 0) + 1;
      levels[criterion.level] = (levels[criterion.level] || 0) + 1;
    });
    
    console.log('   By Principle:');
    Object.entries(principles).forEach(([principle, count]) => {
      console.log(`   - ${principle}: ${count}`);
    });
    
    console.log('   By Level:');
    Object.entries(levels).forEach(([level, count]) => {
      console.log(`   - ${level}: ${count}`);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log('✓ All tests passed successfully!');
    console.log('='.repeat(50) + '\n');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRealData();
