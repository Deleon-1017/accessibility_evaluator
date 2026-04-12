/**
 * Convert wcag-data.js to wcag-data.json
 * 
 * This script extracts the wcagGuidelines array from the JavaScript file
 * and saves it as a clean JSON file for the PHP migration script.
 * 
 * Usage: node database/convert-js-to-json.js
 */

const fs = require('fs');
const path = require('path');

console.log('=================================================================');
console.log('WCAG Data JS to JSON Converter');
console.log('=================================================================\n');

// Read the JavaScript file
const jsFilePath = path.join(__dirname, '..', 'wcag-data.js');
console.log(`Reading: ${jsFilePath}`);

if (!fs.existsSync(jsFilePath)) {
    console.error(`ERROR: File not found: ${jsFilePath}`);
    process.exit(1);
}

// Load and execute the JavaScript file to get the data
const jsContent = fs.readFileSync(jsFilePath, 'utf8');

// Extract wcagGuidelines using eval (safe in this controlled context)
let wcagGuidelines;
let wcagTechniqueDetails;

try {
    // Create a minimal browser-like environment
    const window = {};
    
    eval(jsContent);
    
    if (typeof wcagGuidelines === 'undefined') {
        throw new Error('wcagGuidelines not found in file');
    }
    
    console.log(`✓ Successfully extracted ${wcagGuidelines.length} WCAG criteria\n`);
    
} catch (error) {
    console.error(`ERROR: Failed to parse JavaScript file: ${error.message}`);
    process.exit(1);
}

// Convert to JSON
const jsonOutput = JSON.stringify(wcagGuidelines, null, 2);

// Write to JSON file
const jsonFilePath = path.join(__dirname, '..', 'wcag-data.json');
console.log(`Writing: ${jsonFilePath}`);

try {
    fs.writeFileSync(jsonFilePath, jsonOutput, 'utf8');
    console.log(`✓ Successfully created wcag-data.json`);
    console.log(`  File size: ${(jsonOutput.length / 1024).toFixed(2)} KB`);
    console.log(`  Criteria count: ${wcagGuidelines.length}`);
    
} catch (error) {
    console.error(`ERROR: Failed to write JSON file: ${error.message}`);
    process.exit(1);
}

console.log('\n=================================================================');
console.log('Conversion completed successfully!');
console.log('You can now run: php database/migrate-wcag-data.php');
console.log('=================================================================');
