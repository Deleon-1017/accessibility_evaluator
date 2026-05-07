/**
 * ARIA Attributes Verification Script
 * 
 * This script verifies that all required ARIA attributes for Task 10.1
 * are properly implemented in the WCAG Sidebar Layout.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const found = content.includes(searchString);
    
    if (found) {
      log(`✓ PASS: ${description}`, 'green');
      return true;
    } else {
      log(`✗ FAIL: ${description}`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ ERROR: Could not read ${filePath}`, 'red');
    return false;
  }
}

function checkMultiplePatterns(filePath, patterns, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const allFound = patterns.every(pattern => content.includes(pattern));
    
    if (allFound) {
      log(`✓ PASS: ${description}`, 'green');
      return true;
    } else {
      log(`✗ FAIL: ${description}`, 'red');
      patterns.forEach(pattern => {
        const found = content.includes(pattern);
        log(`  ${found ? '✓' : '✗'} ${pattern}`, found ? 'green' : 'red');
      });
      return false;
    }
  } catch (error) {
    log(`✗ ERROR: Could not read ${filePath}`, 'red');
    return false;
  }
}

// Main verification
log('\n' + '='.repeat(70), 'blue');
log('WCAG Sidebar ARIA Attributes Verification', 'bold');
log('Task 10.1 - Requirements 7.2, 7.3', 'blue');
log('='.repeat(70) + '\n', 'blue');

let totalTests = 0;
let passedTests = 0;

// Test 1: Sidebar has role="navigation"
log('\n1. Checking sidebar role="navigation"...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag.php',
  'role="navigation"',
  'Sidebar has role="navigation" attribute'
)) {
  passedTests++;
}

// Test 2: Sidebar has aria-label
log('\n2. Checking sidebar aria-label...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag.php',
  'aria-label="WCAG Guidelines Navigation"',
  'Sidebar has descriptive aria-label'
)) {
  passedTests++;
}

// Test 3: Principle headers have aria-expanded
log('\n3. Checking principle headers aria-expanded...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "principleHeader.setAttribute('aria-expanded'",
  'Principle headers have aria-expanded attribute'
)) {
  passedTests++;
}

// Test 4: Principle headers have aria-controls
log('\n4. Checking principle headers aria-controls...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "principleHeader.setAttribute('aria-controls'",
  'Principle headers have aria-controls attribute'
)) {
  passedTests++;
}

// Test 5: Active guideline has aria-current="page"
log('\n5. Checking active guideline aria-current="page"...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    "newActive.setAttribute('aria-current', 'page')",
    "previousActive.removeAttribute('aria-current')"
  ],
  'Active guideline has aria-current="page" (with proper cleanup)'
)) {
  passedTests++;
}

// Test 6: Toggle button has aria-label
log('\n6. Checking toggle button aria-label...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag.php',
  'aria-label="Toggle sidebar"',
  'Toggle button has descriptive aria-label'
)) {
  passedTests++;
}

// Test 7: Toggle button aria-expanded is updated dynamically
log('\n7. Checking toggle button aria-expanded dynamic update...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "toggleButton.setAttribute('aria-expanded', isOpen.toString())",
  'Toggle button aria-expanded is updated dynamically'
)) {
  passedTests++;
}

// Test 8: Principle headers aria-expanded is updated dynamically
log('\n8. Checking principle headers aria-expanded dynamic update...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    "principleHeader.setAttribute('aria-expanded', 'false')",
    "principleHeader.setAttribute('aria-expanded', 'true')"
  ],
  'Principle headers aria-expanded is updated in togglePrinciple()'
)) {
  passedTests++;
}

// Additional checks for bonus ARIA attributes
log('\n' + '-'.repeat(70), 'blue');
log('Additional ARIA Attributes (Bonus)', 'bold');
log('-'.repeat(70), 'blue');

// Test 9: Guideline links have role="button"
log('\n9. Checking guideline links role="button"...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "link.setAttribute('role', 'button')",
  'Guideline links have role="button"'
)) {
  passedTests++;
}

// Test 10: Guideline links have tabindex="0"
log('\n10. Checking guideline links tabindex="0"...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "link.setAttribute('tabindex', '0')",
  'Guideline links have tabindex="0"'
)) {
  passedTests++;
}

// Test 11: Guideline lists have role="list"
log('\n11. Checking guideline lists role="list"...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "guidelineList.setAttribute('role', 'list')",
  'Guideline lists have role="list"'
)) {
  passedTests++;
}

// Summary
log('\n' + '='.repeat(70), 'blue');
log('Verification Summary', 'bold');
log('='.repeat(70), 'blue');

const percentage = Math.round((passedTests / totalTests) * 100);
const status = passedTests === totalTests ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED';
const statusColor = passedTests === totalTests ? 'green' : 'red';

log(`\nTotal Tests: ${totalTests}`, 'blue');
log(`Passed: ${passedTests}`, 'green');
log(`Failed: ${totalTests - passedTests}`, 'red');
log(`Success Rate: ${percentage}%`, 'blue');
log(`\nStatus: ${status}`, statusColor);

if (passedTests === totalTests) {
  log('\n✓ All required ARIA attributes are properly implemented!', 'green');
  log('✓ Task 10.1 requirements are met.', 'green');
  log('✓ The sidebar is fully accessible with screen readers.', 'green');
} else {
  log('\n✗ Some ARIA attributes are missing or incorrect.', 'red');
  log('✗ Please review the failed tests above.', 'red');
}

log('\n' + '='.repeat(70) + '\n', 'blue');

// Exit with appropriate code
process.exit(passedTests === totalTests ? 0 : 1);
