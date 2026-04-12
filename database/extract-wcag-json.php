<?php
/**
 * Extract WCAG data from wcag-data.js and convert to JSON
 * 
 * This PHP script extracts the wcagGuidelines array from the JavaScript file
 * and converts it to JSON format for database migration.
 * 
 * Usage: php database/extract-wcag-json.php
 */

echo "=================================================================\n";
echo "WCAG Data Extractor (JS to JSON)\n";
echo "=================================================================\n\n";

$jsFile = __DIR__ . '/../wcag-data.js';
$jsonFile = __DIR__ . '/../wcag-data.json';

echo "Reading: $jsFile\n";

if (!file_exists($jsFile)) {
    die("ERROR: File not found: $jsFile\n");
}

$content = file_get_contents($jsFile);

// Find the start of wcagGuidelines array
$startPattern = '/const wcagGuidelines = \[/';
if (!preg_match($startPattern, $content, $matches, PREG_OFFSET_CAPTURE)) {
    die("ERROR: Could not find 'const wcagGuidelines = [' in file\n");
}

$startPos = $matches[0][1] + strlen($matches[0][0]);

// Find the matching closing bracket
$bracketCount = 1;
$pos = $startPos;
$length = strlen($content);

while ($pos < $length && $bracketCount > 0) {
    $char = $content[$pos];
    
    if ($char === '[') {
        $bracketCount++;
    } elseif ($char === ']') {
        $bracketCount--;
    }
    
    $pos++;
}

if ($bracketCount !== 0) {
    die("ERROR: Could not find matching closing bracket\n");
}

// Extract the array content
$arrayContent = substr($content, $startPos, $pos - $startPos - 1);

// Now we need to convert JavaScript object notation to JSON
// This is complex because of template literals, so we'll use a different approach

echo "Extracting WCAG criteria using regex patterns...\n";

// Extract each criterion object
preg_match_all('/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/s', $arrayContent, $criteriaMatches);

$criteria = [];
$count = 0;

foreach ($criteriaMatches[0] as $match) {
    // Skip if this looks like a nested object
    if (substr_count($match, '{') > 10) {
        continue;
    }
    
    $criterion = [];
    
    // Extract id
    if (preg_match('/id:\s*["\']([^"\']+)["\']/', $match, $m)) {
        $criterion['id'] = $m[1];
    }
    
    // Extract principle
    if (preg_match('/principle:\s*["\']([^"\']+)["\']/', $match, $m)) {
        $criterion['principle'] = $m[1];
    }
    
    // Extract title
    if (preg_match('/title:\s*["\']([^"\']+)["\']/', $match, $m)) {
        $criterion['title'] = $m[1];
    }
    
    // Extract level
    if (preg_match('/level:\s*["\']([^"\']+)["\']/', $match, $m)) {
        $criterion['level'] = $m[1];
    }
    
    // Only process if we have the basic fields
    if (isset($criterion['id']) && isset($criterion['principle'])) {
        $count++;
    }
}

echo "Found $count criteria objects\n";

// Since regex extraction is complex for nested objects with template literals,
// let's use a different approach: execute the JS in a V8 context

echo "\nAttempting to use V8js extension...\n";

if (!extension_loaded('v8js')) {
    echo "V8js extension not available. Using manual extraction...\n\n";
    echo "Please install Node.js and run:\n";
    echo "  node database/convert-js-to-json.js\n\n";
    echo "Or manually create wcag-data.json from wcag-data.js\n";
    exit(1);
}

try {
    $v8 = new V8Js();
    $v8->executeString($content);
    $data = $v8->executeString('JSON.stringify(wcagGuidelines)');
    
    file_put_contents($jsonFile, $data);
    
    $decoded = json_decode($data, true);
    echo "✓ Successfully extracted " . count($decoded) . " WCAG criteria\n";
    echo "✓ Written to: $jsonFile\n";
    echo "  File size: " . number_format(strlen($data) / 1024, 2) . " KB\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n=================================================================\n";
echo "Extraction completed successfully!\n";
echo "You can now run: php database/migrate-wcag-data.php\n";
echo "=================================================================\n";
