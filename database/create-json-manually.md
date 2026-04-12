# Manual JSON Creation Guide

Since automatic conversion is complex due to JavaScript template literals, here's how to manually create the JSON file:

## Option 1: Use Browser Console (Easiest)

1. Open `wcag.html` in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this command:

```javascript
copy(JSON.stringify(wcagGuidelines, null, 2))
```

5. Paste the clipboard content into a new file named `wcag-data.json` in the root directory

## Option 2: Modify wcag-data.js

1. Open `wcag-data.js`
2. At the very end of the file, add:

```javascript
// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wcagGuidelines, wcagTechniqueDetails };
}
```

3. Create a new file `database/export-json.js`:

```javascript
const data = require('../wcag-data.js');
const fs = require('fs');

fs.writeFileSync(
    'wcag-data.json',
    JSON.stringify(data.wcagGuidelines, null, 2)
);

console.log('Created wcag-data.json');
```

4. Run: `node database/export-json.js`

## Option 3: Use the provided script

Run the Node.js converter (it should work now):

```bash
node database/convert-js-to-json.js
```

## Verify the JSON file

After creating `wcag-data.json`, verify it:

```bash
# Check if file exists and is valid JSON
php -r "json_decode(file_get_contents('wcag-data.json')); echo json_last_error() === JSON_ERROR_NONE ? 'Valid JSON' : 'Invalid JSON';"
```

## Next Step

Once you have `wcag-data.json`, run the migration:

```bash
php database/migrate-wcag-data.php
```
