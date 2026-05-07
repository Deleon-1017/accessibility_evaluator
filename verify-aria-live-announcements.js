/**
 * Verification Script for ARIA Live Region Announcements
 * 
 * This script verifies that ARIA live region announcements are properly implemented
 * for Task 10.2: Add ARIA live regions for content changes
 * 
 * Requirements:
 * - aria-live="polite" region for content change announcements
 * - Announce guideline selection to screen readers
 * - Announce principle expansion/collapse to screen readers
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
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileContains(filePath, searchString, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const found = content.includes(searchString);
    
    if (found) {
      log(`✓ ${description}`, 'green');
      return true;
    } else {
      log(`✗ ${description}`, 'red');
      log(`  Expected to find: "${searchString}"`, 'yellow');
      return false;
    }
  } catch (error) {
    log(`✗ Error reading ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

function checkMultiplePatterns(filePath, patterns, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const allFound = patterns.every(pattern => content.includes(pattern));
    
    if (allFound) {
      log(`✓ ${description}`, 'green');
      return true;
    } else {
      log(`✗ ${description}`, 'red');
      patterns.forEach(pattern => {
        const found = content.includes(pattern);
        log(`  ${found ? '✓' : '✗'} "${pattern}"`, found ? 'green' : 'yellow');
      });
      return false;
    }
  } catch (error) {
    log(`✗ Error reading ${filePath}: ${error.message}`, 'red');
    return false;
  }
}

// Main verification
log('\n=== ARIA Live Region Announcements Verification ===\n', 'cyan');
log('Task 10.2: Add ARIA live regions for content changes\n', 'blue');

let passedTests = 0;
let totalTests = 0;

// Test 1: ARIA live region is created
log('1. Checking ARIA live region creation...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    "createAriaLiveRegion()",
    "setAttribute('role', 'status')",
    "setAttribute('aria-live', 'polite')",
    "setAttribute('aria-atomic', 'true')"
  ],
  'ARIA live region is created with proper attributes'
)) {
  passedTests++;
}

// Test 2: ARIA live region is initialized in constructor
log('\n2. Checking ARIA live region initialization...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  'this.ariaLiveRegion = this.createAriaLiveRegion()',
  'ARIA live region is initialized in WCAGMainContent constructor'
)) {
  passedTests++;
}

// Test 3: announceContentChange method exists
log('\n3. Checking announceContentChange method...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    'announceContentChange(message)',
    "this.ariaLiveRegion.textContent = message"
  ],
  'announceContentChange method is implemented'
)) {
  passedTests++;
}

// Test 4: Guideline selection is announced
log('\n4. Checking guideline selection announcements...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "this.announceContentChange(`Showing details for WCAG ${guideline.id}: ${guideline.title}`)",
  'Guideline selection is announced in showGuidelineDetail()'
)) {
  passedTests++;
}

// Test 5: Landing page display is announced
log('\n5. Checking landing page announcements...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  "this.announceContentChange('Showing WCAG Guidelines landing page')",
  'Landing page display is announced in showLandingPage()'
)) {
  passedTests++;
}

// Test 6: Principle toggle callback is added to WCAGSidebar constructor
log('\n6. Checking principle toggle callback parameter...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  'constructor(sidebarElement, onGuidelineSelect, onPrincipleToggle)',
  'WCAGSidebar constructor accepts onPrincipleToggle callback'
)) {
  passedTests++;
}

// Test 7: Principle toggle callback is stored
log('\n7. Checking principle toggle callback storage...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  'this.onPrincipleToggle = onPrincipleToggle',
  'onPrincipleToggle callback is stored in WCAGSidebar'
)) {
  passedTests++;
}

// Test 8: Principle expansion is announced
log('\n8. Checking principle expansion announcement...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    'if (this.onPrincipleToggle) {',
    'this.onPrincipleToggle(principleName, true)'
  ],
  'Principle expansion calls onPrincipleToggle callback'
)) {
  passedTests++;
}

// Test 9: Principle collapse is announced
log('\n9. Checking principle collapse announcement...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    'if (this.onPrincipleToggle) {',
    'this.onPrincipleToggle(principleName, false)'
  ],
  'Principle collapse calls onPrincipleToggle callback'
)) {
  passedTests++;
}

// Test 10: handlePrincipleToggle method exists in WCAGApp
log('\n10. Checking handlePrincipleToggle method in WCAGApp...', 'yellow');
totalTests++;
if (checkMultiplePatterns(
  'wcag-sidebar-app.js',
  [
    'handlePrincipleToggle(principleName, isExpanded)',
    'this.mainContent.announceContentChange'
  ],
  'handlePrincipleToggle method is implemented in WCAGApp'
)) {
  passedTests++;
}

// Test 11: WCAGApp passes principle toggle callback to sidebar
log('\n11. Checking WCAGApp passes callback to sidebar...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  'this.handlePrincipleToggle.bind(this)',
  'WCAGApp passes handlePrincipleToggle callback to WCAGSidebar'
)) {
  passedTests++;
}

// Test 12: Announcement message format for principle toggle
log('\n12. Checking principle toggle announcement message format...', 'yellow');
totalTests++;
if (checkFileContains(
  'wcag-sidebar-app.js',
  '`${principleName} principle ${action}`',
  'Principle toggle announcement uses proper message format'
)) {
  passedTests++;
}

// Summary
log('\n=== Verification Summary ===\n', 'cyan');
log(`Total Tests: ${totalTests}`, 'blue');
log(`Passed: ${passedTests}`, 'green');
log(`Failed: ${totalTests - passedTests}`, passedTests === totalTests ? 'green' : 'red');

if (passedTests === totalTests) {
  log('\n✓ All ARIA live region announcements are properly implemented!', 'green');
  log('\nImplementation includes:', 'cyan');
  log('  • ARIA live region with role="status" and aria-live="polite"', 'blue');
  log('  • Guideline selection announcements', 'blue');
  log('  • Landing page display announcements', 'blue');
  log('  • Principle expansion/collapse announcements', 'blue');
  log('  • Proper callback architecture for announcements', 'blue');
  process.exit(0);
} else {
  log('\n✗ Some tests failed. Please review the implementation.', 'red');
  process.exit(1);
}
