/**
 * Prepare wcag-data.js for Node.js export
 * This adds module.exports at the end of the file
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'wcag-data.js');
let content = fs.readFileSync(filePath, 'utf8');

// Check if already has export
if (content.includes('module.exports')) {
    console.log('File already has module.exports');
} else {
    // Add export at the end
    content += `\n\n// Export for Node.js\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = { wcagGuidelines, wcagTechniqueDetails };\n}\n`;
    
    fs.writeFileSync(filePath, content);
    console.log('✓ Added module.exports to wcag-data.js');
}

// Now require and export as JSON
const data = require(filePath);
const jsonPath = path.join(__dirname, '..', 'wcag-data.json');

fs.writeFileSync(jsonPath, JSON.stringify(data.wcagGuidelines, null, 2));

console.log(`✓ Created wcag-data.json with ${data.wcagGuidelines.length} criteria`);
console.log('\nYou can now run: php database/migrate-wcag-data.php');
