/**
 * WCAG Color Contrast Ratio Verification Script
 * 
 * This script calculates and verifies color contrast ratios according to
 * WCAG 2.1 Level AA standards (4.5:1 for normal text, 3:1 for large text)
 */

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., "#212529")
 * @returns {object} RGB values {r, g, b}
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance
 * @param {object} rgb - RGB color {r, g, b}
 * @returns {number} Relative luminance value
 */
function getLuminance(rgb) {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number} Contrast ratio
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format');
  }
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 * @param {number} ratio - Contrast ratio
 * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean} Whether ratio meets standard
 */
function meetsWCAG_AA(ratio, isLargeText = false) {
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Format ratio for display
 * @param {number} ratio - Contrast ratio
 * @returns {string} Formatted ratio
 */
function formatRatio(ratio) {
  return ratio.toFixed(2) + ':1';
}

// Test cases for WCAG Sidebar Layout
const testCases = [
  // Primary Text Colors
  { name: 'Primary text on white', fg: '#212529', bg: '#ffffff', expected: 15.4 },
  { name: 'Secondary text on white', fg: '#6c757d', bg: '#ffffff', expected: 4.7 },
  { name: 'Muted text on white (FIXED)', fg: '#6c757d', bg: '#ffffff', expected: 4.7 },
  { name: 'Primary text on secondary bg', fg: '#212529', bg: '#f8f9fa', expected: 14.6 },
  
  // Sidebar Colors
  { name: 'Sidebar title', fg: '#212529', bg: '#ffffff', expected: 15.4 },
  { name: 'Guideline ID badge', fg: '#495057', bg: '#e9ecef', expected: 4.5 },
  { name: 'Active guideline', fg: '#0d6efd', bg: '#ffffff', expected: 4.5 },
  
  // Principle Colors
  { name: 'Perceivable icon', fg: '#4f46e5', bg: '#eef2ff', expected: 5.6 },
  { name: 'Operable icon', fg: '#047857', bg: '#d1fae5', expected: 4.5 },
  { name: 'Understandable icon (FIXED)', fg: '#b45309', bg: '#fef3c7', expected: 4.5 },
  { name: 'Robust icon', fg: '#7c3aed', bg: '#ede9fe', expected: 4.8 },
  
  // Level Badges
  { name: 'Level A badge', fg: '#1565c0', bg: '#e3f2fd', expected: 5.0 },
  { name: 'Level AA badge', fg: '#2e7d32', bg: '#e8f5e9', expected: 4.6 },
  { name: 'Level AAA badge (FIXED)', fg: '#b34700', bg: '#fff3e0', expected: 4.5 },
  
  // Buttons
  { name: 'Primary button', fg: '#ffffff', bg: '#0d6efd', expected: 4.5 },
  { name: 'Success button (FIXED)', fg: '#ffffff', bg: '#1e7e34', expected: 4.5 },
  
  // Modal Colors
  { name: 'Modal title', fg: '#1a1a1a', bg: '#ffffff', expected: 17.4 },
  { name: 'Modal description', fg: '#333333', bg: '#ffffff', expected: 12.6 },
];

// Run tests
console.log('═══════════════════════════════════════════════════════════');
console.log('  WCAG Color Contrast Ratio Verification');
console.log('  Standard: WCAG 2.1 Level AA (4.5:1 minimum)');
console.log('═══════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;
const results = [];

testCases.forEach(test => {
  try {
    const ratio = getContrastRatio(test.fg, test.bg);
    const passes = meetsWCAG_AA(ratio);
    const status = passes ? '✓ PASS' : '✗ FAIL';
    const statusColor = passes ? '\x1b[32m' : '\x1b[31m'; // Green or Red
    const resetColor = '\x1b[0m';
    
    if (passes) passCount++;
    else failCount++;
    
    results.push({
      name: test.name,
      ratio: ratio,
      passes: passes,
      fg: test.fg,
      bg: test.bg
    });
    
    console.log(`${statusColor}${status}${resetColor} ${test.name}`);
    console.log(`     Foreground: ${test.fg} | Background: ${test.bg}`);
    console.log(`     Ratio: ${formatRatio(ratio)} (Expected: ~${test.expected}:1)`);
    console.log('');
  } catch (error) {
    console.error(`ERROR: ${test.name} - ${error.message}\n`);
    failCount++;
  }
});

// Summary
console.log('═══════════════════════════════════════════════════════════');
console.log('  Summary');
console.log('═══════════════════════════════════════════════════════════');
console.log(`Total Tests: ${testCases.length}`);
console.log(`\x1b[32mPassed: ${passCount}\x1b[0m`);
console.log(`\x1b[31mFailed: ${failCount}\x1b[0m`);
console.log(`Success Rate: ${((passCount / testCases.length) * 100).toFixed(1)}%`);
console.log('');

if (failCount === 0) {
  console.log('\x1b[32m✓ All color combinations meet WCAG 2.1 Level AA standards!\x1b[0m');
  console.log('\x1b[32m✓ 100% WCAG AA Compliant\x1b[0m\n');
} else {
  console.log('\x1b[31m✗ Some color combinations do not meet WCAG AA standards.\x1b[0m');
  console.log('\x1b[31m✗ Please review and fix the failing combinations.\x1b[0m\n');
}

// Export results for further analysis
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    results,
    passCount,
    failCount,
    getContrastRatio,
    meetsWCAG_AA
  };
}
