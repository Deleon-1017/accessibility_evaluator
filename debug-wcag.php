<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WCAG Debug</title>
    <style>
        body { font-family: monospace; padding: 20px; background: #f5f5f5; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .success { color: green; }
        .error { color: red; }
        .info { color: blue; }
        pre { background: #f0f0f0; padding: 10px; border-radius: 4px; overflow-x: auto; }
        h2 { margin-top: 0; }
    </style>
</head>
<body>
    <h1>WCAG System Debug Report</h1>

    <div class="section">
        <h2>1. Environment Check</h2>
        <?php
        echo "<p><strong>PHP Version:</strong> " . phpversion() . "</p>";
        echo "<p><strong>Current Directory:</strong> " . getcwd() . "</p>";
        echo "<p><strong>Script Path:</strong> " . __FILE__ . "</p>";
        ?>
    </div>

    <div class="section">
        <h2>2. Database Configuration Check</h2>
        <?php
        $envFile = __DIR__ . '/.env';
        if (file_exists($envFile)) {
            echo "<p class='success'>✓ .env file exists</p>";
            
            // Load env
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $envVars = [];
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    $envVars[trim($key)] = trim($value);
                }
            }
            
            echo "<p><strong>DB_HOST:</strong> " . ($envVars['DB_HOST'] ?? 'NOT SET') . "</p>";
            echo "<p><strong>DB_NAME:</strong> " . ($envVars['DB_NAME'] ?? 'NOT SET') . "</p>";
            echo "<p><strong>DB_READER_USER:</strong> " . ($envVars['DB_READER_USER'] ?? 'NOT SET') . "</p>";
            echo "<p><strong>DB_READER_PASSWORD:</strong> " . (isset($envVars['DB_READER_PASSWORD']) ? '***SET***' : 'NOT SET') . "</p>";
        } else {
            echo "<p class='error'>✗ .env file NOT found at: $envFile</p>";
        }
        ?>
    </div>

    <div class="section">
        <h2>3. Database Connection Test</h2>
        <?php
        try {
            $host = $envVars['DB_HOST'] ?? 'localhost';
            $user = $envVars['DB_READER_USER'] ?? 'wcag_reader';
            $pass = $envVars['DB_READER_PASSWORD'] ?? '';
            $db = $envVars['DB_NAME'] ?? 'wcag_db';
            $port = $envVars['DB_PORT'] ?? 3306;
            
            $conn = new mysqli($host, $user, $pass, $db, $port);
            
            if ($conn->connect_error) {
                echo "<p class='error'>✗ Connection failed: " . $conn->connect_error . "</p>";
            } else {
                echo "<p class='success'>✓ Database connection successful</p>";
                
                // Check table
                $result = $conn->query("SHOW TABLES LIKE 'wcag_criteria'");
                if ($result && $result->num_rows > 0) {
                    echo "<p class='success'>✓ Table 'wcag_criteria' exists</p>";
                    
                    // Count records
                    $result = $conn->query("SELECT COUNT(*) as count FROM wcag_criteria");
                    if ($result) {
                        $row = $result->fetch_assoc();
                        echo "<p class='success'>✓ Guidelines in database: " . $row['count'] . "</p>";
                    }
                } else {
                    echo "<p class='error'>✗ Table 'wcag_criteria' does NOT exist</p>";
                }
                
                $conn->close();
            }
        } catch (Exception $e) {
            echo "<p class='error'>✗ Exception: " . $e->getMessage() . "</p>";
        }
        ?>
    </div>

    <div class="section">
        <h2>4. API Endpoint Check</h2>
        <?php
        $apiPath = __DIR__ . '/api/get-wcag-guidelines.php';
        if (file_exists($apiPath)) {
            echo "<p class='success'>✓ API file exists at: $apiPath</p>";
            
            // Test API by including it
            ob_start();
            try {
                include $apiPath;
                $apiOutput = ob_get_clean();
                
                $jsonData = json_decode($apiOutput, true);
                if ($jsonData) {
                    echo "<p class='success'>✓ API returns valid JSON</p>";
                    echo "<p><strong>Success:</strong> " . ($jsonData['success'] ? 'true' : 'false') . "</p>";
                    echo "<p><strong>Count:</strong> " . ($jsonData['count'] ?? 'N/A') . "</p>";
                    
                    if (isset($jsonData['error'])) {
                        echo "<p class='error'>API Error: " . $jsonData['error'] . "</p>";
                    }
                    
                    if (isset($jsonData['data']) && is_array($jsonData['data']) && count($jsonData['data']) > 0) {
                        echo "<p class='success'>✓ API returns data (" . count($jsonData['data']) . " items)</p>";
                        echo "<p><strong>First item ID:</strong> " . ($jsonData['data'][0]['id'] ?? 'N/A') . "</p>";
                        echo "<p><strong>First item title:</strong> " . ($jsonData['data'][0]['title'] ?? 'N/A') . "</p>";
                    } else {
                        echo "<p class='error'>✗ API returns no data</p>";
                    }
                } else {
                    echo "<p class='error'>✗ API output is not valid JSON</p>";
                    echo "<pre>" . htmlspecialchars(substr($apiOutput, 0, 500)) . "</pre>";
                }
            } catch (Exception $e) {
                ob_end_clean();
                echo "<p class='error'>✗ API Exception: " . $e->getMessage() . "</p>";
            }
        } else {
            echo "<p class='error'>✗ API file NOT found at: $apiPath</p>";
        }
        ?>
    </div>

    <div class="section">
        <h2>5. JavaScript Files Check</h2>
        <?php
        $jsFile = __DIR__ . '/wcag-script.js';
        if (file_exists($jsFile)) {
            echo "<p class='success'>✓ wcag-script.js exists</p>";
            echo "<p><strong>File size:</strong> " . filesize($jsFile) . " bytes</p>";
            
            // Check for key functions
            $jsContent = file_get_contents($jsFile);
            $hasFetchFunction = strpos($jsContent, 'fetchWcagGuidelines') !== false;
            $hasRenderFunction = strpos($jsContent, 'renderTable') !== false;
            $hasEventListener = strpos($jsContent, 'wcagDataLoaded') !== false;
            
            echo "<p>" . ($hasRenderFunction ? '✓' : '✗') . " renderTable function found</p>";
            echo "<p>" . ($hasEventListener ? '✓' : '✗') . " wcagDataLoaded event listener found</p>";
        } else {
            echo "<p class='error'>✗ wcag-script.js NOT found</p>";
        }
        ?>
    </div>

    <div class="section">
        <h2>6. Browser Console Test</h2>
        <p>Open browser console (F12) and check for errors when loading wcag.php</p>
        <button onclick="testFetch()">Test Fetch API</button>
        <div id="fetchResult"></div>
    </div>

    <script>
        async function testFetch() {
            const resultDiv = document.getElementById('fetchResult');
            resultDiv.innerHTML = '<p>Testing...</p>';
            
            try {
                const response = await fetch('api/get-wcag-guidelines.php');
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                
                const text = await response.text();
                console.log('Raw response:', text.substring(0, 200));
                
                const data = JSON.parse(text);
                console.log('Parsed data:', data);
                
                resultDiv.innerHTML = `
                    <p style="color: green;">✓ Fetch successful</p>
                    <p><strong>Success:</strong> ${data.success}</p>
                    <p><strong>Count:</strong> ${data.count}</p>
                    <p><strong>Data items:</strong> ${data.data ? data.data.length : 0}</p>
                    <pre>${JSON.stringify(data, null, 2).substring(0, 500)}</pre>
                `;
            } catch (error) {
                console.error('Fetch error:', error);
                resultDiv.innerHTML = `<p style="color: red;">✗ Fetch failed: ${error.message}</p>`;
            }
        }
    </script>

    <div class="section">
        <h2>7. Recommendations</h2>
        <ul>
            <li>Check browser console for JavaScript errors</li>
            <li>Verify XAMPP MySQL service is running</li>
            <li>Check PHP error logs at: logs/php-errors.log</li>
            <li>Ensure mod_rewrite is enabled in Apache</li>
            <li>Clear browser cache and reload</li>
        </ul>
    </div>
</body>
</html>
